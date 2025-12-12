import Header from "@/components/Header";
import Footer from "@/components/Footer";

const Terms = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="container mx-auto px-4 py-16">
        <h1 className="text-3xl md:text-4xl font-bold mb-8">Terms & Conditions</h1>

        <section className="space-y-4 mb-8">
          <h2 className="text-xl font-semibold">1. About Our Services</h2>
          <p>
            Bayview Advance is a business funding brokerage. We help businesses explore financing options such as loans, credit lines, and working capital through third-party lenders.
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>We do not issue loans ourselves.</li>
            <li>We do not guarantee approval, funding, or loan terms.</li>
          </ul>
        </section>
        <div className="h-px bg-border my-8" aria-hidden="true" />

        <section className="space-y-4 mb-8">
          <h2 className="text-xl font-semibold">2. Eligibility</h2>
          <p>To use this website or apply for funding through us, you must:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Be at least 18 years old,</li>
            <li>Be legally authorized to act on behalf of your business, and</li>
            <li>Provide truthful and complete information in all submissions.</li>
          </ul>
        </section>
        <div className="h-px bg-border my-8" aria-hidden="true" />

        <section className="space-y-4 mb-8">
          <h2 className="text-xl font-semibold">3. No Financial Advice</h2>
          <p>
            The content on this site is for informational purposes only. Bayview Advance does not provide financial, legal, or tax advice. You should consult your own advisors before making financial decisions.
          </p>
        </section>
        <div className="h-px bg-border my-8" aria-hidden="true" />

        <section className="space-y-4 mb-8">
          <h2 className="text-xl font-semibold">4. Information You Provide</h2>
          <p>By submitting forms or applications, you agree to:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Provide accurate and current information,</li>
            <li>Allow Bayview Advance to share your information with lending partners for funding purposes, and</li>
            <li>Accept that any loan agreements are strictly between you and the lender.</li>
          </ul>
        </section>
        <div className="h-px bg-border my-8" aria-hidden="true" />

        <section className="space-y-4 mb-8">
          <h2 className="text-xl font-semibold">5. Third-Party Lenders</h2>
          <p>Bayview Advance is not responsible for:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Decisions made by lenders,</li>
            <li>The accuracy of information provided by third parties, or</li>
            <li>The terms of any funding agreements.</li>
          </ul>
        </section>
        <div className="h-px bg-border my-8" aria-hidden="true" />

        <section className="space-y-4 mb-8">
          <h2 className="text-xl font-semibold">6. No Guarantee of Results</h2>
          <p>Submitting an application does not guarantee funding, loan approval, or specific terms.</p>
        </section>
        <div className="h-px bg-border my-8" aria-hidden="true" />

        <section className="space-y-4 mb-8">
          <h2 className="text-xl font-semibold">7. Limitation of Liability</h2>
          <p>To the fullest extent permitted by law, Bayview Advance is not liable for any damages or losses that result from:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Using this website,</li>
            <li>Relying on its content, or</li>
            <li>Interactions with lenders or third parties.</li>
          </ul>
        </section>
        <div className="h-px bg-border my-8" aria-hidden="true" />

        <section className="space-y-4 mb-8">
          <h2 className="text-xl font-semibold">8. Governing Law</h2>
          <p>These Terms are governed by the laws of the State of New York. Any disputes must be handled in New York courts.</p>
        </section>
        <div className="h-px bg-border my-8" aria-hidden="true" />

        <section className="space-y-4">
          <h2 className="text-xl font-semibold">9. Changes to Terms</h2>
          <p>We may update these Terms at any time. Updated versions will be posted on this page. Continued use of the website means you accept the updated Terms.</p>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Terms;