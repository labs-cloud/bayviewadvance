import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const ThankYou = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex-1 flex items-center justify-center bg-gray-50 py-20">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-2xl mx-auto space-y-8">
            <h1 className="text-5xl md:text-6xl font-bold text-[#2c4a6e] font-montserrat">
              Thank You!
            </h1>

            <h2 className="text-xl md:text-2xl font-semibold text-slate-700 leading-relaxed">
              We've received your application and a Bayview Advance funding advisor will reach out within 24 hours.
            </h2>

            <p className="text-lg text-slate-600 leading-relaxed max-w-xl mx-auto">
              In the meantime, you can explore our funding solutions or contact us directly if you have urgent questions.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8">
              <Button
                asChild
                size="lg"
                className="bg-[#2c4a6e] hover:bg-[#1e3a5c] text-white px-8 py-6 text-lg font-semibold min-w-[200px]"
              >
                <Link to="/">Return to Home</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ThankYou;
