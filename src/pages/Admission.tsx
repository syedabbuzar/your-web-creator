import Layout from "@/components/Layout";
import { GraduationCap, Download, FileText, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState, useRef } from "react";
import scholarLogo from "@/assets/scholar-logo.jpg";

interface AttachmentData {
  name: string;
  label: string;
  dataUrl: string;
  type: string;
}

interface ReceiptData {
  studentName: string;
  class: string;
  address: string;
  percentage: string;
  receiptNo: string;
  date: string;
  attachments: AttachmentData[];
}

const fileToDataUrl = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

const Admission = () => {
  const [formData, setFormData] = useState({
    studentName: "",
    class: "",
    address: "",
    percentage: "",
  });
  const [files, setFiles] = useState<Record<string, File | null>>({
    aadharCard: null,
    birthCertificate: null,
    marksheet: null,
    fatherAadhar: null,
  });
  const [receipt, setReceipt] = useState<ReceiptData | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const receiptRef = useRef<HTMLDivElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
    const file = e.target.files?.[0] || null;
    setFiles({ ...files, [field]: file });
  };

  const fileLabels: Record<string, string> = {
    aadharCard: "Aadhar Card",
    birthCertificate: "Birth Certificate",
    marksheet: "Marksheet",
    fatherAadhar: "Father's Aadhar Card",
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const attachments: AttachmentData[] = [];
      for (const [key, file] of Object.entries(files)) {
        if (file) {
          const dataUrl = await fileToDataUrl(file);
          attachments.push({
            name: file.name,
            label: fileLabels[key],
            dataUrl,
            type: file.type,
          });
        }
      }

      setReceipt({
        studentName: formData.studentName,
        class: formData.class,
        address: formData.address,
        percentage: formData.percentage,
        receiptNo: `SCH-${Date.now().toString().slice(-6)}`,
        date: new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "long", year: "numeric" }),
        attachments,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setFormData({ studentName: "", class: "", address: "", percentage: "" });
    setFiles({ aadharCard: null, birthCertificate: null, marksheet: null, fatherAadhar: null });
    setReceipt(null);
  };

  const isImageType = (type: string) => type.startsWith("image/");

  const handleDownloadPDF = () => {
    if (!receipt) return;
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    const currentReceipt = receipt;

    const docImages = currentReceipt.attachments
      .map((att) => {
...
    printWindow.document.close();

    // Reset form after download
    handleCancel();

  if (receipt) {
    return (
      <Layout>
        <section className="py-8 sm:py-12 md:py-16">
          <div className="container mx-auto px-3 sm:px-4 max-w-2xl">
            <div ref={receiptRef} className="bg-card p-4 sm:p-6 md:p-8 rounded-lg shadow-xl border-2 border-primary">
              {/* Header with Logo */}
              <div className="text-center border-b-2 border-primary pb-3 sm:pb-4 mb-4 sm:mb-6">
                <img src={scholarLogo} alt="Scholar Logo" className="w-14 h-14 sm:w-16 sm:h-16 rounded-full object-cover mx-auto mb-2" />
                <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-foreground">SCHOLAR EDUCATIONAL CAMPUS</h1>
                <p className="text-xs sm:text-sm text-muted-foreground mt-1">Admission Receipt</p>
                <p className="text-[10px] sm:text-xs text-muted-foreground mt-1">
                  📞 +91 98765 43210 &nbsp;|&nbsp; ✉ info@scholarcampus.edu
                </p>
              </div>

              {/* Details */}
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
              </div>

              {/* Document Previews */}
              {receipt.attachments.length > 0 && (
                <div className="mt-4 sm:mt-6">
                  <h3 className="text-sm sm:text-base font-bold text-foreground mb-3 border-b border-primary pb-2">
                    Submitted Documents
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    {receipt.attachments.map((att) => (
                      <div key={att.label} className="border border-border rounded-lg p-2 sm:p-3">
                        <p className="text-xs sm:text-sm font-bold text-primary mb-2">{att.label}</p>
                        {isImageType(att.type) ? (
                          <img
                            src={att.dataUrl}
                            alt={att.label}
                            className="w-full h-32 sm:h-40 object-contain rounded border border-border bg-muted/30"
                          />
                        ) : (
                          <div className="w-full h-32 sm:h-40 flex flex-col items-center justify-center rounded border border-border bg-muted/30 gap-2">
                            <FileText className="w-8 h-8 text-primary" />
                            <span className="text-xs text-muted-foreground">PDF Document</span>
                          </div>
                        )}
                        <p className="text-[10px] sm:text-xs text-muted-foreground mt-1 truncate">{att.name}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

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
                  {Object.entries(fileLabels).map(([key, label]) => (
                    <div key={key} className="space-y-1.5 sm:space-y-2">
                      <Label htmlFor={key} className="text-xs sm:text-sm">{label}</Label>
                      <Input
                        id={key}
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={(e) => handleFileChange(e, key)}
                        className="border-border focus:border-primary text-xs sm:text-sm"
                      />
                      {files[key] && (
                        <div className="flex items-center gap-1.5 text-[10px] sm:text-xs text-green-600">
                          {files[key]!.type.startsWith("image/") ? (
                            <ImageIcon className="w-3 h-3" />
                          ) : (
                            <FileText className="w-3 h-3" />
                          )}
                          <span className="truncate">{files[key]!.name}</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-3 sm:pt-4">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 btn-hover bg-primary text-primary-foreground py-4 sm:py-5 md:py-6 text-sm sm:text-base md:text-lg rounded-full"
                >
                  {isSubmitting ? "Processing..." : "Submit Application"}
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
