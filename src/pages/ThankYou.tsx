import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import citySkyline from "@/assets/city-skyline.jpg";
const ThankYou = () => {
  return <div className="min-h-screen flex flex-col">
      {/* Background with city skyline */}
      <div className="flex-1 relative bg-cover bg-center bg-no-repeat" style={{
      backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.85), rgba(255, 255, 255, 0.85)), url(${citySkyline})`
    }}>
        <div className="container mx-auto px-4 py-16 flex flex-col items-center justify-center min-h-screen text-center">
          <div className="max-w-2xl space-y-8">
            {/* Main heading */}
            <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold text-primary" style={{
            fontFamily: 'Garamond, serif'
          }}>
              Thank You!
            </h1>
            
            {/* Subheading */}
            <h2 className="text-xl md:text-2xl lg:text-3xl font-semibold text-foreground leading-relaxed">
              We've received your application and a Bayview Advance funding advisor will reach out within 24 hours.
            </h2>
            
            {/* Supporting text */}
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-xl mx-auto">
              In the meantime, you can explore our funding solutions or contact us directly if you have urgent questions.
            </p>
            
            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8">
              <Button asChild size="lg" className="bg-bayview-primary hover:bg-bayview-primary/90 text-white px-8 py-6 text-lg font-semibold min-w-[200px]">
                <Link to="/">Return to Home</Link>
              </Button>
              
              <Button asChild variant="outline" size="lg" className="border-bayview-accent text-bayview-accent hover:bg-bayview-accent hover:text-white px-8 py-6 text-lg font-semibold min-w-[200px]">
                
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>;
};
export default ThankYou;