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
    <section id="services" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-[#2c4a6e] mb-4 font-montserrat">
            Funding Solutions for Every Business
          </h2>
          <p className="text-lg text-slate-600 max-w-3xl mx-auto">
            Choose from multiple financing options designed to meet your unique business needs and cash flow requirements.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <Card key={index} className="bg-white border border-slate-200 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
                <CardHeader className="text-center">
                  <div className="mx-auto w-14 h-14 bg-[#2c4a6e] rounded-full flex items-center justify-center mb-4">
                    <Icon className="h-7 w-7 text-white" />
                  </div>
                  <CardTitle className="text-lg text-[#2c4a6e] font-bold">{service.title}</CardTitle>
                  <div className="text-xl font-bold text-[#5b8fb9]">{service.amount}</div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-center mb-4 leading-relaxed text-slate-600">
                    {service.description}
                  </CardDescription>
                  <ul className="space-y-2 mb-6">
                    {service.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center text-sm text-slate-600">
                        <div className="w-2 h-2 bg-[#5b8fb9] rounded-full mr-3 flex-shrink-0"></div>
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Button variant="outline" className="w-full border-[#2c4a6e]/30 text-[#2c4a6e] hover:bg-[#2c4a6e] hover:text-white">
                    Learn More
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-8 border border-slate-200">
          <h3 className="text-2xl md:text-3xl font-bold text-center text-[#2c4a6e] mb-12 font-montserrat">
            Why Choose Bayview Advance?
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {advantages.map((advantage, index) => {
              const Icon = advantage.icon;
              return (
                <div key={index} className="text-center">
                  <div className="mx-auto w-12 h-12 bg-[#5b8fb9]/15 rounded-full flex items-center justify-center mb-4">
                    <Icon className="h-6 w-6 text-[#5b8fb9]" />
                  </div>
                  <h4 className="text-lg font-semibold text-[#2c4a6e] mb-2">{advantage.title}</h4>
                  <p className="text-slate-600 text-sm leading-relaxed">{advantage.description}</p>
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
