"use client";

import { useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  Circle,
  Copy,
  CloudArrowUp,
  CurrencyCircleDollar,
  GearSix,
  Globe,
  Key,
  Lightning,
  QrCode,
  Repeat,
  Shield,
  WarningCircle,
  Check,
  Clock,
  RocketLaunch,
} from "@phosphor-icons/react";

/* ── Step Definitions ── */
const STEPS = [
  { title: "Environment", icon: Globe },
  { title: "API Credentials", icon: Key },
  { title: "Webhooks", icon: CloudArrowUp },
  { title: "Settlement Account", icon: CurrencyCircleDollar },
  { title: "Transaction Limits", icon: Shield },
  { title: "Payment Modes", icon: Lightning },
  { title: "VPA Handle", icon: QrCode },
  { title: "Go-Live Checklist", icon: CheckCircle },
];

/* ── Step 0: Environment ── */
function StepEnvironment({
  env,
  setEnv,
}: {
  env: string;
  setEnv: (v: string) => void;
}) {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-sm font-semibold text-foreground mb-1">Select Environment</h3>
        <p className="text-xs text-muted-foreground mb-4">
          Choose the environment for your UPI integration. You can switch later.
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {[
          {
            key: "sandbox",
            title: "Sandbox",
            desc: "Test your integration with simulated transactions. No real money is moved.",
            badge: "Recommended for setup",
          },
          {
            key: "production",
            title: "Production",
            desc: "Live environment with real transactions. Requires completed KYC verification.",
            badge: "Requires KYC",
          },
        ].map((opt) => (
          <button
            key={opt.key}
            type="button"
            onClick={() => setEnv(opt.key)}
            className={`text-left rounded-xl border-2 p-5 transition-colors ${
              env === opt.key
                ? "border-primary bg-primary/5"
                : "border-border hover:border-muted-foreground/30"
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold text-foreground">{opt.title}</span>
              <span className="rounded-full bg-muted px-2.5 py-0.5 text-[10px] font-medium text-muted-foreground">
                {opt.badge}
              </span>
            </div>
            <p className="text-xs text-muted-foreground">{opt.desc}</p>
          </button>
        ))}
      </div>
    </div>
  );
}

/* ── Step 1: API Credentials ── */
function StepCredentials({ authMode, setAuthMode }: { authMode: string; setAuthMode: (v: string) => void }) {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-sm font-semibold text-foreground mb-1">API Credentials</h3>
        <p className="text-xs text-muted-foreground mb-4">
          Your credentials have been auto-generated. Keep them secure.
        </p>
      </div>
      <Card className="shadow-none border-0">
        <CardContent className="p-4 space-y-4">
          <div>
            <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Client ID</label>
            <div className="flex gap-2">
              <Input readOnly value="setu_cid_7f3a9b2e4d1c8056" className="font-mono text-xs flex-1" />
              <Button size="sm" variant="outline"><Copy size={14} /></Button>
            </div>
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Client Secret</label>
            <div className="flex gap-2">
              <Input readOnly value="setu_sec_••••••••••••••••••••••••" className="font-mono text-xs flex-1" />
              <Button size="sm" variant="outline"><Copy size={14} /></Button>
            </div>
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Auth Mode</label>
            <div className="flex gap-3">
              {["OAuth 2.0", "JWT Bearer", "API Key"].map((mode) => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => setAuthMode(mode)}
                  className={`rounded-lg border px-4 py-2 text-xs font-medium transition-colors ${
                    authMode === mode
                      ? "border-primary bg-primary/5 text-foreground"
                      : "border-border text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {mode}
                </button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

/* ── Step 2: Webhooks ── */
function StepWebhooks() {
  const [events, setEvents] = useState(["payment.success", "payment.failed"]);
  const allEvents = [
    "payment.success",
    "payment.failed",
    "payment.pending",
    "refund.initiated",
    "refund.completed",
    "mandate.created",
    "mandate.revoked",
    "settlement.completed",
  ];

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-sm font-semibold text-foreground mb-1">Webhook Configuration</h3>
        <p className="text-xs text-muted-foreground mb-4">
          Set up a webhook endpoint to receive real-time event notifications.
        </p>
      </div>
      <Card className="shadow-none border-0">
        <CardContent className="p-4 space-y-4">
          <div>
            <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Webhook URL</label>
            <Input placeholder="https://your-domain.com/webhooks/upi" className="font-mono text-xs" />
          </div>
          <div>
            <label className="mb-2 block text-xs font-medium text-muted-foreground">Events to subscribe</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {allEvents.map((evt) => (
                <label key={evt} className="flex items-center gap-2 text-sm cursor-pointer">
                  <input
                    type="checkbox"
                    checked={events.includes(evt)}
                    onChange={(e) => {
                      setEvents(
                        e.target.checked
                          ? [...events, evt]
                          : events.filter((v) => v !== evt)
                      );
                    }}
                    className="rounded border-input"
                  />
                  <span className="font-mono text-xs text-foreground">{evt}</span>
                </label>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Retry attempts</label>
              <select className="w-full rounded-md border border-input bg-background px-3 py-2 text-xs text-foreground">
                <option>3 retries</option>
                <option>5 retries</option>
                <option>10 retries</option>
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Retry interval</label>
              <select className="w-full rounded-md border border-input bg-background px-3 py-2 text-xs text-foreground">
                <option>Exponential backoff</option>
                <option>Fixed (30s)</option>
                <option>Fixed (60s)</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

/* ── Step 3: Settlement Account ── */
function StepSettlement() {
  const [autoSettle, setAutoSettle] = useState(true);

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-sm font-semibold text-foreground mb-1">Settlement Account</h3>
        <p className="text-xs text-muted-foreground mb-4">
          Configure the bank account where your UPI collections will be settled.
        </p>
      </div>
      <Card className="shadow-none border-0">
        <CardContent className="p-4 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Account Number</label>
              <Input placeholder="Enter account number" className="text-xs" />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Confirm Account Number</label>
              <Input placeholder="Re-enter account number" className="text-xs" />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-muted-foreground">IFSC Code</label>
              <Input placeholder="e.g. HDFC0001234" className="text-xs" />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Account Holder Name</label>
              <Input placeholder="As per bank records" className="text-xs" />
            </div>
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Settlement Cycle</label>
            <div className="flex gap-3">
              {["T+0 (Instant)", "T+1 (Next day)", "T+2"].map((cycle) => (
                <button
                  key={cycle}
                  type="button"
                  className="rounded-lg border border-border px-4 py-2 text-xs font-medium text-muted-foreground hover:text-foreground hover:border-muted-foreground/30 transition-colors"
                >
                  {cycle}
                </button>
              ))}
            </div>
          </div>
          <label className="flex items-center gap-2 text-sm text-foreground cursor-pointer">
            <button
              type="button"
              onClick={() => setAutoSettle(!autoSettle)}
              className={`relative inline-flex h-5 w-9 shrink-0 rounded-full border-2 border-transparent transition-colors ${
                autoSettle ? "bg-primary" : "bg-muted"
              }`}
            >
              <span className={`pointer-events-none inline-block h-4 w-4 rounded-full bg-background shadow-sm transition-transform ${
                autoSettle ? "translate-x-4" : "translate-x-0"
              }`} />
            </button>
            <span className="text-xs">Enable auto-settlement</span>
          </label>
        </CardContent>
      </Card>
    </div>
  );
}

/* ── Step 4: Transaction Limits ── */
function StepLimits() {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-sm font-semibold text-foreground mb-1">Transaction Limits</h3>
        <p className="text-xs text-muted-foreground mb-4">
          Define minimum and maximum transaction amounts and daily/monthly caps.
        </p>
      </div>
      <Card className="shadow-none border-0">
        <CardContent className="p-4 space-y-4">
          <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Per Transaction</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Minimum Amount (Rs)</label>
              <Input type="number" defaultValue="1" className="text-xs" />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Maximum Amount (Rs)</label>
              <Input type="number" defaultValue="100000" className="text-xs" />
            </div>
          </div>
          <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider pt-2">Aggregate Limits</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Daily Limit (Rs)</label>
              <Input type="number" defaultValue="5000000" className="text-xs" />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Monthly Limit (Rs)</label>
              <Input type="number" defaultValue="50000000" className="text-xs" />
            </div>
          </div>
          <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider pt-2">Per-Customer Limits</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Max per customer/day (Rs)</label>
              <Input type="number" defaultValue="200000" className="text-xs" />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Max transactions/customer/day</label>
              <Input type="number" defaultValue="20" className="text-xs" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

/* ── Step 5: Payment Modes ── */
function StepPaymentModes() {
  const [enabled, setEnabled] = useState<string[]>(["collect", "intent", "qr"]);

  const modes = [
    { key: "collect", title: "UPI Collect", desc: "Send collect requests to customer VPA" },
    { key: "intent", title: "UPI Intent", desc: "Deep-link to customer's UPI app" },
    { key: "qr", title: "QR Code", desc: "Generate dynamic QR codes for payment" },
    { key: "autopay", title: "AutoPay", desc: "Recurring payments with mandate" },
    { key: "mandate", title: "UPI Mandate", desc: "One-time or recurring mandates" },
    { key: "lite", title: "UPI Lite", desc: "Small-value payments under Rs 500" },
  ];

  function toggle(key: string) {
    setEnabled((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-sm font-semibold text-foreground mb-1">Payment Modes</h3>
        <p className="text-xs text-muted-foreground mb-4">
          Enable the UPI payment modes you want to support.
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {modes.map((mode) => {
          const isOn = enabled.includes(mode.key);
          return (
            <button
              key={mode.key}
              type="button"
              onClick={() => toggle(mode.key)}
              className={`text-left rounded-xl border-2 p-4 transition-colors ${
                isOn
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-muted-foreground/30"
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-sm font-semibold text-foreground">{mode.title}</span>
                <div className={`relative inline-flex h-5 w-9 shrink-0 rounded-full border-2 border-transparent transition-colors ${
                  isOn ? "bg-primary" : "bg-muted"
                }`}>
                  <span className={`pointer-events-none inline-block h-4 w-4 rounded-full bg-background shadow-sm transition-transform ${
                    isOn ? "translate-x-4" : "translate-x-0"
                  }`} />
                </div>
              </div>
              <p className="text-xs text-muted-foreground">{mode.desc}</p>
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ── Step 6: VPA Handle ── */
function StepVPA() {
  const [prefix, setPrefix] = useState("acmepay");

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-sm font-semibold text-foreground mb-1">VPA Handle</h3>
        <p className="text-xs text-muted-foreground mb-4">
          Set up your custom VPA handle for collecting payments.
        </p>
      </div>
      <Card className="shadow-none border-0">
        <CardContent className="p-4 space-y-4">
          <div>
            <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Custom Handle Prefix</label>
            <div className="flex items-center gap-0">
              <Input
                value={prefix}
                onChange={(e) => setPrefix(e.target.value)}
                className="text-xs rounded-r-none border-r-0"
                placeholder="yourhandle"
              />
              <div className="flex h-9 items-center rounded-r-md border border-input bg-muted px-3 text-xs text-muted-foreground">
                @setu
              </div>
            </div>
            <p className="mt-1.5 text-xs text-muted-foreground">
              Your customers will pay to <span className="font-mono font-medium text-foreground">{prefix || "yourhandle"}@setu</span>
            </p>
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Test VPA</label>
            <div className="flex gap-2">
              <Input readOnly value={`${prefix || "yourhandle"}.test@setu`} className="font-mono text-xs flex-1" />
              <Button size="sm" variant="outline"><Copy size={14} /></Button>
            </div>
            <p className="mt-1.5 text-xs text-muted-foreground">
              Use this VPA in sandbox mode for testing.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

/* ── Step 7: Go-Live Checklist ── */
function StepGoLive({ completedSteps }: { completedSteps: Set<number> }) {
  const checklist = [
    { step: 0, label: "Environment selected" },
    { step: 1, label: "API credentials generated" },
    { step: 2, label: "Webhooks configured" },
    { step: 3, label: "Settlement account added" },
    { step: 4, label: "Transaction limits set" },
    { step: 5, label: "Payment modes enabled" },
    { step: 6, label: "VPA handle configured" },
  ];

  const allDone = checklist.every((c) => completedSteps.has(c.step));

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-sm font-semibold text-foreground mb-1">Go-Live Checklist</h3>
        <p className="text-xs text-muted-foreground mb-4">
          Review your configuration before going live.
        </p>
      </div>
      <Card className="shadow-none border-0">
        <CardContent className="p-4 space-y-3">
          {checklist.map((item) => {
            const done = completedSteps.has(item.step);
            return (
              <div key={item.step} className="flex items-center gap-3 py-1.5">
                {done ? (
                  <CheckCircle size={20} weight="fill" className="text-emerald-500 shrink-0" />
                ) : (
                  <Circle size={20} className="text-muted-foreground shrink-0" />
                )}
                <span className={`text-sm ${done ? "text-foreground" : "text-muted-foreground"}`}>
                  {item.label}
                </span>
                {done && (
                  <span className="ml-auto rounded-full bg-emerald-100 dark:bg-emerald-950 px-2 py-0.5 text-[10px] font-medium text-emerald-700 dark:text-emerald-400">
                    Complete
                  </span>
                )}
                {!done && (
                  <span className="ml-auto rounded-full bg-amber-100 dark:bg-amber-950 px-2 py-0.5 text-[10px] font-medium text-amber-700 dark:text-amber-400">
                    Pending
                  </span>
                )}
              </div>
            );
          })}
        </CardContent>
      </Card>

      <div className="flex items-center justify-between rounded-xl border-2 border-border p-5 mt-6">
        <div>
          <p className="text-sm font-semibold text-foreground">
            {allDone ? "Ready to go live!" : "Complete all steps to go live"}
          </p>
          <p className="text-xs text-muted-foreground mt-0.5">
            {allDone
              ? "Your UPI integration is fully configured."
              : `${checklist.filter((c) => completedSteps.has(c.step)).length} of ${checklist.length} steps completed`}
          </p>
        </div>
        <Button size="lg" disabled={!allDone}>
          <RocketLaunch size={16} className="mr-1.5" />
          Go Live
        </Button>
      </div>
    </div>
  );
}

/* ── Main Configuration View ── */
export default function ConfigurationView() {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  const [env, setEnv] = useState("sandbox");
  const [authMode, setAuthMode] = useState("OAuth 2.0");

  function goNext() {
    setCompletedSteps((prev) => new Set([...prev, currentStep]));
    setCurrentStep((prev) => Math.min(prev + 1, STEPS.length - 1));
  }

  function goPrev() {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  }

  return (
    <div className="px-6 pt-6 pb-16">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">UPI Configuration</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Set up your UPI integration step by step
        </p>
      </div>

      {/* Step Indicator */}
      <div className="mb-8">
        <div className="flex items-center gap-0">
          {STEPS.map((step, i) => {
            const isDone = completedSteps.has(i);
            const isCurrent = currentStep === i;
            return (
              <div key={i} className="flex items-center flex-1 last:flex-none">
                <button
                  type="button"
                  onClick={() => setCurrentStep(i)}
                  className="flex flex-col items-center gap-1.5 group"
                >
                  <div
                    className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition-colors ${
                      isCurrent
                        ? "bg-foreground text-background"
                        : isDone
                        ? "bg-emerald-500 text-white"
                        : "bg-muted text-muted-foreground group-hover:bg-muted-foreground/20"
                    }`}
                  >
                    {isDone && !isCurrent ? <Check size={14} weight="bold" /> : i + 1}
                  </div>
                  <span className={`text-[10px] font-medium hidden sm:block ${
                    isCurrent ? "text-foreground" : "text-muted-foreground"
                  }`}>
                    {step.title}
                  </span>
                </button>
                {i < STEPS.length - 1 && (
                  <div className={`h-0.5 flex-1 mx-1 rounded-full ${
                    isDone ? "bg-emerald-500" : "bg-muted"
                  }`} />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Step Content */}
      <div className="min-h-[400px]">
        {currentStep === 0 && <StepEnvironment env={env} setEnv={setEnv} />}
        {currentStep === 1 && <StepCredentials authMode={authMode} setAuthMode={setAuthMode} />}
        {currentStep === 2 && <StepWebhooks />}
        {currentStep === 3 && <StepSettlement />}
        {currentStep === 4 && <StepLimits />}
        {currentStep === 5 && <StepPaymentModes />}
        {currentStep === 6 && <StepVPA />}
        {currentStep === 7 && <StepGoLive completedSteps={completedSteps} />}
      </div>

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between mt-8 pt-6 border-t border-border">
        <Button
          variant="outline"
          onClick={goPrev}
          disabled={currentStep === 0}
        >
          <ArrowLeft size={16} className="mr-1.5" />
          Previous
        </Button>
        {currentStep < STEPS.length - 1 ? (
          <Button onClick={goNext}>
            Next
            <ArrowRight size={16} className="ml-1.5" />
          </Button>
        ) : (
          <div />
        )}
      </div>
    </div>
  );
}
