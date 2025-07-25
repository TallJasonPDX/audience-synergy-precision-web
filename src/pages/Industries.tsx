import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, Users, Briefcase, GraduationCap, Heart, Pill } from "lucide-react";
import heroImage from "@/assets/healthcare-professionals.jpg";

const industries = [
  {
    title: "Pharmaceutical Companies",
    icon: Pill,
    description: "Reach physicians and specialists for drug awareness, education, and clinical trial recruitment",
    useCases: [
      "New drug launch campaigns",
      "Medical education programs", 
      "Clinical trial recruitment",
      "Specialty physician targeting",
      "Post-market surveillance"
    ],
    audience: "Primary care physicians, specialists, pharmacists",
    results: "3x higher engagement vs. traditional medical advertising"
  },
  {
    title: "Healthcare Recruitment",
    icon: Users,
    description: "Connect with qualified healthcare professionals seeking new career opportunities",
    useCases: [
      "Nursing recruitment campaigns",
      "Physician placement services",
      "Travel nurse programs", 
      "Specialty healthcare roles",
      "Healthcare executive search"
    ],
    audience: "RNs, physicians, NPs, PAs, healthcare administrators",
    results: "85% increase in qualified candidate applications"
  },
  {
    title: "Medical Device Companies",
    icon: Heart,
    description: "Target healthcare professionals who specify, purchase, and use medical devices",
    useCases: [
      "New device introductions",
      "Clinical evidence campaigns",
      "Training and education",
      "Competitive positioning",
      "Market research"
    ],
    audience: "Specialists, department heads, procurement teams",
    results: "60% improvement in sales lead quality"
  },
  {
    title: "Healthcare Technology",
    icon: Building2,
    description: "Reach decision-makers implementing healthcare IT solutions and digital health tools",
    useCases: [
      "EHR system adoption",
      "Telehealth platform promotion",
      "Digital health tools",
      "Healthcare analytics",
      "Practice management software"
    ],
    audience: "Healthcare IT directors, practice administrators, physicians",
    results: "2x higher demo request rates"
  },
  {
    title: "Medical Education",
    icon: GraduationCap,
    description: "Promote continuing education, certification programs, and professional development",
    useCases: [
      "CME program promotion",
      "Certification courses",
      "Medical conferences",
      "Online learning platforms",
      "Professional development"
    ],
    audience: "Physicians, nurses, specialists seeking continuing education",
    results: "150% increase in course enrollment"
  },
  {
    title: "Professional Services",
    icon: Briefcase,
    description: "Target healthcare organizations with financial, legal, and consulting services",
    useCases: [
      "Healthcare consulting services",
      "Medical malpractice insurance",
      "Financial planning for physicians",
      "Legal services for healthcare",
      "Practice management consulting"
    ],
    audience: "Practice owners, healthcare executives, administrators",
    results: "4x improvement in qualified lead generation"
  }
];

const Industries = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="relative pt-20 pb-16 overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src={heroImage} 
            alt="Healthcare Industries" 
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background/90 to-secondary/10" />
        </div>
        
        <div className="relative z-10 container mx-auto px-6 text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-display font-bold mb-6">
              <span className="gradient-text">Industries We</span>
              <br />
              <span className="text-foreground">Serve & Empower</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              Specialized healthcare marketing solutions tailored to your industry's unique needs 
              and the professionals you need to reach.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="btn-premium">
                Explore Industry Solutions
              </Button>
              <Button variant="outline" size="lg" className="border-primary/20 hover:bg-primary/5">
                View Case Studies
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Industries Grid */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Trusted Across Healthcare Industries
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              From pharmaceutical giants to medical device startups, we help organizations connect 
              with the right healthcare professionals at the right time.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {industries.map((industry, index) => {
              const Icon = industry.icon;
              return (
                <Card key={index} className="glass-card hover:shadow-elegant transition-all duration-300 h-full">
                  <CardHeader>
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center flex-shrink-0">
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <CardTitle className="text-xl mb-2">{industry.title}</CardTitle>
                        <CardDescription className="text-base">
                          {industry.description}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <h4 className="font-semibold text-foreground mb-3">Common Use Cases:</h4>
                      <ul className="space-y-2">
                        {industry.useCases.map((useCase, idx) => (
                          <li key={idx} className="flex items-center gap-2 text-sm text-muted-foreground">
                            <div className="w-1.5 h-1.5 bg-primary rounded-full flex-shrink-0" />
                            {useCase}
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-foreground mb-2">Target Audience:</h4>
                      <p className="text-sm text-muted-foreground">{industry.audience}</p>
                    </div>
                    
                    <div className="bg-gradient-primary/10 rounded-lg p-4">
                      <h4 className="font-semibold text-primary mb-1">Proven Results:</h4>
                      <p className="text-sm text-primary font-medium">{industry.results}</p>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Industry Focus Areas */}
      <section className="py-16 bg-muted/20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Why Healthcare Companies Choose Us
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-xs font-bold text-white px-1">HIPAA</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Compliance Focused</h3>
              <p className="text-muted-foreground">
                All campaigns are designed with healthcare compliance requirements in mind, ensuring your marketing meets industry standards.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-accent rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-lg font-bold text-white">Rx</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Healthcare Expertise</h3>
              <p className="text-muted-foreground">
                Our team understands healthcare marketing challenges and regulations, providing expert guidance for your campaigns.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-secondary rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-sm font-bold text-white">ROI</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Measurable Results</h3>
              <p className="text-muted-foreground">
                Detailed reporting and analytics help you track campaign performance and optimize for better results.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-primary to-primary-variant">
        <div className="container mx-auto px-6 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to Reach Your Healthcare Audience?
            </h2>
            <p className="text-xl text-white/90 mb-8">
              Let's discuss how we can help your industry connect with the right healthcare professionals
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" className="bg-white text-primary hover:bg-white/90">
                Schedule Industry Consultation
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                Request Industry Case Study
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Industries;