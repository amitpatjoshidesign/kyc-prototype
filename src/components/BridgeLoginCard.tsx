"use client";

import { type FormEvent, useMemo, useState } from "react";
import {
  ArrowLeft,
  CheckCircle,
  Eye,
  EyeSlash,
  PaperPlaneTilt,
  X,
} from "@phosphor-icons/react";
import { REGEXP_ONLY_DIGITS } from "input-otp";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Input } from "@/components/ui/input";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { cn } from "@/lib/utils";

type AuthMode = "login" | "signup";
type AuthStep = "credentials" | "verify-email" | "account-setup" | "success" | "reset-password";
type AuthSurfaceVariant = "split" | "center-card";
type FieldKey =
  | "email"
  | "password"
  | "companyName"
  | "workspaceName"
  | "verificationCode"
  | "terms";

type BridgeLoginCardProps = {
  onSuccess: () => void;
  onClose?: () => void;
  className?: string;
  initialMode?: AuthMode;
  variant?: AuthSurfaceVariant;
};

type AuthFormState = {
  email: string;
  password: string;
  companyName: string;
  workspaceName: string;
  verificationCode: string;
  keepSignedIn: boolean;
  termsAccepted: boolean;
};

const INITIAL_STATE: AuthFormState = {
  email: "",
  password: "",
  companyName: "",
  workspaceName: "",
  verificationCode: "",
  keepSignedIn: true,
  termsAccepted: false,
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const DEMO_CODE = "123456";

const PASSWORD_REQUIREMENTS = [
  {
    label: "8+ characters",
    test: (value: string) => value.length >= 8,
  },
  {
    label: "Uppercase",
    test: (value: string) => /[A-Z]/.test(value),
  },
  {
    label: "Lowercase",
    test: (value: string) => /[a-z]/.test(value),
  },
  {
    label: "Special character",
    test: (value: string) => /[^A-Za-z0-9]/.test(value),
  },
  {
    label: "Number",
    test: (value: string) => /\d/.test(value),
  },
];

function isValidEmail(value: string) {
  return EMAIL_PATTERN.test(value.trim());
}

function isValidSignupPassword(value: string) {
  return PASSWORD_REQUIREMENTS.every((requirement) => requirement.test(value));
}

function getStoredSurveyStatus() {
  if (typeof window === "undefined") {
    return null;
  }

  return localStorage.getItem("bridge_survey_completed");
}

export function BridgeLoginCard({
  onSuccess,
  onClose,
  className,
  initialMode = "login",
  variant = "split",
}: BridgeLoginCardProps) {
  const [mode, setMode] = useState<AuthMode>(initialMode);
  const [step, setStep] = useState<AuthStep>("credentials");
  const [form, setForm] = useState<AuthFormState>(INITIAL_STATE);
  const [errors, setErrors] = useState<Partial<Record<FieldKey, string>>>({});
  const [showPassword, setShowPassword] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");

  const title = useMemo(() => {
    if (step === "verify-email") {
      return mode === "login" ? "Verify your login" : "Verify your email";
    }

    if (step === "account-setup") {
      return "Set up your account";
    }

    if (step === "success") {
      return "Your account has been set up!";
    }

    if (step === "reset-password") {
      return "Reset password";
    }

    return mode === "login" ? "Sign in" : "Create an account";
  }, [mode, step]);

  const subtitle = useMemo(() => {
    if (step === "verify-email") {
      return `Enter the 6-digit OTP sent to ${form.email || "your email"}.`;
    }

    if (step === "account-setup") {
      return "Add a few details to personalise your Bridge workspace.";
    }

    if (step === "success") {
      return getStoredSurveyStatus()
        ? "You can now continue where you left off."
        : "A few quick questions will help tailor your workspace next.";
    }

    if (step === "reset-password") {
      return "Enter your work email and we'll send password reset instructions.";
    }

    return mode === "login"
      ? "Welcome to bridge, sign in to get started."
      : "Use your work email to start setting up Bridge.";
  }, [form.email, mode, step]);

  function updateField<K extends keyof AuthFormState>(key: K, value: AuthFormState[K]) {
    setForm((current) => ({ ...current, [key]: value }));
    setErrors((current) => {
      if (!current[key as FieldKey]) {
        return current;
      }

      const next = { ...current };
      delete next[key as FieldKey];
      return next;
    });
  }

  function switchMode(nextMode: AuthMode) {
    setMode(nextMode);
    setStep("credentials");
    setErrors({});
    setStatusMessage("");
    setForm((current) => ({
      ...INITIAL_STATE,
      email: current.email,
      keepSignedIn: current.keepSignedIn,
    }));
  }

  function goBackToCredentials() {
    setStep("credentials");
    setErrors({});
    setStatusMessage("");
  }

  function persistAuth() {
    const email = form.email.trim() || "amit@setu.co";

    localStorage.setItem("bridge_auth", "true");
    localStorage.setItem("bridge_email", email);
    localStorage.setItem("bridge_keep_signed_in", String(form.keepSignedIn));
  }

  function validateLogin() {
    const nextErrors: Partial<Record<FieldKey, string>> = {};

    if (!form.email.trim()) {
      nextErrors.email = "Enter your email or username.";
    } else if (form.email.includes("@") && !isValidEmail(form.email)) {
      nextErrors.email = "Enter a valid email address.";
    }

    if (!form.password.trim()) {
      nextErrors.password = "Enter your password.";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  function validateSignup() {
    const nextErrors: Partial<Record<FieldKey, string>> = {};

    if (!form.email.trim()) {
      nextErrors.email = "Enter your work email.";
    } else if (!isValidEmail(form.email)) {
      nextErrors.email = "Enter a valid work email address.";
    }

    if (!form.password.trim()) {
      nextErrors.password = "Create a password.";
    } else if (!isValidSignupPassword(form.password)) {
      nextErrors.password = "Password must meet all requirements.";
    }

    if (!form.termsAccepted) {
      nextErrors.terms = "Accept the terms to continue.";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  function validateVerification() {
    const nextErrors: Partial<Record<FieldKey, string>> = {};
    const code = form.verificationCode.trim();

    if (!code) {
      nextErrors.verificationCode = "Enter the verification code.";
    } else if (code.length !== 6) {
      nextErrors.verificationCode = "Enter the 6-digit OTP.";
    } else if (code !== DEMO_CODE) {
      nextErrors.verificationCode = "Use 123456 for this prototype.";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  function validateAccountSetup() {
    const nextErrors: Partial<Record<FieldKey, string>> = {};

    if (!form.companyName.trim()) {
      nextErrors.companyName = "Enter your company name.";
    }

    if (!form.workspaceName.trim()) {
      nextErrors.workspaceName = "Enter a workspace name.";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setStatusMessage("");

    if (step === "reset-password") {
      if (!form.email.trim()) {
        setErrors({ email: "Enter the email for your Bridge account." });
        return;
      }

      if (form.email.includes("@") && !isValidEmail(form.email)) {
        setErrors({ email: "Enter a valid email address." });
        return;
      }

      setStatusMessage("Password reset instructions sent.");
      return;
    }

    if (step === "verify-email") {
      if (!validateVerification()) {
        return;
      }

      localStorage.setItem("bridge_email_verified", "true");
      setStatusMessage("");
      if (mode === "login") {
        persistAuth();
        onSuccess();
        return;
      }

      setStep("account-setup");
      return;
    }

    if (step === "account-setup") {
      if (!validateAccountSetup()) {
        return;
      }

      localStorage.setItem("bridge_account_setup_completed", "true");
      localStorage.setItem(
        "bridge_account_setup",
        JSON.stringify({
          companyName: form.companyName.trim(),
          workspaceName: form.workspaceName.trim(),
        })
      );
      persistAuth();
      setStep("success");
      return;
    }

    if (mode === "login") {
      if (!validateLogin()) {
        return;
      }

      setForm((current) => ({ ...current, verificationCode: "" }));
      setStep("verify-email");
      return;
    }

    if (!validateSignup()) {
      return;
    }

    localStorage.setItem("bridge_signup_completed", "true");
    setForm((current) => ({ ...current, verificationCode: "" }));
    setStep("verify-email");
  }

  function handleResendCode() {
    setStatusMessage("");
  }

  function handleContinueAfterSuccess() {
    onSuccess();
  }

  const formId = `bridge-${mode}-${step}-form`;
  const isCenterCard = variant === "center-card";

  return (
    <section
      className={cn(
        isCenterCard
          ? "flex h-[560px] max-h-[calc(100vh-48px)] w-[calc(100vw-32px)] max-w-[420px] overflow-hidden rounded-[24px] bg-white shadow-2xl"
          : "flex h-[640px] max-h-[calc(100vh-32px)] w-full max-w-[860px] overflow-hidden rounded-[24px] bg-white",
        className
      )}
    >
      {!isCenterCard && (
        <div className="relative hidden w-[473px] shrink-0 overflow-hidden lg:block">
          <img
            src="/login-bridge-splash.png"
            alt=""
            className="absolute left-0 top-[-53px] h-[728px] w-[485px] max-w-none object-cover"
          />
          <div className="absolute inset-0 bg-[#09383e] mix-blend-color" />
          <img
            src="/setu-by-pinelabs-logo.svg"
            alt="Setu by Pine Labs"
            className="absolute bottom-8 left-1/2 h-8 w-[61px] -translate-x-1/2"
          />
        </div>
      )}

      <div
        className={cn(
          "flex min-w-0 flex-1 flex-col overflow-y-auto bg-white px-6 pb-8 pt-10 sm:px-8 sm:pt-12",
          isCenterCard && "w-full flex-none px-6 pb-6 pt-8 sm:px-6 sm:pb-6 sm:pt-8"
        )}
      >
        <div className="flex min-h-0 flex-1 flex-col gap-8">
          <div className="flex min-h-0 flex-col">
            <AuthHeader
              onClose={onClose}
              showLogo={isCenterCard}
              subtitle={subtitle}
              title={title}
              onBack={step === "credentials" ? undefined : goBackToCredentials}
            />

            <form
              id={formId}
              onSubmit={handleSubmit}
              className="flex min-h-0 flex-col gap-4"
            >
              {step === "credentials" && mode === "login" && (
                <LoginFields
                  errors={errors}
                  form={form}
                  showPassword={showPassword}
                  onForgotPassword={() => {
                    setErrors({});
                    setStatusMessage("");
                    setStep("reset-password");
                  }}
                  onTogglePassword={() => setShowPassword((visible) => !visible)}
                  onUpdate={updateField}
                />
              )}

              {step === "credentials" && mode === "signup" && (
                <SignupFields
                  errors={errors}
                  form={form}
                  showPassword={showPassword}
                  onTogglePassword={() => setShowPassword((visible) => !visible)}
                  onUpdate={updateField}
                />
              )}

              {step === "verify-email" && (
                <VerifyEmailFields
                  errors={errors}
                  value={form.verificationCode}
                  onResend={handleResendCode}
                  onUpdate={(value) => updateField("verificationCode", value)}
                />
              )}

              {step === "account-setup" && (
                <AccountSetupFields errors={errors} form={form} onUpdate={updateField} />
              )}

              {step === "reset-password" && (
                <ResetPasswordFields
                  email={form.email}
                  error={errors.email}
                  onUpdate={(value) => updateField("email", value)}
                />
              )}

              {statusMessage && (
                <p className="rounded-lg bg-primary/10 px-3 py-2 text-sm text-primary">
                  {statusMessage}
                </p>
              )}
            </form>

            {step === "success" && <SuccessState />}
          </div>

          <AuthFooter
            formId={formId}
            mode={mode}
            step={step}
            onContinueAfterSuccess={handleContinueAfterSuccess}
            onSwitchMode={switchMode}
          />
        </div>
      </div>
    </section>
  );
}

type CommonFormProps = {
  form: AuthFormState;
  errors: Partial<Record<FieldKey, string>>;
  onUpdate: <K extends keyof AuthFormState>(key: K, value: AuthFormState[K]) => void;
};

function AuthHeader({
  onClose,
  onBack,
  showLogo = false,
  subtitle,
  title,
}: {
  onClose?: () => void;
  onBack?: () => void;
  showLogo?: boolean;
  subtitle: string;
  title: string;
}) {
  return (
    <div className="mb-4 flex flex-col gap-4">
      <div className="flex min-h-8 items-start justify-between">
        {onBack ? (
          <button
            type="button"
            onClick={onBack}
            className="flex h-6 w-fit items-center gap-1.5 text-sm font-medium text-stone-500 transition-colors hover:text-stone-950"
          >
            <ArrowLeft data-icon="inline-start" />
            Back
          </button>
        ) : (
          <div className={cn("flex items-center", !showLogo && "lg:hidden")}>
            <img
              src="/setu-by-pinelabs-logo.svg"
              alt="Setu by Pine Labs"
              className="h-8 w-[61px] brightness-0"
            />
          </div>
        )}
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            aria-label="Close sign in modal"
            className="ml-auto flex size-6 items-center justify-center rounded-full border border-white/60 bg-white/50 text-slate-700 transition-colors hover:bg-white/70 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900"
          >
            <X size={14} weight="bold" />
          </button>
        )}
      </div>

      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold leading-8 text-stone-950">{title}</h1>
        <p className="text-sm leading-5 text-stone-500">{subtitle}</p>
      </div>
    </div>
  );
}

function LoginFields({
  errors,
  form,
  onForgotPassword,
  onTogglePassword,
  onUpdate,
  showPassword,
}: CommonFormProps & {
  onForgotPassword: () => void;
  onTogglePassword: () => void;
  showPassword: boolean;
}) {
  return (
    <FieldGroup className="gap-6">
      <TextField
        autoComplete="username"
        error={errors.email}
        id="login-email"
        label="Email"
        placeholder="Email or username"
        type="text"
        value={form.email}
        onChange={(value) => onUpdate("email", value)}
      />

      <PasswordField
        error={errors.password}
        id="login-password"
        label="Password"
        placeholder="Enter password"
        showPassword={showPassword}
        value={form.password}
        onChange={(value) => onUpdate("password", value)}
        onToggle={onTogglePassword}
      />

      <div className="flex items-center justify-between gap-4">
        <label className="flex cursor-pointer items-center gap-2 text-sm font-medium leading-none text-stone-950">
          <Checkbox
            checked={form.keepSignedIn}
            onCheckedChange={(checked) => onUpdate("keepSignedIn", checked === true)}
            className="size-4 rounded border-primary data-[state=checked]:bg-primary"
          />
          Keep me signed in
        </label>

        <button
          type="button"
          onClick={onForgotPassword}
          className="shrink-0 text-sm leading-5 text-stone-500 underline underline-offset-2 hover:text-stone-700"
        >
          Forgot password?
        </button>
      </div>
    </FieldGroup>
  );
}

function SignupFields({
  errors,
  form,
  onTogglePassword,
  onUpdate,
  showPassword,
}: CommonFormProps & {
  onTogglePassword: () => void;
  showPassword: boolean;
}) {
  return (
    <FieldGroup className="gap-6">
      <TextField
        autoComplete="email"
        error={errors.email}
        id="signup-email"
        label="Work email"
        placeholder="you@company.com"
        type="email"
        value={form.email}
        onChange={(value) => onUpdate("email", value)}
      />
      <div className="flex flex-col gap-4">
        <PasswordField
          autoComplete="new-password"
          error={errors.password}
          id="signup-password"
          label="Password"
          placeholder="Create password"
          showPassword={showPassword}
          value={form.password}
          onChange={(value) => onUpdate("password", value)}
          onToggle={onTogglePassword}
        />
        <PasswordRequirementList value={form.password} />
      </div>
      <Field data-invalid={!!errors.terms} className="gap-2">
        <label className="flex cursor-pointer items-start gap-2 text-sm leading-5 text-stone-600">
          <Checkbox
            checked={form.termsAccepted}
            aria-invalid={!!errors.terms}
            onCheckedChange={(checked) => onUpdate("termsAccepted", checked === true)}
            className="mt-0.5 size-4 rounded border-primary data-[state=checked]:bg-primary"
          />
          <span>
            I agree to the{" "}
            <button
              type="button"
              className="font-medium text-primary underline underline-offset-2"
            >
              terms and conditions
            </button>
            .
          </span>
        </label>
        {errors.terms && <FieldError>{errors.terms}</FieldError>}
      </Field>
    </FieldGroup>
  );
}

function PasswordRequirementList({ value }: { value: string }) {
  return (
    <ul
      aria-live="polite"
      className="-mt-1 grid grid-cols-[max-content_max-content_max-content] gap-x-3 gap-y-1"
    >
      {PASSWORD_REQUIREMENTS.map((requirement) => {
        const isMet = requirement.test(value);

        return (
          <li
            key={requirement.label}
            className={cn(
              "inline-flex items-center gap-1 whitespace-nowrap text-xs font-normal leading-4 transition-colors",
              isMet ? "text-green-700" : "text-stone-400"
            )}
          >
            <CheckCircle
              size={12}
              weight={isMet ? "fill" : "regular"}
              className={isMet ? "text-green-600" : "text-stone-400"}
            />
            {requirement.label}
          </li>
        );
      })}
    </ul>
  );
}

function VerifyEmailFields({
  errors,
  onResend,
  onUpdate,
  value,
}: {
  errors: Partial<Record<FieldKey, string>>;
  onResend: () => void;
  onUpdate: (value: string) => void;
  value: string;
}) {
  const hasError = !!errors.verificationCode;
  const slotClassName = cn(
    "h-9 w-full border-stone-200 bg-stone-50 text-sm text-stone-950 shadow-none",
    hasError && "border-destructive text-destructive"
  );

  return (
    <FieldGroup className="gap-4">
      <Field data-invalid={hasError} className="gap-2">
        <FieldLabel
          htmlFor="verification-code"
          className="text-sm font-medium leading-5 text-stone-950"
        >
          Verification code
        </FieldLabel>
        <InputOTP
          id="verification-code"
          maxLength={6}
          pattern={REGEXP_ONLY_DIGITS}
          value={value}
          onChange={(nextValue) => onUpdate(nextValue)}
          aria-invalid={hasError}
          containerClassName="grid w-full grid-cols-[1fr_auto_1fr] gap-2"
        >
          <InputOTPGroup className="grid grid-cols-3">
            <InputOTPSlot index={0} className={slotClassName} />
            <InputOTPSlot index={1} className={slotClassName} />
            <InputOTPSlot index={2} className={slotClassName} />
          </InputOTPGroup>
          <InputOTPSeparator className="px-0 text-stone-300 [&_svg]:size-3" />
          <InputOTPGroup className="grid grid-cols-3">
            <InputOTPSlot index={3} className={slotClassName} />
            <InputOTPSlot index={4} className={slotClassName} />
            <InputOTPSlot index={5} className={slotClassName} />
          </InputOTPGroup>
        </InputOTP>
        {hasError && <FieldError>{errors.verificationCode}</FieldError>}
      </Field>
      <div className="flex items-center justify-between gap-3 text-sm text-stone-500">
        <span>Didn&apos;t receive the email?</span>
        <button
          type="button"
          onClick={onResend}
          className="font-medium text-primary underline underline-offset-2"
        >
          Resend code
        </button>
      </div>
    </FieldGroup>
  );
}

function AccountSetupFields({ errors, form, onUpdate }: CommonFormProps) {
  return (
    <FieldGroup className="gap-4">
      <TextField
        autoComplete="organization"
        error={errors.companyName}
        id="company-name"
        label="Company name"
        placeholder="Acme Financial Services"
        type="text"
        value={form.companyName}
        onChange={(value) => onUpdate("companyName", value)}
      />
      <TextField
        error={errors.workspaceName}
        id="workspace-name"
        label="Workspace name"
        placeholder="Acme production"
        type="text"
        value={form.workspaceName}
        onChange={(value) => onUpdate("workspaceName", value)}
      />
      <div className="rounded-lg border border-primary/20 bg-primary/10 px-3 py-3">
        <p className="text-sm font-medium text-stone-950">Next up</p>
        <p className="mt-1 text-sm leading-5 text-stone-500">
          After setup, Bridge will ask a few optional onboarding questions to tune
          products, docs, and workspace defaults.
        </p>
      </div>
    </FieldGroup>
  );
}

function ResetPasswordFields({
  email,
  error,
  onUpdate,
}: {
  email: string;
  error?: string;
  onUpdate: (value: string) => void;
}) {
  return (
    <FieldGroup className="gap-4">
      <TextField
        autoComplete="email"
        error={error}
        id="reset-email"
        label="Email"
        placeholder="Email or username"
        type="text"
        value={email}
        onChange={onUpdate}
      />
    </FieldGroup>
  );
}

function SuccessState() {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-primary/20 bg-primary/10 px-6 py-10 text-center">
      <div className="mb-5 flex size-14 items-center justify-center rounded-full bg-primary text-primary-foreground">
        <CheckCircle data-icon="inline-start" weight="fill" />
      </div>
      <h2 className="text-lg font-bold text-stone-950">Account setup successful</h2>
      <p className="mt-2 max-w-[260px] text-sm leading-5 text-stone-500">
        Your account is ready. Continue to Bridge to finish workspace onboarding.
      </p>
    </div>
  );
}

function AuthFooter({
  formId,
  mode,
  onContinueAfterSuccess,
  onSwitchMode,
  step,
}: {
  formId: string;
  mode: AuthMode;
  onContinueAfterSuccess: () => void;
  onSwitchMode: (mode: AuthMode) => void;
  step: AuthStep;
}) {
  if (step === "success") {
    return (
      <Button
        type="button"
        onClick={onContinueAfterSuccess}
        className="h-9 w-full rounded-lg bg-[#006976] px-4 py-2 text-sm font-medium text-white shadow-none hover:bg-[#005865]"
      >
        Continue
      </Button>
    );
  }

  const cta =
    step === "verify-email"
      ? "Verify OTP"
      : step === "account-setup"
      ? "Complete setup"
      : step === "reset-password"
      ? "Send reset link"
      : mode === "login"
      ? "Sign in"
      : "Create account";

  return (
    <div className="mt-auto flex flex-col items-center justify-center gap-4">
      <Button
        type="submit"
        form={formId}
        className="h-9 w-full rounded-lg bg-[#006976] px-4 py-2 text-sm font-medium text-white shadow-none hover:bg-[#005865]"
      >
        {step === "reset-password" && <PaperPlaneTilt data-icon="inline-start" />}
        {cta}
      </Button>

      {step === "credentials" && (
        <p className="flex w-full justify-center gap-2 whitespace-nowrap text-center text-sm leading-5">
          <span className="text-stone-500">
            {mode === "login" ? "Don't have an account?" : "Already have an account?"}
          </span>
          <button
            type="button"
            onClick={() => onSwitchMode(mode === "login" ? "signup" : "login")}
            className="font-medium text-primary underline underline-offset-2 hover:text-primary/80"
          >
            {mode === "login" ? "Sign up" : "Sign in"}
          </button>
        </p>
      )}
    </div>
  );
}

function TextField({
  autoComplete,
  error,
  id,
  inputMode,
  label,
  maxLength,
  onChange,
  placeholder,
  type,
  value,
}: {
  autoComplete?: string;
  error?: string;
  id: string;
  inputMode?: "numeric";
  label: string;
  maxLength?: number;
  onChange: (value: string) => void;
  placeholder: string;
  type: string;
  value: string;
}) {
  return (
    <Field data-invalid={!!error} className="gap-2">
      <FieldLabel
        htmlFor={id}
        className="text-sm font-medium leading-5 text-stone-950"
      >
        {label}
      </FieldLabel>
      <Input
        id={id}
        type={type}
        autoComplete={autoComplete}
        inputMode={inputMode}
        maxLength={maxLength}
        aria-invalid={!!error}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-9 rounded-lg border-stone-200 bg-stone-50 px-3 text-sm text-stone-950 shadow-none placeholder:text-stone-500 focus-visible:border-primary"
      />
      {error && <FieldError>{error}</FieldError>}
    </Field>
  );
}

function PasswordField({
  autoComplete = "current-password",
  description,
  error,
  id,
  label,
  onChange,
  onToggle,
  placeholder,
  showPassword,
  value,
}: {
  autoComplete?: string;
  description?: string;
  error?: string;
  id: string;
  label: string;
  onChange: (value: string) => void;
  onToggle: () => void;
  placeholder: string;
  showPassword: boolean;
  value: string;
}) {
  return (
    <Field data-invalid={!!error} className="gap-2">
      <FieldLabel
        htmlFor={id}
        className="text-sm font-medium leading-5 text-stone-950"
      >
        {label}
      </FieldLabel>
      <InputGroup className="h-9 rounded-lg border-stone-200 bg-stone-50 shadow-none focus-within:border-primary">
        <InputGroupInput
          id={id}
          type={showPassword ? "text" : "password"}
          autoComplete={autoComplete}
          aria-invalid={!!error}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="h-9 px-3 text-sm text-stone-950 placeholder:text-stone-500"
        />
        <InputGroupAddon align="inline-end" className="pr-3">
          <InputGroupButton
            aria-label={showPassword ? "Hide password" : "Show password"}
            onClick={onToggle}
            size="icon-xs"
            className="text-stone-300 hover:bg-transparent hover:text-stone-500"
          >
            {showPassword ? <EyeSlash /> : <Eye />}
          </InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
      {error && <FieldError>{error}</FieldError>}
      {!error && description && (
        <FieldDescription className="text-xs text-stone-500">
          {description}
        </FieldDescription>
      )}
    </Field>
  );
}
