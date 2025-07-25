import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Settings, Target, Monitor, Radio, Share2, Globe } from "lucide-react";
import heroImage from "@/assets/precision-targeting.jpg";

const serviceOptions = [
  {
    title: "Managed Service",
    icon: Settings,
    description: "Full-service campaign management with dedicated healthcare marketing experts",
    features: [
      "Dedicated Account Manager",
      "Campaign Strategy & Planning", 
      "Creative Development Support",
      "Real-time Optimization",
      "Detailed Performance Reporting",
      "Audience Insights & Analytics"
    ],
    benefits: [
      "Expert healthcare marketing guidance",
      "Hands-off campaign management", 
      "Optimized for best performance",
      "Strategic recommendations"
    ]
  },
  {
    title: "Self-Service Programmatic",
    icon: Target,
    description: "Direct access to our platform for experienced programmatic advertisers",
    features: [
      "Real-time Bidding Access",
      "Audience Targeting Interface",
      "Campaign Management Dashboard",
      "Performance Analytics",
      "Automated Optimization Tools",
      "API Integration Available"
    ],
    benefits: [
      "Complete campaign control",
      "Lower management fees",
      "Instant campaign adjustments",
      "Direct platform access"
    ]
  }
];

const channels = [
  {
    title: "Social Media Advertising",
    icon: Share2,
    description: "Precision targeting on Facebook, LinkedIn, and other professional networks",
    details: "Reach healthcare professionals where they engage professionally and personally"
  },
  {
    title: "Web Display Banners", 
    icon: Monitor,
    description: "High-impact banner placements on healthcare and professional websites",
    details: "Industry-leading 0.80% CTR on healthcare professional banner campaigns"
  },
  {
    title: "Connected TV",
    icon: Monitor,
    description: "Premium video advertising on streaming platforms and smart TVs",
    details: "Build brand awareness with healthcare professionals at home"
  },
  {
    title: "Streaming Audio",
    icon: Radio,
    description: "Audio advertising on music and podcast streaming platforms",
    details: "Reach busy healthcare workers during commutes and downtime"
  },
  {
    title: "Native Advertising",
    icon: Globe,
    description: "Content-driven ads that blend seamlessly with editorial content",
    details: "Engage healthcare professionals with relevant, non-intrusive advertising"
  }
];

const Services = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="relative pt-20 pb-16 overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src={heroImage} 
            alt="Precision Targeting" 
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background/90 to-secondary/10" />
        </div>
        
        <div className="relative z-10 container mx-auto px-6 text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-display font-bold mb-6">
              <span className="gradient-text">Healthcare Marketing</span>
              <br />
              <span className="text-foreground">Services & Channels</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              Comprehensive programmatic advertising solutions designed specifically for 
              reaching healthcare professionals with precision and scale.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="btn-premium">
                Start Campaign
              </Button>
              <Button variant="outline" size="lg" className="border-primary/20 hover:bg-primary/5">
                View Case Studies
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Service Options */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Two Engagement Options
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Choose the level of service that best fits your team's needs and expertise
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {serviceOptions.map((service, index) => {
              const Icon = service.icon;
              return (
                <Card key={index} className="glass-card hover:shadow-elegant transition-all duration-300 h-full">
                  <CardHeader className="text-center pb-6">
                    <div className="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <CardTitle className="text-2xl">{service.title}</CardTitle>
                    <CardDescription className="text-base">
                      {service.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <h4 className="font-semibold text-foreground mb-3">Features Included:</h4>
                      <ul className="space-y-2">
                        {service.features.map((feature, idx) => (
                          <li key={idx} className="flex items-center gap-2 text-sm text-muted-foreground">
                            <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-foreground mb-3">Key Benefits:</h4>
                      <ul className="space-y-2">
                        {service.benefits.map((benefit, idx) => (
                          <li key={idx} className="flex items-center gap-2 text-sm text-muted-foreground">
                            <div className="w-1.5 h-1.5 bg-accent rounded-full" />
                            {benefit}
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <Button className="w-full mt-6">
                      Learn More About {service.title}
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Advertising Channels */}
      <section className="py-16 bg-muted/20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Multi-Channel Reach
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Connect with healthcare professionals across all the channels where they consume content
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {channels.map((channel, index) => {
              const Icon = channel.icon;
              return (
                <Card key={index} className="glass-card hover:shadow-elegant transition-all duration-300">
                  <CardHeader className="text-center">
                    <div className="w-12 h-12 bg-gradient-accent rounded-xl flex items-center justify-center mx-auto mb-3">
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <CardTitle className="text-lg">{channel.title}</CardTitle>
                    <CardDescription>
                      {channel.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {channel.details}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-primary to-primary-variant">
        <div className="container mx-auto px-6 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to Reach Healthcare Professionals?
            </h2>
            <p className="text-xl text-white/90 mb-8">
              Get started with precision healthcare marketing today
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" className="bg-white text-primary hover:bg-white/90">
                Request Campaign Proposal
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                Schedule Consultation
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Services;