"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import confetti from "canvas-confetti";
import Header from "@/components/Header";
import BbpsBreadcrumb from "@/components/BbpsBreadcrumb";
import Sidebar, { Step, MobileStepIndicator } from "@/components/Sidebar";
import StepHeader from "@/components/StepHeader";
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
import {
  InputGroup,
  InputGroupInput,
  InputGroupAddon,
  InputGroupButton,
  InputGroupTextarea,
} from "@/components/ui/input-group";
import { Kbd } from "@/components/ui/kbd";
import { Field, FieldLabel, FieldError } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import {
  IdentificationCard,
  Receipt,
  Storefront,
  Notepad,
  MapPin,
  Buildings,
  Building,
  CheckCircle,
  XCircle,
  User,
  Handshake,
  Scales,
  Shield,
  Users,
} from "@phosphor-icons/react";

// ── Validation utilities ──

function isValidPAN(pan: string): boolean {
  return /^[A-Z]{5}\d{4}[A-Z]$/.test(pan.toUpperCase());
}

function isValidGST(gst: string): boolean {
  return /^\d{2}[A-Z]{5}\d{4}[A-Z]\d[Z][A-Z\d]$/.test(gst.toUpperCase());
}

function isValidPincode(pincode: string): boolean {
  return /^[1-9]\d{5}$/.test(pincode);
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
  gstNumber: string;
  businessName: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
}

interface BusinessDetailsData {
  merchantDbaName: string;
  businessDescription: string;
}

interface BbpsFormData {
  getStarted: GetStartedData;
  companyDocuments: CompanyDocumentsData;
  businessDetails: BusinessDetailsData;
}

const initialFormData: BbpsFormData = {
  getStarted: { pan: "", registrationType: "" },
  companyDocuments: {
    gstNumber: "",
    businessName: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
  },
  businessDetails: {
    merchantDbaName: "",
    businessDescription: "",
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

const STEP_TITLES = ["Get started", "Verify your business", "KYC summary"];

const SUB_STEP_TITLES = ["Company documents", "Business details"];

const REGISTRATION_TYPE_OPTIONS = [
  { value: "pvt_ltd", label: "Private Ltd.", fullLabel: "Private Limited Company", icon: Buildings },
  { value: "public_ltd", label: "Public Ltd.", fullLabel: "Public Limited Company", icon: Building },
  { value: "llp", label: "LLP", fullLabel: "LLP", icon: Scales },
  { value: "partnership", label: "Partnership", fullLabel: "Partnership Firm", icon: Handshake },
  { value: "sole_proprietorship", label: "Sole Prop.", fullLabel: "Sole Proprietorship", icon: Storefront },
  { value: "opc", label: "OPC", fullLabel: "One Person Company", icon: User },
  { value: "trust", label: "Trust", fullLabel: "Trust / Society", icon: Shield },
  { value: "huf", label: "HUF", fullLabel: "HUF", icon: Users },
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

export default function BbpsBouKYC() {
  const [currentStep, setCurrentStep] = useState(0);
  const [currentSubStep, setCurrentSubStep] = useState(0);
  const [formData, setFormData] = useState<BbpsFormData>(initialFormData);
  const [skpiModalState, setSkpiModalState] = useState<"idle" | "loading" | "select" | "results">("idle");
  const [skpiFetchedData, setSkpiFetchedData] = useState<Record<string, string> | null>(null);
  const [existingKycRecords, setExistingKycRecords] = useState<Array<{
    product: string;
    pan: string;
    filledFields: number;
    totalFields: number;
    data: Record<string, string>;
  }>>([]);
  const [selectedKycIndex, setSelectedKycIndex] = useState<number | null>(null);
  const [gstModalState, setGstModalState] = useState<"idle" | "loading" | "results">("idle");
  const [gstFetchedData, setGstFetchedData] = useState<Record<string, string> | null>(null);
  const [kycSubmitted, setKycSubmitted] = useState(false);

  useEffect(() => {
    localStorage.setItem("kyc_started", "true");
  }, []);

  // ── Updaters ──

  function updateField<K extends keyof BbpsFormData>(
    section: K,
    field: keyof BbpsFormData[K],
    value: BbpsFormData[K][keyof BbpsFormData[K]]
  ) {
    setFormData((prev) => ({
      ...prev,
      [section]: { ...prev[section], [field]: value },
    }));
  }

  // ── Navigation ──

  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === 2;
  const isSummaryStep = currentStep === 2;

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
    confetti({
      particleCount: 150,
      spread: 100,
      origin: { y: 0 },
      gravity: 0.8,
      colors: ["#0293A6", "#03C0D9", "#E8FBFF", "#FF8C42", "#FFB347", "#FFFFFF"],
    });
  }

  // ── SKPI fetch handlers ──

  function handleSkpiFetch() {
    if (!isValidPAN(formData.getStarted.pan)) return;
    setSkpiModalState("loading");
    const pan = formData.getStarted.pan;
    setTimeout(() => {
      setExistingKycRecords([
        {
          product: "Account Aggregator",
          pan,
          filledFields: 8,
          totalFields: 10,
          data: {
            "Merchant DBA Name": "Acme Finserv Pvt. Ltd.",
            "Registration Type": "pvt_ltd",
            "PAN": pan,
            "GST Number": "27AABCA1234H1Z5",
            "Business Name": "Acme Finserv Private Limited",
            "Address": "301, Trade Tower, Bandra Kurla Complex",
            "City": "Mumbai",
            "State": "maharashtra",
            "Pincode": "400051",
            "Business Description": "Financial data aggregation and analytics services for lending institutions",
          },
        },
        {
          product: "UPI Deeplinks",
          pan,
          filledFields: 6,
          totalFields: 10,
          data: {
            "Merchant DBA Name": "Acme Pay",
            "Registration Type": "pvt_ltd",
            "PAN": pan,
            "GST Number": "27AABCA1234H1Z5",
            "Business Name": "Acme Payments Private Limited",
            "Address": "",
            "City": "",
            "State": "",
            "Pincode": "",
            "Business Description": "UPI payment collection and disbursement services",
          },
        },
        {
          product: "Payment Gateway",
          pan,
          filledFields: 9,
          totalFields: 10,
          data: {
            "Merchant DBA Name": "Acme Payments Pvt. Ltd.",
            "Registration Type": "pvt_ltd",
            "PAN": pan,
            "GST Number": "27AABCA1234H1Z5",
            "Business Name": "Acme Payments Private Limited",
            "Address": "301, Trade Tower, Bandra Kurla Complex",
            "City": "Mumbai",
            "State": "maharashtra",
            "Pincode": "400051",
            "Business Description": "Online payment gateway for e-commerce and subscription businesses",
          },
        },
      ]);
      setSkpiModalState("select");
    }, 3000);
  }

  function handleSelectKycRecord(index: number) {
    const record = existingKycRecords[index];
    if (!record) return;
    setSkpiFetchedData(record.data);
    setSkpiModalState("results");
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
        businessName: skpiFetchedData["Business Name"] || prev.companyDocuments.businessName,
        address: skpiFetchedData["Address"] || prev.companyDocuments.address,
        city: skpiFetchedData["City"] || prev.companyDocuments.city,
        state: skpiFetchedData["State"] || prev.companyDocuments.state,
        pincode: skpiFetchedData["Pincode"] || prev.companyDocuments.pincode,
      },
      businessDetails: {
        ...prev.businessDetails,
        merchantDbaName: skpiFetchedData["Merchant DBA Name"] || prev.businessDetails.merchantDbaName,
        businessDescription: skpiFetchedData["Business Description"] || prev.businessDetails.businessDescription,
      },
    }));
    setSkpiModalState("idle");
    setSkpiFetchedData(null);
  }

  // ── GST fetch handlers ──

  function handleGstFetch() {
    if (!isValidGST(formData.companyDocuments.gstNumber)) return;
    setGstModalState("loading");
    setTimeout(() => {
      setGstFetchedData({
        "Business Name": "Acme Payments Private Limited",
        "Address": "301, Trade Tower, Bandra Kurla Complex",
        "City": "Mumbai",
        "State": "maharashtra",
        "Pincode": "400051",
        "Merchant DBA Name": "Acme Payments Pvt. Ltd.",
      });
      setGstModalState("results");
    }, 3000);
  }

  function handleGstConfirm() {
    if (!gstFetchedData) return;
    setFormData((prev) => ({
      ...prev,
      companyDocuments: {
        ...prev.companyDocuments,
        businessName: gstFetchedData["Business Name"] || prev.companyDocuments.businessName,
        address: gstFetchedData["Address"] || prev.companyDocuments.address,
        city: gstFetchedData["City"] || prev.companyDocuments.city,
        state: gstFetchedData["State"] || prev.companyDocuments.state,
        pincode: gstFetchedData["Pincode"] || prev.companyDocuments.pincode,
      },
      businessDetails: {
        ...prev.businessDetails,
        merchantDbaName: gstFetchedData["Merchant DBA Name"] || prev.businessDetails.merchantDbaName,
      },
    }));
    setGstModalState("idle");
    setGstFetchedData(null);
  }

  // ── Sidebar steps computation ──

  const sidebarSteps: Step[] = useMemo(() => {
    const gsFilled = countFilled(formData.getStarted);
    const gsTotal = countTotal(formData.getStarted);

    const cdFilled = countFilled(formData.companyDocuments);
    const cdTotal = countTotal(formData.companyDocuments);

    const bdFilled = countFilled(formData.businessDetails);
    const bdTotal = countTotal(formData.businessDetails);

    const step0Complete = gsFilled === gsTotal;
    const step1Complete = cdFilled === cdTotal && bdFilled === bdTotal;

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
        label: "KYC summary",
        completed: kycSubmitted,
        active: currentStep === 2,
      },
    ];
  }, [formData, currentStep, currentSubStep, kycSubmitted]);

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
      <section className="space-y-2">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 items-end">
          <div className={panVerification === "verified" ? "col-span-2 md:col-span-3" : "col-span-2 md:col-span-4"}>
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
          </div>
          {panVerification === "verified" && (
            <Button variant="outline" className="h-9" onClick={handleSkpiFetch}>
              Check existing KYC
            </Button>
          )}
        </div>
        {panVerification === "verified" && (
          <div>
            <p className="text-xs text-muted-foreground">
              PAN Verified &mdash; Registration type auto-detected
            </p>
            <div className="space-y-2 mt-8">
              <h3 className="text-sm font-medium text-foreground">Registration type</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {REGISTRATION_TYPE_OPTIONS.map((opt) => {
                  const Icon = opt.icon;
                  const isSelected = d.registrationType === opt.value;
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => updateField("getStarted", "registrationType", opt.value)}
                      className={`flex h-9 items-center gap-2.5 rounded-lg border px-3 text-sm font-medium transition-colors ${
                        isSelected
                          ? "border-primary bg-secondary text-primary"
                          : "border-border bg-card text-muted-foreground hover:border-ring"
                      }`}
                    >
                      <Icon size={16} weight={isSelected ? "fill" : "regular"} className="shrink-0" />
                      {opt.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </section>
    );
  }

  function renderCompanyDocuments() {
    const d = formData.companyDocuments;
    const gstVerification = getVerification(d.gstNumber, isValidGST);

    return (
      <section className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-6">
          <div className="col-span-1 md:col-span-2 flex flex-col gap-2 sm:flex-row sm:items-end">
            <div className="flex-1">
              <TextField
                label="GST number"
                value={d.gstNumber}
                onChange={(v) => updateField("companyDocuments", "gstNumber", v.toUpperCase())}
                placeholder="22AAAAA0000A1Z5"
                icon={<Receipt size={16} />}
                verification={gstVerification}
                error={getValidationError(d.gstNumber, isValidGST, "Enter a valid 15-character GST number")}
              />
            </div>
            {gstVerification === "verified" && (
              <Button variant="outline" className="shrink-0" onClick={handleGstFetch}>
                Fetch details
              </Button>
            )}
          </div>
          <div className="col-span-1 md:col-span-2">
            <TextField
              label="Business name"
              value={d.businessName}
              onChange={(v) => updateField("companyDocuments", "businessName", v)}
              placeholder="Legal business name"
              icon={<Buildings size={16} />}
            />
          </div>
          <div className="col-span-1 md:col-span-2">
            <TextField
              label="Address"
              value={d.address}
              onChange={(v) => updateField("companyDocuments", "address", v)}
              placeholder="Registered office address"
              icon={<MapPin size={16} />}
            />
          </div>
          <TextField
            label="City"
            value={d.city}
            onChange={(v) => updateField("companyDocuments", "city", v)}
            placeholder="City"
          />
          <SelectField
            label="State"
            value={d.state}
            onChange={(v) => updateField("companyDocuments", "state", v)}
            options={INDIAN_STATES}
          />
          <TextField
            label="Pincode"
            value={d.pincode}
            onChange={(v) => updateField("companyDocuments", "pincode", v)}
            placeholder="400001"
            verification={getVerification(d.pincode, isValidPincode)}
            error={getValidationError(d.pincode, isValidPincode, "Enter a valid 6-digit pincode")}
          />
        </div>
      </section>
    );
  }

  function renderBusinessDetails() {
    const d = formData.businessDetails;
    return (
      <section className="space-y-5">
        <div className="grid grid-cols-1 gap-y-6">
          <TextField
            label="Merchant DBA name"
            value={d.merchantDbaName}
            onChange={(v) => updateField("businessDetails", "merchantDbaName", v)}
            placeholder="Doing Business As name"
            icon={<Storefront size={16} />}
          />
          <TextAreaField
            label="Business description"
            value={d.businessDescription}
            onChange={(v) => updateField("businessDetails", "businessDescription", v)}
            placeholder="Describe the nature of your business and what the BBPS integration will be used for"
            icon={<Notepad size={16} />}
            rows={4}
          />
        </div>
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

    const regTypeLabel =
      REGISTRATION_TYPE_OPTIONS.find((o) => o.value === gs.registrationType)?.fullLabel || gs.registrationType;

    const stateLabel =
      INDIAN_STATES.find((o) => o.value === cd.state)?.label || cd.state;

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
            { label: "GST number", value: cd.gstNumber },
            { label: "Business name", value: cd.businessName },
            { label: "Address", value: cd.address },
            { label: "City", value: cd.city },
            { label: "State", value: stateLabel },
            { label: "Pincode", value: cd.pincode },
          ]}
        />

        <SummaryCard
          title="Business details"
          onEdit={() => { setCurrentStep(1); setCurrentSubStep(1); }}
          rows={[
            { label: "Merchant DBA name", value: bd.merchantDbaName },
            { label: "Business description", value: bd.businessDescription },
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
        return renderSummary();
    }
  }

  // ── Display step number ──

  const displayStep = currentStep + 1;
  const totalSteps = 3;

  return (
    <div className="relative min-h-screen bg-muted/50">
      <Header />

      <div className="relative z-10 mx-auto max-w-[1080px] px-0 md:px-4 pt-0 md:pt-6 pb-0">
        <BbpsBreadcrumb />

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

      {/* Autofill Loading Modal */}
      <Dialog open={skpiModalState === "loading"}>
        <DialogContent className="sm:max-w-md" onInteractOutside={(e) => e.preventDefault()}>
          <DialogHeader>
            <DialogTitle>Fetching KYC details</DialogTitle>
            <DialogDescription>Looking up your existing KYC details from PAN...</DialogDescription>
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

      {/* Existing KYC Selection Modal */}
      <Dialog open={skpiModalState === "select"} onOpenChange={(open) => { if (!open) { setSkpiModalState("idle"); setExistingKycRecords([]); setSelectedKycIndex(null); } }}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>3 existing KYC found</DialogTitle>
            <DialogDescription>
              We found {existingKycRecords.length} existing KYC records for PAN {formData.getStarted.pan}. Select one to prefill your form.
            </DialogDescription>
          </DialogHeader>
          <div className="py-2 space-y-3 max-h-[400px] overflow-y-auto">
            {existingKycRecords.map((record, i) => {
              const remaining = record.totalFields - record.filledFields;
              const isSelected = selectedKycIndex === i;
              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => setSelectedKycIndex(i)}
                  className={`w-full rounded-lg border p-4 text-left transition-colors ${
                    isSelected
                      ? "border-foreground"
                      : "border-border/50 hover:border-border"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-semibold text-foreground">{record.product}</span>
                      </div>
                      <p className="text-xs text-muted-foreground">PAN: {record.pan}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {remaining === 0
                          ? "All fields available — no additional input needed"
                          : `${remaining} field${remaining > 1 ? "s" : ""} remaining for you to fill`}
                      </p>
                    </div>
                    <div className="flex-shrink-0">
                      <svg width="40" height="40" viewBox="0 0 40 40">
                        <circle cx="20" cy="20" r="16" fill="none" stroke="currentColor" strokeWidth="3" className="text-muted/50" />
                        <circle cx="20" cy="20" r="16" fill="none" stroke="currentColor" strokeWidth="3" className="text-ring" strokeLinecap="round"
                          strokeDasharray={`${2 * Math.PI * 16}`}
                          strokeDashoffset={`${2 * Math.PI * 16 * (1 - record.filledFields / record.totalFields)}`}
                          transform="rotate(-90 20 20)"
                        />
                        <text x="20" y="21" textAnchor="middle" dominantBaseline="middle" className="fill-muted-foreground" fontSize="9" fontWeight="600">
                          {Math.round((record.filledFields / record.totalFields) * 100)}%
                        </text>
                      </svg>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" className="w-[120px]" onClick={() => { setSkpiModalState("idle"); setExistingKycRecords([]); setSelectedKycIndex(null); }}>
              Exit
            </Button>
            <Button className="w-[120px]" disabled={selectedKycIndex === null} onClick={() => { if (selectedKycIndex !== null) handleSelectKycRecord(selectedKycIndex); }}>
              Next
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Autofill Results Modal */}
      <Dialog open={skpiModalState === "results"} onOpenChange={(open) => { if (!open) { setSkpiModalState("idle"); setSkpiFetchedData(null); } }}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>KYC details found</DialogTitle>
            <DialogDescription>Review the details below and confirm to prefill your form. You can edit any field afterwards.</DialogDescription>
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

      {/* GST Loading Modal */}
      <Dialog open={gstModalState === "loading"}>
        <DialogContent className="sm:max-w-md" onInteractOutside={(e) => e.preventDefault()}>
          <DialogHeader>
            <DialogTitle>Fetching GST details</DialogTitle>
            <DialogDescription>Looking up business details from GST number...</DialogDescription>
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

      {/* GST Results Modal */}
      <Dialog open={gstModalState === "results"} onOpenChange={(open) => { if (!open) { setGstModalState("idle"); setGstFetchedData(null); } }}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>GST details fetched</DialogTitle>
            <DialogDescription>Review the details below and confirm to prefill your form. You can edit any field afterwards.</DialogDescription>
          </DialogHeader>
          <div className="py-2 space-y-2 max-h-[400px] overflow-y-auto">
            {gstFetchedData && Object.entries(gstFetchedData).map(([key, value]) => {
              const displayValue = key === "State"
                ? INDIAN_STATES.find((s) => s.value === value)?.label || value
                : value;
              return (
                <div key={key} className="flex justify-between py-1.5 border-b border-border last:border-0">
                  <span className="text-sm text-muted-foreground">{key}</span>
                  <span className="text-sm font-medium text-foreground text-right max-w-[60%]">{displayValue}</span>
                </div>
              );
            })}
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => { setGstModalState("idle"); setGstFetchedData(null); }}>
              Cancel
            </Button>
            <Button onClick={handleGstConfirm}>
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
