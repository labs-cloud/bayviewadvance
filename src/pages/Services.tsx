
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Services from "@/components/Services";

const ServicesPage = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="pt-20">
        <Services />
      </main>
      <Footer />
    </div>
  );
};

export default ServicesPage;
