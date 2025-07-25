import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { UserCheck, Stethoscope, Shield, Pill } from "lucide-react";
import heroImage from "@/assets/healthcare-professionals.jpg";

const audienceTypes = [
  {
    title: "Registered Nurses by Specialty",
    icon: UserCheck,
    description: "Access precision-targeted RN audiences across all specialties",
    specialties: ["ICU/Critical Care", "Emergency/Trauma", "Operating Room", "Medical/Surgical", "Pediatric", "Oncology", "Cardiac", "Labor & Delivery"],
    coverage: "850,000+ RNs"
  },
  {
    title: "Physicians by Specialty", 
    icon: Stethoscope,
    description: "NPI-verified physician audiences with 93% US coverage",
    specialties: ["Primary Care", "Cardiology", "Oncology", "Neurology", "Orthopedics", "Dermatology", "Psychiatry", "Emergency Medicine"],
    coverage: "750,000+ Physicians"
  },
  {
    title: "Nurse Practitioners & PAs",
    icon: Shield,
    description: "Advanced practice providers by specialty and location",
    specialties: ["Family Medicine", "Adult-Gerontology", "Pediatric", "Acute Care", "Psychiatric", "Women's Health", "Emergency", "Orthopedic"],
    coverage: "300,000+ NPs/PAs"
  },
  {
    title: "Pharmacists by Specialty",
    icon: Pill,
    description: "Clinical and retail pharmacists across all practice settings",
    specialties: ["Clinical Pharmacy", "Retail Pharmacy", "Hospital Pharmacy", "Oncology Pharmacy", "Psychiatric Pharmacy", "Ambulatory Care", "Critical Care", "Pediatric"],
    coverage: "275,000+ Pharmacists"
  }
];

const Audiences = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="relative pt-20 pb-16 overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src={heroImage} 
            alt="Healthcare Professionals" 
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background/90 to-secondary/10" />
        </div>
        
        <div className="relative z-10 container mx-auto px-6 text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-display font-bold mb-6">
              <span className="gradient-text">Precision Healthcare</span>
              <br />
              <span className="text-foreground">Professional Audiences</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              NPI-verified, deterministic audiences of healthcare professionals. 
              No guesswork. No assumptions. Just verified professionals ready to engage.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="btn-premium">
                Request Audience Data
              </Button>
              <Button variant="outline" size="lg" className="border-primary/20 hover:bg-primary/5">
                Download Specialty Guide
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Audience Types */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Healthcare Professional Segments
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Access verified audiences across all major healthcare professions with specialty-level precision
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {audienceTypes.map((audience, index) => {
              const Icon = audience.icon;
              return (
                <Card key={index} className="glass-card hover:shadow-elegant transition-all duration-300">
                  <CardHeader>
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center">
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-xl">{audience.title}</CardTitle>
                        <div className="text-sm text-primary font-semibold">{audience.coverage}</div>
                      </div>
                    </div>
                    <CardDescription className="text-base">
                      {audience.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <h4 className="font-semibold text-foreground">Available Specialties:</h4>
                      <div className="grid grid-cols-2 gap-2">
                        {audience.specialties.map((specialty, idx) => (
                          <div key={idx} className="text-sm text-muted-foreground bg-muted/50 rounded-lg px-3 py-2">
                            {specialty}
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Key Features */}
      <section className="py-16 bg-muted/20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Why Our Audiences Are Different
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-white">100%</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">NPI Verified</h3>
              <p className="text-muted-foreground">
                Every healthcare professional in our database is verified against the National Provider Identifier registry
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-accent rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-white">93%</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">US Coverage</h3>
              <p className="text-muted-foreground">
                Comprehensive coverage of active physicians across the United States
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-secondary rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-white">0.80%</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Click-Through Rate</h3>
              <p className="text-muted-foreground">
                Industry-leading engagement rates on healthcare professional banner campaigns
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Audiences;