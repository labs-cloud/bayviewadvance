
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
  
  // Form state
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
    
    // Basic validation
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

    try {
      const { error } = await supabase
        .from('applications')
        .insert({
          full_name: formData.fullName,
          business_name: formData.businessName,
          email: formData.email,
          phone: formData.phone,
          monthly_revenue_range: formData.monthlyRevenue,
          funding_needed_range: formData.fundingNeeded,
          purpose: formData.purpose,
          contact_consent: formData.contactConsent,
          terms_consent: formData.termsConsent,
          source: 'quick'
        });

      if (error) {
        throw error;
      }

      // Navigate to thank you page on success
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
      <main className="py-20 bg-gradient-to-br from-secondary/30 via-accent/20 to-background bg-textured relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute inset-0 bg-pattern opacity-30"></div>
        <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-primary/10 to-trust/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-20 right-10 w-48 h-48 bg-gradient-to-br from-accent/20 to-primary/10 rounded-full blur-3xl animate-float" style={{animationDelay: '1s'}}></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12 animate-fade-up">
              <h1 className="text-5xl md:text-6xl font-extrabold bg-gradient-to-r from-primary via-primary-glow to-accent bg-clip-text text-transparent mb-6 leading-tight">
                GET YOUR BUSINESS
                <br />
                <span className="text-4xl md:text-5xl font-bold text-primary">FUNDED TODAY</span>
              </h1>
              <p className="text-xl text-muted-foreground">
                COMPLETE OUR QUICK FORM AND GET YOUR FUNDING OPTIONS IN MINUTES
              </p>
            </div>

            <Card className="form-premium shadow-premium border-0 animate-scale-in backdrop-blur-sm">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl text-primary">QUICK APPLICATION</CardTitle>
                <CardDescription>
                  TAKES LESS THAN 2 MINUTES • NO IMPACT ON CREDIT SCORE
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form className="space-y-6" onSubmit={handleSubmit}>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="fullName">FULL NAME *</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
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
                      <Label htmlFor="businessName">BUSINESS NAME *</Label>
                      <div className="relative">
                        <Building className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
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
                      <Label htmlFor="email">EMAIL ADDRESS *</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
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
                      <Label htmlFor="phone">PHONE NUMBER (MOBILE) *</Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
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
                      <Label htmlFor="monthlyRevenue">MONTHLY REVENUE ($) *</Label>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
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
                      <Label htmlFor="fundingNeeded">FUNDING NEEDED ($ AMOUNT) *</Label>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
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
                    <Label htmlFor="purpose">PURPOSE OF FUNDING *</Label>
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
                      <Label htmlFor="contact-consent" className="text-sm leading-relaxed">
                        By submitting this form, you agree to receive transaction messages from Bayview Advance. Text and data rates may apply. Message frequency varies. Reply STOP to unsubscribe or HELP for help. To view our privacy policy, go to{" "}
                        <Link to="/privacy" className="text-primary hover:underline">our privacy policy</Link>.
                      </Label>
                    </div>
                    <div className="flex items-start space-x-3">
                      <Checkbox 
                        id="terms-consent" 
                        className="mt-1"
                        checked={formData.termsConsent}
                        onCheckedChange={(checked) => handleInputChange('termsConsent', checked === true)}
                      />
                      <Label htmlFor="terms-consent" className="text-sm leading-relaxed">
                        I have read and agree to the{" "}
                        <Link to="/terms" className="text-primary hover:underline">Terms & Conditions</Link>
                        {" "}and{" "}
                        <Link to="/privacy" className="text-primary hover:underline">Privacy Policy</Link>.
                      </Label>
                    </div>
                  </div>

                  <div className="text-center pt-6">
                    <Button 
                      type="submit" 
                      variant="hero" 
                      size="lg" 
                      className="px-12 group"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? 'SUBMITTING...' : 'CHECK MY OPTIONS'}
                      <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                    </Button>
                    <p className="text-sm text-muted-foreground mt-4">
                      Need more detailed options?{" "}
                      <Link to="/apply" className="text-primary hover:underline font-medium">
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
