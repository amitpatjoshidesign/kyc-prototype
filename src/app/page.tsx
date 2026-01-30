"use client";

import { useState, useMemo } from "react";
import Header from "@/components/Header";
import Breadcrumb from "@/components/Breadcrumb";
import Sidebar, { Step } from "@/components/Sidebar";
import StepHeader from "@/components/StepHeader";
import FileUploadField from "@/components/FileUploadField";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import {
  InputGroup,
  InputGroupInput,
  InputGroupAddon,
  InputGroupTextarea,
} from "@/components/ui/input-group";
import { Kbd } from "@/components/ui/kbd";
import { Field, FieldLabel, FieldError } from "@/components/ui/field";
import {
  Buildings,
  IdentificationCard,
  HashStraight,
  Receipt,
  Globe,
  MapPin,
  Flag,
  Hash,
  User,
  Briefcase,
  EnvelopeSimple,
  Phone as PhoneIcon,
  Bank,
  CheckCircle,
  XCircle,
  Storefront,
  Tag,
  Money,
  CreditCard,
  Notepad,
  Warning,
} from "@phosphor-icons/react";

// ── Validation utilities ──

function isValidPhone(phone: string): boolean {
  return /^[6-9]\d{9}$/.test(phone.replace(/\s/g, ""));
}

function isValidPAN(pan: string): boolean {
  return /^[A-Z]{5}\d{4}[A-Z]$/.test(pan.toUpperCase());
}

function isValidGST(gst: string): boolean {
  return /^\d{2}[A-Z]{5}\d{4}[A-Z]\d[Z][A-Z\d]$/.test(gst.toUpperCase());
}

function isValidCIN(cin: string): boolean {
  return /^[UL]\d{5}[A-Z]{2}\d{4}[A-Z]{3}\d{6}$/.test(cin.toUpperCase());
}

function isValidIFSC(ifsc: string): boolean {
  return /^[A-Z]{4}0[A-Z\d]{6}$/.test(ifsc.toUpperCase());
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isValidPincode(pincode: string): boolean {
  return /^[1-9]\d{5}$/.test(pincode);
}

function isValidBankAccount(account: string): boolean {
  return /^\d{9,18}$/.test(account);
}

function isValidURL(url: string): boolean {
  if (!url) return false;
  try {
    new URL(url.startsWith("http") ? url : `https://${url}`);
    return true;
  } catch {
    return false;
  }
}

function getVerification(
  value: string,
  validator: (v: string) => boolean
): VerificationState {
  if (!value) return "default";
  return validator(value) ? "verified" : "error";
}

function getValidationError(
  value: string,
  validator: (v: string) => boolean,
  message: string
): string | undefined {
  if (!value) return undefined;
  return validator(value) ? undefined : message;
}

// ── Form data types ──

interface GetStartedData {
  phone: string;
  registrationType: string;
  pan: string;
}

interface BusinessDetailsData {
  businessCategory: string;
  businessSubCategory: string;
  merchantDbaName: string;
  businessNature: string;
  annualTurnover: string;
  businessModel: string;
  paymentMode: string;
  websiteAppLink: string;
}

interface CompanyDocumentsData {
  hasGst: boolean;
  gstNumber: string;
  gstDocument: File | null;
  nonGstDeclaration: File | null;
  cin: string;
  memorandum: File | null;
  articles: File | null;
  certificate: File | null;
  boardResolution: File | null;
}

interface BusinessAddressData {
  regAddressLine1: string;
  regAddressLine2: string;
  regCity: string;
  regState: string;
  regPincode: string;
  sameAsRegistered: boolean;
  commAddressLine1: string;
  commAddressLine2: string;
  commCity: string;
  commState: string;
  commPincode: string;
}

interface CategoryDocsData {
  categoryDoc1: File | null;
  categoryDoc2: File | null;
}

interface PepData {
  isPep: string;
  isRelatedToPep: string;
  pepDetails: string;
  hasAdditionalMembers: string;
  additionalMembersDetails: string;
}

interface SignatoryData {
  name: string;
  designation: string;
  pan: string;
  email: string;
  proofType: string;
  aadhaarFront: File | null;
  aadhaarBack: File | null;
  passportFront: File | null;
  passportLastPage: File | null;
  voterId: File | null;
  dl: File | null;
}

interface BankData {
  accountNumber: string;
  ifsc: string;
}

interface FormData {
  getStarted: GetStartedData;
  businessDetails: BusinessDetailsData;
  companyDocuments: CompanyDocumentsData;
  businessAddress: BusinessAddressData;
  categoryDocs: CategoryDocsData;
  pep: PepData;
  signatory: SignatoryData;
  bank: BankData;
}

const initialFormData: FormData = {
  getStarted: { phone: "", registrationType: "", pan: "" },
  businessDetails: {
    businessCategory: "",
    businessSubCategory: "",
    merchantDbaName: "",
    businessNature: "",
    annualTurnover: "",
    businessModel: "",
    paymentMode: "",
    websiteAppLink: "",
  },
  companyDocuments: {
    hasGst: true,
    gstNumber: "",
    gstDocument: null,
    nonGstDeclaration: null,
    cin: "",
    memorandum: null,
    articles: null,
    certificate: null,
    boardResolution: null,
  },
  businessAddress: {
    regAddressLine1: "",
    regAddressLine2: "",
    regCity: "",
    regState: "",
    regPincode: "",
    sameAsRegistered: false,
    commAddressLine1: "",
    commAddressLine2: "",
    commCity: "",
    commState: "",
    commPincode: "",
  },
  categoryDocs: { categoryDoc1: null, categoryDoc2: null },
  pep: {
    isPep: "",
    isRelatedToPep: "",
    pepDetails: "",
    hasAdditionalMembers: "",
    additionalMembersDetails: "",
  },
  signatory: {
    name: "",
    designation: "",
    pan: "",
    email: "",
    proofType: "",
    aadhaarFront: null,
    aadhaarBack: null,
    passportFront: null,
    passportLastPage: null,
    voterId: null,
    dl: null,
  },
  bank: { accountNumber: "", ifsc: "" },
};

// ── Helpers ──

function countFilled(obj: object): number {
  return Object.values(obj).filter(
    (v) => v !== "" && v !== null && typeof v !== "boolean"
  ).length;
}

function countTotal(obj: object): number {
  return Object.values(obj).filter((v) => typeof v !== "boolean").length;
}

const STEP_TITLES = [
  "Get started",
  "Verify your business",
  "Signatory details",
  "Bank account verification",
];

const SUB_STEP_TITLES = [
  "Business details",
  "Company documents",
  "Business address",
  "MCC specific docs",
  "Politically exposed persons",
];

const INDIAN_STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
  "Chandigarh", "Delhi", "Goa", "Gujarat", "Haryana", "Himachal Pradesh",
  "Jammu and Kashmir", "Jharkhand", "Karnataka", "Kerala", "Ladakh",
  "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram",
  "Nagaland", "Odisha", "Puducherry", "Punjab", "Rajasthan", "Sikkim",
  "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand",
  "West Bengal",
].map((s) => ({ value: s.toLowerCase().replace(/\s+/g, "_"), label: s }));

// ── Verification state ──

type VerificationState = "default" | "verified" | "error";

// ── Input field components ──

function TextField({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
  icon,
  kbd,
  verification = "default",
  error,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
  icon?: React.ReactNode;
  kbd?: string;
  verification?: VerificationState;
  error?: string;
}) {
  return (
    <Field data-invalid={verification === "error" || undefined}>
      <FieldLabel>{label}</FieldLabel>
      <InputGroup>
        {icon && (
          <InputGroupAddon align="inline-start">{icon}</InputGroupAddon>
        )}
        <InputGroupInput
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          aria-invalid={verification === "error"}
        />
        {verification === "verified" && (
          <InputGroupAddon align="inline-end">
            <CheckCircle size={16} weight="fill" className="text-emerald-600" />
          </InputGroupAddon>
        )}
        {verification === "error" && (
          <InputGroupAddon align="inline-end">
            <XCircle size={16} weight="fill" className="text-red-500" />
          </InputGroupAddon>
        )}
        {kbd && verification === "default" && (
          <InputGroupAddon align="inline-end">
            <Kbd>{kbd}</Kbd>
          </InputGroupAddon>
        )}
      </InputGroup>
      {error && <FieldError>{error}</FieldError>}
    </Field>
  );
}

function SelectField({
  label,
  value,
  onChange,
  options,
  verification = "default",
  error,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
  verification?: VerificationState;
  error?: string;
}) {
  return (
    <Field data-invalid={verification === "error" || undefined}>
      <FieldLabel>{label}</FieldLabel>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger>
          <SelectValue placeholder="Select..." />
        </SelectTrigger>
        <SelectContent>
          {options.map((o) => (
            <SelectItem key={o.value} value={o.value}>
              {o.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {error && <FieldError>{error}</FieldError>}
    </Field>
  );
}

function TextAreaField({
  label,
  value,
  onChange,
  placeholder,
  icon,
  rows = 3,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  icon?: React.ReactNode;
  rows?: number;
}) {
  return (
    <Field>
      <FieldLabel>{label}</FieldLabel>
      <InputGroup>
        {icon && (
          <InputGroupAddon align="inline-start">{icon}</InputGroupAddon>
        )}
        <InputGroupTextarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={rows}
        />
      </InputGroup>
    </Field>
  );
}

// ── Main page component ──

export default function Home() {
  const [currentStep, setCurrentStep] = useState(0);
  const [currentSubStep, setCurrentSubStep] = useState(0);
  const [formData, setFormData] = useState<FormData>(initialFormData);

  // ── Updaters ──

  function updateField<K extends keyof FormData>(
    section: K,
    field: keyof FormData[K],
    value: FormData[K][keyof FormData[K]]
  ) {
    setFormData((prev) => ({
      ...prev,
      [section]: { ...prev[section], [field]: value },
    }));
  }

  // ── Navigation ──

  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === 3;

  function handleNext() {
    if (currentStep === 1) {
      if (currentSubStep < 4) {
        setCurrentSubStep((s) => s + 1);
        return;
      }
    }
    if (!isLastStep) {
      setCurrentStep((s) => s + 1);
      if (currentStep + 1 === 1) setCurrentSubStep(0);
    }
  }

  function handlePrevious() {
    if (currentStep === 1 && currentSubStep > 0) {
      setCurrentSubStep((s) => s - 1);
      return;
    }
    if (!isFirstStep) {
      setCurrentStep((s) => s - 1);
      if (currentStep - 1 === 1) setCurrentSubStep(4);
    }
  }

  function handleSubmit() {
    alert("KYC form submitted!");
  }

  // ── Sidebar steps computation ──

  const sidebarSteps: Step[] = useMemo(() => {
    const gsFilled = countFilled(formData.getStarted);
    const gsTotal = countTotal(formData.getStarted);

    const bdFilled = countFilled(formData.businessDetails);
    const bdTotal = countTotal(formData.businessDetails);
    const cdFilled = countFilled(formData.companyDocuments);
    const cdTotal = countTotal(formData.companyDocuments);

    const ba = formData.businessAddress;
    const regFilled = [ba.regAddressLine1, ba.regAddressLine2, ba.regCity, ba.regState, ba.regPincode].filter((v) => v !== "").length;
    const regTotal = 5;
    const commFilled = ba.sameAsRegistered ? 0 : [ba.commAddressLine1, ba.commAddressLine2, ba.commCity, ba.commState, ba.commPincode].filter((v) => v !== "").length;
    const commTotal = ba.sameAsRegistered ? 0 : 5;
    const baFilled = regFilled + commFilled;
    const baTotal = regTotal + commTotal;

    const catFilled = countFilled(formData.categoryDocs);
    const catTotal = countTotal(formData.categoryDocs);

    const pepFilled = countFilled(formData.pep);
    const pepTotal = countTotal(formData.pep);

    const sigFilled = countFilled(formData.signatory);
    const sigTotal = countTotal(formData.signatory);

    const bankFilled = countFilled(formData.bank);
    const bankTotal = countTotal(formData.bank);

    const step1Complete = gsFilled === gsTotal;
    const step2Complete =
      bdFilled === bdTotal &&
      cdFilled === cdTotal &&
      baFilled === baTotal &&
      catFilled === catTotal &&
      pepFilled === pepTotal;
    const step3Complete = sigFilled === sigTotal;
    const step4Complete = bankFilled === bankTotal;

    return [
      {
        label: "Get started",
        completed: step1Complete && currentStep > 0,
        active: currentStep === 0,
      },
      {
        label: "Verify your business",
        completed: step2Complete && currentStep > 1,
        active: currentStep === 1,
        hasSubSteps: true,
        subSteps:
          currentStep === 1
            ? [
                { label: "Business details", completed: bdFilled, total: bdTotal, active: currentSubStep === 0 },
                { label: "Company documents", completed: cdFilled, total: cdTotal, active: currentSubStep === 1 },
                { label: "Business address", completed: baFilled, total: baTotal, active: currentSubStep === 2 },
                { label: "MCC specific docs", completed: catFilled, total: catTotal, active: currentSubStep === 3 },
                { label: "Politically exposed persons", completed: pepFilled, total: pepTotal, active: currentSubStep === 4 },
              ]
            : undefined,
      },
      {
        label: "Signatory details",
        completed: step3Complete && currentStep > 2,
        active: currentStep === 2,
      },
      {
        label: "Bank account verification",
        completed: step4Complete && currentStep > 3,
        active: currentStep === 3,
      },
    ];
  }, [formData, currentStep, currentSubStep]);

  // ── Step title ──

  const stepTitle = STEP_TITLES[currentStep];

  // ── Step content renderers ──

  function renderGetStarted() {
    const d = formData.getStarted;
    return (
      <section className="space-y-5">
        <TextField
          label="Phone number"
          value={d.phone}
          onChange={(v) => updateField("getStarted", "phone", v)}
          type="tel"
          placeholder="98765 43210"
          icon={<PhoneIcon size={16} />}
          kbd="+91"
          verification={getVerification(d.phone, isValidPhone)}
          error={getValidationError(d.phone, isValidPhone, "Enter a valid 10-digit mobile number")}
        />
        <SelectField
          label="Registration type"
          value={d.registrationType}
          onChange={(v) => updateField("getStarted", "registrationType", v)}
          options={[
            { value: "pvt_ltd", label: "Private Limited Company" },
            { value: "public_ltd", label: "Public Limited Company" },
            { value: "llp", label: "LLP" },
            { value: "partnership", label: "Partnership Firm" },
            { value: "sole_proprietorship", label: "Sole Proprietorship" },
            { value: "opc", label: "One Person Company" },
            { value: "trust", label: "Trust / Society" },
            { value: "huf", label: "HUF" },
          ]}
        />
        <TextField
          label="PAN"
          value={d.pan}
          onChange={(v) => updateField("getStarted", "pan", v.toUpperCase())}
          placeholder="ABCDE1234F"
          icon={<IdentificationCard size={16} />}
          kbd="A-Z 0-9"
          verification={getVerification(d.pan, isValidPAN)}
          error={getValidationError(d.pan, isValidPAN, "PAN must be 5 letters, 4 digits, 1 letter (e.g. ABCDE1234F)")}
        />
      </section>
    );
  }

  function renderBusinessDetails() {
    const d = formData.businessDetails;
    return (
      <section className="space-y-5">
        <div className="grid grid-cols-2 gap-x-4 gap-y-6">
          <SelectField
            label="Business category"
            value={d.businessCategory}
            onChange={(v) => updateField("businessDetails", "businessCategory", v)}
            options={[
              { value: "retail", label: "Retail" },
              { value: "ecommerce", label: "E-commerce" },
              { value: "financial_services", label: "Financial Services" },
              { value: "education", label: "Education" },
              { value: "healthcare", label: "Healthcare" },
              { value: "travel", label: "Travel & Hospitality" },
              { value: "food", label: "Food & Beverages" },
              { value: "technology", label: "Technology / SaaS" },
              { value: "professional", label: "Professional Services" },
              { value: "nonprofit", label: "Non-profit / NGO" },
              { value: "other", label: "Other" },
            ]}
          />
          <SelectField
            label="Business sub-category"
            value={d.businessSubCategory}
            onChange={(v) => updateField("businessDetails", "businessSubCategory", v)}
            options={[
              { value: "physical_goods", label: "Physical Goods" },
              { value: "digital_goods", label: "Digital Goods & Services" },
              { value: "subscriptions", label: "Subscriptions" },
              { value: "donations", label: "Donations & Non-profit" },
              { value: "utilities", label: "Utilities & Bills" },
              { value: "education_training", label: "Education & Training" },
              { value: "professional_services", label: "Professional Services" },
            ]}
          />
          <div className="col-span-2">
            <TextField
              label="Merchant DBA name"
              value={d.merchantDbaName}
              onChange={(v) => updateField("businessDetails", "merchantDbaName", v)}
              placeholder="Doing Business As name"
              icon={<Storefront size={16} />}
            />
          </div>
          <div className="col-span-2">
            <TextAreaField
              label="Describe the nature of your business"
              value={d.businessNature}
              onChange={(v) => updateField("businessDetails", "businessNature", v)}
              placeholder="Please describe the nature of your business and what will the money be collected for?"
              icon={<Notepad size={16} />}
              rows={3}
            />
          </div>
          <SelectField
            label="Annual turnover"
            value={d.annualTurnover}
            onChange={(v) => updateField("businessDetails", "annualTurnover", v)}
            options={[
              { value: "upto_10l", label: "Up to \u20B910 Lakhs" },
              { value: "10l_50l", label: "\u20B910 Lakhs \u2013 \u20B950 Lakhs" },
              { value: "50l_1cr", label: "\u20B950 Lakhs \u2013 \u20B91 Crore" },
              { value: "1cr_5cr", label: "\u20B91 Crore \u2013 \u20B95 Crores" },
              { value: "5cr_25cr", label: "\u20B95 Crores \u2013 \u20B925 Crores" },
              { value: "25cr_100cr", label: "\u20B925 Crores \u2013 \u20B9100 Crores" },
              { value: "above_100cr", label: "Above \u20B9100 Crores" },
            ]}
          />
          <SelectField
            label="Business model"
            value={d.businessModel}
            onChange={(v) => updateField("businessDetails", "businessModel", v)}
            options={[
              { value: "b2b", label: "B2B" },
              { value: "b2c", label: "B2C" },
              { value: "b2b2c", label: "B2B2C" },
              { value: "d2c", label: "D2C" },
              { value: "marketplace", label: "Marketplace" },
            ]}
          />
          <SelectField
            label="Accept payments"
            value={d.paymentMode}
            onChange={(v) => updateField("businessDetails", "paymentMode", v)}
            options={[
              { value: "online", label: "Online" },
              { value: "offline", label: "Offline" },
              { value: "both", label: "Both" },
            ]}
          />
          {(d.paymentMode === "online" || d.paymentMode === "both") && (
            <TextField
              label="Website / App link"
              value={d.websiteAppLink}
              onChange={(v) => updateField("businessDetails", "websiteAppLink", v)}
              placeholder="https://example.com"
              icon={<Globe size={16} />}
              verification={getVerification(d.websiteAppLink, isValidURL)}
              error={getValidationError(d.websiteAppLink, isValidURL, "Enter a valid URL")}
            />
          )}
        </div>
      </section>
    );
  }

  function renderCompanyDocuments() {
    const d = formData.companyDocuments;
    return (
      <section className="space-y-6">
        <label className="flex items-center gap-2.5 cursor-pointer">
          <Checkbox
            checked={d.hasGst}
            onCheckedChange={(checked) =>
              updateField("companyDocuments", "hasGst", checked === true)
            }
          />
          <span className="text-sm text-stone-700">I have a GST number</span>
        </label>

        <div className="grid grid-cols-2 gap-x-4 gap-y-6">
          {d.hasGst ? (
            <>
              <TextField
                label="GST number"
                value={d.gstNumber}
                onChange={(v) => updateField("companyDocuments", "gstNumber", v.toUpperCase())}
                placeholder="22AAAAA0000A1Z5"
                icon={<Receipt size={16} />}
                verification={getVerification(d.gstNumber, isValidGST)}
                error={getValidationError(d.gstNumber, isValidGST, "Enter a valid 15-character GST number")}
              />
              <FileUploadField
                label="GST certificate"
                file={d.gstDocument}
                helperText="Attested PDF under 5MB"
                onFileSelect={(f) => updateField("companyDocuments", "gstDocument", f)}
                onClear={() => updateField("companyDocuments", "gstDocument", null)}
              />
            </>
          ) : (
            <FileUploadField
              label="Non-GST declaration"
              file={d.nonGstDeclaration}
              helperText="Upload signed declaration PDF"
              onFileSelect={(f) => updateField("companyDocuments", "nonGstDeclaration", f)}
              onClear={() => updateField("companyDocuments", "nonGstDeclaration", null)}
            />
          )}

          <div className="col-span-2">
            <TextField
              label="CIN (Company Identification Number)"
              value={d.cin}
              onChange={(v) => updateField("companyDocuments", "cin", v.toUpperCase())}
              placeholder="U12345MH2020PTC123456"
              icon={<HashStraight size={16} />}
              verification={getVerification(d.cin, isValidCIN)}
              error={getValidationError(d.cin, isValidCIN, "Enter a valid 21-character CIN")}
            />
          </div>

          <FileUploadField
            label="Memorandum of association"
            file={d.memorandum}
            helperText="Attested PDF under 5MB"
            onFileSelect={(f) => updateField("companyDocuments", "memorandum", f)}
            onClear={() => updateField("companyDocuments", "memorandum", null)}
          />
          <FileUploadField
            label="Articles of association"
            file={d.articles}
            helperText="Attested PDF under 5MB"
            onFileSelect={(f) => updateField("companyDocuments", "articles", f)}
            onClear={() => updateField("companyDocuments", "articles", null)}
          />
          <FileUploadField
            label="Certificate of incorporation"
            file={d.certificate}
            helperText="Attested PDF under 5MB"
            onFileSelect={(f) => updateField("companyDocuments", "certificate", f)}
            onClear={() => updateField("companyDocuments", "certificate", null)}
          />
          <FileUploadField
            label="Board resolution / Power of Attorney"
            file={d.boardResolution}
            helperText="Attested PDF under 5MB"
            onFileSelect={(f) => updateField("companyDocuments", "boardResolution", f)}
            onClear={() => updateField("companyDocuments", "boardResolution", null)}
          />
        </div>
      </section>
    );
  }

  function renderBusinessAddress() {
    const d = formData.businessAddress;
    return (
      <section className="space-y-6">
        <h3 className="text-sm font-semibold text-stone-800">Registered address</h3>
        <div className="grid grid-cols-2 gap-x-4 gap-y-6">
          <div className="col-span-2">
            <TextField
              label="Address line 1"
              value={d.regAddressLine1}
              onChange={(v) => updateField("businessAddress", "regAddressLine1", v)}
              placeholder="Street address"
              icon={<MapPin size={16} />}
            />
          </div>
          <div className="col-span-2">
            <TextField
              label="Address line 2"
              value={d.regAddressLine2}
              onChange={(v) => updateField("businessAddress", "regAddressLine2", v)}
              placeholder="Apartment, suite, etc."
              icon={<MapPin size={16} />}
            />
          </div>
          <TextField
            label="City"
            value={d.regCity}
            onChange={(v) => updateField("businessAddress", "regCity", v)}
            icon={<Buildings size={16} />}
          />
          <SelectField
            label="State"
            value={d.regState}
            onChange={(v) => updateField("businessAddress", "regState", v)}
            options={INDIAN_STATES}
          />
          <TextField
            label="Pincode"
            value={d.regPincode}
            onChange={(v) => updateField("businessAddress", "regPincode", v)}
            placeholder="110001"
            icon={<Hash size={16} />}
            verification={getVerification(d.regPincode, isValidPincode)}
            error={getValidationError(d.regPincode, isValidPincode, "Enter a valid 6-digit pincode")}
          />
        </div>

        <label className="flex items-center gap-2.5 cursor-pointer pt-2">
          <Checkbox
            checked={d.sameAsRegistered}
            onCheckedChange={(checked) =>
              updateField("businessAddress", "sameAsRegistered", checked === true)
            }
          />
          <span className="text-sm text-stone-700">Communication address is the same as registered address</span>
        </label>

        {!d.sameAsRegistered && (
          <>
            <h3 className="text-sm font-semibold text-stone-800 pt-2">Communication address</h3>
            <div className="grid grid-cols-2 gap-x-4 gap-y-6">
              <div className="col-span-2">
                <TextField
                  label="Address line 1"
                  value={d.commAddressLine1}
                  onChange={(v) => updateField("businessAddress", "commAddressLine1", v)}
                  placeholder="Street address"
                  icon={<MapPin size={16} />}
                />
              </div>
              <div className="col-span-2">
                <TextField
                  label="Address line 2"
                  value={d.commAddressLine2}
                  onChange={(v) => updateField("businessAddress", "commAddressLine2", v)}
                  placeholder="Apartment, suite, etc."
                  icon={<MapPin size={16} />}
                />
              </div>
              <TextField
                label="City"
                value={d.commCity}
                onChange={(v) => updateField("businessAddress", "commCity", v)}
                icon={<Buildings size={16} />}
              />
              <SelectField
                label="State"
                value={d.commState}
                onChange={(v) => updateField("businessAddress", "commState", v)}
                options={INDIAN_STATES}
              />
              <TextField
                label="Pincode"
                value={d.commPincode}
                onChange={(v) => updateField("businessAddress", "commPincode", v)}
                placeholder="110001"
                icon={<Hash size={16} />}
                verification={getVerification(d.commPincode, isValidPincode)}
                error={getValidationError(d.commPincode, isValidPincode, "Enter a valid 6-digit pincode")}
              />
            </div>
          </>
        )}
      </section>
    );
  }

  function renderCategoryDocs() {
    const d = formData.categoryDocs;
    return (
      <section>
        <p className="mb-5 text-sm text-stone-500">
          Depending on the category and sub-category type, additional documents may be required.
        </p>
        <div className="grid grid-cols-2 gap-x-4 gap-y-6">
          <FileUploadField
            label="MCC document 1"
            file={d.categoryDoc1}
            helperText="Attested PDF under 5MB"
            onFileSelect={(f) => updateField("categoryDocs", "categoryDoc1", f)}
            onClear={() => updateField("categoryDocs", "categoryDoc1", null)}
          />
          <FileUploadField
            label="MCC document 2"
            file={d.categoryDoc2}
            helperText="Attested PDF under 5MB"
            onFileSelect={(f) => updateField("categoryDocs", "categoryDoc2", f)}
            onClear={() => updateField("categoryDocs", "categoryDoc2", null)}
          />
        </div>
      </section>
    );
  }

  function renderPep() {
    const d = formData.pep;
    const showDetails = d.isPep === "yes" || d.isRelatedToPep === "yes";
    return (
      <section className="space-y-5">
        <div className="grid grid-cols-2 gap-x-4 gap-y-6">
          <SelectField
            label="Are you a Politically Exposed Person?"
            value={d.isPep}
            onChange={(v) => updateField("pep", "isPep", v)}
            options={[
              { value: "yes", label: "Yes" },
              { value: "no", label: "No" },
            ]}
          />
          <SelectField
            label="Are you related to any Politically Exposed Person?"
            value={d.isRelatedToPep}
            onChange={(v) => updateField("pep", "isRelatedToPep", v)}
            options={[
              { value: "yes", label: "Yes" },
              { value: "no", label: "No" },
            ]}
          />
        </div>
        {showDetails && (
          <TextAreaField
            label="PEP details"
            value={d.pepDetails}
            onChange={(v) => updateField("pep", "pepDetails", v)}
            placeholder="Provide details about the politically exposed person"
            icon={<Warning size={16} />}
            rows={3}
          />
        )}
        <SelectField
          label="Additional members details"
          value={d.hasAdditionalMembers}
          onChange={(v) => updateField("pep", "hasAdditionalMembers", v)}
          options={[
            { value: "yes", label: "Yes" },
            { value: "no", label: "No" },
          ]}
        />
        {d.hasAdditionalMembers === "yes" && (
          <TextAreaField
            label="Additional members information"
            value={d.additionalMembersDetails}
            onChange={(v) => updateField("pep", "additionalMembersDetails", v)}
            placeholder="Provide details of additional members"
            rows={3}
          />
        )}
      </section>
    );
  }

  function renderSignatory() {
    const d = formData.signatory;
    return (
      <section className="space-y-6">
        <h3 className="text-sm font-semibold text-stone-800">Authorised signatory details</h3>
        <div className="grid grid-cols-2 gap-x-4 gap-y-6">
          <TextField
            label="Full name"
            value={d.name}
            onChange={(v) => updateField("signatory", "name", v)}
            placeholder="Authorized signatory name"
            icon={<User size={16} />}
          />
          <TextField
            label="Designation"
            value={d.designation}
            onChange={(v) => updateField("signatory", "designation", v)}
            placeholder="e.g. Director, CEO"
            icon={<Briefcase size={16} />}
          />
          <TextField
            label="PAN"
            value={d.pan}
            onChange={(v) => updateField("signatory", "pan", v.toUpperCase())}
            placeholder="ABCDE1234F"
            icon={<IdentificationCard size={16} />}
            kbd="A-Z 0-9"
            verification={getVerification(d.pan, isValidPAN)}
            error={getValidationError(d.pan, isValidPAN, "PAN must be 5 letters, 4 digits, 1 letter")}
          />
          <TextField
            label="Email"
            value={d.email}
            onChange={(v) => updateField("signatory", "email", v)}
            type="email"
            placeholder="signatory@company.com"
            icon={<EnvelopeSimple size={16} />}
            kbd="@"
            verification={getVerification(d.email, isValidEmail)}
            error={getValidationError(d.email, isValidEmail, "Enter a valid email address")}
          />
        </div>

        <h3 className="text-sm font-semibold text-stone-800 pt-2">Proof of address</h3>
        <SelectField
          label="Document type"
          value={d.proofType}
          onChange={(v) => updateField("signatory", "proofType", v)}
          options={[
            { value: "aadhaar", label: "Aadhaar" },
            { value: "passport", label: "Passport" },
            { value: "voter_id", label: "Voter ID" },
            { value: "dl", label: "Driving Licence" },
          ]}
        />

        {d.proofType === "aadhaar" && (
          <div className="grid grid-cols-2 gap-x-4 gap-y-6">
            <FileUploadField
              label="Aadhaar front"
              file={d.aadhaarFront}
              helperText="Upload front side (masked)"
              onFileSelect={(f) => updateField("signatory", "aadhaarFront", f)}
              onClear={() => updateField("signatory", "aadhaarFront", null)}
            />
            <FileUploadField
              label="Aadhaar back"
              file={d.aadhaarBack}
              helperText="Upload back side"
              onFileSelect={(f) => updateField("signatory", "aadhaarBack", f)}
              onClear={() => updateField("signatory", "aadhaarBack", null)}
            />
          </div>
        )}

        {d.proofType === "passport" && (
          <div className="grid grid-cols-2 gap-x-4 gap-y-6">
            <FileUploadField
              label="Passport front page"
              file={d.passportFront}
              helperText="Upload front page"
              onFileSelect={(f) => updateField("signatory", "passportFront", f)}
              onClear={() => updateField("signatory", "passportFront", null)}
            />
            <FileUploadField
              label="Passport last page"
              file={d.passportLastPage}
              helperText="Upload last page"
              onFileSelect={(f) => updateField("signatory", "passportLastPage", f)}
              onClear={() => updateField("signatory", "passportLastPage", null)}
            />
          </div>
        )}

        {d.proofType === "voter_id" && (
          <FileUploadField
            label="Voter ID"
            file={d.voterId}
            helperText="Upload Voter ID"
            onFileSelect={(f) => updateField("signatory", "voterId", f)}
            onClear={() => updateField("signatory", "voterId", null)}
          />
        )}

        {d.proofType === "dl" && (
          <FileUploadField
            label="Driving Licence"
            file={d.dl}
            helperText="Upload Driving Licence"
            onFileSelect={(f) => updateField("signatory", "dl", f)}
            onClear={() => updateField("signatory", "dl", null)}
          />
        )}
      </section>
    );
  }

  function renderBank() {
    const d = formData.bank;
    return (
      <section className="space-y-5">
        <div className="grid grid-cols-2 gap-x-4 gap-y-6">
          <TextField
            label="Bank account number"
            value={d.accountNumber}
            onChange={(v) => updateField("bank", "accountNumber", v)}
            placeholder="Enter account number"
            icon={<Bank size={16} />}
            verification={getVerification(d.accountNumber, isValidBankAccount)}
            error={getValidationError(d.accountNumber, isValidBankAccount, "Account number must be 9\u201318 digits")}
          />
          <TextField
            label="IFSC code"
            value={d.ifsc}
            onChange={(v) => updateField("bank", "ifsc", v.toUpperCase())}
            placeholder="SBIN0001234"
            icon={<HashStraight size={16} />}
            verification={getVerification(d.ifsc, isValidIFSC)}
            error={getValidationError(d.ifsc, isValidIFSC, "IFSC must be 4 letters, 0, then 6 characters")}
          />
        </div>
      </section>
    );
  }

  function renderStepContent() {
    switch (currentStep) {
      case 0:
        return renderGetStarted();
      case 1:
        switch (currentSubStep) {
          case 0:
            return renderBusinessDetails();
          case 1:
            return renderCompanyDocuments();
          case 2:
            return renderBusinessAddress();
          case 3:
            return renderCategoryDocs();
          case 4:
            return renderPep();
        }
        break;
      case 2:
        return renderSignatory();
      case 3:
        return renderBank();
    }
  }

  // ── Display step number ──

  const displayStep = currentStep + 1;
  const totalSteps = 4;

  return (
    <div className="relative min-h-screen bg-stone-50">
      <Header />

      <div className="relative z-10 mx-auto max-w-[1080px] px-4 pt-6 pb-0">
        <Breadcrumb />

        <div className="relative flex min-h-[calc(100vh-64px-41px-24px)] overflow-hidden rounded-t-xl bg-white shadow-sm">
          <Sidebar steps={sidebarSteps} />

          <main className="flex-1 p-6">
            <div className="max-w-[812px]">
              <StepHeader
                currentStep={displayStep}
                totalSteps={totalSteps}
                title={stepTitle}
                onPrevious={isFirstStep ? undefined : handlePrevious}
                onNext={isLastStep ? handleSubmit : handleNext}
              />

              {renderStepContent()}
            </div>
          </main>
        </div>
      </div>

      {/* Teal gradient — full width, sticky bottom */}
      <div
        aria-hidden
        className="pointer-events-none sticky bottom-0 z-0 h-[640px] w-full -mt-[640px]"
        style={{
          opacity: 0.3,
          background:
            "linear-gradient(5deg, #009CB0 -31.37%, #009CB0 0.52%, #D5FFFF 96.2%)",
          filter: "blur(47.6px)",
        }}
      />
    </div>
  );
}
