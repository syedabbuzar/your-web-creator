import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import scholarLogo from "@/assets/scholar-logo.jpg";

const navLinks = [
  { name: "Home", path: "/" },
  { name: "Events", path: "/events" },
  { name: "About Us", path: "/about" },
  { name: "Campus", path: "/campus" },
  { name: "Exam", path: "/exam" },
  { name: "Admission", path: "/admission" },
];

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled
          ? "bg-background/95 backdrop-blur-md shadow-md py-2"
          : "bg-transparent py-4"
      )}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          {/* Logo and Title */}
          <Link to="/" className="flex items-center gap-3 group">
            <img src={scholarLogo} alt="Scholar Educational Campus Logo" className="w-16 h-16 md:w-20 md:h-20 rounded-full object-cover transition-transform duration-300 group-hover:scale-110" />
            <div className="hidden sm:block">
              <h1 className="text-lg md:text-xl font-bold text-foreground tracking-wide">
                SCHOLAR EDUCATIONAL
              </h1>
              <p className="text-sm md:text-base text-foreground/80 tracking-widest">
                CAMPUS
              </p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={cn(
                  "nav-link text-foreground font-medium text-sm uppercase tracking-wider py-2",
                  location.pathname === link.path && "after:w-full"
                )}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Contact Button & Mobile Menu */}
          <div className="flex items-center gap-4">
            <Link to="/contact" className="hidden md:block">
              <Button className="btn-hover bg-primary text-primary-foreground font-semibold px-6 py-2 rounded-full">
                Contact Us
              </Button>
            </Link>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 text-foreground hover:bg-secondary rounded-md transition-colors"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={cn(
            "lg:hidden overflow-hidden transition-all duration-300",
            isMobileMenuOpen ? "max-h-96 mt-4" : "max-h-0"
          )}
        >
          <div className="flex flex-col gap-2 py-4 bg-card rounded-lg shadow-lg">
            {navLinks.map((link, index) => (
              <Link
                key={link.path}
                to={link.path}
                className={cn(
                  "px-6 py-3 text-foreground font-medium hover:bg-secondary transition-colors",
                  location.pathname === link.path && "bg-secondary"
                )}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {link.name}
              </Link>
            ))}
            <Link to="/contact" className="px-6 py-3">
              <Button className="w-full bg-primary text-primary-foreground font-semibold rounded-full">
                Contact Us
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
