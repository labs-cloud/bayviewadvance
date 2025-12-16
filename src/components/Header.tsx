import { Button } from "@/components/ui/button";
import { Phone, Mail } from "lucide-react";
import { Link } from "react-router-dom";
const Header = () => {
  return <header className="bg-white shadow-card sticky top-0 z-50">
      <div className="container mx-auto px-4 py-1">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Link to="/">
              <img src="/lovable-uploads/06ea678f-b8c6-4f3e-840a-4cf85fb809f4.png" alt="Bayview Advance" className="h-36 md:h-40 lg:h-44 w-auto cursor-pointer hover:opacity-90 transition-opacity" />
            </Link>
          </div>
          
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-foreground hover:text-trust transition-colors">
              HOME
            </Link>
            <a href="#services" className="text-foreground hover:text-trust transition-colors">
              SERVICES
            </a>
            <Link to="/faq" className="text-foreground hover:text-trust transition-colors">
              FAQ
            </Link>
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <Phone className="h-4 w-4" />
              <span>+1 828-604-6224</span>
            </div>
          </nav>
          
          <Button variant="hero" size="lg" asChild>
            <Link to="/quick-apply">GET CAPITAL</Link>
          </Button>
        </div>
      </div>
    </header>;
};
export default Header;