import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious
} from "@/components/ui/carousel";
import chefPlating from "@/assets/chef-plating.jpg";
import constructionSite from "@/assets/construction-site.jpg";
import lawFirmBoardroom from "@/assets/law-firm-boardroom.jpg";

const Testimonials = () => {
  const testimonials = [
    {
      image: chefPlating,
      alt: "Chef plating dinner in a modern restaurant kitchen",
      quote: "Bayview Advance helped us upgrade our kitchen and expand seating—funding landed in days.",
      name: "Elena P.",
      role: "Restaurant Owner"
    },
    {
      image: constructionSite,
      alt: "Construction crew working on a high-rise site",
      quote: "We secured working capital for materials and payroll during a big project—fast and straightforward.",
      name: "Marcus T.",
      role: "General Contractor"
    },
    {
      image: lawFirmBoardroom,
      alt: "Attorneys meeting in a glass-walled conference room",
      quote: "Simple application. Clear terms. Exactly what our practice needed to smooth cash flow.",
      name: "Dana L.",
      role: "Managing Partner"
    }
  ];

  return (
    <section className="relative py-20 px-4 bg-[#2c4a6e]">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 font-montserrat">
            What Our Clients Say
          </h2>
          <div className="w-16 h-1 bg-[#5b8fb9] mx-auto"></div>
        </div>

        {/* Desktop: 3-across grid */}
        <div className="hidden md:grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border-0">
              <div className="aspect-video overflow-hidden">
                <img
                  src={testimonial.image}
                  alt={testimonial.alt}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
              <CardContent className="p-6">
                <div className="mb-6">
                  <svg
                    className="w-8 h-8 mb-4 text-[#5b8fb9]"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-10zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h4v10h-10z" />
                  </svg>
                  <p className="italic leading-relaxed mb-4 text-slate-700">
                    "{testimonial.quote}"
                  </p>
                </div>
                <div className="border-t border-slate-200 pt-4">
                  <p className="font-semibold text-[#2c4a6e]">
                    {testimonial.name}
                  </p>
                  <p className="text-sm text-slate-500">{testimonial.role}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Mobile: Carousel */}
        <div className="md:hidden">
          <Carousel className="w-full max-w-sm mx-auto">
            <CarouselContent>
              {testimonials.map((testimonial, index) => (
                <CarouselItem key={index}>
                  <Card className="bg-white rounded-xl shadow-lg overflow-hidden border-0">
                    <div className="aspect-video overflow-hidden">
                      <img
                        src={testimonial.image}
                        alt={testimonial.alt}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </div>
                    <CardContent className="p-6">
                      <div className="mb-6">
                        <svg
                          className="w-8 h-8 mb-4 text-[#5b8fb9]"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-10zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h4v10h-10z" />
                        </svg>
                        <p className="italic leading-relaxed mb-4 text-slate-700">
                          "{testimonial.quote}"
                        </p>
                      </div>
                      <div className="border-t border-slate-200 pt-4">
                        <p className="font-semibold text-[#2c4a6e]">
                          {testimonial.name}
                        </p>
                        <p className="text-sm text-slate-500">{testimonial.role}</p>
                      </div>
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
