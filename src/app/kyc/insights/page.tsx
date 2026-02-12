"use client";

import { useState, useMemo, useEffect } from "react";
import Header from "@/components/Header";
import InsightsBreadcrumb from "@/components/InsightsBreadcrumb";
import Sidebar, { Step, MobileStepIndicator } from "@/components/Sidebar";
import StepHeader from "@/components/StepHeader";
import FileUploadField from "@/components/FileUploadField";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
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
import { Button } from "@/components/ui/button";
import {
  IdentificationCard,
  Receipt,
  Globe,
  User,
  Briefcase,
  EnvelopeSimple,
  CheckCircle,
  XCircle,
  Storefront,
  Notepad,
} from "@phosphor-icons/react";

// ── Validation utilities ──

function isValidPAN(pan: string): boolean {
  return /^[A-Z]{5}\d{4}[A-Z]$/.test(pan.toUpperCase());
}

function isValidGST(gst: string): boolean {
  return /^\d{2}[A-Z]{5}\d{4}[A-Z]\d[Z][A-Z\d]$/.test(gst.toUpperCase());
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
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

// ── Registration type from PAN char 4 ──

function getRegistrationTypeFromPAN(pan: string): string {
  if (pan.length < 4) return "";
  const char = pan[3].toUpperCase();
  const map: Record<string, string> = {
    P: "sole_proprietorship",
    F: "partnership",
    C: "pvt_ltd",
    T: "trust",
    A: "society",
    H: "huf",
  };
  return map[char] || "";
}

// ── Form data types ──

interface GetStartedData {
  pan: string;
  registrationType: string;
}

interface CompanyDocumentsData {
  hasGst: boolean;
  gstNumber: string;
  gstDocument: File | null;
  nonGstDeclaration: File | null;
  regulatorDocType: string;
  regulatorDocument: File | null;
}

interface BusinessDetailsData {
  businessDescription: string;
  merchantDbaName: string;
  acceptPayments: string;
  websiteLink: string;
  appPlatform: string;
  appLink: string;
  registrationType: string;
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

interface AAFormData {
  getStarted: GetStartedData;
  companyDocuments: CompanyDocumentsData;
  businessDetails: BusinessDetailsData;
  signatory: SignatoryData;
}

const initialFormData: AAFormData = {
  getStarted: { pan: "", registrationType: "" },
  companyDocuments: {
    hasGst: true,
    gstNumber: "",
    gstDocument: null,
    nonGstDeclaration: null,
    regulatorDocType: "",
    regulatorDocument: null,
  },
  businessDetails: {
    businessDescription: "",
    merchantDbaName: "",
    acceptPayments: "",
    websiteLink: "",
    appPlatform: "",
    appLink: "",
    registrationType: "",
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
  "KYC Summary",
];

const SUB_STEP_TITLES = ["Company documents", "Business details"];

const REGISTRATION_TYPE_OPTIONS = [
  { value: "pvt_ltd", label: "Private Limited Company" },
  { value: "public_ltd", label: "Public Limited Company" },
  { value: "llp", label: "LLP" },
  { value: "partnership", label: "Partnership Firm" },
  { value: "sole_proprietorship", label: "Sole Proprietorship" },
  { value: "opc", label: "One Person Company" },
  { value: "trust", label: "Trust / Society" },
  { value: "huf", label: "HUF" },
  { value: "society", label: "Society" },
];

const REGULATOR_DOC_OPTIONS = [
  { value: "rbi", label: "RBI" },
  { value: "sebi", label: "SEBI" },
  { value: "pfrda", label: "PFRDA" },
  { value: "irdai", label: "IRDAI" },
];

const APP_PLATFORM_OPTIONS = [
  { value: "android", label: "Android" },
  { value: "iphone", label: "iPhone" },
  { value: "website", label: "Website" },
  { value: "other", label: "Other" },
];

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
            <CheckCircle weight="fill" className="text-primary size-4" />
          </InputGroupAddon>
        )}
        {verification === "error" && (
          <InputGroupAddon align="inline-end">
            <XCircle weight="fill" className="text-red-500 size-4" />
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

export default function InsightsKYC() {
  const [currentStep, setCurrentStep] = useState(0);
  const [currentSubStep, setCurrentSubStep] = useState(0);
  const [formData, setFormData] = useState<AAFormData>(initialFormData);
  const [skpiModalState, setSkpiModalState] = useState<"idle" | "loading" | "results">("idle");
  const [skpiFetchedData, setSkpiFetchedData] = useState<Record<string, string> | null>(null);
  const [kycSubmitted, setKycSubmitted] = useState(false);

  useEffect(() => {
    localStorage.setItem("kyc_started", "true");
  }, []);

  // ── Updaters ──

  function updateField<K extends keyof AAFormData>(
    section: K,
    field: keyof AAFormData[K],
    value: AAFormData[K][keyof AAFormData[K]]
  ) {
    setFormData((prev) => ({
      ...prev,
      [section]: { ...prev[section], [field]: value },
    }));
  }

  // ── Navigation ──

  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === 3;
  const isSummaryStep = currentStep === 3;

  function handleNext() {
    if (currentStep === 1) {
      if (currentSubStep < 1) {
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
      if (currentStep - 1 === 1) setCurrentSubStep(1);
    }
  }

  function handleSubmit() {
    localStorage.setItem("kyc_completed", "true");
    setKycSubmitted(true);
  }

  // ── SKPI fetch handlers ──

  function handleSkpiFetch() {
    if (!isValidPAN(formData.getStarted.pan)) return;
    setSkpiModalState("loading");
    setTimeout(() => {
      setSkpiFetchedData({
        "Setu Identifier (SKPI)": "SKPI-2024-AA-00847",
        "Merchant DBA Name": "Acme Finserv Pvt. Ltd.",
        "Registration Type": "pvt_ltd",
        "PAN": formData.getStarted.pan,
        "GST Number": "27AABCA1234H1Z5",
        "Business Description": "Financial data aggregation and analytics services for lending institutions",
        "Signatory Name": "Rajesh Kumar",
        "Signatory Email": "rajesh@acmefinserv.in",
        "Signatory Designation": "Director",
      });
      setSkpiModalState("results");
    }, 3000);
  }

  function handleSkpiConfirm() {
    if (!skpiFetchedData) return;
    setFormData((prev) => ({
      ...prev,
      getStarted: {
        ...prev.getStarted,
        registrationType: skpiFetchedData["Registration Type"] || prev.getStarted.registrationType,
      },
      companyDocuments: {
        ...prev.companyDocuments,
        gstNumber: skpiFetchedData["GST Number"] || prev.companyDocuments.gstNumber,
      },
      businessDetails: {
        ...prev.businessDetails,
        merchantDbaName: skpiFetchedData["Merchant DBA Name"] || prev.businessDetails.merchantDbaName,
        businessDescription: skpiFetchedData["Business Description"] || prev.businessDetails.businessDescription,
        registrationType: skpiFetchedData["Registration Type"] || prev.businessDetails.registrationType,
      },
      signatory: {
        ...prev.signatory,
        name: skpiFetchedData["Signatory Name"] || prev.signatory.name,
        email: skpiFetchedData["Signatory Email"] || prev.signatory.email,
        designation: skpiFetchedData["Signatory Designation"] || prev.signatory.designation,
      },
    }));
    setSkpiModalState("idle");
    setSkpiFetchedData(null);
  }

  // ── Sidebar steps computation ──

  const sidebarSteps: Step[] = useMemo(() => {
    const gsFilled = countFilled(formData.getStarted);
    const gsTotal = countTotal(formData.getStarted);

    const cdFilled = countFilled(formData.companyDocuments);
    const cdTotal = countTotal(formData.companyDocuments);

    const bdFilled = countFilled(formData.businessDetails);
    const bdTotal = countTotal(formData.businessDetails);

    const sigFilled = countFilled(formData.signatory);
    const sigTotal = countTotal(formData.signatory);

    const step0Complete = gsFilled === gsTotal;
    const step1Complete = cdFilled === cdTotal && bdFilled === bdTotal;
    const step2Complete = sigFilled === sigTotal;

    return [
      {
        label: "Get started",
        completed: step0Complete && currentStep > 0,
        active: currentStep === 0,
      },
      {
        label: "Verify your business",
        completed: step1Complete && currentStep > 1,
        active: currentStep === 1,
        hasSubSteps: true,
        subSteps:
          currentStep === 1
            ? [
                { label: "Company documents", completed: cdFilled, total: cdTotal, active: currentSubStep === 0 },
                { label: "Business details", completed: bdFilled, total: bdTotal, active: currentSubStep === 1 },
              ]
            : undefined,
      },
      {
        label: "Signatory details",
        completed: step2Complete && currentStep > 2,
        active: currentStep === 2,
      },
      ...(currentStep === 3
        ? [
            {
              label: "KYC Summary",
              completed: false,
              active: true,
            },
          ]
        : []),
    ];
  }, [formData, currentStep, currentSubStep]);

  // ── Step title ──

  const stepTitle = currentStep === 1 ? SUB_STEP_TITLES[currentSubStep] : STEP_TITLES[currentStep];

  // ── Step content renderers ──

  function renderGetStarted() {
    const d = formData.getStarted;
    const panVerification = getVerification(d.pan, isValidPAN);

    function handlePanChange(value: string) {
      const upper = value.toUpperCase();
      updateField("getStarted", "pan", upper);
      const detected = getRegistrationTypeFromPAN(upper);
      if (detected) {
        updateField("getStarted", "registrationType", detected);
      }
    }

    return (
      <section className="space-y-5">
        <TextField
          label="Business PAN"
          value={d.pan}
          onChange={handlePanChange}
          placeholder="ABCDE1234F"
          icon={<IdentificationCard size={16} />}
          kbd="A-Z 0-9"
          verification={panVerification}
          error={
            panVerification === "verified"
              ? undefined
              : getValidationError(d.pan, isValidPAN, "PAN must be 5 letters, 4 digits, 1 letter (e.g. ABCDE1234F)")
          }
        />
        {panVerification === "verified" && (
          <div className="space-y-2">
            <p className="text-xs text-muted-foreground">
              PAN Verified &mdash; Registration type auto-detected
            </p>
            <SelectField
              label="Registration type"
              value={d.registrationType}
              onChange={(v) => updateField("getStarted", "registrationType", v)}
              options={REGISTRATION_TYPE_OPTIONS}
            />
            <Button variant="outline" onClick={handleSkpiFetch}>
              Fetch SKPI from PAN
            </Button>
          </div>
        )}
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
          <span className="text-sm text-foreground">I have a GST number</span>
        </label>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-6">
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
        </div>

        <h3 className="text-sm font-semibold text-foreground pt-2">Regulator document</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-6">
          <SelectField
            label="Document type"
            value={d.regulatorDocType}
            onChange={(v) => updateField("companyDocuments", "regulatorDocType", v)}
            options={REGULATOR_DOC_OPTIONS}
          />
          <FileUploadField
            label="Regulator certificate"
            file={d.regulatorDocument}
            helperText="Upload regulator certificate PDF"
            onFileSelect={(f) => updateField("companyDocuments", "regulatorDocument", f)}
            onClear={() => updateField("companyDocuments", "regulatorDocument", null)}
          />
        </div>
      </section>
    );
  }

  function renderBusinessDetails() {
    const d = formData.businessDetails;
    return (
      <section className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-6">
          <div className="col-span-1 md:col-span-2">
            <TextAreaField
              label="Business description"
              value={d.businessDescription}
              onChange={(v) => updateField("businessDetails", "businessDescription", v)}
              placeholder="Describe the nature of your business and what will the data be used for"
              icon={<Notepad size={16} />}
              rows={3}
            />
          </div>
          <div className="col-span-1 md:col-span-2">
            <TextField
              label="Merchant DBA name"
              value={d.merchantDbaName}
              onChange={(v) => updateField("businessDetails", "merchantDbaName", v)}
              placeholder="Doing Business As name (prefilled from GST API)"
              icon={<Storefront size={16} />}
            />
          </div>
          <SelectField
            label="Accept payments"
            value={d.acceptPayments}
            onChange={(v) => updateField("businessDetails", "acceptPayments", v)}
            options={[
              { value: "online", label: "Online" },
              { value: "offline", label: "Offline" },
              { value: "both", label: "Both" },
            ]}
          />
          <SelectField
            label="Registration type"
            value={d.registrationType}
            onChange={(v) => updateField("businessDetails", "registrationType", v)}
            options={REGISTRATION_TYPE_OPTIONS}
          />

          {(d.acceptPayments === "online" || d.acceptPayments === "both") && (
            <>
              <TextField
                label="Website link"
                value={d.websiteLink}
                onChange={(v) => updateField("businessDetails", "websiteLink", v)}
                placeholder="https://example.com"
                icon={<Globe size={16} />}
                verification={getVerification(d.websiteLink, isValidURL)}
                error={getValidationError(d.websiteLink, isValidURL, "Enter a valid URL")}
              />
              <SelectField
                label="App platform"
                value={d.appPlatform}
                onChange={(v) => updateField("businessDetails", "appPlatform", v)}
                options={APP_PLATFORM_OPTIONS}
              />
              {d.appPlatform && (
                <div className="col-span-1 md:col-span-2">
                  <TextField
                    label="App link"
                    value={d.appLink}
                    onChange={(v) => updateField("businessDetails", "appLink", v)}
                    placeholder="https://play.google.com/store/apps/..."
                    icon={<Globe size={16} />}
                    verification={getVerification(d.appLink, isValidURL)}
                    error={getValidationError(d.appLink, isValidURL, "Enter a valid URL")}
                  />
                </div>
              )}
            </>
          )}
        </div>
      </section>
    );
  }

  function renderSignatory() {
    const d = formData.signatory;
    return (
      <section className="space-y-6">
        <h3 className="text-sm font-semibold text-foreground">Authorised signatory details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-6">
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

        <h3 className="text-sm font-semibold text-foreground pt-2">Proof of address</h3>
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-6">
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-6">
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

  function SummaryCard({
    title,
    onEdit,
    rows,
  }: {
    title: string;
    onEdit: () => void;
    rows: { label: string; value: string }[];
  }) {
    return (
      <div className="rounded-lg border border-border p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-foreground">{title}</h3>
          <button
            type="button"
            onClick={onEdit}
            className="text-sm font-medium text-primary hover:underline"
          >
            Edit
          </button>
        </div>
        <div className="space-y-3">
          {rows.map((row) => (
            <div key={row.label} className="flex flex-col md:flex-row gap-1 md:gap-8">
              <span className="w-auto md:w-48 shrink-0 text-sm text-muted-foreground">{row.label}</span>
              <span className="text-sm text-foreground">{row.value || "\u2014"}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  function renderSummary() {
    if (kycSubmitted) {
      return (
        <section className="space-y-6">
          <div className="rounded-lg border border-border p-10 text-center space-y-3">
            <div className="flex justify-center">
              <CheckCircle size={48} weight="fill" className="text-primary" />
            </div>
            <h2 className="text-lg font-bold text-foreground">KYC submitted for review</h2>
            <p className="text-sm text-muted-foreground">
              We will reach out to you once we have verified your KYC, it would usually take 2-4 working days
            </p>
          </div>
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between rounded-lg border border-border px-5 py-3">
            <span className="text-sm text-muted-foreground">
              Ref ID. - {Math.floor(10000000 + Math.random() * 90000000)}
            </span>
            <Button variant="outline" onClick={() => window.location.reload()}>
              Go to home
            </Button>
          </div>
        </section>
      );
    }

    const gs = formData.getStarted;
    const cd = formData.companyDocuments;
    const bd = formData.businessDetails;
    const sig = formData.signatory;

    const regTypeLabel =
      REGISTRATION_TYPE_OPTIONS.find((o) => o.value === gs.registrationType)?.label || gs.registrationType;

    const bdRegTypeLabel =
      REGISTRATION_TYPE_OPTIONS.find((o) => o.value === bd.registrationType)?.label || bd.registrationType;

    return (
      <section className="space-y-5">
        <SummaryCard
          title="Get started"
          onEdit={() => setCurrentStep(0)}
          rows={[
            { label: "Business PAN", value: gs.pan },
            { label: "Registration type", value: regTypeLabel },
          ]}
        />

        <SummaryCard
          title="Company documents"
          onEdit={() => { setCurrentStep(1); setCurrentSubStep(0); }}
          rows={[
            ...(cd.hasGst
              ? [{ label: "GST number", value: cd.gstNumber }]
              : [{ label: "GST", value: "Non-GST declaration provided" }]),
            ...(cd.regulatorDocType
              ? [{ label: "Regulator document", value: REGULATOR_DOC_OPTIONS.find((o) => o.value === cd.regulatorDocType)?.label || cd.regulatorDocType }]
              : []),
          ]}
        />

        <SummaryCard
          title="Business details"
          onEdit={() => { setCurrentStep(1); setCurrentSubStep(1); }}
          rows={[
            { label: "Business description", value: bd.businessDescription },
            { label: "Merchant DBA name", value: bd.merchantDbaName },
            { label: "Accept payments", value: bd.acceptPayments },
            ...(bd.websiteLink ? [{ label: "Website link", value: bd.websiteLink }] : []),
            ...(bd.appPlatform ? [{ label: "App platform", value: APP_PLATFORM_OPTIONS.find((o) => o.value === bd.appPlatform)?.label || bd.appPlatform }] : []),
            ...(bd.appLink ? [{ label: "App link", value: bd.appLink }] : []),
            { label: "Registration type", value: bdRegTypeLabel },
          ]}
        />

        <SummaryCard
          title="Signatory details"
          onEdit={() => setCurrentStep(2)}
          rows={[
            { label: "Full name", value: sig.name },
            { label: "Designation", value: sig.designation },
            { label: "PAN", value: sig.pan },
            { label: "Email", value: sig.email },
          ]}
        />
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
            return renderCompanyDocuments();
          case 1:
            return renderBusinessDetails();
        }
        break;
      case 2:
        return renderSignatory();
      case 3:
        return renderSummary();
    }
  }

  // ── Display step number ──

  const displayStep = currentStep + 1;
  const totalSteps = 4;

  return (
    <div className="relative min-h-screen bg-muted/50">
      <Header />

      <div className="relative z-10 mx-auto max-w-[1080px] px-0 md:px-4 pt-0 md:pt-6 pb-0">
        <InsightsBreadcrumb />

        <div className="relative flex flex-col md:flex-row h-[calc(100vh-64px)] md:h-[calc(100vh-64px-41px-24px)] overflow-hidden rounded-none md:rounded-t-xl bg-card shadow-sm">
          <MobileStepIndicator currentStep={displayStep} totalSteps={totalSteps} stepTitle={stepTitle} />
          <Sidebar steps={sidebarSteps} />

          <main className="flex-1 flex flex-col min-h-0">
            <div className="shrink-0 px-4 pt-4 md:px-6 md:pt-6">
              <div className="max-w-full md:max-w-[812px]">
                <StepHeader
                  currentStep={displayStep}
                  totalSteps={totalSteps}
                  title={stepTitle}
                  subtitle={isSummaryStep ? "Final step" : undefined}
                  onPrevious={isFirstStep || isSummaryStep ? undefined : handlePrevious}
                  onNext={
                    kycSubmitted
                      ? undefined
                      : isSummaryStep
                      ? handleSubmit
                      : handleNext
                  }
                  nextLabel={
                    isSummaryStep
                      ? "Submit for verification"
                      : undefined
                  }
                  hidePrevious={isSummaryStep || kycSubmitted}
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-4 pb-20 md:px-6 md:pb-6">
              <div className="max-w-full md:max-w-[812px]">
                {renderStepContent()}
              </div>
            </div>
          </main>
        </div>
      </div>

      {/* SKPI Loading Modal */}
      <Dialog open={skpiModalState === "loading"}>
        <DialogContent className="sm:max-w-md" onInteractOutside={(e) => e.preventDefault()}>
          <DialogHeader>
            <DialogTitle>Fetching SKPI details</DialogTitle>
            <DialogDescription>Looking up your Setu identifier from PAN...</DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
              <div className="h-full rounded-full bg-foreground animate-progress-bar" />
            </div>
            <p className="text-xs text-muted-foreground text-center">
              Don&apos;t refresh or close this page while we fetch your details.
            </p>
          </div>
        </DialogContent>
      </Dialog>

      {/* SKPI Results Modal */}
      <Dialog open={skpiModalState === "results"} onOpenChange={(open) => { if (!open) { setSkpiModalState("idle"); setSkpiFetchedData(null); } }}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>SKPI details fetched</DialogTitle>
            <DialogDescription>Review the details below and confirm to prefill your KYC form. You can edit any field afterwards.</DialogDescription>
          </DialogHeader>
          <div className="py-2 space-y-2 max-h-[400px] overflow-y-auto">
            {skpiFetchedData && Object.entries(skpiFetchedData).map(([key, value]) => (
              <div key={key} className="flex justify-between py-1.5 border-b border-border last:border-0">
                <span className="text-sm text-muted-foreground">{key}</span>
                <span className="text-sm font-medium text-foreground text-right max-w-[60%]">{value}</span>
              </div>
            ))}
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => { setSkpiModalState("idle"); setSkpiFetchedData(null); }}>
              Cancel
            </Button>
            <Button onClick={handleSkpiConfirm}>
              Confirm & Prefill
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Teal gradient — fixed to bottom */}
      <div
        aria-hidden
        className="pointer-events-none fixed -bottom-[80px] -z-10 h-[594px] animate-gradient-breathe"
        style={{
          width: "130vw",
          left: "calc(50% - 65vw)",
          background:
            "linear-gradient(185.32deg, #0099AD -31.37%, #0099AD 0.52%, #DDFEFF 96.2%)",
          opacity: 0.3,
          filter: "blur(47.6px)",
          transform: "rotate(180deg)",
        }}
      />
    </div>
  );
}
