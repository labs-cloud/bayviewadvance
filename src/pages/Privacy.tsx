import Header from "@/components/Header";
import Footer from "@/components/Footer";

const Privacy = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="container mx-auto px-4 py-16">
        <h1 className="text-3xl md:text-4xl font-bold mb-8">Privacy Policy</h1>

        <section className="space-y-4 mb-8">
          <h2 className="text-xl font-semibold">1. Information We Collect</h2>
          <p>When you use our site or submit forms, we may collect:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Business information (company name, industry, EIN, financial details).</li>
            <li>Personal information (name, email, phone number, address).</li>
            <li>Funding request details (loan amount, purpose of funding, supporting documents).</li>
            <li>Technical data (IP address, browser type, and usage analytics).</li>
          </ul>
        </section>
        <div className="h-px bg-border my-8" aria-hidden="true" />

        <section className="space-y-4 mb-8">
          <h2 className="text-xl font-semibold">2. How We Use Your Information</h2>
          <p>We use the information we collect to:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Process and review funding requests.</li>
            <li>Share your application details with third-party lenders and funding partners.</li>
            <li>Communicate with you regarding your request.</li>
            <li>Improve our website and services.</li>
            <li>Comply with legal or regulatory obligations.</li>
          </ul>
        </section>
        <div className="h-px bg-border my-8" aria-hidden="true" />

        <section className="space-y-4 mb-8">
          <h2 className="text-xl font-semibold">3. Sharing of Information</h2>
          <p>We may share your information with:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Lending partners to evaluate and provide funding options.</li>
            <li>Service providers who help us run our website and operations (e.g., hosting, analytics).</li>
            <li>Legal authorities if required by law or to protect our rights.</li>
          </ul>
          <p className="mt-4">We do not sell your information to third parties for marketing purposes.</p>
          <p className="mt-4 font-medium">
            Mobile/SMS opt-in data and consent are never shared. Your mobile phone number, SMS opt-in,
            and consent information will not be sold or shared with any third parties or affiliates for
            marketing or promotional purposes. We will not share this SMS consent data with third parties,
            except for the service providers we use solely to deliver the text messages you have requested.
          </p>
        </section>
        <div className="h-px bg-border my-8" aria-hidden="true" />

        <section className="space-y-4 mb-8">
          <h2 className="text-xl font-semibold">4. Mobile Messaging &amp; SMS Consent</h2>
          <p>
            If you choose to opt in, we may send you automated transactional text messages from Bayview
            Advance about your application, status updates, and appointments. SMS consent is optional and
            is never a condition of submitting an application or receiving funding.
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Message frequency varies. Message and data rates may apply.</li>
            <li>You can opt out at any time by replying STOP, or reply HELP for assistance.</li>
            <li>
              Mobile information, SMS opt-in, and consent will not be sold or shared with third parties or
              affiliates for marketing or promotional purposes.
            </li>
            <li>
              SMS opt-in data and consent will not be sold or shared with any third parties, except service
              providers used only to deliver the messages you have requested.
            </li>
          </ul>
        </section>
        <div className="h-px bg-border my-8" aria-hidden="true" />

        <section className="space-y-4 mb-8">
          <h2 className="text-xl font-semibold">5. Data Security</h2>
          <p>
            We use reasonable administrative, technical, and physical safeguards to protect your data. However, no online system is 100% secure, and we cannot guarantee complete security.
          </p>
        </section>
        <div className="h-px bg-border my-8" aria-hidden="true" />

        <section className="space-y-4 mb-8">
          <h2 className="text-xl font-semibold">6. Your Choices</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>You can contact us at any time to update or correct your information.</li>
            <li>You may opt out of receiving non-essential communications from us.</li>
            <li>If you wish to withdraw your application or have your data deleted, email us at info@bayviewadvance.com.</li>
          </ul>
        </section>
        <div className="h-px bg-border my-8" aria-hidden="true" />

        <section className="space-y-4 mb-8">
          <h2 className="text-xl font-semibold">7. Cookies & Analytics</h2>
          <p>
            Our website may use cookies and analytics tools (such as Google Analytics) to understand how visitors use our site. You can disable cookies in your browser, but some site features may not work properly.
          </p>
        </section>
        <div className="h-px bg-border my-8" aria-hidden="true" />

        <section className="space-y-4 mb-8">
          <h2 className="text-xl font-semibold">8. Third-Party Links</h2>
          <p>
            Our website may link to third-party sites. We are not responsible for the privacy practices or content of those sites.
          </p>
        </section>
        <div className="h-px bg-border my-8" aria-hidden="true" />

        <section className="space-y-4 mb-8">
          <h2 className="text-xl font-semibold">9. Children's Privacy</h2>
          <p>
            Our services are intended for adults. We do not knowingly collect personal information from anyone under 18.
          </p>
        </section>
        <div className="h-px bg-border my-8" aria-hidden="true" />

        <section className="space-y-4 mb-8">
          <h2 className="text-xl font-semibold">10. Governing Law</h2>
          <p>This Privacy Policy is governed by the laws of the State of New York.</p>
        </section>
        <div className="h-px bg-border my-8" aria-hidden="true" />

        <section className="space-y-4">
          <h2 className="text-xl font-semibold">11. Changes to Policy</h2>
          <p>
            We may update this Privacy Policy from time to time. Updates will be posted on this page with a new "Effective Date."
          </p>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Privacy;