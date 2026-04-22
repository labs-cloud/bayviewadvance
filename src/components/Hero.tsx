import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import heroBackground from "@/assets/city-skyline.jpg";

const Hero = () => {
  const navigate = useNavigate();

  return (
    <section className="relative overflow-hidden min-h-[85vh] flex items-center">
      {/* Background with darker overlay for improved text contrast */}
      <div className="absolute inset-0">
        <img
          src={heroBackground}
          alt="Business growth and opportunity"
          className="w-full h-full object-cover"
          loading="eager"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-[#0b1e33]/85 to-black/90"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center space-y-8">
          <div className="space-y-4">
            <h1 className="font-playfair text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight drop-shadow-lg">
              <span className="text-white">Fuel Your</span>
              <br />
              <span className="text-white">Business</span>
              <br />
              <span className="italic text-[#f5c542] font-extrabold">Growth Today</span>
            </h1>
          </div>

          <p className="text-lg md:text-xl text-white leading-relaxed max-w-2xl mx-auto font-montserrat drop-shadow">
            Fast, flexible funding solutions for growing businesses. Get the capital you need with merchant cash advances and short-term loans tailored to your success.
          </p>

          <div className="flex justify-center pt-4">
            <Button
              size="lg"
              className="bg-[#f5c542] hover:bg-[#e0b030] text-[#1e3a5c] font-bold rounded-md px-10 py-6 text-lg shadow-lg hover:shadow-xl transition-all duration-300 font-montserrat"
              onClick={() => navigate("/quick-apply")}
            >
              Get Started Today
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
