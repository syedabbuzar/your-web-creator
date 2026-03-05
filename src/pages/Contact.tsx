import Layout from "@/components/Layout";
import SEOHead from "@/components/SEOHead";
import FloatingActions from "@/components/FloatingActions";
import { Mail, Phone, MapPin, Clock, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { toast } from "sonner";

const contactInfo = [
  { icon: MapPin, title: "Address", content: "Hyderabad Road Wajegaon, Dist Nanded" },
  { icon: Phone, title: "Phone", content: "+91 95038 34282" },
  { icon: Mail, title: "Email", content: "scholareducationalcampus@gmail.com" },
  { icon: Clock, title: "Working Hours", content: "Mon - Sat: 8:00 AM - 5:00 PM" },
];

const WHATSAPP_NUMBER = "919503894282";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const text = `*New Inquiry from Scholar Campus Website*%0A%0A*Name:* ${encodeURIComponent(formData.name)}%0A*Email:* ${encodeURIComponent(formData.email)}%0A*Phone:* ${encodeURIComponent(formData.phone)}%0A*Subject:* ${encodeURIComponent(formData.subject)}%0A*Message:* ${encodeURIComponent(formData.message)}`;
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${text}`, "_blank");
    toast.success("Redirecting to WhatsApp...");
    setFormData({ name: "", email: "", phone: "", subject: "", message: "" });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <Layout>
      <SEOHead title="Contact Us" description="Contact Scholar Educational Campus Nanded. Address: Hyderabad Road Wajegaon, Nanded. Phone: +91 9503894282. Email: scholareducationalcampus@gmail.com. Admissions enquiry welcome." keywords="contact scholar campus nanded, school phone number nanded, school address nanded, school email nanded" path="/contact" />
      <FloatingActions />
      <section className="py-10 sm:py-14 md:py-20 bg-secondary/30">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Mail className="w-8 h-8 text-primary" />
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground">Contact Us</h1>
          </div>
          <p className="text-sm sm:text-base text-muted-foreground">
            Get in touch with us for admissions, inquiries, or any other information
          </p>
        </div>
      </section>

      <section className="py-10 sm:py-14 md:py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
            <div className="animate-slide-in-left">
              <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-foreground mb-4 sm:mb-6">Send us a Message</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-xs sm:text-sm">Full Name *</Label>
                    <Input name="name" value={formData.name} onChange={handleChange} required className="text-sm" />
                  </div>
                  <div>
                    <Label className="text-xs sm:text-sm">Email Address *</Label>
                    <Input name="email" type="email" value={formData.email} onChange={handleChange} placeholder="name@email.com" required className="text-sm" />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-xs sm:text-sm">Phone Number</Label>
                    <Input name="phone" value={formData.phone} onChange={handleChange} className="text-sm" />
                  </div>
                  <div>
                    <Label className="text-xs sm:text-sm">Subject *</Label>
                    <Input name="subject" value={formData.subject} onChange={handleChange} required className="text-sm" />
                  </div>
                </div>
                <div>
                  <Label className="text-xs sm:text-sm">Message *</Label>
                  <Textarea name="message" value={formData.message} onChange={handleChange} rows={4} required className="text-sm" />
                </div>
                <Button type="submit" className="w-full btn-hover bg-primary text-primary-foreground py-4 sm:py-5 md:py-6 text-sm sm:text-base md:text-lg">
                  <Send className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                  Send Message via WhatsApp
                </Button>
              </form>
            </div>

            <div className="animate-slide-in-right">
              <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-foreground mb-4 sm:mb-6">Get in Touch</h2>
              <p className="text-xs sm:text-sm md:text-base text-muted-foreground mb-4 sm:mb-6 md:mb-8">
                We'd love to hear from you! Whether you have a question about admissions, fees, or anything else, our team is ready to answer all your questions.
              </p>
              <div className="space-y-3 sm:space-y-4 md:space-y-6">
                {contactInfo.map((info, index) => (
                  <div key={info.title} className="flex items-start gap-3 sm:gap-4 p-3 sm:p-4 bg-card rounded-lg card-hover animate-fade-in-up" style={{ animationDelay: `${index * 0.1}s` }}>
                    <div className="w-9 h-9 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <info.icon className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-bold text-foreground text-sm sm:text-base">{info.title}</h3>
                      <p className="text-xs sm:text-sm md:text-base text-muted-foreground">{info.content}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-10 sm:py-14 md:py-20 bg-secondary/30">
        <div className="container mx-auto px-4">
          <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-foreground text-center mb-4 sm:mb-6 md:mb-8 animate-fade-in">Find Us on Map</h2>
          <div className="aspect-[16/9] max-w-4xl mx-auto bg-card rounded-lg overflow-hidden shadow-lg animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3769.176546425336!2d77.33875547714214!3d19.14374780364763!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bd1d7c5e9ab3f8b%3A0x1646397e70814832!2sScholar%20International%20School%20HYD.Road%20Wajegaon%20Nanded!5e0!3m2!1sen!2sin!4v1770882964893!5m2!1sen!2sin"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Scholar Campus Location"
            />
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Contact;