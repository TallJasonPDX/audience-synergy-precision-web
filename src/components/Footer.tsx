import { Target, Mail, Phone, MapPin, Linkedin, Twitter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Footer = () => {
  const footerSections = [
    {
      title: "Solutions",
      links: [
        { label: "Managed Service", href: "#managed" },
        { label: "Self-Service Integration", href: "#self-service" },
        { label: "API Access", href: "#api" },
        { label: "Custom Audiences", href: "#custom" },
      ]
    },
    {
      title: "Audiences",
      links: [
        { label: "Physicians", href: "#physicians" },
        { label: "Nurses", href: "#nurses" },
        { label: "Pharmacists", href: "#pharmacists" },
        { label: "Patients", href: "#patients" },
      ]
    },
    {
      title: "Resources",
      links: [
        { label: "Healthcare Media News", href: "/blog" },
        { label: "Case Studies", href: "#case-studies" },
        { label: "Documentation", href: "#docs" },
        { label: "Industry Reports", href: "#reports" },
        { label: "Support", href: "#support" },
      ]
    },
    {
      title: "Company",
      links: [
        { label: "About Us", href: "#about" },
        { label: "Careers", href: "#careers" },
        { label: "Press", href: "#press" },
        { label: "Contact", href: "#contact" },
      ]
    }
  ];

  return (
    <footer className="bg-muted/30 border-t border-border/50">
      <div className="container mx-auto px-6">
        {/* Main footer content */}
        <div className="py-16">
          <div className="grid lg:grid-cols-6 gap-12">
            {/* Company info */}
            <div className="lg:col-span-2">
              <Link to="/" className="inline-block mb-6">
                <img 
                  src="/lovable-uploads/f244ebe9-b404-40fe-b795-a4b821e85ffe.png" 
                  alt="Audience Synergy" 
                  className="h-10 w-auto"
                />
              </Link>
              
              <p className="text-muted-foreground mb-6 leading-relaxed">
                NPI-verified, deterministic healthcare professional audiences for pharmaceutical companies, 
                medical device manufacturers, and healthcare recruiters. We don't believe in guessing 
                who is seeing your ad.
              </p>

              {/* Contact info */}
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <Mail className="w-4 h-4" />
                  hello@audiencesynergy.com
                </div>
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <Phone className="w-4 h-4" />
                  1-800-SYNERGY
                </div>
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <MapPin className="w-4 h-4" />
                  Healthcare Data Center, USA
                </div>
              </div>

              {/* Social links */}
              <div className="flex items-center gap-3 mt-6">
                <Button variant="outline" size="sm" className="w-10 h-10 p-0">
                  <Linkedin className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="sm" className="w-10 h-10 p-0">
                  <Twitter className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Footer sections */}
            {footerSections.map((section) => (
              <div key={section.title}>
                <h4 className="font-semibold mb-4">{section.title}</h4>
                <ul className="space-y-3">
                  {section.links.map((link) => (
                    <li key={link.label}>
                      <a 
                        href={link.href}
                        className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom bar */}
        <div className="py-6 border-t border-border/50">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <span>&copy; 2025 Audience Synergy. All rights reserved.</span>
              <a href="#privacy" className="hover:text-foreground transition-colors">Privacy Policy</a>
              <a href="#terms" className="hover:text-foreground transition-colors">Terms of Service</a>
              <a href="#hipaa" className="hover:text-foreground transition-colors">HIPAA Compliance</a>
            </div>
            
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <div className="w-2 h-2 bg-accent rounded-full animate-pulse" />
              <span>All systems operational</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;