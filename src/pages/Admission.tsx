import Layout from "@/components/Layout";
import { GraduationCap, Printer } from "lucide-react";
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

  const handlePrint = () => {
    if (receiptRef.current) {
      const printWindow = window.open("", "_blank");
      if (printWindow) {
        printWindow.document.write(`
          <html><head><title>Admission Receipt</title>
          <style>
            body { font-family: Georgia, serif; padding: 40px; color: #333; }
            .receipt { border: 2px solid #8B0000; padding: 30px; max-width: 600px; margin: auto; }
            .header { text-align: center; border-bottom: 2px solid #8B0000; padding-bottom: 15px; margin-bottom: 20px; }
            .header h1 { color: #8B0000; margin: 0; font-size: 22px; }
            .header p { margin: 5px 0 0; font-size: 14px; color: #666; }
            .row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px dashed #ccc; }
            .label { font-weight: bold; color: #8B0000; }
            .footer { text-align: center; margin-top: 30px; font-size: 12px; color: #888; }
          </style></head><body>
          ${receiptRef.current.innerHTML}
          <script>window.print();window.close();</script>
          </body></html>
        `);
        printWindow.document.close();
      }
    }
  };

  if (receipt) {
    return (
      <Layout>
        <section className="py-16">
          <div className="container mx-auto px-4 max-w-2xl">
            <div ref={receiptRef} className="bg-card p-8 rounded-lg shadow-xl border-2 border-primary">
              <div className="header text-center border-b-2 border-primary pb-4 mb-6">
                <h1 className="text-2xl font-bold text-foreground">SCHOLAR EDUCATIONAL CAMPUS</h1>
                <p className="text-sm text-muted-foreground mt-1">Admission Receipt</p>
              </div>
              <div className="space-y-3">
                <div className="row flex justify-between py-2 border-b border-dashed border-border">
                  <span className="label font-bold text-foreground">Receipt No:</span>
                  <span className="text-muted-foreground">{receipt.receiptNo}</span>
                </div>
                <div className="row flex justify-between py-2 border-b border-dashed border-border">
                  <span className="label font-bold text-foreground">Date:</span>
                  <span className="text-muted-foreground">{receipt.date}</span>
                </div>
                <div className="row flex justify-between py-2 border-b border-dashed border-border">
                  <span className="label font-bold text-foreground">Student Name:</span>
                  <span className="text-muted-foreground">{receipt.studentName}</span>
                </div>
                <div className="row flex justify-between py-2 border-b border-dashed border-border">
                  <span className="label font-bold text-foreground">Class:</span>
                  <span className="text-muted-foreground">{receipt.class}</span>
                </div>
                <div className="row flex justify-between py-2 border-b border-dashed border-border">
                  <span className="label font-bold text-foreground">Address:</span>
                  <span className="text-muted-foreground">{receipt.address}</span>
                </div>
                <div className="row flex justify-between py-2 border-b border-dashed border-border">
                  <span className="label font-bold text-foreground">Percentage:</span>
                  <span className="text-muted-foreground">{receipt.percentage}%</span>
                </div>
                {receipt.attachments.length > 0 && (
                  <div className="py-2 border-b border-dashed border-border">
                    <span className="label font-bold text-foreground">Documents Submitted:</span>
                    <ul className="mt-1 list-disc list-inside text-muted-foreground text-sm">
                      {receipt.attachments.map((a) => <li key={a}>{a}</li>)}
                    </ul>
                  </div>
                )}
              </div>
              <div className="footer text-center mt-6 text-xs text-muted-foreground">
                <p>This is a computer-generated receipt. No signature required.</p>
              </div>
            </div>
            <div className="flex gap-4 mt-6 justify-center">
              <Button onClick={handlePrint} className="bg-primary text-primary-foreground px-8 py-3 rounded-full btn-hover">
                <Printer className="w-4 h-4 mr-2" />
                Print Receipt
              </Button>
              <Button onClick={handleCancel} variant="outline" className="border-primary text-primary px-8 py-3 rounded-full btn-hover">
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
      <section className="py-16 bg-secondary/30">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <GraduationCap className="w-8 h-8 text-primary" />
            <h1 className="text-4xl md:text-5xl font-bold text-foreground animate-fade-in">
              Admission Form
            </h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
            Fill in the details below to apply for admission at Scholar Educational Campus
          </p>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="bg-card p-8 rounded-lg shadow-lg animate-fade-in-up">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="studentName">Student Name *</Label>
                  <Input
                    id="studentName"
                    name="studentName"
                    value={formData.studentName}
                    onChange={handleChange}
                    placeholder="Enter student full name"
                    required
                    className="border-border focus:border-primary"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="class">Class *</Label>
                  <Input
                    id="class"
                    name="class"
                    value={formData.class}
                    onChange={handleChange}
                    placeholder="Enter class (e.g., 10th, 12th)"
                    required
                    className="border-border focus:border-primary"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Address *</Label>
                <Input
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Enter complete address"
                  required
                  className="border-border focus:border-primary"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="percentage">Percentage *</Label>
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
                  className="border-border focus:border-primary"
                />
              </div>

              <div className="border-t border-border pt-6">
                <h3 className="text-lg font-bold text-foreground mb-4">Documents (Optional)</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="aadharCard">Aadhar Card</Label>
                    <Input
                      id="aadharCard"
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={(e) => handleFileChange(e, "aadharCard")}
                      className="border-border focus:border-primary"
                    />
                    <p className="text-xs text-muted-foreground">Upload student's Aadhar card</p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="birthCertificate">Birth Certificate</Label>
                    <Input
                      id="birthCertificate"
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={(e) => handleFileChange(e, "birthCertificate")}
                      className="border-border focus:border-primary"
                    />
                    <p className="text-xs text-muted-foreground">Upload birth certificate</p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="marksheet">Marksheet</Label>
                    <Input
                      id="marksheet"
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={(e) => handleFileChange(e, "marksheet")}
                      className="border-border focus:border-primary"
                    />
                    <p className="text-xs text-muted-foreground">Upload previous class marksheet</p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="fatherAadhar">Father's Aadhar Card</Label>
                    <Input
                      id="fatherAadhar"
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={(e) => handleFileChange(e, "fatherAadhar")}
                      className="border-border focus:border-primary"
                    />
                    <p className="text-xs text-muted-foreground">Upload father's Aadhar card</p>
                  </div>
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <Button type="submit" className="flex-1 btn-hover bg-primary text-primary-foreground py-6 text-lg rounded-full">
                  Submit Application
                </Button>
                <Button type="button" onClick={handleCancel} variant="outline" className="flex-1 border-primary text-primary py-6 text-lg rounded-full btn-hover">
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
