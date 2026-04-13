import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ArrowRight, DollarSign, Building, Calendar } from "lucide-react";

const ApplicationForm = () => {
  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-[#2c4a6e] mb-4 font-montserrat">
              Get Your Funding in 3 Simple Steps
            </h2>
            <p className="text-lg text-slate-600">
              Complete our quick application and get a decision in minutes
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8 mb-12">
            <div className="text-center">
              <div className="mx-auto w-14 h-14 bg-[#2c4a6e] rounded-full flex items-center justify-center mb-4 text-white text-xl font-bold">
                1
              </div>
              <h3 className="text-lg font-semibold text-[#2c4a6e] mb-2">Apply Online</h3>
              <p className="text-slate-600">Fill out our simple application form</p>
            </div>
            <div className="text-center">
              <div className="mx-auto w-14 h-14 bg-[#2c4a6e] rounded-full flex items-center justify-center mb-4 text-white text-xl font-bold">
                2
              </div>
              <h3 className="text-lg font-semibold text-[#2c4a6e] mb-2">Quick Review</h3>
              <p className="text-slate-600">Our team reviews your application</p>
            </div>
            <div className="text-center">
              <div className="mx-auto w-14 h-14 bg-[#2c4a6e] rounded-full flex items-center justify-center mb-4 text-white text-xl font-bold">
                3
              </div>
              <h3 className="text-lg font-semibold text-[#2c4a6e] mb-2">Get Funded</h3>
              <p className="text-slate-600">Receive funds in as little as 24 hours</p>
            </div>
          </div>

          <Card className="shadow-md border border-slate-200">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl text-[#2c4a6e]">Quick Application Form</CardTitle>
              <CardDescription>
                Takes less than 5 minutes to complete &middot; No impact on credit score
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="businessName">Business Name *</Label>
                    <div className="relative">
                      <Building className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                      <Input id="businessName" className="pl-10" placeholder="Your Business Name" />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="industry">Industry</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select your industry" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="retail">Retail</SelectItem>
                        <SelectItem value="restaurant">Restaurant</SelectItem>
                        <SelectItem value="construction">Construction</SelectItem>
                        <SelectItem value="healthcare">Healthcare</SelectItem>
                        <SelectItem value="professional">Professional Services</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="monthlyRevenue">Monthly Revenue *</Label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                      <Select>
                        <SelectTrigger className="pl-10">
                          <SelectValue placeholder="Select monthly revenue" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="10k-25k">$10K - $25K</SelectItem>
                          <SelectItem value="25k-50k">$25K - $50K</SelectItem>
                          <SelectItem value="50k-100k">$50K - $100K</SelectItem>
                          <SelectItem value="100k+">$100K+</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="timeInBusiness">Time in Business</Label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                      <Select>
                        <SelectTrigger className="pl-10">
                          <SelectValue placeholder="How long in business?" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="6months">6+ Months</SelectItem>
                          <SelectItem value="1year">1+ Year</SelectItem>
                          <SelectItem value="2years">2+ Years</SelectItem>
                          <SelectItem value="5years">5+ Years</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="firstName">First Name *</Label>
                    <Input id="firstName" placeholder="John" />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name *</Label>
                    <Input id="lastName" placeholder="Smith" />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="email">Email Address *</Label>
                    <Input id="email" type="email" placeholder="john@business.com" />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input id="phone" type="tel" placeholder="(555) 123-4567" />
                  </div>
                </div>

                <div>
                  <Label htmlFor="fundingAmount">Funding Amount Needed</Label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                    <Select>
                      <SelectTrigger className="pl-10">
                        <SelectValue placeholder="How much funding do you need?" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="5k-25k">$5K - $25K</SelectItem>
                        <SelectItem value="25k-50k">$25K - $50K</SelectItem>
                        <SelectItem value="50k-100k">$50K - $100K</SelectItem>
                        <SelectItem value="100k-250k">$100K - $250K</SelectItem>
                        <SelectItem value="250k+">$250K+</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="purpose">How will you use the funding?</Label>
                  <Textarea
                    id="purpose"
                    placeholder="Describe how you plan to use the funding (inventory, equipment, expansion, etc.)"
                    className="h-20"
                  />
                </div>

                <div className="text-center pt-4">
                  <Button
                    size="lg"
                    className="bg-[#2c4a6e] hover:bg-[#1e3a5c] text-white font-bold px-12 group"
                  >
                    Get My Funding Options
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                  <p className="text-sm text-slate-500 mt-4">
                    By submitting this form, you agree to our terms and privacy policy.
                    No obligation to accept funding.
                  </p>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default ApplicationForm;
