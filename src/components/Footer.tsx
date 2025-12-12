import { Button } from "@/components/ui/button";
import { Phone, Mail, MapPin, Clock } from "lucide-react";
import footerSkyline from "@/assets/footer-skyline.jpg";

const Footer = () => {
  return (
    <footer className="relative bg-primary text-white py-16 overflow-hidden">
      {/* Enhanced background with NYC skyline */}
      <div className="absolute inset-0">
        <img 
          src={footerSkyline} 
          alt="NYC Skyline" 
          className="w-full h-full object-cover opacity-20"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-bayview-primary/90 via-bayview-primary/80 to-bayview-accent/70"></div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-8 text-center">
          <div className="space-y-4 flex flex-col items-center">
            <img src="/lovable-uploads/286df6e3-0d61-442c-aced-336d1ff0dd93.png" alt="Bayview Advance" className="h-24 w-auto brightness-0 invert mx-auto" />
            <p className="text-blue-100 leading-relaxed text-center">
              Providing fast, flexible business funding solutions to help entrepreneurs 
              and small businesses achieve their growth goals.
            </p>
            <div className="flex justify-center pt-4">
              <Button variant="default" size="lg" className="bg-gradient-warning hover:shadow-warning">
                <Phone className="mr-2 h-4 w-4" />
                +1 828-604-6224
              </Button>
            </div>
          </div>

          <div className="text-center">
            <h3 className="text-lg font-semibold mb-4">Funding Solutions</h3>
            <ul className="space-y-2 text-blue-100">
              <li><a href="#" className="hover:text-white transition-colors">Merchant Cash Advance</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Short-Term Loans</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Revenue-Based Financing</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Equipment Financing</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Working Capital</a></li>
            </ul>
          </div>

          <div className="text-center">
            <h3 className="text-lg font-semibold mb-4">Company</h3>
            <ul className="space-y-2 text-blue-100">
              <li><a href="#about" className="hover:text-white transition-colors">About Us</a></li>
              <li><a href="/faq" className="hover:text-white transition-colors">FAQ</a></li>
              <li><a href="/contact" className="hover:text-white transition-colors">Contact</a></li>
              <li><a href="/apply" className="hover:text-white transition-colors">Apply Now</a></li>
            </ul>
          </div>

          <div className="text-center">
            <h3 className="text-lg font-semibold mb-4">Contact Info</h3>
            <div className="space-y-3 text-blue-100">
              <div className="flex flex-col items-center space-y-1">
                <MapPin className="h-5 w-5 text-accent" />
                <div>
                  <p>365 Flushing Ave</p>
                  <p>Brooklyn, NY 11205</p>
                </div>
              </div>
              <div className="flex flex-col items-center space-y-1">
                <Mail className="h-5 w-5 text-accent" />
                <span>info@bayviewadvance.com</span>
              </div>
              <div className="flex flex-col items-center space-y-1">
                <Clock className="h-5 w-5 text-accent" />
                <span>Mon-Fri: 8AM-5PM EST</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-blue-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center text-center">
            <p className="text-blue-100 text-sm">© 2025 Bayview Advance. All rights reserved.</p>
            <div className="flex space-x-6 text-sm text-blue-100 mt-4 md:mt-0">
              <a href="/privacy" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="/terms" className="hover:text-white transition-colors">Terms of Service</a>
            </div>
          </div>
          <div className="mt-4 text-xs text-blue-200 text-center">
            <p>
              Bayview Advance is not a lender. We are a financial services company that helps connect 
              businesses with funding partners. Funding decisions are subject to approval by our lending partners.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;