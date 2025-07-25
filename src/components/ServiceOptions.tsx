import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight, Settings, Zap, Users, BarChart3, Headphones, Cog } from "lucide-react";

const ServiceOptions = () => {
  return (
    <section className="py-24">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-display font-bold mb-6">
            Choose Your <span className="gradient-text">Service Model</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Whether you prefer hands-on campaign management or self-service flexibility, 
            we have the right solution for your team's needs.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 max-w-7xl mx-auto">
          {/* Managed Service */}
          <Card className="p-8 glass-card border-primary/20 relative overflow-hidden group hover:shadow-premium transition-all duration-500">
            <div className="absolute inset-0 bg-gradient-primary opacity-0 group-hover:opacity-5 transition-opacity duration-500" />
            <div className="relative">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                    <Headphones className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-display font-bold">Managed Service</h3>
                    <p className="text-muted-foreground">Full-service campaign management</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-muted-foreground">Starting at</div>
                  <div className="text-2xl font-bold text-primary">Custom</div>
                </div>
              </div>

              {/* Features */}
              <div className="space-y-4 mb-8">
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 bg-primary/20 rounded-full flex items-center justify-center mt-0.5">
                    <div className="w-2 h-2 bg-primary rounded-full" />
                  </div>
                  <div>
                    <div className="font-semibold">Dedicated Campaign Manager</div>
                    <div className="text-sm text-muted-foreground">Personal healthcare marketing expert assigned to your account</div>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 bg-primary/20 rounded-full flex items-center justify-center mt-0.5">
                    <div className="w-2 h-2 bg-primary rounded-full" />
                  </div>
                  <div>
                    <div className="font-semibold">Custom Audience Development</div>
                    <div className="text-sm text-muted-foreground">Tailored physician segments based on your specific criteria</div>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 bg-primary/20 rounded-full flex items-center justify-center mt-0.5">
                    <div className="w-2 h-2 bg-primary rounded-full" />
                  </div>
                  <div>
                    <div className="font-semibold">Campaign Optimization</div>
                    <div className="text-sm text-muted-foreground">Continuous performance monitoring and strategy adjustments</div>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 bg-primary/20 rounded-full flex items-center justify-center mt-0.5">
                    <div className="w-2 h-2 bg-primary rounded-full" />
                  </div>
                  <div>
                    <div className="font-semibold">Advanced Reporting</div>
                    <div className="text-sm text-muted-foreground">Physician-level insights with ROI analysis</div>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 bg-primary/20 rounded-full flex items-center justify-center mt-0.5">
                    <div className="w-2 h-2 bg-primary rounded-full" />
                  </div>
                  <div>
                    <div className="font-semibold">Strategic Consultation</div>
                    <div className="text-sm text-muted-foreground">Quarterly business reviews and strategy sessions</div>
                  </div>
                </div>
              </div>

              {/* Best for */}
              <div className="bg-primary/5 rounded-xl p-4 mb-6">
                <div className="text-sm font-semibold text-primary mb-2">Perfect for:</div>
                <div className="text-sm text-muted-foreground">
                  Pharmaceutical companies, medical device manufacturers, and organizations requiring 
                  hands-on expertise and custom audience strategies.
                </div>
              </div>

              <Button className="w-full btn-premium">
                Get Started
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </Card>

          {/* Self-Service */}
          <Card className="p-8 glass-card border-secondary/20 relative overflow-hidden group hover:shadow-premium transition-all duration-500">
            <div className="absolute inset-0 bg-gradient-accent opacity-0 group-hover:opacity-5 transition-opacity duration-500" />
            <div className="relative">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-secondary/10 rounded-xl flex items-center justify-center">
                    <Cog className="w-6 h-6 text-secondary" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-display font-bold">Self-Service Integration</h3>
                    <p className="text-muted-foreground">Audiences delivered to your DSP or Meta account</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-muted-foreground">Perfect for</div>
                  <div className="text-lg font-bold text-secondary">In-house Teams</div>
                  <div className="text-xs text-muted-foreground">with existing DSPs</div>
                </div>
              </div>

              {/* Features */}
              <div className="space-y-4 mb-8">
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 bg-secondary/20 rounded-full flex items-center justify-center mt-0.5">
                    <div className="w-2 h-2 bg-secondary rounded-full" />
                  </div>
                  <div>
                    <div className="font-semibold">Direct DSP Integration</div>
                    <div className="text-sm text-muted-foreground">We deliver audiences directly to your preferred DSP platform</div>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 bg-secondary/20 rounded-full flex items-center justify-center mt-0.5">
                    <div className="w-2 h-2 bg-secondary rounded-full" />
                  </div>
                  <div>
                    <div className="font-semibold">Meta Business Manager Setup</div>
                    <div className="text-sm text-muted-foreground">Direct audience onboarding to your Meta ad account</div>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 bg-secondary/20 rounded-full flex items-center justify-center mt-0.5">
                    <div className="w-2 h-2 bg-secondary rounded-full" />
                  </div>
                  <div>
                    <div className="font-semibold">Employment Ad Compliance</div>
                    <div className="text-sm text-muted-foreground">Compliant solution for Meta employment advertising restrictions</div>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 bg-secondary/20 rounded-full flex items-center justify-center mt-0.5">
                    <div className="w-2 h-2 bg-secondary rounded-full" />
                  </div>
                  <div>
                    <div className="font-semibold">Complete Campaign Control</div>
                    <div className="text-sm text-muted-foreground">Maintain control over budget, creative, bidding, and optimization</div>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 bg-secondary/20 rounded-full flex items-center justify-center mt-0.5">
                    <div className="w-2 h-2 bg-secondary rounded-full" />
                  </div>
                  <div>
                    <div className="font-semibold">No Platform Fees</div>
                    <div className="text-sm text-muted-foreground">Use your existing tools and budgets without additional markups</div>
                  </div>
                </div>
              </div>

              {/* Best for */}
              <div className="bg-secondary/5 rounded-xl p-4 mb-6">
                <div className="text-sm font-semibold text-secondary mb-2">Perfect for:</div>
                <div className="text-sm text-muted-foreground">
                  Marketing agencies, recruitment firms, and in-house teams who have existing DSP relationships 
                  or run campaigns through Meta Business Manager and want precision healthcare audiences.
                </div>
              </div>

              <Button variant="outline" className="w-full border-secondary text-secondary hover:bg-secondary/5">
                Get Audience Integration
                <Zap className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </Card>
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <div className="glass-card inline-flex items-center gap-4 px-8 py-4">
            <BarChart3 className="w-6 h-6 text-accent" />
            <span className="text-lg">
              Not sure which option fits your needs? 
              <Button variant="link" className="text-accent font-semibold p-0 ml-2 h-auto">
                Schedule a consultation
              </Button>
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServiceOptions;