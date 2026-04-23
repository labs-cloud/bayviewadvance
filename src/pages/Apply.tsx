import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

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

const Apply = () => {
  const today = new Date().toISOString().slice(0, 10);

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

                <form className="space-y-8">
                  <div>
                    <Label htmlFor="rep">Rep *</Label>
                    <Select>
                      <SelectTrigger id="rep">
                        <SelectValue placeholder="Please Select" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">Not Assigned</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-6">
                    <h3 className="text-center text-base font-semibold text-[#2c4a6e] border-b border-slate-200 pb-2">
                      Business Information:
                    </h3>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <Label htmlFor="legalBusinessName">Legal Business Name: *</Label>
                        <Input id="legalBusinessName" />
                      </div>
                      <div>
                        <Label htmlFor="dba">DBA:</Label>
                        <Input id="dba" />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <Label htmlFor="businessStartDate">Business Start Date: *</Label>
                        <Input id="businessStartDate" type="date" placeholder="MM-DD-YYYY" />
                      </div>
                      <div>
                        <Label htmlFor="businessAddress">Business Address: *</Label>
                        <Input id="businessAddress" />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <Label htmlFor="entityType">Entity Type: *</Label>
                        <Select>
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
                        <Select>
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
                        <Input id="ein" placeholder="XX-XXXXXXX" />
                      </div>
                      <div>
                        <Label htmlFor="industry">Industry: *</Label>
                        <Select>
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
                          <Input id="ownerFirstName" placeholder="First" />
                          <p className="text-xs text-slate-500 mt-1">First Name</p>
                        </div>
                        <div>
                          <Input id="ownerLastName" placeholder="Last" />
                          <p className="text-xs text-slate-500 mt-1">Last Name</p>
                        </div>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <Label htmlFor="dob">Date of Birth: *</Label>
                        <Input id="dob" type="date" placeholder="MM-DD-YYYY" />
                      </div>
                      <div>
                        <Label htmlFor="ssn">SSN: *</Label>
                        <Input id="ssn" placeholder="XXX-XX-XXXX" />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <Label htmlFor="homeAddress">Home Address *</Label>
                        <Input id="homeAddress" />
                        <p className="text-xs text-slate-500 mt-1">Home Address</p>
                      </div>
                      <div>
                        <Label>Ownership *</Label>
                        <RadioGroup className="mt-2" defaultValue="single">
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
                      <Input id="signature" placeholder="Type full legal name" />
                    </div>
                    <div>
                      <Label htmlFor="signatureDate">Today's Date: *</Label>
                      <Input id="signatureDate" type="date" defaultValue={today} />
                    </div>
                  </div>

                  <div className="flex justify-center gap-3 pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      className="px-8"
                    >
                      Save
                    </Button>
                    <Button
                      type="submit"
                      className="bg-[#2c4a6e] hover:bg-[#1e3a5c] text-white font-semibold px-8"
                    >
                      Submit
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
