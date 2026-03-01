import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, ShieldOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAdmin } from "@/contexts/AdminContext";
import scholarLogo from "@/assets/scholar-logo.jpg";

const navLinks = [
  { name: "Home", path: "/" },
  { name: "Events", path: "/events" },
  { name: "About Us", path: "/about" },
  { name: "Campus", path: "/campus" },
  { name: "Exam", path: "/exam" },
  { name: "Admission", path: "/admission" },
  { name: "Quiz", path: "/quiz" },
];

const Navbar = () => {
  const { isAdmin, toggleAdmin } = useAdmin();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
          ? "bg-background shadow-md py-1 sm:py-2"
          : "bg-background/80 backdrop-blur-sm py-2 sm:py-4"
      )}
    >
      <div className="container mx-auto px-3 sm:px-4">
        <div className="flex items-center justify-between">
          {/* Logo and Title */}
          <Link to="/" className="flex items-center gap-2 sm:gap-3 group">
            <img
              src={scholarLogo}
              alt="Scholar Educational Campus Logo"
              className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 rounded-full object-cover transition-transform duration-300 group-hover:scale-110"
            />
            <div>
              <h1 className=" text-[12px] sm:text-sm md:text-lg lg:text-xl xl:text-3xl font-bold text-foreground tracking-wide leading-tight whitespace-nowrap">
                SCHOLAR 
              </h1>
              <p className="text-[8px] sm:text-xs md:text-sm lg:text-base xl:text-lg text-foreground/80 tracking-widest font-medium">
                 EDUCATIONAL CAMPUS 
              </p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-4 xl:gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={cn(
                  "nav-link text-foreground font-medium text-xs xl:text-sm uppercase tracking-wider py-2 whitespace-nowrap",
                  location.pathname === link.path && "after:w-full"
                )}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Contact Button & Mobile Menu */}
          <div className="flex items-center gap-2 sm:gap-4">
            {isAdmin && (
              <Button
                onClick={toggleAdmin}
                variant="outline"
                size="sm"
                className="hidden md:flex items-center gap-1 border-destructive text-destructive hover:bg-destructive/10 rounded-full text-xs"
              >
                <ShieldOff className="w-3.5 h-3.5" /> Exit Admin
              </Button>
            )}
            <Link to="/contact" className="hidden md:block">
              <Button className="btn-hover bg-primary text-primary-foreground font-semibold px-4 lg:px-6 py-2 rounded-full text-xs lg:text-sm">
                Contact Us
              </Button>
            </Link>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-1.5 sm:p-2 text-foreground hover:bg-secondary rounded-md transition-colors"
            >
              {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={cn(
            "lg:hidden overflow-hidden transition-all duration-300",
            isMobileMenuOpen ? "max-h-[500px] mt-3" : "max-h-0"
          )}
        >
          <div className="flex flex-col gap-1 py-3 bg-card rounded-lg shadow-lg">
            {navLinks.map((link, index) => (
              <Link
                key={link.path}
                to={link.path}
                className={cn(
                  "px-4 sm:px-6 py-2.5 sm:py-3 text-sm sm:text-base text-foreground font-medium hover:bg-secondary transition-colors",
                  location.pathname === link.path && "bg-secondary"
                )}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {link.name}
              </Link>
            ))}
            {isAdmin && (
              <div className="px-4 sm:px-6 py-2">
                <Button
                  onClick={toggleAdmin}
                  variant="outline"
                  className="w-full border-destructive text-destructive hover:bg-destructive/10 rounded-full text-sm"
                >
                  <ShieldOff className="w-4 h-4 mr-1" /> Exit Admin Mode
                </Button>
              </div>
            )}
            <Link to="/contact" className="px-4 sm:px-6 py-2">
              <Button className="w-full bg-primary text-primary-foreground font-semibold rounded-full text-sm">
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
