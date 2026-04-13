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

      <section className="py-20 px-4 bg-[#2c4a6e]">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 font-montserrat">
              Frequently Asked Questions
            </h1>
            <div className="w-16 h-1 bg-[#5b8fb9] mx-auto"></div>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-lg">
            <Accordion type="single" collapsible className="space-y-4">
              {faqs.map((faq, index) => (
                <AccordionItem
                  key={index}
                  value={`item-${index}`}
                  className="border border-slate-200 rounded-lg px-6 bg-gray-50"
                >
                  <AccordionTrigger className="text-left text-[#2c4a6e] hover:text-[#5b8fb9] font-semibold">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-slate-600 leading-relaxed">
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
