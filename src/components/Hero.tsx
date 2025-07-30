import { Button } from "@/components/ui/button";
import { ArrowRight, Play, Target } from "lucide-react";
import heroImage from "@/assets/hero-healthcare-data.jpg";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20 md:pt-16">{/* Fixed: Added pt-20 for mobile to push content below fixed header */}
      {/* Background with glass overlay */}
      <div className="absolute inset-0">
        <img 
          src={heroImage} 
          alt="Healthcare Data Visualization" 
          className="w-full h-full object-cover opacity-20"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background/90 to-secondary/10" />
      </div>

      {/* Floating geometric elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="floating absolute top-20 left-20 w-20 h-20 bg-gradient-primary rounded-full opacity-20 blur-xl" />
        <div className="floating absolute top-40 right-32 w-32 h-32 bg-gradient-accent rounded-full opacity-15 blur-2xl" style={{animationDelay: '1s'}} />
        <div className="floating absolute bottom-32 left-40 w-24 h-24 bg-secondary/20 rounded-full blur-xl" style={{animationDelay: '2s'}} />
      </div>

      <div className="relative z-10 container mx-auto px-6 text-center pt-4 md:pt-0">{/* Added extra top padding for mobile */}
        {/* Badge */}
        <div className="inline-flex items-center gap-2 glass-card mb-6 md:mb-8 text-sm font-medium text-primary px-4 py-2">
          <Target className="w-4 h-4" />
          <span className="text-xs md:text-sm">2025 YTD: 0.80% Click-Through Rate on HCP Banners</span>
        </div>

        {/* Main heading */}
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-display font-bold mb-6 leading-tight">
          <span className="gradient-text">We don't believe</span>
          <br />
          <span className="text-foreground">in guessing who</span>
          <br />
          <span className="text-foreground">is seeing your ad</span>
        </h1>

        {/* Subheading */}
        <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-4xl mx-auto leading-relaxed">
          NPI-verified, deterministic healthcare professional audiences. 
          Not based on behavior, context, or assumption. <strong className="text-foreground">Precision guaranteed.</strong>
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
          <Button size="lg" className="btn-premium text-lg px-8 py-4 font-semibold">
            Get Demo
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
          <Button variant="outline" size="lg" className="text-lg px-8 py-4 font-semibold magnetic border-primary/20 hover:bg-primary/5">
            <Play className="w-5 h-5 mr-2" />
            Watch Overview
          </Button>
        </div>

        {/* Key metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <div className="glass-card text-center">
            <div className="text-3xl font-bold gradient-text counter">93%</div>
            <div className="text-sm text-muted-foreground">US Physician Coverage</div>
          </div>
          <div className="glass-card text-center">
            <div className="text-3xl font-bold text-accent counter">100%</div>
            <div className="text-sm text-muted-foreground">NPI-Verified</div>
          </div>
          <div className="glass-card text-center">
            <div className="text-3xl font-bold text-secondary counter">0.80%</div>
            <div className="text-sm text-muted-foreground">CTR on HCP Banners</div>
          </div>
        </div>

        {/* Reserved space for future interactive element */}
        <div className="mt-16 w-screen relative left-1/2 right-1/2 ml-[-50vw] mr-[-50vw]">
          <div className="bg-black relative overflow-hidden">
            {/* Subtle pattern overlay */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute inset-0" style={{
                backgroundImage: `
                  radial-gradient(circle at 20% 20%, rgba(255,255,255,0.1) 1px, transparent 1px),
                  radial-gradient(circle at 80% 80%, rgba(255,255,255,0.05) 1px, transparent 1px)
                `,
                backgroundSize: '60px 60px'
              }}></div>
            </div>
            <div className="container mx-auto px-6 py-24">
              <div className="text-center mb-12">
                <div className="text-white/60 text-sm mb-4">Interactive Data Visualization</div>
                <div className="h-64 flex items-center justify-center">
                  <span className="text-white/40 text-lg">Reserved for 3D Funnel Visualization</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;