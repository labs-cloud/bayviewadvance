import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Phone, Mail, MapPin, Clock, MessageSquare } from "lucide-react";

const Contact = () => {
  return (
    <div className="min-h-screen">
      <Header />
      
      {/* Contact Section */}
      <section className="relative py-20 px-4 overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-bayview-primary/10 via-white to-bayview-accent/5" />
        
        <div className="relative max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="font-garamond text-5xl font-bold text-bayview-primary mb-4">
              CONTACT US
            </h1>
            <p className="text-xl text-foreground/80 max-w-2xl mx-auto">
              Get in touch with our funding experts. We're here to help you secure the capital your business needs to grow.
            </p>
            <div className="w-24 h-1 bg-bayview-accent mx-auto mt-6"></div>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Contact Information */}
            <div className="space-y-8">
              <div>
                <h2 className="text-3xl font-bold text-bayview-primary mb-6">Get In Touch</h2>
                <p className="text-foreground/80 leading-relaxed mb-8">
                  Ready to explore your funding options? Our team of experienced funding advisors is standing by to help you navigate the process and find the best solution for your business needs.
                </p>
              </div>

              <div className="space-y-6">
                <div className="flex items-start space-x-4 p-4 bg-white rounded-lg shadow-sm border border-border/20">
                  <div className="bg-bayview-primary/10 p-3 rounded-lg">
                    <Phone className="h-6 w-6 text-bayview-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-bayview-primary mb-1">Phone</h3>
                    <p className="text-foreground/80">+1 828-604-6224</p>
                    <p className="text-sm text-foreground/60">Speak directly with a funding advisor</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4 p-4 bg-white rounded-lg shadow-sm border border-border/20">
                  <div className="bg-bayview-primary/10 p-3 rounded-lg">
                    <Mail className="h-6 w-6 text-bayview-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-bayview-primary mb-1">Email</h3>
                    <p className="text-foreground/80">info@bayviewadvance.com</p>
                    <p className="text-sm text-foreground/60">We respond within 1 business hour</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4 p-4 bg-white rounded-lg shadow-sm border border-border/20">
                  <div className="bg-bayview-primary/10 p-3 rounded-lg">
                    <MapPin className="h-6 w-6 text-bayview-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-bayview-primary mb-1">Address</h3>
                    <p className="text-foreground/80">365 Flushing Ave</p>
                    <p className="text-foreground/80">Brooklyn, NY 11205</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4 p-4 bg-white rounded-lg shadow-sm border border-border/20">
                  <div className="bg-bayview-primary/10 p-3 rounded-lg">
                    <Clock className="h-6 w-6 text-bayview-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-bayview-primary mb-1">Business Hours</h3>
                    <p className="text-foreground/80">Monday - Friday: 8:00 AM - 5:00 PM EST</p>
                    <p className="text-sm text-foreground/60">Emergency funding available 24/7</p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-bayview-primary to-bayview-accent p-6 rounded-xl text-white">
                <h3 className="text-xl font-semibold mb-2">Need Funding Fast?</h3>
                <p className="mb-4 opacity-90">
                  Call us now for same-day approval and funding decisions.
                </p>
                <Button 
                  variant="secondary" 
                  size="lg"
                  className="bg-white text-bayview-primary hover:bg-white/90"
                >
                  <Phone className="mr-2 h-4 w-4" />
                  Call Now: +1 828-604-6224
                </Button>
              </div>
            </div>

            {/* Contact Form */}
            <Card className="shadow-premium">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-bayview-primary">
                  <MessageSquare className="h-5 w-5" />
                  Send Us a Message
                </CardTitle>
                <CardDescription>
                  Fill out the form below and we'll get back to you within 1 business hour.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="first-name">First Name *</Label>
                      <Input id="first-name" placeholder="John" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="last-name">Last Name *</Label>
                      <Input id="last-name" placeholder="Doe" required />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address *</Label>
                    <Input id="email" type="email" placeholder="john@business.com" required />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input id="phone" type="tel" placeholder="(555) 123-4567" required />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="business-name">Business Name</Label>
                    <Input id="business-name" placeholder="Your Business LLC" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="funding-amount">Funding Amount Needed</Label>
                    <Input id="funding-amount" placeholder="$50,000" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">Message *</Label>
                    <Textarea 
                      id="message" 
                      placeholder="Tell us about your funding needs and how we can help..."
                      rows={4}
                      required 
                    />
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full bg-bayview-primary hover:bg-bayview-secondary text-white font-bold"
                    size="lg"
                  >
                    Send Message
                  </Button>

                  <p className="text-sm text-foreground/60 text-center">
                    By submitting this form, you agree to our{" "}
                    <a href="/privacy" className="text-bayview-primary hover:underline">Privacy Policy</a>
                    {" "}and{" "}
                    <a href="/terms" className="text-bayview-primary hover:underline">Terms & Conditions</a>.
                  </p>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Contact;