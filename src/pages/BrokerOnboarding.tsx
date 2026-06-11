import { useMemo, useRef, useState } from "react";
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  FileText,
  ShieldCheck,
  Upload,
  UserRound,
  WalletCards,
  X,
} from "lucide-react";
import "./BrokerOnboarding.css";

type Step = 1 | 2 | 3 | 4;
type Status = "idle" | "submitting" | "success" | "error";
type UploadKey = "w9" | "id" | "voidedCheck" | "other";

type EncodedFile = {
  name: string;
  type: string;
  size: number;
  data: string;
};

type FormState = {
  firstName: string;
  lastName: string;
  companyName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  taxClassification: string;
  taxIdLast4: string;
  payoutMethod: string;
  bankName: string;
  accountName: string;
  routingNumber: string;
  accountLast4: string;
  commissionEmail: string;
  referralSource: string;
  notes: string;
  signatureName: string;
  signature: string;
  agreed: boolean;
};

const initialForm: FormState = {
  firstName: "",
  lastName: "",
  companyName: "",
  email: "",
  phone: "",
  address: "",
  city: "",
  state: "",
  zip: "",
  taxClassification: "",
  taxIdLast4: "",
  payoutMethod: "ACH",
  bankName: "",
  accountName: "",
  routingNumber: "",
  accountLast4: "",
  commissionEmail: "",
  referralSource: "",
  notes: "",
  signatureName: "",
  signature: "",
  agreed: false,
};

const uploadLabels: Record<UploadKey, string> = {
  w9: "W-9 / 1099 tax form",
  id: "Government ID",
  voidedCheck: "Voided check or bank letter",
  other: "Other supporting file",
};

const ndaSections: { title: string; body: string[] }[] = [
  {
    title: "Purpose",
    body: [
      "The purpose of this Agreement is to protect the Company's legitimate business interests, including its confidential information, proprietary systems, client and referral relationships, and goodwill developed through the Company's investment of time and resources. For purposes of this Agreement, references to the Company shall include its affiliates, subsidiaries, officers, and assigns, and the term Broker shall include any entity or individual acting on behalf of the Broker.",
      "This Agreement sets forth the Broker's obligations concerning the protection of such interests, including duties of confidentiality, non-solicitation, and limited non-competition, each of which is intended to be reasonable and necessary for the fair protection of the Company's business. The parties acknowledge that the Broker is an independent contractor and not an employee, partner, or agent of the Company, and nothing in this Agreement shall be construed to create any employment relationship.",
    ],
  },
  {
    title: "Confidential Information",
    body: [
      "Broker acknowledges that, during the course of their engagement, they will have access to the Company's confidential and proprietary information, including but not limited to client and referral lists, leads, pricing and commission structures, marketing materials, scripts, training systems, business strategies, financial data, and technology platforms (collectively, Confidential Information). Broker agrees that they shall not, during or after their engagement, directly or indirectly disclose, copy, retain, or use any Confidential Information for any purpose other than in furtherance of the Company's business. The obligations under this section shall not apply to information that becomes public through no fault of the Broker.",
    ],
  },
  {
    title: "Non-Solicitation",
    body: [
      "During the term of this Agreement and for a period of twelve (12) months following the termination of Broker's engagement, Broker shall not, directly or indirectly, solicit or attempt to solicit any client, prospective client, or referral source with whom the Broker had material contact through the Company, for the purpose of providing products or services that compete with those offered by the Company. Broker shall likewise not solicit or induce any employee, contractor, or vendor of the Company to terminate or reduce their relationship with the Company.",
    ],
  },
  {
    title: "Non-Competition",
    body: [
      "For a period of twelve (12) months following the termination of Broker's engagement, Broker shall not, without the Company's prior written consent, directly or indirectly engage in, own, manage, operate, or provide services to any business that competes with the Company in the merchant cash-advance or alternative funding industry within the geographic area in which the Broker performed services for the Company.",
      "This restriction applies only to activities that are the same as or substantially similar to those the Broker performed for the Company and only to the extent necessary to protect the Company's confidential information and goodwill. Nothing in this Section shall prevent the Broker from earning a livelihood in a non-competitive capacity or from owning stock, shares, or equity of any publicly traded company.",
    ],
  },
  {
    title: "Return of Materials",
    body: [
      "Upon termination of Broker's engagement for any reason, Broker shall immediately return to the Company all property, records, and materials belonging to the Company, whether in physical or electronic form, including but not limited to client and lead information, data, scripts, marketing materials, access credentials, and any copies thereof. Broker further agrees to permanently delete all such materials from any personal devices, accounts, or storage systems and, upon request, certify in writing that all Company materials have been returned or deleted.",
    ],
  },
  {
    title: "Remedies",
    body: [
      "Broker acknowledges that a breach or threatened breach of this Agreement may cause the Company irreparable harm for which monetary damages would be inadequate. Accordingly, the Company shall be entitled, in addition to any other remedies available at law or in equity, to seek temporary, preliminary, and permanent injunctive relief to prevent or restrain any such breach, without the necessity of posting a bond. Nothing in this Agreement shall limit the Company's right to pursue monetary damages or any other relief as may be appropriate.",
    ],
  },
  {
    title: "Governing Law",
    body: [
      "This Agreement shall be governed by, and construed in accordance with, the laws of the State of New York, without regard to its conflict of laws principles. Any dispute arising out of or relating to this Agreement shall be brought exclusively in the state or federal courts located in Kings County (Brooklyn), New York, and each party hereby consents to the personal jurisdiction and venue of such courts.",
    ],
  },
  {
    title: "Entire Agreement",
    body: [
      "This Agreement constitutes the entire understanding between the parties with respect to the subject matter hereof and supersedes all prior and contemporaneous agreements, representations, or understandings, whether oral or written. No modification or waiver of any provision of this Agreement shall be effective unless in writing and signed by both parties.",
    ],
  },
  {
    title: "Miscellaneous",
    body: [
      "This Agreement may be executed in one or more counterparts, each of which shall be deemed an original and all of which together shall constitute one and the same instrument. Signatures delivered electronically, including via DocuSign or other recognized electronic signature platform, or by scanned copy, shall be deemed to have the same force and effect as original signatures.",
      "No presumption or inference shall be drawn against either party based on the drafting of this Agreement. Each party acknowledges that they have had the opportunity to review this Agreement and to seek the advice of independent legal counsel before signing. If any provision of this Agreement is held to be invalid or unenforceable, such provision shall be limited or modified to the minimum extent necessary to make it enforceable, and the remaining provisions shall remain in full force and effect.",
    ],
  },
  {
    title: "Acknowledgment",
    body: [
      "Broker acknowledges that the restrictions in this Agreement are reasonable and necessary to protect the Company's legitimate business interests, and that Broker has received adequate consideration in exchange for entering into this Agreement.",
    ],
  },
  {
    title: "Commission Structure",
    body: [
      "As consideration for Broker's services under this Agreement, the Company shall pay Broker commissions on funded deals in accordance with the following tiered schedule, based on cumulative funded volume during the term of Broker's engagement:",
      "(a) Base Rate - 25% Commission: Broker shall earn a commission rate of twenty-five percent (25%) on all funded deals from the commencement of engagement.",
      "(b) Tier 2 - 30% Commission: Upon Broker's cumulative funded volume reaching two hundred fifty thousand dollars ($250,000), the commission rate shall increase to thirty percent (30%) on all subsequent funded deals.",
      "(c) Tier 3 - 35% Commission: Upon Broker's cumulative funded volume reaching four hundred fifty thousand dollars ($450,000), the commission rate shall further increase to thirty-five percent (35%) on all subsequent funded deals.",
      "Commission thresholds are calculated on a cumulative basis. The Company reserves the right to adjust the commission schedule upon thirty (30) days' written notice to Broker, provided that no adjustment shall reduce commissions already earned on deals funded prior to such notice.",
      "(d) Chargeback Upon Default: In the event that a merchant defaults on a funded deal and fails to satisfy its payment obligations to the Company, the Company shall have the right to recover (chargeback) all or a proportionate portion of the commission previously paid to Broker in connection with that deal. The chargeback amount shall be calculated based on the outstanding unpaid balance at the time of default. The Company may, at its sole discretion, deduct any such chargeback amount from future commissions owed to Broker or demand repayment directly. Broker acknowledges and agrees that commissions are earned only on successfully collected deals, and that this chargeback right is a material term of the compensation arrangement.",
      "(e) Commission Payment Schedule: Commissions shall be paid on a weekly basis, every Thursday, for all deals funded during the preceding calendar week (Monday through Sunday). Payment shall be made via the Company's standard disbursement method. The Company reserves the right to withhold payment on any deal that is under review, subject to a pending chargeback, or otherwise disputed, pending resolution.",
    ],
  },
  {
    title: "Forfeiture and Waiver of Claims Upon Breach",
    body: [
      "In the event that Broker breaches any provision of this Agreement, including but not limited to the confidentiality, non-solicitation, or non-competition obligations set forth herein, Broker shall, upon the Company's determination of such breach: (i) immediately forfeit any and all unpaid commissions, compensation, or monies of any kind then owed or accrued by the Company to Broker, and Broker shall have no right to receive or collect any such amounts; and (ii) irrevocably waive, release, and relinquish any and all claims, rights, causes of action, demands, or legal proceedings of any kind against Bayview Advance, its affiliates, officers, directors, employees, and assigns, whether known or unknown, arising out of or related to Broker's engagement, this Agreement, or any compensation or commission allegedly owed.",
      "Broker acknowledges that this forfeiture and waiver constitutes reasonable and agreed-upon liquidated damages in light of the difficulty of calculating the harm caused by a breach, and not a penalty. By signing this Agreement, Broker expressly agrees that, upon breach, Broker shall not initiate, pursue, or participate in any lawsuit, arbitration, administrative proceeding, or other legal action against the Company related to any withheld or forfeited compensation.",
    ],
  },
];

const readFile = (file: File): Promise<EncodedFile> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () =>
      resolve({
        name: file.name,
        type: file.type || "application/octet-stream",
        size: file.size,
        data: String(reader.result || ""),
      });
    reader.onerror = () => reject(new Error(`Could not read ${file.name}`));
    reader.readAsDataURL(file);
  });

// Vercel caps a serverless request body at ~4.5MB. Documents are sent base64
// (≈33% larger) inside one JSON body, so keep the combined payload under this.
const MAX_PAYLOAD_BYTES = 4 * 1024 * 1024;

// Downscale/re-encode photos before upload so a phone snapshot of an ID or
// check doesn't blow past the request-size limit. Non-images pass through.
const compressImage = (file: File): Promise<File> =>
  new Promise((resolve) => {
    if (!file.type.startsWith("image/")) {
      resolve(file);
      return;
    }
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      const scale = Math.min(1, 1600 / Math.max(img.width, img.height));
      const canvas = document.createElement("canvas");
      canvas.width = Math.round(img.width * scale);
      canvas.height = Math.round(img.height * scale);
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        resolve(file);
        return;
      }
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      canvas.toBlob(
        (blob) => {
          if (!blob || blob.size >= file.size) {
            resolve(file);
            return;
          }
          const name = file.name.replace(/\.[^.]+$/, "") + ".jpg";
          resolve(new File([blob], name, { type: "image/jpeg" }));
        },
        "image/jpeg",
        0.72,
      );
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      resolve(file);
    };
    img.src = url;
  });

const dataUriToBase64 = (dataUri: string) => dataUri.split(",")[1] || dataUri;

export default function BrokerOnboarding() {
  const [step, setStep] = useState<Step>(1);
  const [form, setForm] = useState<FormState>(initialForm);
  const [files, setFiles] = useState<Record<UploadKey, EncodedFile | null>>({
    w9: null,
    id: null,
    voidedCheck: null,
    other: null,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<Status>("idle");
  const [submitMessage, setSubmitMessage] = useState("");

  const steps = useMemo(
    () => [
      { number: 1 as Step, label: "Information", icon: UserRound },
      { number: 2 as Step, label: "Payout", icon: WalletCards },
      { number: 3 as Step, label: "Documents", icon: Upload },
      { number: 4 as Step, label: "NDA", icon: ShieldCheck },
    ],
    [],
  );

  const setField = (field: keyof FormState, value: string | boolean) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => {
      const next = { ...prev };
      delete next[field];
      return next;
    });
  };

  const validateStep = (targetStep: Step = step) => {
    const nextErrors: Record<string, string> = {};
    const required = (key: keyof FormState, label: string) => {
      if (!String(form[key] ?? "").trim()) nextErrors[key] = `${label} is required`;
    };

    if (targetStep === 1) {
      required("firstName", "First name");
      required("lastName", "Last name");
      required("email", "Email");
      required("phone", "Phone");
      if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
        nextErrors.email = "Enter a valid email address";
      }
    }

    if (targetStep === 2) {
      required("payoutMethod", "Payout method");
      required("bankName", "Bank name");
      required("accountName", "Account name");
      required("routingNumber", "Routing number");
      required("accountLast4", "Account last 4");
      if (form.routingNumber && !/^\d{9}$/.test(form.routingNumber)) {
        nextErrors.routingNumber = "Routing number must be 9 digits";
      }
      if (form.accountLast4 && !/^\d{4}$/.test(form.accountLast4)) {
        nextErrors.accountLast4 = "Use the last 4 digits only";
      }
    }

    if (targetStep === 3) {
      if (!files.w9) nextErrors.w9 = "W-9 / 1099 tax form is required";
      if (!files.id) nextErrors.id = "Government ID is required";
      if (!files.voidedCheck) nextErrors.voidedCheck = "Bank verification is required";
    }

    if (targetStep === 4) {
      required("signatureName", "Typed legal name");
      if (!form.signature) nextErrors.signature = "Signature is required";
      if (!form.agreed) nextErrors.agreed = "You must acknowledge the agreement";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const nextStep = () => {
    if (!validateStep()) return;
    setStep((prev) => Math.min(prev + 1, 4) as Step);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const prevStep = () => {
    setStep((prev) => Math.max(prev - 1, 1) as Step);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const onFileChange = async (key: UploadKey, file?: File) => {
    if (!file) return;
    const prepared = await compressImage(file);
    if (prepared.size > MAX_PAYLOAD_BYTES) {
      setErrors((prev) => ({
        ...prev,
        [key]: "File is too large (over 4MB). Upload a photo instead of a scan, or compress the PDF.",
      }));
      return;
    }
    const encoded = await readFile(prepared);
    setFiles((prev) => ({ ...prev, [key]: encoded }));
    setErrors((prev) => {
      const next = { ...prev };
      delete next[key];
      return next;
    });
  };

  const submit = async () => {
    if (!validateStep(4)) return;
    setStatus("submitting");
    setSubmitMessage("");

    const payload = JSON.stringify({
      ...form,
      signature: {
        filename: "broker-signature.png",
        contentType: "image/png",
        content: dataUriToBase64(form.signature),
      },
      files,
    });

    if (payload.length > MAX_PAYLOAD_BYTES) {
      setStatus("error");
      setSubmitMessage(
        "Your documents are too large to submit together (over 4MB). Please re-upload smaller or compressed files and try again.",
      );
      return;
    }

    try {
      const res = await fetch("/api/brokers/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: payload,
      });

      if (!res.ok) {
        if (res.status === 413) {
          throw new Error(
            "Your documents are too large to submit (over 4MB). Please upload smaller or compressed files and try again.",
          );
        }
        let message = `Submission failed (${res.status})`;
        try {
          const data = await res.json();
          message = data.error || message;
        } catch {
          // Non-JSON error body (e.g. a platform error page) — keep the generic message.
        }
        throw new Error(message);
      }

      const data = await res.json();
      if (!data.success) throw new Error(data.error || "Submission failed");
      setStatus("success");
    } catch (err) {
      setStatus("error");
      setSubmitMessage(err instanceof Error ? err.message : "Submission failed. Please try again.");
    }
  };

  if (status === "success") {
    return (
      <main className="broker-shell">
        <section className="broker-success-card">
          <img src="/lovable-uploads/new-logo.png" alt="Bayview Advance" className="broker-logo" />
          <CheckCircle2 className="broker-success-icon" size={60} />
          <h1>Onboarding submitted</h1>
          <p>
            Your broker packet and signed NDA were sent to Bayview Advance. The team will review
            everything and follow up if anything else is needed.
          </p>
        </section>
      </main>
    );
  }

  return (
    <main className="broker-shell">
      <section className="broker-header">
        <img src="/lovable-uploads/new-logo.png" alt="Bayview Advance" className="broker-logo" />
        <div>
          <p className="broker-kicker">Broker Operations</p>
          <h1>Broker Onboarding</h1>
          <p>Complete your profile, payout setup, tax documents, and NDA signature.</p>
        </div>
      </section>

      <section className="broker-progress" aria-label="Onboarding progress">
        {steps.map(({ number, label, icon: Icon }) => (
          <div
            key={number}
            className={`broker-progress-item ${step === number ? "is-active" : ""} ${
              step > number ? "is-done" : ""
            }`}
          >
            <span>{step > number ? <Check size={16} /> : <Icon size={16} />}</span>
            {label}
          </div>
        ))}
      </section>

      <section className="broker-card">
        {step === 1 && (
          <div className="broker-grid">
            <Field label="First name" value={form.firstName} onChange={(value) => setField("firstName", value)} error={errors.firstName} required />
            <Field label="Last name" value={form.lastName} onChange={(value) => setField("lastName", value)} error={errors.lastName} required />
            <Field label="Company / DBA" value={form.companyName} onChange={(value) => setField("companyName", value)} />
            <Field label="Email" type="email" value={form.email} onChange={(value) => setField("email", value)} error={errors.email} required />
            <Field label="Phone" type="tel" value={form.phone} onChange={(value) => setField("phone", value)} error={errors.phone} required />
            <Field label="Referral source" value={form.referralSource} onChange={(value) => setField("referralSource", value)} />
            <Field label="Street address" value={form.address} onChange={(value) => setField("address", value)} wide />
            <Field label="City" value={form.city} onChange={(value) => setField("city", value)} />
            <Field label="State" value={form.state} onChange={(value) => setField("state", value)} />
            <Field label="ZIP" value={form.zip} onChange={(value) => setField("zip", value)} />
          </div>
        )}

        {step === 2 && (
          <div className="broker-grid">
            <SelectField label="Tax classification" value={form.taxClassification} onChange={(value) => setField("taxClassification", value)} options={["Individual / Sole proprietor", "LLC", "S-Corp", "C-Corp", "Partnership", "Other"]} />
            <Field label="Tax ID last 4" value={form.taxIdLast4} onChange={(value) => setField("taxIdLast4", value.replace(/\D/g, "").slice(0, 4))} />
            <SelectField label="Payout method" value={form.payoutMethod} onChange={(value) => setField("payoutMethod", value)} options={["ACH", "Wire", "Check"]} error={errors.payoutMethod} required />
            <Field label="Bank name" value={form.bankName} onChange={(value) => setField("bankName", value)} error={errors.bankName} required />
            <Field label="Account holder name" value={form.accountName} onChange={(value) => setField("accountName", value)} error={errors.accountName} required />
            <Field label="Routing number" value={form.routingNumber} onChange={(value) => setField("routingNumber", value.replace(/\D/g, "").slice(0, 9))} error={errors.routingNumber} required />
            <Field label="Account last 4" value={form.accountLast4} onChange={(value) => setField("accountLast4", value.replace(/\D/g, "").slice(0, 4))} error={errors.accountLast4} required />
            <Field label="Commission notice email" type="email" value={form.commissionEmail} onChange={(value) => setField("commissionEmail", value)} />
          </div>
        )}

        {step === 3 && (
          <div className="broker-stack">
            {(Object.keys(uploadLabels) as UploadKey[]).map((key) => (
              <FileDrop
                key={key}
                label={uploadLabels[key]}
                file={files[key]}
                required={key === "w9" || key === "voidedCheck"}
                error={errors[key]}
                onChange={(file) => onFileChange(key, file)}
                onRemove={() => setFiles((prev) => ({ ...prev, [key]: null }))}
              />
            ))}
            <label className="broker-field broker-field-wide">
              <span>Notes</span>
              <textarea
                value={form.notes}
                onChange={(event) => setField("notes", event.target.value)}
                placeholder="Anything Bayview should know before setting up your broker account."
              />
            </label>
          </div>
        )}

        {step === 4 && (
          <div className="broker-stack">
            <div className="broker-notice">
              <FileText size={18} />
              <span>
                Review the NDA and non-compete summary below before signing. Your submitted
                signature and timestamp will be included in the backend email.
              </span>
            </div>
            <a className="broker-download" href="/bayview-nda-non-compete.pdf" download>
              <FileText size={16} /> Download full NDA document
            </a>
            <div className="broker-agreement">
              <h2>Non-Disclosure, Non-Compete & Non-Solicitation Agreement</h2>
              <p className="broker-agreement-intro">
                This Agreement is made and entered into on the date of electronic signature by and
                between Bayview Advance and the undersigned broker.
              </p>
              {ndaSections.map((section) => (
                <article key={section.title}>
                  <h3>{section.title}</h3>
                  {section.body.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </article>
              ))}
              <div className="broker-agreement-signature-preview">
                <strong>Broker:</strong> {form.signatureName || "Pending signature"}
                <br />
                <strong>Date:</strong> Completed when submitted
              </div>
            </div>
            <Field label="Typed legal name" value={form.signatureName} onChange={(value) => setField("signatureName", value)} error={errors.signatureName} required wide />
            <SignaturePad value={form.signature} onChange={(value) => setField("signature", value)} error={errors.signature} />
            <label className="broker-checkbox">
              <input
                type="checkbox"
                checked={form.agreed}
                onChange={(event) => setField("agreed", event.target.checked)}
              />
              <span>I have reviewed and agree to the Bayview Advance NDA, non-compete, and non-solicitation terms.</span>
            </label>
            {errors.agreed && <p className="broker-error">{errors.agreed}</p>}
          </div>
        )}

        {status === "error" && (
          <div className="broker-error-banner">
            <AlertCircle size={18} />
            {submitMessage}
          </div>
        )}

        <div className="broker-actions">
          {step > 1 ? (
            <button type="button" className="broker-button broker-button-secondary" onClick={prevStep}>
              <ArrowLeft size={16} /> Back
            </button>
          ) : (
            <span />
          )}
          {step < 4 ? (
            <button type="button" className="broker-button broker-button-primary" onClick={nextStep}>
              Continue <ArrowRight size={16} />
            </button>
          ) : (
            <button
              type="button"
              className="broker-button broker-button-primary"
              onClick={submit}
              disabled={status === "submitting"}
            >
              {status === "submitting" ? "Submitting..." : "Submit broker packet"}
            </button>
          )}
        </div>
      </section>
    </main>
  );
}

function Field({
  label,
  value,
  onChange,
  error,
  type = "text",
  required = false,
  wide = false,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  type?: string;
  required?: boolean;
  wide?: boolean;
}) {
  return (
    <label className={`broker-field ${wide ? "broker-field-wide" : ""}`}>
      <span>
        {label} {required && <b>*</b>}
      </span>
      <input className={error ? "has-error" : ""} type={type} value={value} onChange={(event) => onChange(event.target.value)} />
      {error && <small>{error}</small>}
    </label>
  );
}

function SelectField({
  label,
  value,
  onChange,
  options,
  error,
  required = false,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
  error?: string;
  required?: boolean;
}) {
  return (
    <label className="broker-field">
      <span>
        {label} {required && <b>*</b>}
      </span>
      <select className={error ? "has-error" : ""} value={value} onChange={(event) => onChange(event.target.value)}>
        <option value="">Select...</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      {error && <small>{error}</small>}
    </label>
  );
}

function FileDrop({
  label,
  file,
  required,
  error,
  onChange,
  onRemove,
}: {
  label: string;
  file: EncodedFile | null;
  required?: boolean;
  error?: string;
  onChange: (file: File) => void;
  onRemove: () => void;
}) {
  return (
    <div className={`broker-file-row ${error ? "has-error" : ""}`}>
      <div className="broker-file-info">
        <FileText size={20} />
        <div>
          <strong>
            {label} {required && <b>*</b>}
          </strong>
          <span>{file ? `${file.name} (${Math.ceil(file.size / 1024)} KB)` : "PDF, image, or document up to 15MB"}</span>
        </div>
      </div>
      <div className="broker-file-actions">
        <label className="broker-upload-button">
          <Upload size={15} /> Upload
          <input
            type="file"
            accept=".pdf,.png,.jpg,.jpeg,.doc,.docx"
            onChange={(event) => event.target.files?.[0] && onChange(event.target.files[0])}
          />
        </label>
        {file && (
          <button type="button" onClick={onRemove} aria-label={`Remove ${label}`}>
            <X size={16} />
          </button>
        )}
      </div>
      {error && <small>{error}</small>}
    </div>
  );
}

function SignaturePad({
  value,
  onChange,
  error,
}: {
  value: string;
  onChange: (value: string) => void;
  error?: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [drawing, setDrawing] = useState(false);
  const [signed, setSigned] = useState(Boolean(value));

  const coordinates = (event: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const point = "touches" in event ? event.touches[0] : event;
    return {
      x: (point.clientX - rect.left) * (canvas.width / rect.width),
      y: (point.clientY - rect.top) * (canvas.height / rect.height),
    };
  };

  const start = (event: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    event.preventDefault();
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    if (!signed) {
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
    const { x, y } = coordinates(event);
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.strokeStyle = "#111827";
    ctx.lineWidth = 2.4;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    setDrawing(true);
  };

  const move = (event: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!drawing) return;
    event.preventDefault();
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;
    const { x, y } = coordinates(event);
    ctx.lineTo(x, y);
    ctx.stroke();
    setSigned(true);
  };

  const stop = () => {
    if (!drawing) return;
    setDrawing(false);
    if (canvasRef.current && signed) onChange(canvasRef.current.toDataURL("image/png"));
  };

  const clear = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    setSigned(false);
    onChange("");
  };

  return (
    <div className="broker-signature">
      <label>
        Broker signature <b>*</b>
      </label>
      <div className={`broker-signature-box ${error ? "has-error" : ""}`}>
        <canvas
          ref={canvasRef}
          width={900}
          height={220}
          onMouseDown={start}
          onMouseMove={move}
          onMouseUp={stop}
          onMouseLeave={stop}
          onTouchStart={start}
          onTouchMove={move}
          onTouchEnd={stop}
        />
        {!signed && <span>Sign here</span>}
      </div>
      <div className="broker-signature-actions">
        <button type="button" onClick={clear} disabled={!signed}>
          Clear
        </button>
        {signed && <em>Signed</em>}
      </div>
      {error && <small>{error}</small>}
    </div>
  );
}
