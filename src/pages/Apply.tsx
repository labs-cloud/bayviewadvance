import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowRight, Building, DollarSign, Calendar, User, Mail, Phone, MapPin, Upload } from "lucide-react";
import { Link } from "react-router-dom";

const Apply = () => {
  return (
    <div className="min-h-screen">
      <Header />

      <main className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h1 className="text-3xl md:text-4xl font-bold text-[#2c4a6e] mb-4 font-montserrat">
                Complete Funding Application
              </h1>
              <p className="text-lg text-slate-600">
                Get comprehensive funding options tailored to your business needs
              </p>
            </div>

            <Card className="shadow-md border border-slate-200">
              <CardHeader>
                <CardTitle className="text-2xl text-[#2c4a6e]">Full Application Form</CardTitle>
                <CardDescription>
                  Complete all sections for the best funding options
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form className="space-y-8">
                  <div className="space-y-6">
                    <h3 className="text-lg font-semibold text-[#2c4a6e] border-b border-slate-200 pb-2">
                      Business Information
                    </h3>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <Label htmlFor="legalBusinessName">Legal Business Name *</Label>
                        <div className="relative">
                          <Building className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                          <Input id="legalBusinessName" className="pl-10" placeholder="Legal Business Name" />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="dba">DBA (if applicable)</Label>
                        <Input id="dba" placeholder="Doing Business As" />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <Label htmlFor="businessStructure">Business Structure *</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select business structure" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="llc">LLC</SelectItem>
                            <SelectItem value="corp">Corporation</SelectItem>
                            <SelectItem value="sole-prop">Sole Proprietorship</SelectItem>
                            <SelectItem value="partnership">Partnership</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="businessStartDate">Business Start Date *</Label>
                        <div className="relative">
                          <Calendar className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                          <Input id="businessStartDate" type="date" className="pl-10" />
                        </div>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <Label htmlFor="industry">Industry *</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select your industry" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="retail">Retail</SelectItem>
                            <SelectItem value="restaurant">Restaurant/Food Service</SelectItem>
                            <SelectItem value="construction">Construction</SelectItem>
                            <SelectItem value="healthcare">Healthcare</SelectItem>
                            <SelectItem value="professional">Professional Services</SelectItem>
                            <SelectItem value="manufacturing">Manufacturing</SelectItem>
                            <SelectItem value="transportation">Transportation</SelectItem>
                            <SelectItem value="real-estate">Real Estate</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="creditScore">Credit Score Range</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select credit score range" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="excellent">Excellent (750+)</SelectItem>
                            <SelectItem value="good">Good (700-749)</SelectItem>
                            <SelectItem value="fair">Fair (650-699)</SelectItem>
                            <SelectItem value="poor">Poor (Below 650)</SelectItem>
                            <SelectItem value="not-sure">Not Sure</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="businessAddress">Business Address *</Label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                        <Textarea
                          id="businessAddress"
                          className="pl-10 h-20"
                          placeholder="Street Address, City, State, ZIP Code"
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6">
                      <div>
                        <Label htmlFor="monthlyRevenue">Monthly Revenue ($) *</Label>
                        <div className="relative">
                          <DollarSign className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                          <Input id="monthlyRevenue" type="number" className="pl-10" placeholder="50000" />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="annualRevenue">Annual Revenue ($)</Label>
                        <div className="relative">
                          <DollarSign className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                          <Input id="annualRevenue" type="number" className="pl-10" placeholder="600000" />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="bankBalance">Avg Monthly Bank Balance ($)</Label>
                        <div className="relative">
                          <DollarSign className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                          <Input id="bankBalance" type="number" className="pl-10" placeholder="25000" />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <h3 className="text-lg font-semibold text-[#2c4a6e] border-b border-slate-200 pb-2">
                      Funding Request
                    </h3>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <Label htmlFor="amountRequested">Amount Requested ($) *</Label>
                        <div className="relative">
                          <DollarSign className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                          <Input id="amountRequested" type="number" className="pl-10" placeholder="100000" />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="fundingType">Type of Funding *</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select funding type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="loan">Business Loan</SelectItem>
                            <SelectItem value="line-of-credit">Line of Credit</SelectItem>
                            <SelectItem value="equipment-financing">Equipment Financing</SelectItem>
                            <SelectItem value="real-estate">Real Estate Financing</SelectItem>
                            <SelectItem value="merchant-cash-advance">Merchant Cash Advance</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="purposeOfFunds">Purpose of Funds *</Label>
                      <Textarea
                        id="purposeOfFunds"
                        className="h-24"
                        placeholder="Describe how you plan to use the funding (working capital, equipment purchase, expansion, etc.)"
                      />
                    </div>
                  </div>

                  <div className="space-y-6">
                    <h3 className="text-lg font-semibold text-[#2c4a6e] border-b border-slate-200 pb-2">
                      Owner/Officer Information
                    </h3>

                    <div className="grid md:grid-cols-3 gap-6">
                      <div>
                        <Label htmlFor="ownerName">Owner Name *</Label>
                        <div className="relative">
                          <User className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                          <Input id="ownerName" className="pl-10" placeholder="John Smith" />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="ownershipPercent">Ownership % *</Label>
                        <Input id="ownershipPercent" type="number" max="100" placeholder="100" />
                      </div>
                      <div>
                        <Label htmlFor="dateOfBirth">Date of Birth *</Label>
                        <Input id="dateOfBirth" type="date" />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <Label htmlFor="ownerEmail">Email Address *</Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                          <Input id="ownerEmail" type="email" className="pl-10" placeholder="john@business.com" />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="ownerPhone">Phone Number *</Label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                          <Input id="ownerPhone" type="tel" className="pl-10" placeholder="(555) 123-4567" />
                        </div>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="homeAddress">Home Address *</Label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                        <Textarea
                          id="homeAddress"
                          className="pl-10 h-20"
                          placeholder="Street Address, City, State, ZIP Code"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <h3 className="text-lg font-semibold text-[#2c4a6e] border-b border-slate-200 pb-2">
                      Supporting Documents (Optional)
                    </h3>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <Label htmlFor="bankStatements">Upload Last 3 Months Bank Statements</Label>
                        <div className="mt-2 border-2 border-dashed border-slate-300 rounded-lg p-6 text-center hover:border-[#2c4a6e]/50 transition-colors">
                          <Upload className="mx-auto h-8 w-8 text-slate-400 mb-2" />
                          <p className="text-sm text-slate-500">
                            Click to upload or drag and drop
                          </p>
                          <input type="file" className="hidden" multiple accept=".pdf,.jpg,.png" />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="driverLicense">Upload Driver's License</Label>
                        <div className="mt-2 border-2 border-dashed border-slate-300 rounded-lg p-6 text-center hover:border-[#2c4a6e]/50 transition-colors">
                          <Upload className="mx-auto h-8 w-8 text-slate-400 mb-2" />
                          <p className="text-sm text-slate-500">
                            Click to upload or drag and drop
                          </p>
                          <input type="file" className="hidden" accept=".pdf,.jpg,.png" />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4 pt-4">
                    <div className="flex items-start space-x-3">
                      <Checkbox id="lender-consent" className="mt-1" />
                      <Label htmlFor="lender-consent" className="text-sm leading-relaxed text-slate-600">
                        I authorize Bayview Advance to share my application with its network of lenders for the purpose of evaluating funding options.
                      </Label>
                    </div>
                    <div className="flex items-start space-x-3">
                      <Checkbox id="contact-consent-full" className="mt-1" />
                      <Label htmlFor="contact-consent-full" className="text-sm leading-relaxed text-slate-600">
                        I agree that Bayview Advance may contact me by phone, email, and text (SMS). Message and data rates may apply. Consent is not required to apply.
                      </Label>
                    </div>
                    <div className="flex items-start space-x-3">
                      <Checkbox id="terms-consent-full" className="mt-1" />
                      <Label htmlFor="terms-consent-full" className="text-sm leading-relaxed text-slate-600">
                        I have read and agree to the{" "}
                        <Link to="/terms" className="text-[#2c4a6e] hover:underline">Terms & Conditions</Link>
                        {" "}and{" "}
                        <Link to="/privacy" className="text-[#2c4a6e] hover:underline">Privacy Policy</Link>.
                      </Label>
                    </div>
                  </div>

                  <div className="text-center pt-8">
                    <Button
                      size="lg"
                      className="bg-[#2c4a6e] hover:bg-[#1e3a5c] text-white font-bold px-12 group"
                    >
                      Get My Funding Options
                      <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                    </Button>
                    <p className="text-sm text-slate-500 mt-4">
                      Secure application &middot; Your information is protected
                    </p>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Apply;
