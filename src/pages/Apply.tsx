import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";
import { REPS, findRep } from "@/data/reps";
import { Upload, FileText, X } from "lucide-react";

const US_STATES = [
  "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut",
  "Delaware", "Florida", "Georgia", "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa",
  "Kansas", "Kentucky", "Louisiana", "Maine", "Maryland", "Massachusetts", "Michigan",
  "Minnesota", "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire",
  "New Jersey", "New Mexico", "New York", "North Carolina", "North Dakota", "Ohio",
  "Oklahoma", "Oregon", "Pennsylvania", "Rhode Island", "South Carolina", "South Dakota",
  "Tennessee", "Texas", "Utah", "Vermont", "Virginia", "Washington", "West Virginia",
  "Wisconsin", "Wyoming",
];

type FormState = {
  rep: string;
  legalBusinessName: string;
  dba: string;
  businessStartDate: string;
  businessAddress: string;
  entityType: string;
  stateIncorporated: string;
  ein: string;
  industry: string;
  ownerFirstName: string;
  ownerLastName: string;
  dob: string;
  ssn: string;
  homeAddress: string;
  ownership: string;
  bankStatementMonths: string;
  signature: string;
  signatureDate: string;
};

type EncodedFile = { name: string; type: string; size: number; data: string };

const STATEMENT_COUNT = 3;

// Vercel caps a serverless request body at ~4.5MB. The three statements are
// sent base64 (~33% larger) inside one JSON body, so keep the combined payload
// comfortably under that ceiling.
const MAX_PAYLOAD_BYTES = 4 * 1024 * 1024;

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

const Apply = () => {
  const today = new Date().toISOString().slice(0, 10);
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState<FormState>({
    rep: "",
    legalBusinessName: "",
    dba: "",
    businessStartDate: "",
    businessAddress: "",
    entityType: "",
    stateIncorporated: "",
    ein: "",
    industry: "",
    ownerFirstName: "",
    ownerLastName: "",
    dob: "",
    ssn: "",
    homeAddress: "",
    ownership: "single",
    bankStatementMonths: "",
    signature: "",
    signatureDate: today,
  });
  const [statements, setStatements] = useState<(EncodedFile | null)[]>(
    Array(STATEMENT_COUNT).fill(null),
  );

  const update = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const setStatement = async (index: number, file?: File) => {
    if (!file) return;
    if (file.size > MAX_PAYLOAD_BYTES) {
      toast({
        title: "File too large",
        description: `${file.name} is over 4MB. Please upload a smaller or compressed PDF.`,
        variant: "destructive",
      });
      return;
    }
    const encoded = await readFile(file);
    setStatements((prev) => {
      const next = [...prev];
      next[index] = encoded;
      return next;
    });
  };

  const removeStatement = (index: number) =>
    setStatements((prev) => {
      const next = [...prev];
      next[index] = null;
      return next;
    });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const required: (keyof FormState)[] = [
      "legalBusinessName", "businessStartDate", "businessAddress", "entityType",
      "stateIncorporated", "ein", "industry", "ownerFirstName", "ownerLastName",
      "dob", "ssn", "homeAddress", "ownership", "bankStatementMonths",
      "signature", "signatureDate",
    ];
    const missing = required.filter((k) => !form[k]);
    if (missing.length > 0) {
      toast({
        title: "Please fill in all required fields",
        description: "All fields marked with * are required.",
        variant: "destructive",
      });
      return;
    }

    if (statements.some((file) => !file)) {
      toast({
        title: "Bank statements required",
        description: `Please attach all ${STATEMENT_COUNT} of your most recent bank statements.`,
        variant: "destructive",
      });
      return;
    }

    const rep = findRep(form.rep);
    const body = JSON.stringify({
      source: "full",
      rep: rep?.name ?? "",
      rep_email: rep?.email ?? "",
      legal_business_name: form.legalBusinessName,
      dba: form.dba,
      business_start_date: form.businessStartDate,
      business_address: form.businessAddress,
      entity_type: form.entityType,
      state_incorporated: form.stateIncorporated,
      ein: form.ein,
      industry: form.industry,
      owner_name: `${form.ownerFirstName} ${form.ownerLastName}`.trim(),
      email: "",
      date_of_birth: form.dob,
      ssn: form.ssn,
      home_address: form.homeAddress,
      ownership: form.ownership,
      bank_statement_months: form.bankStatementMonths,
      bank_statements: statements
        .filter((file): file is EncodedFile => Boolean(file))
        .map((file, i) => ({ ...file, label: `Bank Statement ${i + 1}` })),
      owner_signature: form.signature,
      signature_date: form.signatureDate,
    });

    if (body.length > MAX_PAYLOAD_BYTES) {
      toast({
        title: "Attachments too large",
        description:
          "Your bank statements are too large to submit together (over 4MB). Please upload smaller or compressed PDFs.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/send-application-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body,
      });

      if (!res.ok) {
        const text = await res.text();
        console.error("send-application-email response:", res.status, text);
        let detailError: string | undefined;
        try {
          detailError = JSON.parse(text)?.error;
        } catch {
          // non-JSON response
        }
        throw new Error(detailError ?? `HTTP ${res.status}: ${text.slice(0, 200)}`);
      }

      navigate("/thank-you");
    } catch (error) {
      console.error("Error submitting application:", error);
      toast({
        title: "Submission failed",
        description: "There was an error submitting your application. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen">
      <Header />

      <main className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-8">
              <img
                src="/lovable-uploads/new-logo.png"
                alt="Bayview Advance"
                className="h-20 w-auto mx-auto mb-4"
              />
            </div>

            <Card className="shadow-md border border-slate-200">
              <CardContent className="pt-8">
                <div className="text-center mb-8">
                  <h1 className="text-xl font-bold text-[#2c4a6e] tracking-wide">
                    BAYVIEW ADVANCE &middot; FUNDING APPLICATION
                  </h1>
                  <p className="text-sm text-slate-500 italic mt-1">Funding Made Simple</p>
                </div>

                <form className="space-y-8" onSubmit={handleSubmit}>
                  <div>
                    <Label htmlFor="rep">Rep *</Label>
                    <Select value={form.rep} onValueChange={(v) => update("rep", v)}>
                      <SelectTrigger id="rep">
                        <SelectValue placeholder="Please Select" />
                      </SelectTrigger>
                      <SelectContent>
                        {REPS.map((rep) => (
                          <SelectItem key={rep.value} value={rep.value}>
                            {rep.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-slate-500 mt-1">
                      Select your name so a copy of this application is sent to your inbox.
                    </p>
                  </div>

                  <div className="space-y-6">
                    <h3 className="text-center text-base font-semibold text-[#2c4a6e] border-b border-slate-200 pb-2">
                      Business Information:
                    </h3>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <Label htmlFor="legalBusinessName">Legal Business Name: *</Label>
                        <Input
                          id="legalBusinessName"
                          value={form.legalBusinessName}
                          onChange={(e) => update("legalBusinessName", e.target.value)}
                        />
                      </div>
                      <div>
                        <Label htmlFor="dba">DBA:</Label>
                        <Input
                          id="dba"
                          value={form.dba}
                          onChange={(e) => update("dba", e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <Label htmlFor="businessStartDate">Business Start Date: *</Label>
                        <Input
                          id="businessStartDate"
                          type="date"
                          value={form.businessStartDate}
                          onChange={(e) => update("businessStartDate", e.target.value)}
                        />
                      </div>
                      <div>
                        <Label htmlFor="businessAddress">Business Address: *</Label>
                        <Input
                          id="businessAddress"
                          value={form.businessAddress}
                          onChange={(e) => update("businessAddress", e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <Label htmlFor="entityType">Entity Type: *</Label>
                        <Select value={form.entityType} onValueChange={(v) => update("entityType", v)}>
                          <SelectTrigger id="entityType">
                            <SelectValue placeholder="Please Select" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="llc">LLC</SelectItem>
                            <SelectItem value="c-corp">C-Corporation</SelectItem>
                            <SelectItem value="s-corp">S-Corporation</SelectItem>
                            <SelectItem value="sole-proprietorship">Sole Proprietorship</SelectItem>
                            <SelectItem value="partnership">Partnership</SelectItem>
                            <SelectItem value="non-profit">Non-Profit</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="stateIncorporated">State Incorporated: *</Label>
                        <Select value={form.stateIncorporated} onValueChange={(v) => update("stateIncorporated", v)}>
                          <SelectTrigger id="stateIncorporated">
                            <SelectValue placeholder="Please Select" />
                          </SelectTrigger>
                          <SelectContent>
                            {US_STATES.map((state) => (
                              <SelectItem key={state} value={state.toLowerCase().replace(/\s+/g, "-")}>
                                {state}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <Label htmlFor="ein">Federal Tax ID (EIN #): *</Label>
                        <Input
                          id="ein"
                          placeholder="XX-XXXXXXX"
                          value={form.ein}
                          onChange={(e) => update("ein", e.target.value)}
                        />
                      </div>
                      <div>
                        <Label htmlFor="industry">Industry: *</Label>
                        <Select value={form.industry} onValueChange={(v) => update("industry", v)}>
                          <SelectTrigger id="industry">
                            <SelectValue placeholder="Please Select" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="retail">Retail</SelectItem>
                            <SelectItem value="restaurant">Restaurant/Food Service</SelectItem>
                            <SelectItem value="construction">Construction</SelectItem>
                            <SelectItem value="healthcare">Healthcare</SelectItem>
                            <SelectItem value="professional-services">Professional Services</SelectItem>
                            <SelectItem value="manufacturing">Manufacturing</SelectItem>
                            <SelectItem value="transportation">Transportation</SelectItem>
                            <SelectItem value="real-estate">Real Estate</SelectItem>
                            <SelectItem value="technology">Technology</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <h3 className="text-center text-base font-semibold text-[#2c4a6e] border-b border-slate-200 pb-2">
                      Owner Information:
                    </h3>

                    <div>
                      <Label htmlFor="ownerFirstName">Owner Name *</Label>
                      <div className="grid md:grid-cols-2 gap-6 mt-1">
                        <div>
                          <Input
                            id="ownerFirstName"
                            placeholder="First"
                            value={form.ownerFirstName}
                            onChange={(e) => update("ownerFirstName", e.target.value)}
                          />
                          <p className="text-xs text-slate-500 mt-1">First Name</p>
                        </div>
                        <div>
                          <Input
                            id="ownerLastName"
                            placeholder="Last"
                            value={form.ownerLastName}
                            onChange={(e) => update("ownerLastName", e.target.value)}
                          />
                          <p className="text-xs text-slate-500 mt-1">Last Name</p>
                        </div>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <Label htmlFor="dob">Date of Birth: *</Label>
                        <Input
                          id="dob"
                          type="date"
                          value={form.dob}
                          onChange={(e) => update("dob", e.target.value)}
                        />
                      </div>
                      <div>
                        <Label htmlFor="ssn">SSN: *</Label>
                        <Input
                          id="ssn"
                          placeholder="XXX-XX-XXXX"
                          value={form.ssn}
                          onChange={(e) => update("ssn", e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <Label htmlFor="homeAddress">Home Address *</Label>
                        <Input
                          id="homeAddress"
                          value={form.homeAddress}
                          onChange={(e) => update("homeAddress", e.target.value)}
                        />
                        <p className="text-xs text-slate-500 mt-1">Home Address</p>
                      </div>
                      <div>
                        <Label>Ownership *</Label>
                        <RadioGroup
                          className="mt-2"
                          value={form.ownership}
                          onValueChange={(v) => update("ownership", v)}
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="single" id="ownership-single" />
                            <Label htmlFor="ownership-single" className="font-normal">Single Owner</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="multiple" id="ownership-multiple" />
                            <Label htmlFor="ownership-multiple" className="font-normal">Multiple Owners</Label>
                          </div>
                        </RadioGroup>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <h3 className="text-center text-base font-semibold text-[#2c4a6e] border-b border-slate-200 pb-2">
                      Bank Statements:
                    </h3>

                    <div>
                      <Label htmlFor="bankStatementMonths">
                        Months Covered (3 most recent) *
                      </Label>
                      <Input
                        id="bankStatementMonths"
                        placeholder="e.g. April, May, June 2026"
                        value={form.bankStatementMonths}
                        onChange={(e) => update("bankStatementMonths", e.target.value)}
                      />
                      <p className="text-xs text-slate-500 mt-1">
                        List which three months the statements below cover.
                      </p>
                    </div>

                    <div>
                      <Label>Upload Your 3 Most Recent Bank Statements (PDF) *</Label>
                      <div className="grid gap-3 mt-2">
                        {statements.map((file, index) => (
                          <div key={index}>
                            {file ? (
                              <div className="flex items-center justify-between rounded-md border border-slate-200 bg-slate-50 px-3 py-2">
                                <div className="flex items-center gap-2 min-w-0">
                                  <FileText className="h-4 w-4 text-[#2c4a6e] shrink-0" />
                                  <span className="text-sm text-slate-700 truncate">
                                    {file.name}
                                  </span>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => removeStatement(index)}
                                  className="text-slate-400 hover:text-slate-600"
                                  aria-label={`Remove bank statement ${index + 1}`}
                                >
                                  <X className="h-4 w-4" />
                                </button>
                              </div>
                            ) : (
                              <label
                                htmlFor={`statement-${index}`}
                                className="flex items-center gap-2 cursor-pointer rounded-md border border-dashed border-slate-300 px-3 py-2 text-sm text-slate-500 hover:border-[#2c4a6e] hover:text-[#2c4a6e] transition-colors"
                              >
                                <Upload className="h-4 w-4 shrink-0" />
                                <span>Bank Statement {index + 1} — choose PDF</span>
                                <input
                                  id={`statement-${index}`}
                                  type="file"
                                  accept="application/pdf,.pdf"
                                  className="hidden"
                                  onChange={(e) => setStatement(index, e.target.files?.[0])}
                                />
                              </label>
                            )}
                          </div>
                        ))}
                      </div>
                      <p className="text-xs text-slate-500 mt-2">
                        PDF files only · up to 4MB each.
                      </p>
                    </div>
                  </div>

                  <div className="border-t border-slate-200 pt-6">
                    <p className="text-xs text-slate-600 leading-relaxed text-justify">
                      By signing below, each of the above-listed business and business owner(s) (individually and collectively, "you")
                      authorize Bayview Advance ("B/A") and each of its representatives, successors, assigns and designees
                      ("Recipients") that may be involved with or require commercial loans having daily repayment features or
                      Merchant Cash Advance transactions, including without limitation the application(s) herein (collectively,
                      "Transactions") to obtain consumer or personal, business and investigative reports and other information about
                      you, including credit card processor statements and bank statements; bureau or non-consumer reporting
                      agencies; and/or third parties. Equifax, Experian and/or from other credit bureaus, banks, creditors and other
                      third parties. You also authorize B/A to transmit this application form, along with any of the foregoing
                      information obtained in connection with this application, to any or all of the Recipients for the foregoing
                      purposes. You also consent to the release, by any creditor or financial institution, of any information relating
                      to any of you, to B/A and to each of the Recipients, on its own behalf.
                    </p>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="signature">Owner Signature: *</Label>
                      <Input
                        id="signature"
                        placeholder="Type full legal name"
                        value={form.signature}
                        onChange={(e) => update("signature", e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="signatureDate">Today's Date: *</Label>
                      <Input
                        id="signatureDate"
                        type="date"
                        value={form.signatureDate}
                        onChange={(e) => update("signatureDate", e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="flex justify-center gap-3 pt-4">
                    <Button
                      type="submit"
                      className="bg-[#2c4a6e] hover:bg-[#1e3a5c] text-white font-semibold px-8"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Submitting..." : "Submit Application"}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Apply;
