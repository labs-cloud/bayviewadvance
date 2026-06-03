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
type UploadKey = "w9" | "id" | "voidedCheck" | "brokerAgreement" | "other";

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
  brokerAgreement: "Broker agreement or license",
  other: "Other supporting file",
};

const ndaSections = [
  {
    title: "Purpose",
    body: "This Agreement protects Bayview Advance confidential information, proprietary systems, client and referral relationships, and goodwill. Broker acknowledges they are an independent contractor and not an employee, partner, or agent of the Company.",
  },
  {
    title: "Confidential Information",
    body: "Broker will have access to confidential and proprietary information, including client and referral lists, leads, pricing and commission structures, marketing materials, scripts, training systems, business strategies, financial data, and technology platforms. Broker agrees not to disclose, copy, retain, or use that information outside Company business.",
  },
  {
    title: "Non-Solicitation",
    body: "During the Agreement and for twelve months after termination, Broker will not directly or indirectly solicit Company clients, prospective clients, referral sources, employees, contractors, or vendors in a way that competes with or harms the Company relationship.",
  },
  {
    title: "Non-Competition",
    body: "For twelve months after termination, Broker will not, without prior written consent, engage in substantially similar competitive services in the merchant cash-advance or alternative funding industry where Broker performed services for the Company, except as allowed in the Agreement.",
  },
  {
    title: "Return of Materials, Remedies, Law",
    body: "Broker must return or delete Company property and materials at termination. Bayview Advance may seek injunctive relief for breach. The Agreement is governed by New York law, with venue in Kings County, New York.",
  },
  {
    title: "Acknowledgment",
    body: "Broker acknowledges the restrictions are reasonable and necessary to protect Bayview Advance legitimate business interests and that Broker has had the opportunity to review the Agreement and seek independent legal counsel before signing.",
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

const dataUriToBase64 = (dataUri: string) => dataUri.split(",")[1] || dataUri;

export default function BrokerOnboarding() {
  const [step, setStep] = useState<Step>(1);
  const [form, setForm] = useState<FormState>(initialForm);
  const [files, setFiles] = useState<Record<UploadKey, EncodedFile | null>>({
    w9: null,
    id: null,
    voidedCheck: null,
    brokerAgreement: null,
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
    if (file.size > 15 * 1024 * 1024) {
      setErrors((prev) => ({ ...prev, [key]: "File must be 15MB or less" }));
      return;
    }
    const encoded = await readFile(file);
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

    try {
      const res = await fetch("/api/brokers/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          signature: {
            filename: "broker-signature.png",
            contentType: "image/png",
            content: dataUriToBase64(form.signature),
          },
          files,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || "Submission failed");
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
            <a className="broker-download" href="/bayview-nda-non-compete.docx" download>
              <FileText size={16} /> Download full NDA document
            </a>
            <div className="broker-agreement">
              <h2>Non-Disclosure, Non-Compete & Non-Solicitation Agreement</h2>
              {ndaSections.map((section) => (
                <article key={section.title}>
                  <h3>{section.title}</h3>
                  <p>{section.body}</p>
                </article>
              ))}
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
