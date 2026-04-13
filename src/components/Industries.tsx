import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import restaurantDining from "@/assets/restaurant-dining.jpg";
import constructionCranes from "@/assets/construction-cranes.jpg";
import courthouseColumns from "@/assets/courthouse-columns.jpg";
import medicalClinic from "@/assets/medical-clinic.jpg";
import retailStorefront from "@/assets/retail-storefront.jpg";
import realEstateSkyline from "@/assets/real-estate-skyline.jpg";

const Industries = () => {
  const industries = [
    {
      title: "Restaurants & Cafés",
      image: restaurantDining,
      alt: "Modern upscale restaurant dining room with elegant table settings"
    },
    {
      title: "Construction & Trades",
      image: constructionCranes,
      alt: "Large construction cranes and steel frame structure of a building under construction"
    },
    {
      title: "Law Firms & Professional Services",
      image: courthouseColumns,
      alt: "Classical courthouse columns with impressive stone architecture"
    },
    {
      title: "Medical & Dental Practices",
      image: medicalClinic,
      alt: "Modern medical clinic interior with clean white walls and medical equipment"
    },
    {
      title: "Retail & eCommerce",
      image: retailStorefront,
      alt: "Modern retail storefront with large windows and attractive product displays"
    },
    {
      title: "Real Estate Investors",
      image: realEstateSkyline,
      alt: "City skyline with modern residential apartment buildings and high-rises at dusk"
    }
  ];

  return (
    <section className="py-20 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-[#2c4a6e] font-montserrat">
            Industries We Serve
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {industries.map((industry, index) => (
            <div
              key={index}
              className="group relative aspect-[4/3] overflow-hidden rounded-xl shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer"
            >
              <img
                src={industry.image}
                alt={industry.alt}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                loading="lazy"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-[#2c4a6e]/80 via-[#2c4a6e]/30 to-transparent" />

              <div className="absolute inset-0 flex flex-col justify-end p-6 text-white">
                <h3 className="text-xl font-bold mb-4 group-hover:mb-6 transition-all duration-300 font-montserrat">
                  {industry.title}
                </h3>

                <div className="transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                  <Button
                    asChild
                    className="bg-white text-[#2c4a6e] hover:bg-white/90 font-semibold"
                  >
                    <Link to="/quick-apply">See If I Qualify</Link>
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Industries;
