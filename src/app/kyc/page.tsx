"use client";

import { useState, useMemo, useRef, useEffect, useCallback } from "react";
import Header from "@/components/Header";
import Breadcrumb from "@/components/Breadcrumb";
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
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
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
  InputGroupButton,
  InputGroupTextarea,
} from "@/components/ui/input-group";
import { Kbd } from "@/components/ui/kbd";
import { Field, FieldLabel, FieldError } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
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
  Handshake,
  Scales,
  Shield,
  Building,
  Users,
  Calendar,
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

interface CkycrData {
  pan: string;
  companyType: string;
  mobileNumber: string;
  otp: string[];
  dateOfIncorporation: string;
  consent: boolean;
}

interface FormData {
  ckycr: CkycrData;
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
  ckycr: {
    pan: "",
    companyType: "",
    mobileNumber: "",
    otp: ["", "", "", "", "", ""],
    dateOfIncorporation: "",
    consent: false,
  },
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

// ── CKYCr helpers ──

function getCompanyTypeFromPAN(pan: string): string {
  if (pan.length < 4) return "";
  const char = pan[3].toUpperCase();
  const map: Record<string, string> = {
    P: "individual",
    F: "partnership",
    C: "pvt_ltd",
    T: "trust",
    A: "society",
    H: "individual",
  };
  return map[char] || "";
}

const COMPANY_TYPE_TO_REGISTRATION: Record<string, string> = {
  individual: "sole_proprietorship",
  partnership: "partnership",
  llp: "llp",
  trust: "trust",
  pvt_ltd: "pvt_ltd",
  public_ltd: "public_ltd",
  society: "trust",
  sole_prop: "sole_proprietorship",
};

const COMPANY_TYPE_OPTIONS = [
  { value: "individual", label: "Individual", icon: User },
  { value: "partnership", label: "Partnership", icon: Handshake },
  { value: "llp", label: "LLP", icon: Scales },
  { value: "trust", label: "Trust", icon: Shield },
  { value: "pvt_ltd", label: "Private Ltd.", icon: Buildings },
  { value: "public_ltd", label: "Public Ltd.", icon: Building },
  { value: "society", label: "Society", icon: Users },
  { value: "sole_prop", label: "Sole Prop.", icon: Storefront },
];

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
  "Auto verify using CKYCr",
  "Get started",
  "Verify your business",
  "Signatory details",
  "Bank account verification",
  "KYC Summary",
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
            <CheckCircle size={16} weight="fill" className="text-primary" />
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
  const [ckycrModalState, setCkycrModalState] = useState<"idle" | "loading" | "results">("idle");
  const [ckycrFetchedData, setCkycrFetchedData] = useState<Record<string, string> | null>(null);
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [otpSent, setOtpSent] = useState(false);
  const [otpTimer, setOtpTimer] = useState(0);
  const [kycSubmitted, setKycSubmitted] = useState(false);

  const startOtpTimer = useCallback(() => {
    setOtpSent(true);
    setOtpTimer(59);
  }, []);

  useEffect(() => {
    if (otpTimer <= 0) return;
    const id = setTimeout(() => setOtpTimer((t) => t - 1), 1000);
    return () => clearTimeout(id);
  }, [otpTimer]);

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
  const isLastStep = currentStep === 5;
  const isSummaryStep = currentStep === 5;

  function handleNext() {
    if (currentStep === 2) {
      if (currentSubStep < 4) {
        setCurrentSubStep((s) => s + 1);
        return;
      }
    }
    if (!isLastStep) {
      setCurrentStep((s) => s + 1);
      if (currentStep + 1 === 2) setCurrentSubStep(0);
    }
  }

  function handlePrevious() {
    if (currentStep === 2 && currentSubStep > 0) {
      setCurrentSubStep((s) => s - 1);
      return;
    }
    if (!isFirstStep) {
      setCurrentStep((s) => s - 1);
      if (currentStep - 1 === 2) setCurrentSubStep(4);
    }
  }

  function handleSubmit() {
    setKycSubmitted(true);
  }

  // ── CKYCr handlers ──

  function handleCkycrSubmit() {
    const d = formData.ckycr;
    if (!isValidPAN(d.pan)) return;
    if (!d.companyType) return;
    if (!d.consent) return;
    if (d.companyType === "individual") {
      if (!isValidPhone(d.mobileNumber)) return;
      if (d.otp.some((digit) => !digit)) return;
    } else {
      if (!d.dateOfIncorporation) return;
    }

    setCkycrModalState("loading");
    setTimeout(() => {
      setCkycrFetchedData({
        "Business Name": "Acme Technologies Pvt. Ltd.",
        "PAN": d.pan,
        "Registration Number": "U72200MH2020PTC345678",
        "Date of Incorporation": d.companyType === "individual" ? "01/01/1990" : d.dateOfIncorporation,
        "Registered Address": "42, MG Road, Fort",
        "City": "Mumbai",
        "State": "Maharashtra",
        "Pincode": "400001",
        "Signatory Name": "Rajesh Kumar",
        "Signatory Email": "rajesh@acmetech.in",
        "Signatory Designation": "Director",
        "Phone": d.companyType === "individual" ? d.mobileNumber : "9876543210",
      });
      setCkycrModalState("results");
    }, 3000);
  }

  function handleCkycrConfirm() {
    if (!ckycrFetchedData) return;
    setFormData((prev) => ({
      ...prev,
      getStarted: {
        ...prev.getStarted,
        pan: ckycrFetchedData["PAN"] || prev.getStarted.pan,
        phone: ckycrFetchedData["Phone"] || prev.getStarted.phone,
        registrationType: COMPANY_TYPE_TO_REGISTRATION[prev.ckycr.companyType] || prev.getStarted.registrationType,
      },
      businessDetails: {
        ...prev.businessDetails,
        merchantDbaName: ckycrFetchedData["Business Name"] || prev.businessDetails.merchantDbaName,
      },
      companyDocuments: {
        ...prev.companyDocuments,
        cin: ckycrFetchedData["Registration Number"] || prev.companyDocuments.cin,
      },
      businessAddress: {
        ...prev.businessAddress,
        regAddressLine1: ckycrFetchedData["Registered Address"] || prev.businessAddress.regAddressLine1,
        regCity: ckycrFetchedData["City"] || prev.businessAddress.regCity,
        regState: (ckycrFetchedData["State"] || "").toLowerCase().replace(/\s+/g, "_") || prev.businessAddress.regState,
        regPincode: ckycrFetchedData["Pincode"] || prev.businessAddress.regPincode,
      },
      signatory: {
        ...prev.signatory,
        name: ckycrFetchedData["Signatory Name"] || prev.signatory.name,
        email: ckycrFetchedData["Signatory Email"] || prev.signatory.email,
        designation: ckycrFetchedData["Signatory Designation"] || prev.signatory.designation,
      },
    }));
    setCkycrModalState("idle");
    setCkycrFetchedData(null);
    setCurrentStep(1);
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
        label: "Centralised KYC",
        completed: currentStep > 0,
        active: currentStep === 0,
      },
      {
        label: "Get started",
        completed: step1Complete && currentStep > 1,
        active: currentStep === 1,
      },
      {
        label: "Verify your business",
        completed: step2Complete && currentStep > 2,
        active: currentStep === 2,
        hasSubSteps: true,
        subSteps:
          currentStep === 2
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
        completed: step3Complete && currentStep > 3,
        active: currentStep === 3,
      },
      {
        label: "Bank account verification",
        completed: step4Complete && currentStep > 4,
        active: currentStep === 4,
      },
      ...(currentStep === 5
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

  const stepTitle = STEP_TITLES[currentStep];

  // ── Step content renderers ──

  function renderCkycr() {
    const d = formData.ckycr;
    const panVerification = getVerification(d.pan, isValidPAN);

    function handlePanChange(value: string) {
      const upper = value.toUpperCase();
      updateField("ckycr", "pan", upper);
      const detected = getCompanyTypeFromPAN(upper);
      if (detected) {
        updateField("ckycr", "companyType", detected);
      }
    }

    function handleOtpChange(index: number, value: string) {
      if (value.length > 1) value = value[value.length - 1];
      if (value && !/^\d$/.test(value)) return;
      const newOtp = [...d.otp];
      newOtp[index] = value;
      setFormData((prev) => ({
        ...prev,
        ckycr: { ...prev.ckycr, otp: newOtp },
      }));
      if (value && index < 5) {
        otpRefs.current[index + 1]?.focus();
      }
    }

    function handleOtpKeyDown(index: number, e: React.KeyboardEvent<HTMLInputElement>) {
      if (e.key === "Backspace" && !d.otp[index] && index > 0) {
        otpRefs.current[index - 1]?.focus();
      }
    }

    return (
      <section className="space-y-8">
        {/* PAN Section */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-foreground">Verify your PAN</h3>
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
            <p className="text-xs text-muted-foreground -mt-2">
              PAN Verified
            </p>
          )}
        </div>

        {/* Company Type Section */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-foreground">Type of your company</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {COMPANY_TYPE_OPTIONS.map((opt) => {
              const Icon = opt.icon;
              const isSelected = d.companyType === opt.value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => updateField("ckycr", "companyType", opt.value)}
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

        {/* Conditional Verification */}
        {d.companyType && (
          <div className="space-y-4">
            {d.companyType === "individual" ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-4">
                <div>
                  <Field data-invalid={getVerification(d.mobileNumber, isValidPhone) === "error" || undefined}>
                    <FieldLabel>Mobile number</FieldLabel>
                    <InputGroup>
                      <InputGroupAddon align="inline-start">
                        <Kbd>+91</Kbd>
                      </InputGroupAddon>
                      <InputGroupInput
                        type="tel"
                        value={d.mobileNumber}
                        onChange={(e) => updateField("ckycr", "mobileNumber", e.target.value)}
                        placeholder="10 digit mobile number"
                        aria-invalid={getVerification(d.mobileNumber, isValidPhone) === "error"}
                      />
                      <InputGroupAddon align="inline-end">
                        {!otpSent && isValidPhone(d.mobileNumber) && (
                          <InputGroupButton
                            variant="ghost"
                            size="xs"
                            className="text-primary font-semibold hover:text-primary"
                            style={{ fontSize: "14px" }}
                            onClick={startOtpTimer}
                          >
                            Send OTP
                          </InputGroupButton>
                        )}
                        {otpSent && otpTimer > 0 && (
                          <span className="text-xs text-muted-foreground whitespace-nowrap">
                            Resend in {otpTimer}s
                          </span>
                        )}
                        {otpSent && otpTimer === 0 && (
                          <InputGroupButton
                            variant="ghost"
                            size="xs"
                            className="text-primary font-semibold hover:text-primary"
                            style={{ fontSize: "14px" }}
                            onClick={startOtpTimer}
                          >
                            Resend OTP
                          </InputGroupButton>
                        )}
                      </InputGroupAddon>
                    </InputGroup>
                    {getValidationError(d.mobileNumber, isValidPhone, "Enter a valid 10-digit mobile number") && (
                      <FieldError>{getValidationError(d.mobileNumber, isValidPhone, "Enter a valid 10-digit mobile number")}</FieldError>
                    )}
                  </Field>
                </div>
                {otpSent && (
                  <div className="min-w-0">
                    <label className="block text-sm font-medium text-foreground mb-2">Enter OTP</label>
                    <div className="flex gap-2">
                      {d.otp.map((digit, i) => (
                        <input
                          key={i}
                          ref={(el) => { otpRefs.current[i] = el; }}
                          type="text"
                          inputMode="numeric"
                          maxLength={1}
                          value={digit}
                          onChange={(e) => handleOtpChange(i, e.target.value)}
                          onKeyDown={(e) => handleOtpKeyDown(i, e)}
                          className="h-10 min-w-0 flex-1 rounded-md border border-input bg-transparent text-foreground text-center text-sm font-medium focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Field>
                <FieldLabel>Date of incorporation</FieldLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <button
                      type="button"
                      className={cn(
                        "flex h-9 w-full items-center gap-2 rounded-md border border-input bg-transparent px-3 text-sm shadow-sm",
                        d.dateOfIncorporation ? "text-foreground" : "text-muted-foreground"
                      )}
                    >
                      <Calendar size={16} className="shrink-0 text-muted-foreground" />
                      {d.dateOfIncorporation
                        ? new Date(d.dateOfIncorporation).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })
                        : "Pick a date"}
                    </button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <CalendarComponent
                      mode="single"
                      selected={d.dateOfIncorporation ? new Date(d.dateOfIncorporation) : undefined}
                      onSelect={(date) =>
                        updateField("ckycr", "dateOfIncorporation", date ? date.toISOString().split("T")[0] : "")
                      }
                      disabled={(date) => date > new Date()}
                      captionLayout="dropdown"
                      startMonth={new Date(1950, 0)}
                      endMonth={new Date()}
                    />
                  </PopoverContent>
                </Popover>
              </Field>
            )}
          </div>
        )}

        {/* Consent */}
        <label className="flex items-center gap-2.5 cursor-pointer">
          <Checkbox
            checked={d.consent}
            onCheckedChange={(checked) =>
              updateField("ckycr", "consent", checked === true)
            }
          />
          <span className="text-sm text-foreground">
            I give my consent to fetch & share my details with the central KYC registry.
          </span>
        </label>
      </section>
    );
  }

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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-6">
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
          <div className="col-span-1 md:col-span-2">
            <TextField
              label="Merchant DBA name"
              value={d.merchantDbaName}
              onChange={(v) => updateField("businessDetails", "merchantDbaName", v)}
              placeholder="Doing Business As name"
              icon={<Storefront size={16} />}
            />
          </div>
          <div className="col-span-1 md:col-span-2">
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

          <div className="col-span-1 md:col-span-2">
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
        <h3 className="text-sm font-semibold text-foreground">Registered address</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-6">
          <div className="col-span-1 md:col-span-2">
            <TextField
              label="Address line 1"
              value={d.regAddressLine1}
              onChange={(v) => updateField("businessAddress", "regAddressLine1", v)}
              placeholder="Street address"
              icon={<MapPin size={16} />}
            />
          </div>
          <div className="col-span-1 md:col-span-2">
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
          <span className="text-sm text-foreground">Communication address is the same as registered address</span>
        </label>

        {!d.sameAsRegistered && (
          <>
            <h3 className="text-sm font-semibold text-foreground pt-2">Communication address</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-6">
              <div className="col-span-1 md:col-span-2">
                <TextField
                  label="Address line 1"
                  value={d.commAddressLine1}
                  onChange={(v) => updateField("businessAddress", "commAddressLine1", v)}
                  placeholder="Street address"
                  icon={<MapPin size={16} />}
                />
              </div>
              <div className="col-span-1 md:col-span-2">
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
        <p className="mb-5 text-sm text-muted-foreground">
          Depending on the category and sub-category type, additional documents may be required.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-6">
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-6">
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

  function renderBank() {
    const d = formData.bank;
    return (
      <section className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-6">
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
              <span className="text-sm text-foreground">{row.value || "—"}</span>
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
    const bd = formData.businessDetails;
    const cd = formData.companyDocuments;
    const ba = formData.businessAddress;
    const sig = formData.signatory;
    const bank = formData.bank;

    const regTypeLabel =
      [
        { value: "pvt_ltd", label: "Private Limited Company" },
        { value: "public_ltd", label: "Public Limited Company" },
        { value: "llp", label: "LLP" },
        { value: "partnership", label: "Partnership Firm" },
        { value: "sole_proprietorship", label: "Sole Proprietorship" },
        { value: "opc", label: "One Person Company" },
        { value: "trust", label: "Trust / Society" },
        { value: "huf", label: "HUF" },
      ].find((o) => o.value === gs.registrationType)?.label || gs.registrationType;

    return (
      <section className="space-y-5">
        <SummaryCard
          title="Mobile verification"
          onEdit={() => setCurrentStep(1)}
          rows={[
            { label: "Mobile number", value: gs.phone },
            { label: "PAN", value: gs.pan },
          ]}
        />

        <SummaryCard
          title="Company registration details"
          onEdit={() => setCurrentStep(1)}
          rows={[
            { label: "Business registration type", value: regTypeLabel },
          ]}
        />

        <SummaryCard
          title="Business details"
          onEdit={() => { setCurrentStep(2); setCurrentSubStep(0); }}
          rows={[
            { label: "Business category", value: bd.businessCategory },
            { label: "Business sub-category", value: bd.businessSubCategory },
            { label: "Merchant DBA name", value: bd.merchantDbaName },
            { label: "Nature of business", value: bd.businessNature },
            { label: "Annual turnover", value: bd.annualTurnover },
            { label: "Business model", value: bd.businessModel },
            { label: "Accept payments", value: bd.paymentMode },
            ...(bd.websiteAppLink ? [{ label: "Website / App link", value: bd.websiteAppLink }] : []),
          ]}
        />

        <SummaryCard
          title="Company documents"
          onEdit={() => { setCurrentStep(2); setCurrentSubStep(1); }}
          rows={[
            ...(cd.hasGst
              ? [{ label: "GST number", value: cd.gstNumber }]
              : [{ label: "GST", value: "Non-GST declaration provided" }]),
            { label: "CIN", value: cd.cin },
          ]}
        />

        <SummaryCard
          title="Business address"
          onEdit={() => { setCurrentStep(2); setCurrentSubStep(2); }}
          rows={[
            { label: "Address line 1", value: ba.regAddressLine1 },
            { label: "Address line 2", value: ba.regAddressLine2 },
            { label: "City", value: ba.regCity },
            { label: "State", value: ba.regState },
            { label: "Pincode", value: ba.regPincode },
          ]}
        />

        <SummaryCard
          title="Signatory details"
          onEdit={() => setCurrentStep(3)}
          rows={[
            { label: "Full name", value: sig.name },
            { label: "Designation", value: sig.designation },
            { label: "PAN", value: sig.pan },
            { label: "Email", value: sig.email },
          ]}
        />

        <SummaryCard
          title="Bank account"
          onEdit={() => setCurrentStep(4)}
          rows={[
            { label: "Account number", value: bank.accountNumber },
            { label: "IFSC code", value: bank.ifsc },
          ]}
        />
      </section>
    );
  }

  function renderStepContent() {
    switch (currentStep) {
      case 0:
        return renderCkycr();
      case 1:
        return renderGetStarted();
      case 2:
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
      case 3:
        return renderSignatory();
      case 4:
        return renderBank();
      case 5:
        return renderSummary();
    }
  }

  // ── Display step number ──

  const displayStep = currentStep + 1;
  const totalSteps = 6;

  return (
    <div className="relative min-h-screen bg-accent">
      <Header />

      <div className="relative z-10 mx-auto max-w-[1080px] px-0 md:px-4 pt-0 md:pt-6 pb-0">
        <Breadcrumb />

        <div className="relative flex flex-col md:flex-row min-h-[calc(100vh-64px)] md:min-h-[calc(100vh-64px-41px-24px)] overflow-hidden rounded-none md:rounded-t-xl bg-card shadow-sm">
          <MobileStepIndicator currentStep={displayStep} totalSteps={totalSteps} stepTitle={stepTitle} />
          <Sidebar steps={sidebarSteps} />

          <main className="flex-1 p-4 pb-20 md:p-6">
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
                    : currentStep === 0
                    ? handleCkycrSubmit
                    : isSummaryStep
                    ? handleSubmit
                    : handleNext
                }
                nextLabel={
                  currentStep === 0
                    ? "Continue"
                    : isSummaryStep
                    ? "Submit for verification"
                    : undefined
                }
                hidePrevious={isSummaryStep || kycSubmitted}
              />

              {renderStepContent()}
            </div>
          </main>
        </div>
      </div>

      {/* CKYCr Loading Modal */}
      <Dialog open={ckycrModalState === "loading"}>
        <DialogContent className="sm:max-w-md" onInteractOutside={(e) => e.preventDefault()}>
          <DialogHeader>
            <DialogTitle>Fetching your details from CKYCr</DialogTitle>
            <DialogDescription>Connecting to CERSAI...</DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
              <div className="h-full rounded-full bg-primary animate-progress-bar" />
            </div>
            <p className="text-xs text-muted-foreground text-center">
              Don&apos;t refresh or close this page while we fetch your details.
            </p>
          </div>
        </DialogContent>
      </Dialog>

      {/* CKYCr Results Modal */}
      <Dialog open={ckycrModalState === "results"} onOpenChange={(open) => { if (!open) { setCkycrModalState("idle"); setCkycrFetchedData(null); } }}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Details fetched from CKYCr</DialogTitle>
            <DialogDescription>Review the details below and confirm to auto-fill your KYC form.</DialogDescription>
          </DialogHeader>
          <div className="py-2 space-y-2 max-h-[400px] overflow-y-auto">
            {ckycrFetchedData && Object.entries(ckycrFetchedData).map(([key, value]) => (
              <div key={key} className="flex justify-between py-1.5 border-b border-border last:border-0">
                <span className="text-sm text-muted-foreground">{key}</span>
                <span className="text-sm font-medium text-foreground">{value}</span>
              </div>
            ))}
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => { setCkycrModalState("idle"); setCkycrFetchedData(null); }}>
              Cancel
            </Button>
            <Button onClick={handleCkycrConfirm}>
              Confirm & Continue
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Teal gradient — full width, sticky bottom */}
      <div
        aria-hidden
        className="pointer-events-none sticky bottom-0 -z-10 h-[640px] w-full -mt-[640px]"
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
