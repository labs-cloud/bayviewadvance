import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowRight, DollarSign, Building, Phone, Mail, User } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const QuickApply = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    fullName: '',
    businessName: '',
    email: '',
    phone: '',
    monthlyRevenue: '',
    fundingNeeded: '',
    purpose: '',
    contactConsent: false,
    termsConsent: false
  });

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const requiredFields = ['fullName', 'businessName', 'email', 'phone', 'monthlyRevenue', 'fundingNeeded', 'purpose'];
    const missingFields = requiredFields.filter(field => !formData[field as keyof typeof formData]);

    if (missingFields.length > 0) {
      toast({
        title: "Please fill in all required fields",
        description: "All fields marked with * are required.",
        variant: "destructive",
      });
      return;
    }

    if (!formData.contactConsent || !formData.termsConsent) {
      toast({
        title: "Please accept the terms",
        description: "You must agree to the terms and consent to be contacted.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    const payload = {
      full_name: formData.fullName,
      business_name: formData.businessName,
      email: formData.email,
      phone: formData.phone,
      monthly_revenue_range: formData.monthlyRevenue,
      funding_needed_range: formData.fundingNeeded,
      purpose: formData.purpose,
      source: 'quick',
    };

    try {
      const res = await fetch('/api/send-application-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const text = await res.text();
        console.error('send-application-email response:', res.status, text);
        let detailError: string | undefined;
        try {
          detailError = JSON.parse(text)?.error;
        } catch {
          // non-JSON response
        }
        throw new Error(detailError ?? `HTTP ${res.status}: ${text.slice(0, 200)}`);
      }

      // Best-effort DB log; don't block the user on failure.
      supabase
        .from('applications')
        .insert({
          ...payload,
          contact_consent: formData.contactConsent,
          terms_consent: formData.termsConsent,
        })
        .then(({ error }) => {
          if (error) console.error('applications insert failed:', error);
        });

      navigate('/thank-you');
    } catch (error) {
      console.error('Error submitting application:', error);
      toast({
        title: "Submission failed",
        description: "There was an error submitting your application. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen">
      <Header />
      <main className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <h1 className="text-3xl md:text-4xl font-bold text-[#2c4a6e] mb-4 font-montserrat">
                Get Your Business Funded Today
              </h1>
              <p className="text-lg text-slate-600">
                Complete our quick form and get your funding options in minutes
              </p>
            </div>

            <Card className="shadow-md border border-slate-200">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl text-[#2c4a6e]">Quick Application</CardTitle>
                <CardDescription>
                  Takes less than 2 minutes &middot; No impact on credit score
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form className="space-y-6" onSubmit={handleSubmit}>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="fullName">Full Name *</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                        <Input
                          id="fullName"
                          className="pl-10"
                          placeholder="Your Full Name"
                          value={formData.fullName}
                          onChange={(e) => handleInputChange('fullName', e.target.value)}
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="businessName">Business Name *</Label>
                      <div className="relative">
                        <Building className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                        <Input
                          id="businessName"
                          className="pl-10"
                          placeholder="Your Business Name"
                          value={formData.businessName}
                          onChange={(e) => handleInputChange('businessName', e.target.value)}
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="email">Email Address *</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                        <Input
                          id="email"
                          type="email"
                          className="pl-10"
                          placeholder="your@email.com"
                          value={formData.email}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone Number (Mobile) *</Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                        <Input
                          id="phone"
                          type="tel"
                          className="pl-10"
                          placeholder="(555) 123-4567"
                          value={formData.phone}
                          onChange={(e) => handleInputChange('phone', e.target.value)}
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="monthlyRevenue">Monthly Revenue ($) *</Label>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                        <Select value={formData.monthlyRevenue} onValueChange={(value) => handleInputChange('monthlyRevenue', value)}>
                          <SelectTrigger className="pl-10">
                            <SelectValue placeholder="Select monthly revenue" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="10k-25k">$10,000 - $25,000</SelectItem>
                            <SelectItem value="25k-50k">$25,000 - $50,000</SelectItem>
                            <SelectItem value="50k-100k">$50,000 - $100,000</SelectItem>
                            <SelectItem value="100k-250k">$100,000 - $250,000</SelectItem>
                            <SelectItem value="250k+">$250,000+</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="fundingNeeded">Funding Needed ($ Amount) *</Label>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                        <Select value={formData.fundingNeeded} onValueChange={(value) => handleInputChange('fundingNeeded', value)}>
                          <SelectTrigger className="pl-10">
                            <SelectValue placeholder="How much funding?" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="5k-25k">$5,000 - $25,000</SelectItem>
                            <SelectItem value="25k-50k">$25,000 - $50,000</SelectItem>
                            <SelectItem value="50k-100k">$50,000 - $100,000</SelectItem>
                            <SelectItem value="100k-250k">$100,000 - $250,000</SelectItem>
                            <SelectItem value="250k+">$250,000+</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="purpose">Purpose of Funding *</Label>
                    <Select value={formData.purpose} onValueChange={(value) => handleInputChange('purpose', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select purpose of funding" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="working-capital">Working Capital</SelectItem>
                        <SelectItem value="equipment">Equipment</SelectItem>
                        <SelectItem value="expansion">Expansion</SelectItem>
                        <SelectItem value="real-estate">Real Estate</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-4 pt-4">
                    <div className="flex items-start space-x-3">
                      <Checkbox
                        id="contact-consent"
                        className="mt-1"
                        checked={formData.contactConsent}
                        onCheckedChange={(checked) => handleInputChange('contactConsent', checked === true)}
                      />
                      <Label htmlFor="contact-consent" className="text-sm leading-relaxed text-slate-600">
                        By submitting this form, you agree to receive transaction messages from Bayview Advance. Text and data rates may apply. Message frequency varies. Reply STOP to unsubscribe or HELP for help. To view our privacy policy, go to{" "}
                        <Link to="/privacy" className="text-[#2c4a6e] hover:underline">our privacy policy</Link>.
                      </Label>
                    </div>
                    <div className="flex items-start space-x-3">
                      <Checkbox
                        id="terms-consent"
                        className="mt-1"
                        checked={formData.termsConsent}
                        onCheckedChange={(checked) => handleInputChange('termsConsent', checked === true)}
                      />
                      <Label htmlFor="terms-consent" className="text-sm leading-relaxed text-slate-600">
                        I have read and agree to the{" "}
                        <Link to="/terms" className="text-[#2c4a6e] hover:underline">Terms & Conditions</Link>
                        {" "}and{" "}
                        <Link to="/privacy" className="text-[#2c4a6e] hover:underline">Privacy Policy</Link>.
                      </Label>
                    </div>
                  </div>

                  <div className="text-center pt-6">
                    <Button
                      type="submit"
                      size="lg"
                      className="bg-[#2c4a6e] hover:bg-[#1e3a5c] text-white font-bold px-12 group"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? 'Submitting...' : 'Submit Application'}
                      <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                    </Button>
                    <p className="text-sm text-slate-500 mt-4">
                      Need more detailed options?{" "}
                      <Link to="/apply" className="text-[#2c4a6e] hover:underline font-medium">
                        Complete Full Application
                      </Link>
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

export default QuickApply;
