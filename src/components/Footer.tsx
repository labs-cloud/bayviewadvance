import { Button } from "@/components/ui/button";
import { Phone, Mail, Clock } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-[#1e3a5c] text-white py-16">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-8 text-center">
          <div className="space-y-4 flex flex-col items-center">
            <img
              src="/lovable-uploads/new-logo.png"
              alt="Bayview Advance"
              className="h-16 w-auto mx-auto invert brightness-200 contrast-125 mix-blend-screen"
            />
            <p className="text-slate-300 leading-relaxed text-center text-sm">
              Providing fast, flexible business funding solutions to help entrepreneurs
              and small businesses achieve their growth goals.
            </p>
            <div className="flex justify-center pt-2">
              <Button
                variant="outline"
                size="sm"
                className="bg-white text-[#1e3a5c] border-white hover:bg-slate-100 hover:text-[#1e3a5c] font-semibold"
              >
                <Phone className="mr-2 h-4 w-4" />
                +1 828-604-6224
              </Button>
            </div>
          </div>

          <div className="text-center">
            <h3 className="text-base font-semibold mb-4">Funding Solutions</h3>
            <ul className="space-y-2 text-slate-300 text-sm">
              <li><a href="#services" className="hover:text-white transition-colors">Merchant Cash Advance</a></li>
              <li><a href="#services" className="hover:text-white transition-colors">Short-Term Loans</a></li>
              <li><a href="#services" className="hover:text-white transition-colors">Revenue-Based Financing</a></li>
              <li><a href="#services" className="hover:text-white transition-colors">Equipment Financing</a></li>
              <li><a href="#services" className="hover:text-white transition-colors">Working Capital</a></li>
            </ul>
          </div>

          <div className="text-center">
            <h3 className="text-base font-semibold mb-4">Company</h3>
            <ul className="space-y-2 text-slate-300 text-sm">
              <li><a href="#about" className="hover:text-white transition-colors">About Us</a></li>
              <li><a href="/faq" className="hover:text-white transition-colors">FAQ</a></li>
              <li><a href="/contact" className="hover:text-white transition-colors">Contact</a></li>
              <li><a href="/apply" className="hover:text-white transition-colors">Apply Now</a></li>
            </ul>
          </div>

          <div className="text-center">
            <h3 className="text-base font-semibold mb-4">Contact Info</h3>
            <div className="space-y-3 text-slate-300 text-sm">
              <div className="flex flex-col items-center space-y-1">
                <Mail className="h-4 w-4 text-[#5b8fb9]" />
                <span>info@bayviewadvance.com</span>
              </div>
              <div className="flex flex-col items-center space-y-1">
                <Clock className="h-4 w-4 text-[#5b8fb9]" />
                <span>Mon-Fri: 8AM-5PM EST</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center text-center">
            <p className="text-slate-400 text-sm">&copy; 2025 Bayview Advance. All rights reserved.</p>
            <div className="flex space-x-6 text-sm text-slate-400 mt-4 md:mt-0">
              <a href="/privacy" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="/terms" className="hover:text-white transition-colors">Terms of Service</a>
            </div>
          </div>
          <div className="mt-4 text-xs text-slate-500 text-center">
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
