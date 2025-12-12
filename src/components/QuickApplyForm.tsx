import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowRight, DollarSign, Building, Phone, Mail, User } from "lucide-react";
import { Link } from "react-router-dom";
import formBackground from "@/assets/form-background.jpg";
const QuickApplyForm = () => {
  return <section id="quick-apply" className="relative py-20 overflow-hidden">
      {/* Enhanced background with form imagery */}
      <div className="absolute inset-0">
        <img src={formBackground} alt="Application Background" className="w-full h-full object-cover" />
        
        
      </div>
      
      {/* Decorative floating elements */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-warning rounded-full blur-3xl animate-float opacity-60"></div>
      <div className="absolute bottom-20 right-10 w-48 h-48 bg-gradient-success rounded-full blur-3xl animate-float opacity-40" style={{
      animationDelay: '1s'
    }}></div>
      
      <div className="container mx-auto px-4 relative z-10">
        
      </div>
    </section>;
};
export default QuickApplyForm;