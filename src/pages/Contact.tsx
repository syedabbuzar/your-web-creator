import Layout from "@/components/Layout";
import { Mail, Phone, MapPin, Clock, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { toast } from "sonner";

const contactInfo = [
  { icon: MapPin, title: "Address", content: "123 Education Lane, Knowledge City, State - 123456" },
  { icon: Phone, title: "Phone", content: "+91 98765 43210" },
  { icon: Mail, title: "Email", content: "info@scholarcampus.edu" },
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
      <section className="py-16 bg-secondary/30">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Mail className="w-8 h-8 text-primary" />
            <h1 className="text-4xl md:text-5xl font-bold text-foreground animate-fade-in">Contact Us</h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
            Get in touch with us for admissions, inquiries, or any other information
          </p>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12">
            <div className="bg-card p-8 rounded-lg shadow-lg animate-slide-in-left">
              <h2 className="text-2xl font-bold text-foreground mb-6">Send us a Message</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name *</Label>
                    <Input id="name" name="name" value={formData.name} onChange={handleChange} placeholder="Your full name" required className="border-border focus:border-primary" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address *</Label>
                    <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} placeholder="your@email.com" required className="border-border focus:border-primary" />
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input id="phone" name="phone" value={formData.phone} onChange={handleChange} placeholder="+91 12345 67890" className="border-border focus:border-primary" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject *</Label>
                    <Input id="subject" name="subject" value={formData.subject} onChange={handleChange} placeholder="How can we help?" required className="border-border focus:border-primary" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="message">Message *</Label>
                  <Textarea id="message" name="message" value={formData.message} onChange={handleChange} placeholder="Write your message here..." rows={5} required className="border-border focus:border-primary" />
                </div>
                <Button type="submit" className="w-full btn-hover bg-primary text-primary-foreground py-6 text-lg">
                  <Send className="w-5 h-5 mr-2" />
                  Send Message via WhatsApp
                </Button>
              </form>
            </div>

            <div className="animate-slide-in-right">
              <h2 className="text-2xl font-bold text-foreground mb-6">Get in Touch</h2>
              <p className="text-muted-foreground mb-8">
                We'd love to hear from you! Whether you have a question about admissions, fees, or anything else, our team is ready to answer all your questions.
              </p>
              <div className="space-y-6">
                {contactInfo.map((info, index) => (
                  <div key={info.title} className="flex items-start gap-4 p-4 bg-card rounded-lg card-hover animate-fade-in-up" style={{ animationDelay: `${index * 0.1}s` }}>
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <info.icon className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-bold text-foreground">{info.title}</h3>
                      <p className="text-muted-foreground">{info.content}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-secondary/30">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-foreground text-center mb-8 animate-fade-in">Find Us on Map</h2>
          <div className="aspect-[16/9] max-w-4xl mx-auto bg-card rounded-lg overflow-hidden shadow-lg animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3671.9012!2d72.5714!3d23.0225!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjPCsDAxJzIxLjAiTiA3MsKwMzQnMTcuMCJF!5e0!3m2!1sen!2sin!4v1234567890"
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
