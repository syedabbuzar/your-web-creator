import { Link } from "react-router-dom";
import { Facebook, Twitter, Instagram, Youtube, Mail, Phone, MapPin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Logo and About */}
          <div className="animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-14 h-14 rounded-full bg-primary-foreground text-primary flex items-center justify-center font-bold text-xl">
                SC
              </div>
              <div>
                <h3 className="font-bold text-lg">SCHOLAR</h3>
                <p className="text-sm opacity-80">EDUCATIONAL CAMPUS</p>
              </div>
            </div>
            <p className="text-sm opacity-80 leading-relaxed">
              Committed to shaping a better world through better education. VERITAS - Truth, Knowledge, Excellence.
            </p>
          </div>

          {/* Quick Links */}
          <div className="animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
            <h4 className="font-bold text-lg mb-4 pb-2 border-b border-primary-foreground/30">Quick Links</h4>
            <ul className="space-y-2">
              {["Home", "Events", "About Us", "Campus", "Exam", "Contact Us"].map((link) => (
                <li key={link}>
                  <Link
                    to={link === "Home" ? "/" : `/${link.toLowerCase().replace(" ", "-").replace("-us", "")}`}
                    className="text-sm opacity-80 hover:opacity-100 hover:translate-x-1 inline-block transition-all duration-200"
                  >
                    → {link}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="animate-fade-in-up" style={{ animationDelay: "0.3s" }}>
            <h4 className="font-bold text-lg mb-4 pb-2 border-b border-primary-foreground/30">Contact Info</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-2 text-sm opacity-80">
                <MapPin size={18} className="mt-0.5 flex-shrink-0" />
                <span>123 Education Lane, Knowledge City, State - 123456</span>
              </li>
              <li className="flex items-center gap-2 text-sm opacity-80">
                <Phone size={18} className="flex-shrink-0" />
                <span>+91 98765 43210</span>
              </li>
              <li className="flex items-center gap-2 text-sm opacity-80">
                <Mail size={18} className="flex-shrink-0" />
                <span>info@scholarcampus.edu</span>
              </li>
            </ul>
          </div>

          {/* Social Links */}
          <div className="animate-fade-in-up" style={{ animationDelay: "0.4s" }}>
            <h4 className="font-bold text-lg mb-4 pb-2 border-b border-primary-foreground/30">Follow Us</h4>
            <div className="flex gap-3">
              {[
                { icon: Facebook, label: "Facebook" },
                { icon: Twitter, label: "Twitter" },
                { icon: Instagram, label: "Instagram" },
                { icon: Youtube, label: "YouTube" },
              ].map(({ icon: Icon, label }) => (
                <a
                  key={label}
                  href="#"
                  aria-label={label}
                  className="w-10 h-10 rounded-full bg-primary-foreground/10 flex items-center justify-center hover:bg-primary-foreground hover:text-primary transition-all duration-300 hover:scale-110"
                >
                  <Icon size={18} />
                </a>
              ))}
            </div>
            <div className="mt-6">
              <p className="text-sm opacity-80 mb-2">Working Hours:</p>
              <p className="text-sm">Mon - Sat: 8:00 AM - 5:00 PM</p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-6 border-t border-primary-foreground/20 text-center">
          <p className="text-sm opacity-70">
            © {new Date().getFullYear()} Scholar Educational Campus. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
