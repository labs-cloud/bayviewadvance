import { Card, CardContent } from "@/components/ui/card";
import citySkyline from "@/assets/city-skyline.jpg";

const AboutUs = () => {
  return (
    <section className="relative py-20 overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${citySkyline})` }}
      />
      <div className="absolute inset-0 bg-[#2c4a6e]/70" />

      <div className="relative z-10 container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-white font-montserrat">
            About Us
          </h2>

          <Card className="bg-white/95 backdrop-blur-sm shadow-lg border-0">
            <CardContent className="p-8 md:p-12">
              <p className="text-lg md:text-xl leading-relaxed text-slate-700 text-center">
                At <span className="font-semibold text-[#2c4a6e]">Bayview Advance</span>, we specialize in helping businesses unlock the funding they need to grow. From small business loans to lines of credit and working capital, our team connects you with the right lenders and financial solutions. We pride ourselves on <span className="font-semibold text-[#5b8fb9]">trust, speed, and transparency</span> — guiding you from application to approval with expert support at every step. Based in <span className="font-semibold text-[#2c4a6e]">New York</span>, we serve a wide range of industries across the U.S., helping entrepreneurs, professionals, and investors secure the financing that powers real growth.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default AboutUs;
