import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CreditCard, Banknote, TrendingUp, Users, Clock, Shield, Calculator, Handshake } from "lucide-react";

const Services = () => {
  const services = [
    {
      icon: CreditCard,
      title: "Merchant Cash Advance",
      description: "Get upfront capital based on your future credit card sales. Flexible repayment through a percentage of daily sales.",
      features: ["No fixed monthly payments", "Quick approval process", "Based on sales volume"],
      amount: "$5K - $2M"
    },
    {
      icon: Banknote,
      title: "Short-Term Business Loans",
      description: "Traditional term loans with competitive rates and predictable monthly payments for established businesses.",
      features: ["Fixed interest rates", "Predictable payments", "Build business credit"],
      amount: "$10K - $500K"
    },
    {
      icon: TrendingUp,
      title: "Revenue-Based Financing",
      description: "Flexible funding that adjusts with your business performance. Perfect for seasonal businesses.",
      features: ["Payment flexibility", "No collateral required", "Quick decision process"],
      amount: "$25K - $1M"
    },
    {
      icon: Users,
      title: "Equipment Financing",
      description: "Finance essential business equipment and machinery to help your business grow and stay competitive.",
      features: ["Equipment as collateral", "Tax advantages", "Preserve working capital"],
      amount: "$15K - $750K"
    }
  ];

  const advantages = [
    {
      icon: Clock,
      title: "Fast Approval",
      description: "Get approved in as little as 24 hours with minimal paperwork"
    },
    {
      icon: Shield,
      title: "No Collateral",
      description: "Most funding options don't require personal guarantees or collateral"
    },
    {
      icon: Calculator,
      title: "Flexible Terms",
      description: "Choose repayment terms that work with your cash flow"
    },
    {
      icon: Handshake,
      title: "Personal Service",
      description: "Work directly with funding specialists who understand your business"
    }
  ];

  return (
    <section id="services" className="relative py-20 overflow-hidden">
      {/* Enhanced background */}
      <div className="absolute inset-0">
        <img 
          src="/src/assets/services-workspace.jpg" 
          alt="Services Background" 
          className="w-full h-full object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-background via-secondary/30 to-accent/20"></div>
        <div className="absolute inset-0 bg-gradient-mesh"></div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16 animate-fade-up">
          <h2 className="text-4xl font-bold text-primary mb-4">
            FUNDING SOLUTIONS FOR EVERY BUSINESS
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Choose from multiple financing options designed to meet your unique business needs and cash flow requirements.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <Card key={index} className="bg-gradient-to-br from-white via-blue-50/80 to-bayview-accent/10 border-blue-200/60 shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-2 animate-scale-in backdrop-blur-sm" style={{ animationDelay: `${index * 0.1}s` }}>
                <CardHeader className="text-center">
                  <div className="mx-auto w-16 h-16 bg-gradient-to-br from-bayview-primary to-bayview-accent rounded-full flex items-center justify-center mb-4 shadow-md">
                    <Icon className="h-8 w-8 text-white" />
                  </div>
                  <CardTitle className="text-xl text-bayview-primary font-bold">{service.title}</CardTitle>
                  <div className="text-2xl font-bold text-bayview-accent">{service.amount}</div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-center mb-4 leading-relaxed">
                    {service.description}
                  </CardDescription>
                  <ul className="space-y-2 mb-6">
                    {service.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center text-sm text-muted-foreground">
                        <div className="w-2 h-2 bg-bayview-accent rounded-full mr-3"></div>
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Button variant="outline" className="w-full hover:bg-bayview-accent hover:text-white hover:border-bayview-accent border-bayview-accent/50 text-bayview-primary">
                    Learn More
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="bg-gradient-to-br from-white via-bayview-accent/5 to-white rounded-2xl shadow-elegant p-8 border border-bayview-accent/10">
          <h3 className="text-3xl font-bold text-center text-primary mb-12">
            Why Choose Bayview Advance?
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {advantages.map((advantage, index) => {
              const Icon = advantage.icon;
              return (
                <div key={index} className="text-center animate-fade-up" style={{ animationDelay: `${(index + 4) * 0.1}s` }}>
                  <div className="mx-auto w-12 h-12 bg-gradient-to-br from-bayview-accent/20 to-bayview-accent/30 rounded-full flex items-center justify-center mb-4">
                    <Icon className="h-6 w-6 text-bayview-accent" />
                  </div>
                  <h4 className="text-lg font-semibold text-bayview-primary mb-2">{advantage.title}</h4>
                  <p className="text-muted-foreground text-sm leading-relaxed">{advantage.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Services;