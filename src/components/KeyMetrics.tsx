import { Card } from "@/components/ui/card";
import { TrendingUp, Target, Users, Award, CheckCircle2, BarChart3 } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const KeyMetrics = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  // Intersection Observer for scroll animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const metrics = [
    {
      icon: TrendingUp,
      value: "0.80%",
      label: "HCP Banner CTR",
      subtext: "2025 YTD Performance",
      comparison: "3x industry average",
      color: "accent",
      prefix: ""
    },
    {
      icon: Users,
      value: "93",
      label: "US Physician Coverage",
      subtext: "Active practicing physicians",
      comparison: "Highest in industry",
      color: "primary",
      prefix: "",
      suffix: "%"
    },
    {
      icon: CheckCircle2,
      value: "100",
      label: "NPI Verification",
      subtext: "Healthcare professional validation",
      comparison: "Zero false positives",
      color: "secondary",
      prefix: "",
      suffix: "%"
    },
    {
      icon: Target,
      value: "850",
      label: "Verified Physicians",
      subtext: "Across all specialties",
      comparison: "Growing monthly",
      color: "accent",
      prefix: "",
      suffix: "K+"
    },
    {
      icon: BarChart3,
      value: "2.1",
      label: "Registered Nurses",
      subtext: "Including nurse practitioners",
      comparison: "89% coverage",
      color: "primary",
      prefix: "",
      suffix: "M+"
    },
    {
      icon: Award,
      value: "320",
      label: "Licensed Pharmacists",
      subtext: "Retail and clinical settings",
      comparison: "91% coverage",
      color: "secondary",
      prefix: "",
      suffix: "K+"
    }
  ];

  // Counter animation hook
  const useCounter = (end: number, duration: number = 2000) => {
    const [count, setCount] = useState(0);
    
    useEffect(() => {
      if (!isVisible) return;
      
      let startTime: number;
      const step = (timestamp: number) => {
        if (!startTime) startTime = timestamp;
        const progress = Math.min((timestamp - startTime) / duration, 1);
        setCount(Math.floor(progress * end));
        
        if (progress < 1) {
          requestAnimationFrame(step);
        }
      };
      
      requestAnimationFrame(step);
    }, [end, duration, isVisible]);
    
    return count;
  };

  return (
    <section ref={sectionRef} className="py-24 relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5" />
      
      <div className="relative container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-display font-bold mb-6">
            Results That <span className="gradient-text">Define Excellence</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Our precision-driven approach delivers measurable outcomes that set new 
            industry standards for healthcare professional targeting.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {metrics.map((metric, index) => {
            const IconComponent = metric.icon;
            const numericValue = parseFloat(metric.value.replace(/[^\d.]/g, ''));
            const animatedValue = useCounter(numericValue);
            
            return (
              <Card 
                key={metric.label}
                className={`glass-card group hover:shadow-premium transition-all duration-500 ${
                  isVisible ? 'scroll-reveal revealed' : 'scroll-reveal'
                }`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div className="p-6">
                  {/* Icon */}
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${
                    metric.color === 'primary' ? 'bg-primary/10' :
                    metric.color === 'secondary' ? 'bg-secondary/10' :
                    'bg-accent/10'
                  }`}>
                    <IconComponent className={`w-6 h-6 ${
                      metric.color === 'primary' ? 'text-primary' :
                      metric.color === 'secondary' ? 'text-secondary' :
                      'text-accent'
                    }`} />
                  </div>

                  {/* Value with animation */}
                  <div className={`text-4xl font-bold mb-2 counter ${
                    metric.color === 'primary' ? 'text-primary' :
                    metric.color === 'secondary' ? 'text-secondary' :
                    'text-accent'
                  }`}>
                    {metric.prefix}
                    {metric.value.includes('.') ? 
                      (animatedValue / 100).toFixed(2) : 
                      animatedValue.toLocaleString()
                    }
                    {metric.suffix}
                  </div>

                  {/* Label and description */}
                  <h3 className="text-lg font-semibold mb-1">{metric.label}</h3>
                  <p className="text-sm text-muted-foreground mb-3">{metric.subtext}</p>

                  {/* Comparison badge */}
                  <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                    metric.color === 'primary' ? 'bg-primary/10 text-primary' :
                    metric.color === 'secondary' ? 'bg-secondary/10 text-secondary' :
                    'bg-accent/10 text-accent'
                  }`}>
                    {metric.comparison}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Bottom highlight */}
        <div className="mt-16 text-center">
          <div className="glass-card inline-flex items-center gap-4 px-8 py-6 max-w-4xl">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-accent rounded-full animate-pulse" />
              <span className="text-sm font-semibold text-accent">LIVE DATA</span>
            </div>
            <div className="h-4 w-px bg-border" />
            <span className="text-lg">
              All metrics updated in real-time from our precision targeting platform
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default KeyMetrics;