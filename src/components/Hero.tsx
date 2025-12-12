import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import citySkyline from "@/assets/city-skyline.jpg";
const Hero = () => {
  const navigate = useNavigate();
  return <section className="relative overflow-hidden min-h-[100vh] flex items-center">
      {/* Background with city skyline and gradient overlay */}
      <div className="absolute inset-0">
        <img src={citySkyline} alt="City skyline at sunrise representing business growth and opportunity" className="w-full h-full object-cover" loading="eager" />
        <div className="absolute inset-0 bg-gradient-to-b from-bayview-primary/60 via-bayview-primary/50 to-bayview-primary/80"></div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center space-y-16">
          <div className="space-y-8 animate-fade-in">
            <h1 className="text-4xl lg:text-5xl xl:text-6xl font-medium leading-tight text-white drop-shadow-lg font-montserrat uppercase tracking-wide antialiased">
              NEED CASH FLOW?
              <span className="block">
                WE'VE GOT THE FLOW.
              </span>
            </h1>
            <p className="text-xl lg:text-2xl text-white/90 leading-relaxed max-w-lg mx-auto drop-shadow-lg font-montserrat font-medium">
              Quick approvals. Real results.
            </p>
          </div>
          
          <div className="flex justify-center animate-fade-in">
            <Button size="lg" className="bg-gradient-to-r from-bayview-accent to-bayview-primary hover:from-bayview-accent/90 hover:to-bayview-primary/90 text-white font-black rounded-full px-16 py-8 text-2xl shadow-2xl transform hover:scale-110 hover:shadow-glow transition-all duration-500 tracking-tight font-montserrat animate-bounce hover:animate-none" onClick={() => navigate('/quick-apply')} style={{
            animation: 'flowWave 3s ease-in-out infinite'
          }}>Access Funding</Button>
          </div>
        </div>
      </div>
    </section>;
};
export default Hero;