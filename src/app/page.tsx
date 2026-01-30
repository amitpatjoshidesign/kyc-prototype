"use client";

import { useState, useMemo } from "react";
import Header from "@/components/Header";
import Breadcrumb from "@/components/Breadcrumb";
import Sidebar, { Step } from "@/components/Sidebar";
import StepHeader from "@/components/StepHeader";
import FileUploadField from "@/components/FileUploadField";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

// ── Form data types ──

interface GetStartedData {
  establishmentType: string;
  businessName: string;
  pan: string;
}

interface BusinessDetailsData {
  businessName: string;
  registrationNumber: string;
  gstNumber: string;
  dateOfIncorporation: string;
  businessType: string;
  website: string;
}

interface CompanyDocumentsData {
  memorandum: File | null;
  articles: File | null;
  certificate: File | null;
  boardResolution: File | null;
  beneficialOwner: File | null;
}

interface BusinessAddressData {
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
}

interface CategoryDocsData {
  categoryDoc1: File | null;
  categoryDoc2: File | null;
}

interface VerifyIdentityData {
  pan: string;
  aadhaar: string;
}

interface SignatoryData {
  name: string;
  designation: string;
  pan: string;
  email: string;
}

interface BankData {
  accountNumber: string;
  ifsc: string;
  bankName: string;
}

interface PocData {
  name: string;
  email: string;
  phone: string;
  designation: string;
}

interface FormData {
  getStarted: GetStartedData;
  businessDetails: BusinessDetailsData;
  companyDocuments: CompanyDocumentsData;
  businessAddress: BusinessAddressData;
  categoryDocs: CategoryDocsData;
  verifyIdentity: VerifyIdentityData;
  signatory: SignatoryData;
  bank: BankData;
  poc: PocData;
}

const initialFormData: FormData = {
  getStarted: { establishmentType: "", businessName: "", pan: "" },
  businessDetails: {
    businessName: "",
    registrationNumber: "",
    gstNumber: "",
    dateOfIncorporation: "",
    businessType: "",
    website: "",
  },
  companyDocuments: {
    memorandum: null,
    articles: null,
    certificate: null,
    boardResolution: null,
    beneficialOwner: null,
  },
  businessAddress: {
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    pincode: "",
    country: "",
  },
  categoryDocs: { categoryDoc1: null, categoryDoc2: null },
  verifyIdentity: { pan: "", aadhaar: "" },
  signatory: { name: "", designation: "", pan: "", email: "" },
  bank: { accountNumber: "", ifsc: "", bankName: "" },
  poc: { name: "", email: "", phone: "", designation: "" },
};

// ── Helpers ──

function countFilled(obj: object): number {
  return Object.values(obj).filter((v) => v !== "" && v !== null).length;
}

const STEP_TITLES = [
  "Get started",
  "Verify your business",
  "Verify your identity",
  "Signatory details",
  "Bank account verification",
  "Add POCs",
];

const SUB_STEP_TITLES = [
  "Business details",
  "Company documents",
  "Business address",
  "Category specific docs",
];

// ── Input field component ──

function TextField({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
}) {
  return (
    <div>
      <Label className="mb-1.5 block">{label}</Label>
      <Input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />
    </div>
  );
}

function SelectField({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <div>
      <Label className="mb-1.5 block">{label}</Label>
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
    </div>
  );
}

// ── Main page component ──

export default function Home() {
  const [currentStep, setCurrentStep] = useState(0);
  const [currentSubStep, setCurrentSubStep] = useState(0);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [hasGst, setHasGst] = useState(true);

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

  function handleNext() {
    if (currentStep === 1) {
      if (currentSubStep < 3) {
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
      if (currentStep - 1 === 1) setCurrentSubStep(3);
    }
  }

  function handleSubmit() {
    alert("KYC form submitted!");
  }

  // ── Sidebar steps computation ──

  const sidebarSteps: Step[] = useMemo(() => {
    const getStartedFilled = countFilled(formData.getStarted);
    const getStartedTotal = Object.keys(formData.getStarted).length;

    const bdFilled = countFilled(formData.businessDetails);
    const bdTotal = Object.keys(formData.businessDetails).length;
    const cdFilled = countFilled(formData.companyDocuments);
    const cdTotal = Object.keys(formData.companyDocuments).length;
    const baFilled = countFilled(formData.businessAddress);
    const baTotal = Object.keys(formData.businessAddress).length;
    const catFilled = countFilled(formData.categoryDocs);
    const catTotal = Object.keys(formData.categoryDocs).length;

    const verifyFilled = countFilled(formData.verifyIdentity);
    const verifyTotal = Object.keys(formData.verifyIdentity).length;

    const sigFilled = countFilled(formData.signatory);
    const sigTotal = Object.keys(formData.signatory).length;

    const bankFilled = countFilled(formData.bank);
    const bankTotal = Object.keys(formData.bank).length;

    const pocFilled = countFilled(formData.poc);
    const pocTotal = Object.keys(formData.poc).length;

    const step1Complete = getStartedFilled === getStartedTotal;
    const step2Complete =
      bdFilled === bdTotal &&
      cdFilled === cdTotal &&
      baFilled === baTotal &&
      catFilled === catTotal;
    const step3Complete = verifyFilled === verifyTotal;
    const step4Complete = sigFilled === sigTotal;
    const step5Complete = bankFilled === bankTotal;

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
                {
                  label: "Business details",
                  completed: bdFilled,
                  total: bdTotal,
                  active: currentSubStep === 0,
                },
                {
                  label: "Company documents",
                  completed: cdFilled,
                  total: cdTotal,
                  active: currentSubStep === 1,
                },
                {
                  label: "Business address",
                  completed: baFilled,
                  total: baTotal,
                  active: currentSubStep === 2,
                },
                {
                  label: "Category specific docs",
                  completed: catFilled,
                  total: catTotal,
                  active: currentSubStep === 3,
                },
              ]
            : undefined,
      },
      {
        label: "Verify your identity",
        completed: step3Complete && currentStep > 2,
        active: currentStep === 2,
      },
      {
        label: "Signatory details",
        completed: step4Complete && currentStep > 3,
        active: currentStep === 3,
      },
      {
        label: "Bank account verification",
        completed: step5Complete && currentStep > 4,
        active: currentStep === 4,
      },
      {
        label: "Add POCs",
        completed: false,
        active: currentStep === 5,
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
        <SelectField
          label="Type of establishment"
          value={d.establishmentType}
          onChange={(v) => updateField("getStarted", "establishmentType", v)}
          options={[
            { value: "pvt_ltd", label: "Private Limited Company" },
            { value: "llp", label: "LLP" },
            { value: "partnership", label: "Partnership" },
            { value: "sole_proprietorship", label: "Sole Proprietorship" },
            { value: "trust", label: "Trust / Society" },
          ]}
        />
        <TextField
          label="Business name"
          value={d.businessName}
          onChange={(v) => updateField("getStarted", "businessName", v)}
          placeholder="Enter your registered business name"
        />
        <TextField
          label="PAN"
          value={d.pan}
          onChange={(v) => updateField("getStarted", "pan", v)}
          placeholder="ABCDE1234F"
        />
      </section>
    );
  }

  function renderBusinessDetails() {
    const d = formData.businessDetails;
    return (
      <section className="space-y-5">
        <div className="grid grid-cols-2 gap-x-6 gap-y-5">
          <TextField
            label="Business name"
            value={d.businessName}
            onChange={(v) => updateField("businessDetails", "businessName", v)}
            placeholder="Registered business name"
          />
          <TextField
            label="Registration number"
            value={d.registrationNumber}
            onChange={(v) =>
              updateField("businessDetails", "registrationNumber", v)
            }
            placeholder="CIN / LLPIN"
          />
          <TextField
            label="GST number"
            value={d.gstNumber}
            onChange={(v) => updateField("businessDetails", "gstNumber", v)}
            placeholder="22AAAAA0000A1Z5"
          />
          <TextField
            label="Date of incorporation"
            value={d.dateOfIncorporation}
            onChange={(v) =>
              updateField("businessDetails", "dateOfIncorporation", v)
            }
            type="date"
          />
          <SelectField
            label="Business type"
            value={d.businessType}
            onChange={(v) => updateField("businessDetails", "businessType", v)}
            options={[
              { value: "manufacturing", label: "Manufacturing" },
              { value: "services", label: "Services" },
              { value: "trading", label: "Trading" },
              { value: "ecommerce", label: "E-commerce" },
            ]}
          />
          <TextField
            label="Website"
            value={d.website}
            onChange={(v) => updateField("businessDetails", "website", v)}
            placeholder="https://example.com"
          />
        </div>
      </section>
    );
  }

  function renderCompanyDocuments() {
    const d = formData.companyDocuments;
    return (
      <section>
        <label className="mb-6 flex items-center gap-2.5 cursor-pointer">
          <Checkbox
            checked={hasGst}
            onCheckedChange={(checked) => setHasGst(checked === true)}
          />
          <span className="text-sm text-stone-700">I have GST proof</span>
        </label>
        <div className="grid grid-cols-2 gap-x-6 gap-y-5">
          <FileUploadField
            label="Memorandum of association"
            file={d.memorandum}
            helperText="Attested PDF under 5MB"
            onFileSelect={(f) =>
              updateField("companyDocuments", "memorandum", f)
            }
            onClear={() =>
              updateField("companyDocuments", "memorandum", null)
            }
          />
          <FileUploadField
            label="Articles of association"
            file={d.articles}
            helperText="Attested PDF under 5MB"
            onFileSelect={(f) =>
              updateField("companyDocuments", "articles", f)
            }
            onClear={() =>
              updateField("companyDocuments", "articles", null)
            }
          />
          <FileUploadField
            label="Certificate of Incorporation"
            file={d.certificate}
            helperText="Attested PDF under 5MB"
            onFileSelect={(f) =>
              updateField("companyDocuments", "certificate", f)
            }
            onClear={() =>
              updateField("companyDocuments", "certificate", null)
            }
          />
          <FileUploadField
            label="Board resolution"
            file={d.boardResolution}
            helperText="Attested PDF under 5MB"
            onFileSelect={(f) =>
              updateField("companyDocuments", "boardResolution", f)
            }
            onClear={() =>
              updateField("companyDocuments", "boardResolution", null)
            }
          />
          <FileUploadField
            label="Beneficial owner declaration"
            file={d.beneficialOwner}
            helperText="Attested PDF under 5MB"
            onFileSelect={(f) =>
              updateField("companyDocuments", "beneficialOwner", f)
            }
            onClear={() =>
              updateField("companyDocuments", "beneficialOwner", null)
            }
          />
        </div>
      </section>
    );
  }

  function renderBusinessAddress() {
    const d = formData.businessAddress;
    return (
      <section className="space-y-5">
        <div className="grid grid-cols-2 gap-x-6 gap-y-5">
          <div className="col-span-2">
            <TextField
              label="Address line 1"
              value={d.addressLine1}
              onChange={(v) =>
                updateField("businessAddress", "addressLine1", v)
              }
              placeholder="Street address"
            />
          </div>
          <div className="col-span-2">
            <TextField
              label="Address line 2"
              value={d.addressLine2}
              onChange={(v) =>
                updateField("businessAddress", "addressLine2", v)
              }
              placeholder="Apartment, suite, etc."
            />
          </div>
          <TextField
            label="City"
            value={d.city}
            onChange={(v) => updateField("businessAddress", "city", v)}
          />
          <TextField
            label="State"
            value={d.state}
            onChange={(v) => updateField("businessAddress", "state", v)}
          />
          <TextField
            label="Pincode"
            value={d.pincode}
            onChange={(v) => updateField("businessAddress", "pincode", v)}
            placeholder="110001"
          />
          <SelectField
            label="Country"
            value={d.country}
            onChange={(v) => updateField("businessAddress", "country", v)}
            options={[
              { value: "IN", label: "India" },
              { value: "US", label: "United States" },
              { value: "GB", label: "United Kingdom" },
              { value: "SG", label: "Singapore" },
            ]}
          />
        </div>
      </section>
    );
  }

  function renderCategoryDocs() {
    const d = formData.categoryDocs;
    return (
      <section>
        <p className="mb-5 text-sm text-stone-500">
          Upload category-specific documents required for your business type.
        </p>
        <div className="grid grid-cols-2 gap-x-6 gap-y-5">
          <FileUploadField
            label="Category document 1"
            file={d.categoryDoc1}
            helperText="Attested PDF under 5MB"
            onFileSelect={(f) =>
              updateField("categoryDocs", "categoryDoc1", f)
            }
            onClear={() =>
              updateField("categoryDocs", "categoryDoc1", null)
            }
          />
          <FileUploadField
            label="Category document 2"
            file={d.categoryDoc2}
            helperText="Attested PDF under 5MB"
            onFileSelect={(f) =>
              updateField("categoryDocs", "categoryDoc2", f)
            }
            onClear={() =>
              updateField("categoryDocs", "categoryDoc2", null)
            }
          />
        </div>
      </section>
    );
  }

  function renderVerifyIdentity() {
    const d = formData.verifyIdentity;
    return (
      <section className="space-y-5">
        <TextField
          label="PAN number"
          value={d.pan}
          onChange={(v) => updateField("verifyIdentity", "pan", v)}
          placeholder="ABCDE1234F"
        />
        <TextField
          label="Aadhaar number"
          value={d.aadhaar}
          onChange={(v) => updateField("verifyIdentity", "aadhaar", v)}
          placeholder="1234 5678 9012"
        />
      </section>
    );
  }

  function renderSignatory() {
    const d = formData.signatory;
    return (
      <section className="space-y-5">
        <div className="grid grid-cols-2 gap-x-6 gap-y-5">
          <TextField
            label="Full name"
            value={d.name}
            onChange={(v) => updateField("signatory", "name", v)}
            placeholder="Authorized signatory name"
          />
          <TextField
            label="Designation"
            value={d.designation}
            onChange={(v) => updateField("signatory", "designation", v)}
            placeholder="e.g. Director, CEO"
          />
          <TextField
            label="PAN"
            value={d.pan}
            onChange={(v) => updateField("signatory", "pan", v)}
            placeholder="ABCDE1234F"
          />
          <TextField
            label="Email"
            value={d.email}
            onChange={(v) => updateField("signatory", "email", v)}
            type="email"
            placeholder="signatory@company.com"
          />
        </div>
      </section>
    );
  }

  function renderBank() {
    const d = formData.bank;
    return (
      <section className="space-y-5">
        <div className="grid grid-cols-2 gap-x-6 gap-y-5">
          <TextField
            label="Account number"
            value={d.accountNumber}
            onChange={(v) => updateField("bank", "accountNumber", v)}
            placeholder="Enter account number"
          />
          <TextField
            label="IFSC code"
            value={d.ifsc}
            onChange={(v) => updateField("bank", "ifsc", v)}
            placeholder="SBIN0001234"
          />
          <div className="col-span-2">
            <TextField
              label="Bank name"
              value={d.bankName}
              onChange={(v) => updateField("bank", "bankName", v)}
              placeholder="e.g. State Bank of India"
            />
          </div>
        </div>
      </section>
    );
  }

  function renderPoc() {
    const d = formData.poc;
    return (
      <section className="space-y-5">
        <div className="grid grid-cols-2 gap-x-6 gap-y-5">
          <TextField
            label="POC name"
            value={d.name}
            onChange={(v) => updateField("poc", "name", v)}
            placeholder="Point of contact name"
          />
          <TextField
            label="Designation"
            value={d.designation}
            onChange={(v) => updateField("poc", "designation", v)}
            placeholder="e.g. Compliance Officer"
          />
          <TextField
            label="Email"
            value={d.email}
            onChange={(v) => updateField("poc", "email", v)}
            type="email"
            placeholder="poc@company.com"
          />
          <TextField
            label="Phone"
            value={d.phone}
            onChange={(v) => updateField("poc", "phone", v)}
            type="tel"
            placeholder="+91 98765 43210"
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
        }
        break;
      case 2:
        return renderVerifyIdentity();
      case 3:
        return renderSignatory();
      case 4:
        return renderBank();
      case 5:
        return renderPoc();
    }
  }

  // ── Display step number (accounting for sub-steps) ──

  const displayStep = currentStep + 1;
  const totalSteps = 6;

  return (
    <div className="relative min-h-screen bg-stone-50">
      <Header />

      <div className="relative mx-auto max-w-[1080px] px-4 pt-6 pb-0">
        <Breadcrumb />
        {/* Teal gradient behind central card */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 max-h-[640px]"
          style={{
            opacity: 0.3,
            background:
              "linear-gradient(5deg, #009CB0 -31.37%, #009CB0 0.52%, #D5FFFF 96.2%)",
            filter: "blur(47.6px)",
          }}
        />

        <div className="relative flex min-h-[calc(100vh-64px-41px-24px)] overflow-hidden rounded-t-xl bg-white shadow-sm">
          <Sidebar steps={sidebarSteps} />

          <main className="flex-1 p-8">
            <div className="max-w-[812px]">
              <StepHeader
                currentStep={displayStep}
                totalSteps={totalSteps}
                title={stepTitle}
                onPrevious={isFirstStep ? undefined : handlePrevious}
                onNext={
                  isLastStep ? handleSubmit : handleNext
                }
              />

              {renderStepContent()}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
