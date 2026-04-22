import { Button } from "@/components/ui/button";
import { Phone, Menu, X } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";

const Header = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="bg-white sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Link to="/">
              <img
                src="/lovable-uploads/new-logo.png"
                alt="Bayview Advance"
                className="h-20 md:h-28 w-auto cursor-pointer hover:opacity-90 transition-opacity"
              />
            </Link>
          </div>

          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-slate-700 hover:text-bayview-primary font-medium transition-colors">
              Home
            </Link>
            <a href="#services" className="text-slate-700 hover:text-bayview-primary font-medium transition-colors">
              Services
            </a>
            <Link to="/faq" className="text-slate-700 hover:text-bayview-primary font-medium transition-colors">
              FAQ
            </Link>
            <div className="flex items-center space-x-2 text-slate-500 text-sm">
              <Phone className="h-4 w-4" />
              <span>+1 828-604-6224</span>
            </div>
          </nav>

          <div className="flex items-center space-x-3">
            <Button
              className="bg-[#2c4a6e] hover:bg-[#1e3a5c] text-white font-semibold px-6 py-2 rounded-md"
              asChild
            >
              <Link to="/quick-apply">Get Funded</Link>
            </Button>

            <button
              className="md:hidden text-slate-700"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {mobileOpen && (
          <nav className="md:hidden pt-4 pb-2 border-t mt-3 space-y-3">
            <Link
              to="/"
              className="block text-slate-700 hover:text-bayview-primary font-medium"
              onClick={() => setMobileOpen(false)}
            >
              Home
            </Link>
            <a
              href="#services"
              className="block text-slate-700 hover:text-bayview-primary font-medium"
              onClick={() => setMobileOpen(false)}
            >
              Services
            </a>
            <Link
              to="/faq"
              className="block text-slate-700 hover:text-bayview-primary font-medium"
              onClick={() => setMobileOpen(false)}
            >
              FAQ
            </Link>
            <div className="flex items-center space-x-2 text-slate-500 text-sm pt-2">
              <Phone className="h-4 w-4" />
              <span>+1 828-604-6224</span>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;
