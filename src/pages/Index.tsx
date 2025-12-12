import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Services from "@/components/Services";
import AboutUs from "@/components/AboutUs";
import Testimonials from "@/components/Testimonials";
import Industries from "@/components/Industries";
import QuickApplyForm from "@/components/QuickApplyForm";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <Hero />
      <Services />
      <AboutUs />
      <Testimonials />
      <Industries />
      <QuickApplyForm />
      <Footer />
    </div>
  );
};

export default Index;
