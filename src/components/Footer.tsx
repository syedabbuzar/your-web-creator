import { Link } from "react-router-dom";
import { Facebook, Twitter, Instagram, Youtube, Mail, Phone, MapPin } from "lucide-react";
import scholarLogo from "@/assets/scholar-logo.jpg";

const Footer = () => {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 py-8 sm:py-10 md:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {/* Logo and About */}
          <div className="animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
            <div className="flex items-center gap-3 mb-4">
              <img
                src={scholarLogo}
                alt="Scholar Educational Campus Logo"
                className="w-10 h-10 sm:w-14 sm:h-14 rounded-full object-cover flex-shrink-0"
              />
              <div>
                <h3 className="font-bold text-base sm:text-lg">SCHOLAR</h3>
                <p className="text-xs sm:text-sm opacity-80">EDUCATIONAL CAMPUS</p>
              </div>
            </div>
            <p className="text-xs sm:text-sm opacity-80 leading-relaxed">
              Committed to shaping a better world through better education. VERITAS - Truth, Knowledge, Excellence.
            </p>
          </div>

          {/* Quick Links */}
          <div className="animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
            <h4 className="font-bold text-base sm:text-lg mb-3 sm:mb-4 pb-2 border-b border-primary-foreground/30">Quick Links</h4>
            <ul className="space-y-1.5 sm:space-y-2">
              {["Home", "Events", "About Us", "Campus", "Exam", "Contact Us"].map((link) => (
                <li key={link}>
                  <Link
                    to={link === "Home" ? "/" : `/${link.toLowerCase().replace(" ", "-").replace("-us", "")}`}
                    className="text-xs sm:text-sm opacity-80 hover:opacity-100 hover:translate-x-1 inline-block transition-all duration-200"
                  >
                    → {link}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="animate-fade-in-up" style={{ animationDelay: "0.3s" }}>
            <h4 className="font-bold text-base sm:text-lg mb-3 sm:mb-4 pb-2 border-b border-primary-foreground/30">Contact Info</h4>
            <ul className="space-y-2 sm:space-y-3">
              <li className="flex items-start gap-2 text-xs sm:text-sm opacity-80">
                <MapPin size={16} className="mt-0.5 flex-shrink-0" />
                <span>Hyd road, Near old bridge Wajegaon, dist Nanded </span>
              </li>
              <li className="flex items-center gap-2 text-xs sm:text-sm opacity-80">
                <Phone size={16} className="flex-shrink-0" />
                <span>+91 9503834282 </span>
              </li>
              <li className="flex items-center gap-2 text-xs sm:text-sm opacity-80">
                <Mail size={16} className="flex-shrink-0" />
                <span>scholaries4282@gmail.com</span>
              </li>
            </ul>
          </div>

          {/* Social Links */}
          <div className="animate-fade-in-up" style={{ animationDelay: "0.4s" }}>
            <h4 className="font-bold text-base sm:text-lg mb-3 sm:mb-4 pb-2 border-b border-primary-foreground/30">Follow Us</h4>
            <div className="flex gap-2 sm:gap-3">
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
                  className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-primary-foreground/10 flex items-center justify-center hover:bg-primary-foreground hover:text-primary transition-all duration-300 hover:scale-110"
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
            {/* <div className="mt-4 sm:mt-6">
              <p className="text-xs sm:text-sm opacity-80 mb-1 sm:mb-2">Working Hours:</p>
              <p className="text-xs sm:text-sm">Mon - Sat: 8:00 AM - 5:00 PM</p>
            </div> */}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 sm:mt-12 pt-4 sm:pt-6 border-t border-primary-foreground/20 text-center">
          <p className="text-xs sm:text-sm opacity-70">
            © {new Date().getFullYear()} Scholar Educational Campus. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
