import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ArrowRight, Calendar, MessageCircle, Phone, Mail } from "lucide-react";
import { useState } from "react";

const CTASection = () => {
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log("Email submitted:", email);
    setEmail("");
  };

  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-secondary/10" />
      
      <div className="relative container mx-auto px-6">
        {/* Main CTA */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-6xl font-display font-bold mb-6">
            Ready to Stop <span className="gradient-text">Guessing?</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Join leading healthcare organizations who trust Audience Synergy for 
            precision targeting that delivers measurable results.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button size="lg" className="btn-premium text-lg px-8 py-4 font-semibold">
              <Calendar className="w-5 h-5 mr-2" />
              Schedule Demo
            </Button>
            <Button variant="outline" size="lg" className="text-lg px-8 py-4 font-semibold border-primary/20 hover:bg-primary/5">
              <MessageCircle className="w-5 h-5 mr-2" />
              Start Free Trial
            </Button>
          </div>
        </div>

        {/* Contact options */}
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto mb-16">
          <Card className="glass-card text-center group hover:shadow-premium transition-all duration-500">
            <div className="p-6">
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-105 transition-transform">
                <Calendar className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Schedule a Demo</h3>
              <p className="text-muted-foreground mb-4">
                See our platform in action with a personalized demonstration
              </p>
              <Button className="btn-premium w-full">
                Book Demo
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </Card>

          <Card className="glass-card text-center group hover:shadow-premium transition-all duration-500">
            <div className="p-6">
              <div className="w-16 h-16 bg-secondary/10 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-105 transition-transform">
                <Phone className="w-8 h-8 text-secondary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Speak with Expert</h3>
              <p className="text-muted-foreground mb-4">
                Get personalized guidance from our healthcare marketing specialists
              </p>
              <Button variant="outline" className="w-full border-secondary text-secondary hover:bg-secondary/5">
                Call Now
                <Phone className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </Card>

          <Card className="glass-card text-center group hover:shadow-premium transition-all duration-500">
            <div className="p-6">
              <div className="w-16 h-16 bg-accent/10 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-105 transition-transform">
                <MessageCircle className="w-8 h-8 text-accent" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Start Free Trial</h3>
              <p className="text-muted-foreground mb-4">
                Experience our self-service platform with no commitment
              </p>
              <Button variant="outline" className="w-full border-accent text-accent hover:bg-accent/5">
                Try Free
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </Card>
        </div>

        {/* Newsletter signup */}
        <div className="max-w-2xl mx-auto">
          <Card className="glass-card">
            <div className="p-8 text-center">
              <div className="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Mail className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-semibold mb-4">Stay Updated</h3>
              <p className="text-muted-foreground mb-6">
                Get insights on healthcare marketing trends, industry benchmarks, and precision targeting strategies.
              </p>
              
              <form onSubmit={handleSubmit} className="flex gap-3">
                <Input
                  type="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1"
                  required
                />
                <Button type="submit" className="btn-premium px-6">
                  Subscribe
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </form>
              
              <p className="text-xs text-muted-foreground mt-3">
                No spam. Unsubscribe anytime. HIPAA-compliant communications.
              </p>
            </div>
          </Card>
        </div>

        {/* Bottom testimonial */}
        <div className="mt-16 text-center">
          <div className="glass-card inline-flex items-center gap-4 px-8 py-4 max-w-4xl">
            <div className="flex items-center gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="w-4 h-4 bg-accent rounded-full opacity-80" />
              ))}
            </div>
            <div className="h-4 w-px bg-border" />
            <span className="text-lg">
              <strong>"The most precise healthcare targeting we've ever experienced"</strong> 
              <span className="text-muted-foreground"> - Fortune 500 Pharmaceutical Company</span>
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;