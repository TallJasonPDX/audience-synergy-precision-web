import { CheckCircle, XCircle, Target, Users, TrendingUp } from "lucide-react";
import { Card } from "@/components/ui/card";

const ValueProposition = () => {
  return (
    <section className="py-24 bg-muted/30">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-display font-bold mb-6">
            <span className="gradient-text">Deterministic</span> vs. <span className="text-muted-foreground">Guesswork</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Stop wasting ad spend on uncertain targeting. Our healthcare professional audiences 
            are people-based, verified, and deliver measurable results.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Our Approach */}
          <Card className="p-8 glass-card border-accent/20 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-accent opacity-10 rounded-full -translate-y-16 translate-x-16" />
            <div className="relative">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center">
                  <Target className="w-6 h-6 text-accent" />
                </div>
                <h3 className="text-2xl font-display font-bold text-accent">Our Approach</h3>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-accent mt-1 flex-shrink-0" />
                  <div>
                    <div className="font-semibold">NPI-Verified Physicians</div>
                    <div className="text-sm text-muted-foreground">Every healthcare professional verified against National Provider Identifier database</div>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-accent mt-1 flex-shrink-0" />
                  <div>
                    <div className="font-semibold">Deterministic Matching</div>
                    <div className="text-sm text-muted-foreground">People-based targeting with 100% identity confidence</div>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-accent mt-1 flex-shrink-0" />
                  <div>
                    <div className="font-semibold">Physician-Level Reporting</div>
                    <div className="text-sm text-muted-foreground">Granular measurement and attribution at the individual level</div>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-accent mt-1 flex-shrink-0" />
                  <div>
                    <div className="font-semibold">93% Coverage</div>
                    <div className="text-sm text-muted-foreground">Comprehensive reach across active US healthcare professionals</div>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Traditional Approach */}
          <Card className="p-8 border-muted relative overflow-hidden bg-muted/20">
            <div className="absolute top-0 right-0 w-32 h-32 bg-muted opacity-20 rounded-full -translate-y-16 translate-x-16" />
            <div className="relative">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-muted/20 rounded-xl flex items-center justify-center">
                  <Users className="w-6 h-6 text-muted-foreground" />
                </div>
                <h3 className="text-2xl font-display font-bold text-muted-foreground">Traditional Approach</h3>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <XCircle className="w-5 h-5 text-muted-foreground mt-1 flex-shrink-0" />
                  <div>
                    <div className="font-semibold text-muted-foreground">Behavioral Assumptions</div>
                    <div className="text-sm text-muted-foreground">Guessing based on website visits and content consumption</div>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <XCircle className="w-5 h-5 text-muted-foreground mt-1 flex-shrink-0" />
                  <div>
                    <div className="font-semibold text-muted-foreground">Probabilistic Matching</div>
                    <div className="text-sm text-muted-foreground">Statistical likelihood with significant margin of error</div>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <XCircle className="w-5 h-5 text-muted-foreground mt-1 flex-shrink-0" />
                  <div>
                    <div className="font-semibold text-muted-foreground">Aggregate Reporting</div>
                    <div className="text-sm text-muted-foreground">High-level metrics without individual-level insights</div>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <XCircle className="w-5 h-5 text-muted-foreground mt-1 flex-shrink-0" />
                  <div>
                    <div className="font-semibold text-muted-foreground">Limited Verification</div>
                    <div className="text-sm text-muted-foreground">No professional credential validation</div>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Results comparison */}
        <div className="mt-16 text-center">
          <div className="inline-flex items-center gap-4 glass-card px-8 py-4">
            <TrendingUp className="w-6 h-6 text-accent" />
            <span className="text-lg font-semibold">
              Our clients see <span className="gradient-text">3x higher engagement rates</span> with deterministic targeting
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ValueProposition;