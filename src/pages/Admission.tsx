import Layout from "@/components/Layout";
import { GraduationCap, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState, useRef } from "react";

interface FormData {
  studentName: string;
  class: string;
  address: string;
  percentage: string;
  aadharCard: File | null;
  birthCertificate: File | null;
  marksheet: File | null;
  fatherAadhar: File | null;
}

interface ReceiptData {
  studentName: string;
  class: string;
  address: string;
  percentage: string;
  receiptNo: string;
  date: string;
  attachments: string[];
}

const Admission = () => {
  const [formData, setFormData] = useState<FormData>({
    studentName: "",
    class: "",
    address: "",
    percentage: "",
    aadharCard: null,
    birthCertificate: null,
    marksheet: null,
    fatherAadhar: null,
  });
  const [receipt, setReceipt] = useState<ReceiptData | null>(null);
  const receiptRef = useRef<HTMLDivElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
    const file = e.target.files?.[0] || null;
    setFormData({ ...formData, [field]: file });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const attachments: string[] = [];
    if (formData.aadharCard) attachments.push("Aadhar Card");
    if (formData.birthCertificate) attachments.push("Birth Certificate");
    if (formData.marksheet) attachments.push("Marksheet");
    if (formData.fatherAadhar) attachments.push("Father's Aadhar Card");

    setReceipt({
      studentName: formData.studentName,
      class: formData.class,
      address: formData.address,
      percentage: formData.percentage,
      receiptNo: `SCH-${Date.now().toString().slice(-6)}`,
      date: new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "long", year: "numeric" }),
      attachments,
    });
  };

  const handleCancel = () => {
    setFormData({
      studentName: "",
      class: "",
      address: "",
      percentage: "",
      aadharCard: null,
      birthCertificate: null,
      marksheet: null,
      fatherAadhar: null,
    });
    setReceipt(null);
  };

  const handleDownloadPDF = () => {
    if (receiptRef.current) {
      const printWindow = window.open("", "_blank");
      if (printWindow) {
        printWindow.document.write(`
          <html><head><title>Admission Receipt - ${receipt?.receiptNo}</title>
          <style>
            body { font-family: Georgia, serif; padding: 20px; color: #333; }
            .receipt { border: 2px solid #8B0000; padding: 20px; max-width: 600px; margin: auto; }
            .header { text-align: center; border-bottom: 2px solid #8B0000; padding-bottom: 15px; margin-bottom: 20px; }
            .header h1 { color: #8B0000; margin: 0; font-size: 18px; }
            .header p { margin: 5px 0 0; font-size: 12px; color: #666; }
            .row { display: flex; justify-content: space-between; padding: 6px 0; border-bottom: 1px dashed #ccc; font-size: 13px; }
            .label { font-weight: bold; color: #8B0000; }
            .footer { text-align: center; margin-top: 20px; font-size: 10px; color: #888; }
            @media print { body { padding: 0; } }
          </style></head><body>
          ${receiptRef.current.innerHTML}
          <script>
            document.title = "Admission_Receipt_${receipt?.receiptNo}";
            window.print();
          <\/script>
          </body></html>
        `);
        printWindow.document.close();
      }
    }
  };

  if (receipt) {
    return (
      <Layout>
        <section className="py-8 sm:py-12 md:py-16">
          <div className="container mx-auto px-3 sm:px-4 max-w-2xl">
            <div ref={receiptRef} className="bg-card p-4 sm:p-6 md:p-8 rounded-lg shadow-xl border-2 border-primary">
              <div className="text-center border-b-2 border-primary pb-3 sm:pb-4 mb-4 sm:mb-6">
                <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-foreground">SCHOLAR EDUCATIONAL CAMPUS</h1>
                <p className="text-xs sm:text-sm text-muted-foreground mt-1">Admission Receipt</p>
              </div>
              <div className="space-y-2 sm:space-y-3">
                {[
                  { label: "Receipt No:", value: receipt.receiptNo },
                  { label: "Date:", value: receipt.date },
                  { label: "Student Name:", value: receipt.studentName },
                  { label: "Class:", value: receipt.class },
                  { label: "Address:", value: receipt.address },
                  { label: "Percentage:", value: `${receipt.percentage}%` },
                ].map((row) => (
                  <div key={row.label} className="flex justify-between py-1.5 sm:py-2 border-b border-dashed border-border">
                    <span className="font-bold text-foreground text-xs sm:text-sm">{row.label}</span>
                    <span className="text-muted-foreground text-xs sm:text-sm text-right max-w-[60%]">{row.value}</span>
                  </div>
                ))}
                {receipt.attachments.length > 0 && (
                  <div className="py-1.5 sm:py-2 border-b border-dashed border-border">
                    <span className="font-bold text-foreground text-xs sm:text-sm">Documents Submitted:</span>
                    <ul className="mt-1 list-disc list-inside text-muted-foreground text-[10px] sm:text-xs md:text-sm">
                      {receipt.attachments.map((a) => <li key={a}>{a}</li>)}
                    </ul>
                  </div>
                )}
              </div>
              <div className="text-center mt-4 sm:mt-6 text-[10px] sm:text-xs text-muted-foreground">
                <p>This is a computer-generated receipt. No signature required.</p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-4 sm:mt-6 justify-center">
              <Button onClick={handleDownloadPDF} className="bg-primary text-primary-foreground px-6 sm:px-8 py-2.5 sm:py-3 rounded-full btn-hover text-sm">
                <Download className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-2" />
                Download PDF
              </Button>
              <Button onClick={handleCancel} variant="outline" className="border-primary text-primary px-6 sm:px-8 py-2.5 sm:py-3 rounded-full btn-hover text-sm">
                New Admission
              </Button>
            </div>
          </div>
        </section>
      </Layout>
    );
  }

  return (
    <Layout>
      <section className="py-10 sm:py-12 md:py-16 bg-secondary/30">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 sm:gap-3 mb-3 sm:mb-4">
            <GraduationCap className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-primary" />
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-foreground animate-fade-in">
              Admission Form
            </h1>
          </div>
          <p className="text-sm sm:text-base md:text-lg text-muted-foreground max-w-2xl mx-auto animate-fade-in-up px-2" style={{ animationDelay: "0.1s" }}>
            Fill in the details below to apply for admission at Scholar Educational Campus
          </p>
        </div>
      </section>

      <section className="py-10 sm:py-14 md:py-20">
        <div className="container mx-auto px-3 sm:px-4 max-w-3xl">
          <div className="bg-card p-4 sm:p-6 md:p-8 rounded-lg shadow-lg animate-fade-in-up">
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5 md:space-y-6">
              <div className="grid sm:grid-cols-2 gap-3 sm:gap-4">
                <div className="space-y-1.5 sm:space-y-2">
                  <Label htmlFor="studentName" className="text-xs sm:text-sm">Student Name *</Label>
                  <Input
                    id="studentName"
                    name="studentName"
                    value={formData.studentName}
                    onChange={handleChange}
                    placeholder="Enter student full name"
                    required
                    className="border-border focus:border-primary text-sm"
                  />
                </div>
                <div className="space-y-1.5 sm:space-y-2">
                  <Label htmlFor="class" className="text-xs sm:text-sm">Class *</Label>
                  <Input
                    id="class"
                    name="class"
                    value={formData.class}
                    onChange={handleChange}
                    placeholder="Enter class (e.g., 10th, 12th)"
                    required
                    className="border-border focus:border-primary text-sm"
                  />
                </div>
              </div>

              <div className="space-y-1.5 sm:space-y-2">
                <Label htmlFor="address" className="text-xs sm:text-sm">Address *</Label>
                <Input
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Enter complete address"
                  required
                  className="border-border focus:border-primary text-sm"
                />
              </div>

              <div className="space-y-1.5 sm:space-y-2">
                <Label htmlFor="percentage" className="text-xs sm:text-sm">Percentage *</Label>
                <Input
                  id="percentage"
                  name="percentage"
                  type="number"
                  min="0"
                  max="100"
                  value={formData.percentage}
                  onChange={handleChange}
                  placeholder="Enter percentage (e.g., 85)"
                  required
                  className="border-border focus:border-primary text-sm"
                />
              </div>

              <div className="border-t border-border pt-4 sm:pt-6">
                <h3 className="text-sm sm:text-base md:text-lg font-bold text-foreground mb-3 sm:mb-4">Documents (Optional)</h3>
                <div className="grid sm:grid-cols-2 gap-3 sm:gap-4">
                  <div className="space-y-1.5 sm:space-y-2">
                    <Label htmlFor="aadharCard" className="text-xs sm:text-sm">Aadhar Card</Label>
                    <Input
                      id="aadharCard"
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={(e) => handleFileChange(e, "aadharCard")}
                      className="border-border focus:border-primary text-xs sm:text-sm"
                    />
                    <p className="text-[10px] sm:text-xs text-muted-foreground">Upload student's Aadhar card</p>
                  </div>
                  <div className="space-y-1.5 sm:space-y-2">
                    <Label htmlFor="birthCertificate" className="text-xs sm:text-sm">Birth Certificate</Label>
                    <Input
                      id="birthCertificate"
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={(e) => handleFileChange(e, "birthCertificate")}
                      className="border-border focus:border-primary text-xs sm:text-sm"
                    />
                    <p className="text-[10px] sm:text-xs text-muted-foreground">Upload birth certificate</p>
                  </div>
                  <div className="space-y-1.5 sm:space-y-2">
                    <Label htmlFor="marksheet" className="text-xs sm:text-sm">Marksheet</Label>
                    <Input
                      id="marksheet"
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={(e) => handleFileChange(e, "marksheet")}
                      className="border-border focus:border-primary text-xs sm:text-sm"
                    />
                    <p className="text-[10px] sm:text-xs text-muted-foreground">Upload previous class marksheet</p>
                  </div>
                  <div className="space-y-1.5 sm:space-y-2">
                    <Label htmlFor="fatherAadhar" className="text-xs sm:text-sm">Father's Aadhar Card</Label>
                    <Input
                      id="fatherAadhar"
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={(e) => handleFileChange(e, "fatherAadhar")}
                      className="border-border focus:border-primary text-xs sm:text-sm"
                    />
                    <p className="text-[10px] sm:text-xs text-muted-foreground">Upload father's Aadhar card</p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-3 sm:pt-4">
                <Button type="submit" className="flex-1 btn-hover bg-primary text-primary-foreground py-4 sm:py-5 md:py-6 text-sm sm:text-base md:text-lg rounded-full">
                  Submit Application
                </Button>
                <Button type="button" onClick={handleCancel} variant="outline" className="flex-1 border-primary text-primary py-4 sm:py-5 md:py-6 text-sm sm:text-base md:text-lg rounded-full btn-hover">
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Admission;
