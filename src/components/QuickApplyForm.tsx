import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const QuickApplyForm = () => {
  return (
    <section id="quick-apply" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-[#2c4a6e] mb-4 font-montserrat">
          Ready to Get Funded?
        </h2>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto mb-8">
          Apply in minutes and get a decision fast. Our streamlined process makes it easy to access the capital your business needs.
        </p>
        <Button
          size="lg"
          className="bg-[#2c4a6e] hover:bg-[#1e3a5c] text-white font-bold px-10 py-6 text-lg rounded-md shadow-md hover:shadow-lg transition-all"
          asChild
        >
          <Link to="/quick-apply">
            Apply Now <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </Button>
      </div>
    </section>
  );
};

export default QuickApplyForm;
