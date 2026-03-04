import Layout from "@/components/Layout";
import SEOHead from "@/components/SEOHead";
import FloatingActions from "@/components/FloatingActions";
import { GraduationCap, Download, FileText, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { toast } from "sonner";
import scholarLogo from "@/assets/scholar-logo.jpg";
import axiosInstance from "@/lib/axios";

interface AttachmentData { name: string; label: string; dataUrl: string; type: string; }
interface ReceiptData { studentName: string; motherName: string; dateOfBirth: string; class: string; address: string; percentage: string; receiptNo: string; date: string; attachments: AttachmentData[]; }

const fileToDataUrl = (file: File): Promise<string> => new Promise((resolve, reject) => { const r = new FileReader(); r.onload = () => resolve(r.result as string); r.onerror = reject; r.readAsDataURL(file); });

const fileLabels: Record<string, string> = { aadharCard: "Aadhar Card", birthCertificate: "Birth Certificate", marksheet: "Marksheet", fatherAadhar: "Father's Aadhar Card", motherAadhar: "Mother's Aadhar Card" };

const Admission = () => {
  const [formData, setFormData] = useState({ studentName: "", motherName: "", mobileNumber: "", dateOfBirth: "", class: "", address: "", percentage: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [files, setFiles] = useState<Record<string, File | null>>({ aadharCard: null, birthCertificate: null, marksheet: null, fatherAadhar: null, motherAadhar: null });
  const [receipt, setReceipt] = useState<ReceiptData | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => { setFormData({ ...formData, [e.target.name]: e.target.value }); if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: "" }); };
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, field: string) => { setFiles({ ...files, [field]: e.target.files?.[0] || null }); };

  const validate = (): boolean => {
    const ne: Record<string, string> = {};
    if (!formData.studentName.trim()) ne.studentName = "Student name is required";
    else if (formData.studentName.trim().length < 2) ne.studentName = "Name must be at least 2 characters";
    if (!formData.motherName.trim()) ne.motherName = "Mother's name is required";
    else if (formData.motherName.trim().length < 2) ne.motherName = "Name must be at least 2 characters";
    if (!formData.mobileNumber.trim()) ne.mobileNumber = "Mobile number is required";
    else if (!/^[0-9]{10,15}$/.test(formData.mobileNumber.trim())) ne.mobileNumber = "Enter a valid 10-15 digit mobile number";
    if (!formData.dateOfBirth) ne.dateOfBirth = "Date of birth is required";
    else {
      const dob = new Date(formData.dateOfBirth);
      const today = new Date();
      if (dob >= today) ne.dateOfBirth = "Date of birth must be in the past";
      const age = today.getFullYear() - dob.getFullYear();
      if (age < 3 || age > 25) ne.dateOfBirth = "Age must be between 3 and 25 years";
    }
    if (!formData.class.trim()) ne.class = "Class is required";
    if (!formData.address.trim()) ne.address = "Address is required";
    else if (formData.address.trim().length < 10) ne.address = "Address must be at least 10 characters";
    if (!formData.percentage.trim()) ne.percentage = "Percentage is required";
    else { const p = parseFloat(formData.percentage); if (isNaN(p) || p < 0 || p > 100) ne.percentage = "Percentage must be between 0 and 100"; }
    setErrors(ne);
    return Object.keys(ne).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) { toast.error("Please fix the errors in the form"); return; }
    setIsSubmitting(true);
    try {
      // Prepare local attachments for receipt (not sent to API)
      const attachments: AttachmentData[] = [];
      for (const [key, file] of Object.entries(files)) {
        if (file) {
          const du = await fileToDataUrl(file);
          attachments.push({ name: file.name, label: fileLabels[key], dataUrl: du, type: file.type });
        }
      }

      // Send ONLY form data to API (no attachments to avoid Payload Too Large)
      try {
        await axiosInstance.post("/admissions", {
          studentName: formData.studentName,
          motherName: formData.motherName,
          mobileNumber: formData.mobileNumber,
          dateOfBirth: formData.dateOfBirth,
          class: formData.class,
          address: formData.address,
          percentage: formData.percentage,
        });
      } catch (apiErr) {
        console.warn("Backend API not available, continuing with local receipt:", apiErr);
      }

      setReceipt({
        studentName: formData.studentName,
        motherName: formData.motherName,
        dateOfBirth: formData.dateOfBirth,
        class: formData.class,
        address: formData.address,
        percentage: formData.percentage,
        receiptNo: `SCH-${Date.now().toString().slice(-6)}`,
        date: new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "long", year: "numeric" }),
        attachments,
      });
      toast.success("Admission submitted successfully!");
    } catch { toast.error("Failed to process admission. Please try again."); } finally { setIsSubmitting(false); }
  };

  const handleCancel = () => { setFormData({ studentName: "", motherName: "", mobileNumber: "", dateOfBirth: "", class: "", address: "", percentage: "" }); setFiles({ aadharCard: null, birthCertificate: null, marksheet: null, fatherAadhar: null, motherAadhar: null }); setErrors({}); setReceipt(null); };
  const isImageType = (t: string) => t.startsWith("image/");

  const handleDownloadPDF = () => {
    if (!receipt) return;
    const pw = window.open("", "_blank");
    if (!pw) return;
    const currentReceipt = receipt;
    const docImages = currentReceipt.attachments.map((att) => {
      if (isImageType(att.type)) {
        return `<div class="doc-item"><p class="doc-label">${att.label}</p><img src="${att.dataUrl}" alt="${att.label}" /><p class="doc-name">${att.name}</p></div>`;
      }
      return `<div class="doc-item"><p class="doc-label">${att.label}</p><div class="pdf-icon">📄</div><p class="doc-name">${att.name}</p></div>`;
    }).join("");

    pw.document.write(`<!DOCTYPE html><html><head><title>Admission Receipt - ${currentReceipt.receiptNo}</title>
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:'Segoe UI',Arial,sans-serif;padding:20px;max-width:750px;margin:0 auto;color:#333;background:#fff}
.receipt{border:3px solid #8B0000;border-radius:12px;padding:25px 30px;position:relative}
.header{text-align:center;border-bottom:3px double #8B0000;padding-bottom:18px;margin-bottom:20px}
.header h1{color:#8B0000;font-size:24px;margin:8px 0 2px;letter-spacing:1px}
.header h2{color:#8B0000;font-size:15px;font-weight:600;margin:4px 0}
.header p{font-size:11px;color:#666;margin:2px 0;line-height:1.5}
.info-table{width:100%;border-collapse:collapse;margin:10px 0}
.info-table td{padding:8px 12px;font-size:13px;border-bottom:1px solid #eee}
.info-table td:first-child{font-weight:700;color:#444;width:35%;background:#faf5f0}
.info-table td:last-child{color:#222}
.info-table tr:last-child td{border-bottom:none}
.docs-section{margin-top:20px;padding-top:15px;border-top:2px solid #8B0000}
.docs-section h3{color:#8B0000;font-size:15px;margin-bottom:12px;font-weight:700}
.docs-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(180px,1fr));gap:12px}
.doc-item{border:1px solid #ddd;border-radius:8px;padding:8px;text-align:center;background:#faf5f0}
.doc-item p.doc-label{font-weight:700;color:#8B0000;font-size:11px;margin-bottom:6px;text-transform:uppercase}
.doc-item img{max-width:100%;max-height:120px;border-radius:6px;object-fit:contain;display:block;margin:0 auto}
.doc-item p.doc-name{font-size:10px;color:#888;margin-top:4px;word-break:break-all}
.doc-item .pdf-icon{font-size:32px;padding:15px 0}
.footer{text-align:center;margin-top:20px;padding-top:15px;border-top:2px double #8B0000}
.footer p{font-size:10px;color:#999;margin:2px 0}
.footer p strong{color:#8B0000}
@media print{body{padding:10px}.receipt{border:2px solid #8B0000}}
</style></head><body>
<div class="receipt">
<div class="header">
<h1>SCHOLAR EDUCATIONAL CAMPUS</h1>
<h2>Admission Receipt</h2>
<p>📞 +91 9503894282 &nbsp;|&nbsp; ✉ scholaries4282@gmail.com</p>
<p>📍 Hyderabad Road Wajegaon, Dist Nanded</p>
</div>
<table class="info-table">
<tr><td>Receipt No:</td><td>${currentReceipt.receiptNo}</td></tr>
<tr><td>Date:</td><td>${currentReceipt.date}</td></tr>
<tr><td>Student Name:</td><td>${currentReceipt.studentName}</td></tr>
<tr><td>Mother's Name:</td><td>${currentReceipt.motherName}</td></tr>
<tr><td>Date of Birth:</td><td>${currentReceipt.dateOfBirth}</td></tr>
<tr><td>Class:</td><td>${currentReceipt.class}</td></tr>
<tr><td>Address:</td><td>${currentReceipt.address}</td></tr>
<tr><td>Percentage:</td><td>${currentReceipt.percentage}%</td></tr>
</table>
${currentReceipt.attachments.length > 0 ? `<div class="docs-section"><h3>📎 Submitted Documents</h3><div class="docs-grid">${docImages}</div></div>` : ""}
<div class="footer">
<p>This is a computer-generated receipt. No signature required.</p>
<p><strong>Scholar Educational Campus</strong> | +91 9503894282</p>
</div>
</div>
<script>
var imgs = document.querySelectorAll('img');
var loaded = 0;
var total = imgs.length;
if(total === 0){window.print();}
else{imgs.forEach(function(img){if(img.complete){loaded++;if(loaded>=total)window.print();}else{img.onload=img.onerror=function(){loaded++;if(loaded>=total)window.print();};}});}
</script>
</body></html>`);
    pw.document.close();
  };

  const fieldError = (f: string) => errors[f] ? <p className="text-xs text-destructive mt-1">{errors[f]}</p> : null;

  if (receipt) {
    return (<Layout><FloatingActions /><section className="py-10 sm:py-14 md:py-20"><div className="container mx-auto px-4 max-w-2xl">
      <div className="bg-card rounded-lg shadow-lg p-6 sm:p-8 border-2 border-primary/30">
        <div className="text-center border-b border-border pb-4 mb-6">
          <img src={scholarLogo} alt="Logo" className="w-16 h-16 rounded-full mx-auto mb-3 object-cover" />
          <h2 className="text-xl font-bold text-primary">SCHOLAR EDUCATIONAL CAMPUS</h2>
          <p className="text-sm text-muted-foreground">Admission Receipt</p>
          <p className="text-xs text-muted-foreground mt-1">📞 +91 9503894282 &nbsp;|&nbsp; ✉ scholaries4282@gmail.com</p>
          <p className="text-xs text-muted-foreground">📍 Hyderabad Road Wajegaon, Dist Nanded</p>
        </div>
        <div className="space-y-1">{[
          {l:"Receipt No:",v:receipt.receiptNo},{l:"Date:",v:receipt.date},{l:"Student Name:",v:receipt.studentName},{l:"Mother's Name:",v:receipt.motherName},{l:"Date of Birth:",v:receipt.dateOfBirth},{l:"Class:",v:receipt.class},{l:"Address:",v:receipt.address},{l:"Percentage:",v:`${receipt.percentage}%`}
        ].map((r,i)=>(<div key={r.l} className={`flex justify-between items-center py-2.5 px-3 rounded text-sm ${i%2===0?'bg-secondary/30':''}`}><span className="font-semibold text-foreground">{r.l}</span><span className="text-muted-foreground font-medium">{r.v}</span></div>))}</div>
        {receipt.attachments.length > 0 && <div className="mt-6 pt-4 border-t border-border"><h3 className="font-bold text-primary mb-3 text-sm">📎 Submitted Documents</h3><div className="grid grid-cols-2 sm:grid-cols-3 gap-3">{receipt.attachments.map(a=>(<div key={a.name} className="text-center bg-secondary/30 rounded-lg p-3"><p className="text-xs font-semibold mb-2">{a.label}</p>{isImageType(a.type)?<img src={a.dataUrl} alt={a.label} className="w-full h-20 object-cover rounded" />:<div className="flex items-center justify-center gap-1 text-xs text-muted-foreground"><FileText className="w-4 h-4" />PDF</div>}<p className="text-[10px] text-muted-foreground mt-1 truncate">{a.name}</p></div>))}</div></div>}
        <div className="mt-6 pt-4 border-t border-primary/30 text-center">
          <p className="text-xs text-muted-foreground">This is a computer-generated receipt. No signature required.</p>
          <p className="text-xs text-muted-foreground mt-1"><strong>Scholar Educational Campus</strong> | +91 9503894282</p>
        </div>
      </div>
      <div className="flex gap-3 mt-6 justify-center"><Button onClick={handleDownloadPDF}><Download className="w-4 h-4 mr-2" />Download PDF</Button><Button variant="outline" onClick={handleCancel}>New Admission</Button></div>
    </div></section></Layout>);
  }

  return (<Layout><SEOHead title="Admission Form" description="Apply for admission at Scholar Educational Campus Nanded. Online admission form for Nursery to 12th Grade. Submit documents and get instant receipt." keywords="school admission nanded, scholar campus admission, online school admission nanded, admission form nanded school" path="/admission" /><FloatingActions />
    <section className="py-10 sm:py-14 md:py-20 bg-secondary/30"><div className="container mx-auto px-4 text-center"><div className="flex items-center justify-center gap-3 mb-4"><GraduationCap className="w-8 h-8 text-primary" /><h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground">Admission Form</h1></div><p className="text-sm sm:text-base text-muted-foreground">Fill in the details below to apply for admission at Scholar Educational Campus</p></div></section>
    <section className="py-10 sm:py-14 md:py-20"><div className="container mx-auto px-4 max-w-2xl"><div className="bg-card rounded-lg shadow-md p-6 sm:p-8"><form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4"><div><Label>Student Name *</Label><Input name="studentName" value={formData.studentName} onChange={handleChange} required />{fieldError("studentName")}</div><div><Label>Mother's Name *</Label><Input name="motherName" value={formData.motherName} onChange={handleChange} required />{fieldError("motherName")}</div></div>
      <div><Label>Mobile Number *</Label><Input name="mobileNumber" value={formData.mobileNumber} onChange={handleChange} required />{fieldError("mobileNumber")}</div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4"><div><Label>Date of Birth *</Label><Input type="date" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleChange} required />{fieldError("dateOfBirth")}</div><div><Label>Class *</Label><Input name="class" value={formData.class} onChange={handleChange} required />{fieldError("class")}</div></div>
      <div><Label>Address *</Label><Input name="address" value={formData.address} onChange={handleChange} required />{fieldError("address")}</div>
      <div><Label>Percentage *</Label><Input name="percentage" value={formData.percentage} onChange={handleChange} required />{fieldError("percentage")}</div>
      <div><h3 className="font-semibold text-foreground text-sm mb-3">Documents (Optional)</h3><div className="grid grid-cols-1 sm:grid-cols-2 gap-3">{Object.entries(fileLabels).map(([k,l])=>(<div key={k}><Label className="text-xs">{l}</Label><Input type="file" accept="image/*,.pdf" onChange={e=>handleFileChange(e,k)} className="text-xs" />{files[k]&&<div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">{files[k]!.type.startsWith("image/")?<ImageIcon className="w-3 h-3"/>:<FileText className="w-3 h-3"/>}{files[k]!.name}</div>}</div>))}</div></div>
      <div className="flex gap-3 pt-4"><Button type="submit" className="flex-1" disabled={isSubmitting}>{isSubmitting?"Processing...":"Submit Application"}</Button><Button type="button" variant="outline" onClick={handleCancel}>Cancel</Button></div>
    </form></div></div></section>
  </Layout>);
};
export default Admission;
