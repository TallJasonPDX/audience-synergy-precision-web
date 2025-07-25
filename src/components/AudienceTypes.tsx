import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Stethoscope, Heart, Pill, Users } from "lucide-react";
import healthcareProfessionals from "@/assets/healthcare-professionals.jpg";

const AudienceTypes = () => {
  const audienceTypes = [
    {
      icon: Stethoscope,
      title: "Physicians",
      coverage: "93%",
      count: "850K+",
      description: "Active practicing physicians across all specialties",
      specialties: ["Primary Care", "Cardiology", "Oncology", "Neurology", "Orthopedics", "Dermatology"],
      color: "primary"
    },
    {
      icon: Heart,
      title: "Nurses",
      coverage: "89%",
      count: "2.1M+",
      description: "Registered nurses and nurse practitioners",
      specialties: ["Critical Care", "Emergency", "Pediatric", "Psychiatric", "Surgical", "Community Health"],
      color: "secondary"
    },
    {
      icon: Pill,
      title: "Pharmacists",
      coverage: "91%",
      count: "320K+",
      description: "Licensed pharmacists in retail and clinical settings",
      specialties: ["Clinical", "Retail", "Hospital", "Specialty", "Compounding", "Consultant"],
      color: "accent"
    },
    {
      icon: Users,
      title: "Patients",
      coverage: "Custom",
      count: "15M+",
      description: "Condition-specific patient populations",
      specialties: ["Chronic Disease", "Rare Disease", "Mental Health", "Oncology", "Diabetes", "Cardiovascular"],
      color: "muted-foreground"
    }
  ];

  return (
    <section className="py-24 bg-muted/20 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 opacity-5">
        <img 
          src={healthcareProfessionals} 
          alt="Healthcare Professionals" 
          className="w-full h-full object-cover"
        />
      </div>
      
      <div className="relative container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-display font-bold mb-6">
            <span className="gradient-text">Healthcare Professional</span> Audiences
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Reach the exact healthcare professionals you need with our comprehensive, 
            NPI-verified audience segments across all major specialties.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {audienceTypes.map((audience, index) => {
            const IconComponent = audience.icon;
            
            return (
              <Card 
                key={audience.title}
                className="glass-card group hover:shadow-premium transition-all duration-500 magnetic"
              >
                <div className="p-6">
                  {/* Icon and header */}
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                      audience.color === 'primary' ? 'bg-primary/10' :
                      audience.color === 'secondary' ? 'bg-secondary/10' :
                      audience.color === 'accent' ? 'bg-accent/10' :
                      'bg-muted/20'
                    }`}>
                      <IconComponent className={`w-6 h-6 ${
                        audience.color === 'primary' ? 'text-primary' :
                        audience.color === 'secondary' ? 'text-secondary' :
                        audience.color === 'accent' ? 'text-accent' :
                        'text-muted-foreground'
                      }`} />
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {audience.coverage} Coverage
                    </Badge>
                  </div>

                  {/* Title and count */}
                  <h3 className="text-xl font-display font-bold mb-2">{audience.title}</h3>
                  <div className={`text-2xl font-bold mb-3 ${
                    audience.color === 'primary' ? 'text-primary' :
                    audience.color === 'secondary' ? 'text-secondary' :
                    audience.color === 'accent' ? 'text-accent' :
                    'text-muted-foreground'
                  }`}>
                    {audience.count}
                  </div>
                  
                  {/* Description */}
                  <p className="text-sm text-muted-foreground mb-4">
                    {audience.description}
                  </p>

                  {/* Specialties */}
                  <div className="space-y-2">
                    <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                      Key Specialties
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {audience.specialties.slice(0, 4).map((specialty) => (
                        <Badge 
                          key={specialty} 
                          variant="secondary" 
                          className="text-xs bg-muted/50 text-muted-foreground hover:bg-muted"
                        >
                          {specialty}
                        </Badge>
                      ))}
                      {audience.specialties.length > 4 && (
                        <Badge variant="outline" className="text-xs">
                          +{audience.specialties.length - 4} more
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Additional features */}
        <div className="mt-16">
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <div className="text-2xl font-bold text-primary">NPI</div>
              </div>
              <h4 className="font-semibold mb-2">NPI Verification</h4>
              <p className="text-sm text-muted-foreground">
                Every healthcare professional verified against the National Provider Identifier database
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-secondary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <div className="text-2xl font-bold text-secondary">⚡</div>
              </div>
              <h4 className="font-semibold mb-2">Real-Time Updates</h4>
              <p className="text-sm text-muted-foreground">
                Audience data refreshed continuously to maintain accuracy and compliance
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-accent/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <div className="text-2xl font-bold text-accent">🎯</div>
              </div>
              <h4 className="font-semibold mb-2">Precision Targeting</h4>
              <p className="text-sm text-muted-foreground">
                Target by specialty, location, practice setting, and prescribing behavior
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AudienceTypes;