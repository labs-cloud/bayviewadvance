import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const FAQ = () => {
  const faqs = [
    {
      question: "What does Bayview Advance do?",
      answer: "We're a brokerage that helps businesses secure funding, loans, and financial solutions by connecting them with trusted lenders."
    },
    {
      question: "What types of funding do you help with?",
      answer: "We work with small business loans, lines of credit, equipment financing, working capital, and SBA loans."
    },
    {
      question: "How long does the process take?",
      answer: "Many clients receive approvals in as little as 24–48 hours after submitting their application, depending on lender requirements."
    },
    {
      question: "Do I need perfect credit to qualify?",
      answer: "No. We work with businesses across a wide range of credit profiles. Lenders consider multiple factors including revenue and time in business."
    },
    {
      question: "Is there a fee to apply?",
      answer: "No, applying through Bayview Advance is free. If approved, fees or terms will come directly from the lender."
    },
    {
      question: "Is my information safe?",
      answer: "Yes. We take data security and privacy seriously. Your information is only shared with lending partners for the purpose of evaluating funding."
    }
  ];

  return (
    <div className="min-h-screen">
      <Header />
      
      {/* FAQ Section */}
      <section className="relative py-20 px-4 overflow-hidden">
        {/* Background with city skyline and gradient */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('/src/assets/city-skyline.jpg')`
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-bayview-primary via-bayview-primary/90 to-bayview-accent/80" />
        
        <div className="relative max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="font-garamond text-5xl font-bold text-white mb-4">
              FREQUENTLY ASKED QUESTIONS
            </h1>
            <div className="w-24 h-1 bg-bayview-accent mx-auto"></div>
          </div>

          <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-8 shadow-premium">
            <Accordion type="single" collapsible className="space-y-4">
              {faqs.map((faq, index) => (
                <AccordionItem 
                  key={index} 
                  value={`item-${index}`}
                  className="border border-border/20 rounded-lg px-6 bg-white/50"
                >
                  <AccordionTrigger className="text-left text-bayview-primary hover:text-bayview-accent font-semibold">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-foreground/80 leading-relaxed">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default FAQ;