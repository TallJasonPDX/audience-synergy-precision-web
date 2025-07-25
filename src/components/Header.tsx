import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { Menu, X, Target, ChevronDown } from "lucide-react";
import { Link } from "react-router-dom";

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  const navItems = [
    { 
      label: "Audiences", 
      href: "/audiences",
      dropdown: [
        { label: "Registered Nurses", href: "/audiences#nurses" },
        { label: "Physicians", href: "/audiences#physicians" },
        { label: "NPs & PAs", href: "/audiences#nps-pas" },
        { label: "Pharmacists", href: "/audiences#pharmacists" }
      ]
    },
    { 
      label: "Industries", 
      href: "/industries",
      dropdown: [
        { label: "Pharmaceutical", href: "/industries#pharmaceutical" },
        { label: "Healthcare Recruitment", href: "/industries#recruitment" },
        { label: "Medical Devices", href: "/industries#medical-devices" },
        { label: "Healthcare Technology", href: "/industries#healthtech" }
      ]
    },
    { 
      label: "Services", 
      href: "/services",
      dropdown: [
        { label: "Managed Service", href: "/services#managed" },
        { label: "Self-Service Integration", href: "/services#self-service" },
        { label: "Multi-Channel", href: "/services#channels" }
      ]
    },
    { label: "About", href: "#about" },
  ];

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'glass backdrop-blur-md border-b border-white/10' 
          : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <img 
              src="/lovable-uploads/f244ebe9-b404-40fe-b795-a4b821e85ffe.png" 
              alt="Audience Synergy" 
              className="h-8 md:h-10 w-auto"
            />
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <div 
                key={item.label}
                className="relative"
                onMouseEnter={() => item.dropdown && setActiveDropdown(item.label)}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                {item.href.startsWith('/') ? (
                  <Link
                    to={item.href}
                    className="flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {item.label}
                    {item.dropdown && <ChevronDown className="w-3 h-3" />}
                  </Link>
                ) : (
                  <a
                    href={item.href}
                    className="flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {item.label}
                    {item.dropdown && <ChevronDown className="w-3 h-3" />}
                  </a>
                )}
                
                {/* Dropdown Menu */}
                {item.dropdown && activeDropdown === item.label && (
                  <div className="absolute top-full left-0 pt-2 z-50">
                    <div className="bg-background/95 backdrop-blur-md border border-border/20 rounded-lg shadow-elegant p-2 min-w-[200px]">
                      {item.dropdown.map((dropdownItem) => (
                        <Link
                          key={dropdownItem.label}
                          to={dropdownItem.href}
                          className="block px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-md transition-colors"
                        >
                          {dropdownItem.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-4">
            <Button variant="ghost" size="sm">
              Log In
            </Button>
            <Button size="sm" className="btn-premium">
              Get Demo
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-muted/50 transition-colors"
          >
            {isMobileMenuOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-border/10 bg-background/95 backdrop-blur-md">
            <nav className="py-4 space-y-2">
              {navItems.map((item) => (
                <div key={item.label}>
                  {item.href.startsWith('/') ? (
                    <Link
                      to={item.href}
                      className="block px-4 py-2 text-muted-foreground hover:text-foreground transition-colors"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {item.label}
                    </Link>
                  ) : (
                    <a
                      href={item.href}
                      className="block px-4 py-2 text-muted-foreground hover:text-foreground transition-colors"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {item.label}
                    </a>
                  )}
                  {item.dropdown && (
                    <div className="ml-4 space-y-1">
                      {item.dropdown.map((dropdownItem) => (
                        <Link
                          key={dropdownItem.label}
                          to={dropdownItem.href}
                          className="block px-4 py-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          {dropdownItem.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              <div className="px-4 pt-4 space-y-2">
                <Button variant="ghost" size="sm" className="w-full justify-start">
                  Log In
                </Button>
                <Button size="sm" className="w-full btn-premium">
                  Get Demo
                </Button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;