import { Card } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { Star, Quote } from "lucide-react";

const SocialProof = () => {
  const testimonials = [
    {
      quote: "Audience Synergy's deterministic targeting helped us achieve a 340% increase in qualified physician engagement compared to our previous programmatic campaigns. The NPI verification gives us confidence we're reaching real healthcare professionals.",
      author: "Sarah Chen",
      title: "VP of Marketing",
      company: "Leading Pharmaceutical Company",
      rating: 5,
      avatar: "SC"
    },
    {
      quote: "The precision of their healthcare professional audiences is unmatched. We've seen our cost per qualified lead drop by 60% while maintaining the highest quality prospects. Their managed service team truly understands healthcare marketing.",
      author: "Michael Rodriguez",
      title: "Director of Digital Marketing",
      company: "Medical Device Manufacturer",
      rating: 5,
      avatar: "MR"
    },
    {
      quote: "As a healthcare recruitment agency, finding qualified nursing candidates efficiently is critical. Audience Synergy's nurse practitioner audiences have transformed our recruitment campaigns with 4x higher application rates.",
      author: "Jennifer Park",
      title: "Head of Talent Acquisition",
      company: "Healthcare Recruitment Firm",
      rating: 5,
      avatar: "JP"
    }
  ];

  const caseStudyStats = [
    {
      metric: "340%",
      description: "Increase in qualified physician engagement",
      category: "Pharmaceutical"
    },
    {
      metric: "60%",
      description: "Reduction in cost per qualified lead",
      category: "Medical Device"
    },
    {
      metric: "4x",
      description: "Higher application rates for nursing roles",
      category: "Recruitment"
    },
    {
      metric: "0.80%",
      description: "Average CTR on HCP banner campaigns",
      category: "Industry Benchmark"
    }
  ];

  return (
    <section className="py-24 bg-muted/30">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-display font-bold mb-6">
            Trusted by <span className="gradient-text">Healthcare Leaders</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            See how leading pharmaceutical companies, medical device manufacturers, 
            and healthcare organizations achieve exceptional results with our precision targeting.
          </p>
        </div>

        {/* Testimonials */}
        <div className="grid lg:grid-cols-3 gap-8 mb-16">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="glass-card group hover:shadow-premium transition-all duration-500">
              <div className="p-6">
                {/* Quote icon */}
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                  <Quote className="w-6 h-6 text-primary" />
                </div>

                {/* Rating */}
                <div className="flex items-center gap-1 mb-4">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-accent fill-accent" />
                  ))}
                </div>

                {/* Quote */}
                <blockquote className="text-muted-foreground mb-6 leading-relaxed">
                  "{testimonial.quote}"
                </blockquote>

                {/* Author */}
                <div className="flex items-center gap-3">
                  <Avatar className="w-10 h-10 bg-primary text-primary-foreground">
                    {testimonial.avatar}
                  </Avatar>
                  <div>
                    <div className="font-semibold">{testimonial.author}</div>
                    <div className="text-sm text-muted-foreground">{testimonial.title}</div>
                    <div className="text-xs text-muted-foreground">{testimonial.company}</div>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Case Study Stats */}
        <div className="glass-card p-8">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-display font-bold mb-2">Proven Results Across Industries</h3>
            <p className="text-muted-foreground">Real performance metrics from client campaigns</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {caseStudyStats.map((stat, index) => (
              <div key={index} className="text-center group">
                <div className="text-3xl font-bold gradient-text mb-2">{stat.metric}</div>
                <div className="text-sm text-muted-foreground mb-1">{stat.description}</div>
                <div className="text-xs text-primary font-medium bg-primary/10 px-2 py-1 rounded-full inline-block">
                  {stat.category}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Client logos placeholder */}
        <div className="mt-16 text-center">
          <p className="text-muted-foreground mb-8">Trusted by leading healthcare organizations</p>
          <div className="flex items-center justify-center gap-8 opacity-50">
            <div className="w-32 h-16 bg-muted/50 rounded-lg flex items-center justify-center">
              <span className="text-xs text-muted-foreground">Pharma Co.</span>
            </div>
            <div className="w-32 h-16 bg-muted/50 rounded-lg flex items-center justify-center">
              <span className="text-xs text-muted-foreground">MedDevice Inc.</span>
            </div>
            <div className="w-32 h-16 bg-muted/50 rounded-lg flex items-center justify-center">
              <span className="text-xs text-muted-foreground">Healthcare Recruit</span>
            </div>
            <div className="w-32 h-16 bg-muted/50 rounded-lg flex items-center justify-center">
              <span className="text-xs text-muted-foreground">Global Health</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SocialProof;