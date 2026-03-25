"use client";

import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import type { DateRange } from "react-day-picker";
import {
  CreditCard, ShieldCheck, User, Buildings, Copy, Eye, EyeSlash, Plus, Trash, Globe, CaretDown,
  Lock, CurrencyInr, DownloadSimple, WarningCircle, CheckCircle, CalendarBlank,
  ChartLine, ChartBar,
} from "@phosphor-icons/react";

/* ── Helpers ── */
function inr(n: number) {
  return "₹" + n.toLocaleString("en-IN", { maximumFractionDigits: 0 });
}

function generateRangeData(from: Date, to: Date) {
  const days: { date: Date; success: number; failed: number }[] = [];
  const cur = new Date(from);
  while (cur <= to) {
    const t = (cur.getTime() - from.getTime()) / Math.max(to.getTime() - from.getTime(), 1);
    const base = 80 + Math.round(Math.sin(t * Math.PI * 3) * 50 + Math.cos(t * Math.PI * 1.5) * 30);
    const dow = cur.getDay();
    const success = Math.max(0, base + (dow === 0 || dow === 6 ? -40 : 0));
    const failed = Math.max(0, Math.round(success * 0.04));
    days.push({ date: new Date(cur), success, failed });
    cur.setDate(cur.getDate() + 1);
  }
  return days;
}

/* ── Toggle ── */
function Toggle({ enabled, onChange }: { enabled: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={enabled}
      onClick={() => onChange(!enabled)}
      className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors focus:outline-none ${
        enabled ? "bg-primary" : "bg-muted-foreground/30"
      }`}
    >
      <span className={`pointer-events-none inline-block h-4 w-4 rounded-full bg-white shadow transform transition-transform ${enabled ? "translate-x-4" : "translate-x-0"}`} />
    </button>
  );
}

/* ── Data ── */
const KYC_FIELDS = [
  {
    group: "Identity", icon: User,
    fields: [
      { id: "pan", label: "PAN number", description: "Access to full PAN card details", enabled: true },
      { id: "aadhaar_masked", label: "Aadhaar (masked)", description: "Last 4 digits of Aadhaar only", enabled: true },
      { id: "aadhaar_full", label: "Aadhaar (full)", description: "Full Aadhaar number — requires explicit consent", enabled: false },
      { id: "dob", label: "Date of birth", description: "Verified date of birth from document", enabled: true },
    ],
  },
  {
    group: "Business", icon: Buildings,
    fields: [
      { id: "gstin", label: "GSTIN", description: "GST Identification Number", enabled: true },
      { id: "cin", label: "CIN / Company registration", description: "Ministry of Corporate Affairs details", enabled: false },
      { id: "udyam", label: "Udyam registration", description: "MSME registration details", enabled: false },
    ],
  },
  {
    group: "Financial", icon: CreditCard,
    fields: [
      { id: "bank_account", label: "Bank account", description: "Account number and IFSC via penny drop", enabled: true },
      { id: "credit_score", label: "Credit bureau score", description: "CIBIL / Experian score pull", enabled: false },
      { id: "itr", label: "ITR data", description: "Income tax return summary", enabled: false },
    ],
  },
];

const API_KEYS = [
  { id: "key_prod_1", name: "Production key", env: "Production", created: "12 Jan 2026", lastUsed: "2 hours ago", secret: "sk_prod_xK9mP2rL4nQ8vJ6wT1yA3bC5dE7fG0hI" },
  { id: "key_sand_1", name: "Sandbox key", env: "Sandbox", created: "5 Nov 2025", lastUsed: "Yesterday", secret: "sk_sand_zA1bC2dE3fG4hI5jK6lM7nO8pQ9rS0tU" },
];

const WEBHOOKS = [
  { id: "wh_1", url: "https://api.myapp.com/webhooks/setu", events: ["payment.successful", "payment.failed"], status: "Active" },
  { id: "wh_2", url: "https://api.myapp.com/webhooks/kyc", events: ["kyc.verification.completed"], status: "Active" },
];

const AVATAR_COLORS = [
  { bg: "bg-violet-600 dark:bg-violet-300", text: "text-violet-100 dark:text-violet-900" },
  { bg: "bg-sky-600 dark:bg-sky-300", text: "text-sky-100 dark:text-sky-900" },
  { bg: "bg-emerald-600 dark:bg-emerald-300", text: "text-emerald-100 dark:text-emerald-900" },
  { bg: "bg-amber-600 dark:bg-amber-300", text: "text-amber-100 dark:text-amber-900" },
];

const TEAM_MEMBERS = [
  { name: "Rahul Sharma", email: "rahul@company.com", role: "Admin", joined: "14 Jan 2025" },
  { name: "Priya Nair", email: "priya@company.com", role: "Developer", joined: "3 Mar 2025" },
  { name: "Ankit Verma", email: "ankit@company.com", role: "Developer", joined: "22 Jun 2025" },
  { name: "Sneha Iyer", email: "sneha@company.com", role: "Viewer", joined: "8 Sep 2025" },
];

/* ── Billing constants ── */
const BILLING_PACKS = [
  { id: "starter", label: "Starter", amount: 100000, estimatedCalls: "~2,000 API calls", validity: "1 year", illustration: "/pricing-1l.png" },
  { id: "growth",  label: "Growth",  amount: 200000, estimatedCalls: "~5,000 API calls", validity: "1 year", popular: true, illustration: "/pricing-2l.png" },
  { id: "scale",   label: "Scale",   amount: 500000, estimatedCalls: "~15,000 API calls", validity: "1 year", illustration: "/pricing-3l.png" },
] as const;

type PackId = "starter" | "growth" | "scale";

const USAGE_PRODUCTS = [
  { name: "PAN Verification",          calls: 840,  amount: 8400  },
  { name: "GST Lookup",                calls: 620,  amount: 6200  },
  { name: "Digilocker",                calls: 310,  amount: 5890  },
  { name: "Penny Drop",                calls: 280,  amount: 4200  },
  { name: "Reverse Penny Drop",        calls: 190,  amount: 2850  },
  { name: "Penny + Pennyless Drop",    calls: 140,  amount: 2100  },
  { name: "BAV Pennyless",             calls: 98,   amount: 1470  },
];

const MOCK_TRANSACTIONS = Array.from({ length: 20 }, (_, i) => {
  const products = USAGE_PRODUCTS.map(p => p.name);
  const statuses = ["Success", "Success", "Success", "Failed"];
  const d = new Date("2026-03-05");
  d.setDate(d.getDate() - i * 2);
  return {
    id: `txn_${String(i + 1).padStart(3, "0")}`,
    date: d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }),
    product: products[i % products.length],
    api: "GET /verify",
    calls: Math.floor(Math.random() * 50) + 1,
    amount: (Math.floor(Math.random() * 50) + 1) * 15,
    status: statuses[i % statuses.length],
  };
});

/* ── Top-Up Dialog ── */
function TopUpDialog({
  open,
  onClose,
  currentPackId,
  preSelectedPackId,
  currentBalance,
}: {
  open: boolean;
  onClose: (purchased?: { packId: PackId; purchasedAt: string }) => void;
  currentPackId: PackId | null;
  preSelectedPackId?: PackId;
  currentBalance: number;
}) {
  const [step, setStep] = useState(1);
  const [selectedPack, setSelectedPack] = useState<PackId | null>(preSelectedPackId ?? currentPackId ?? "growth");
  const [paymentMode, setPaymentMode] = useState<"upi" | "netbanking">("upi");
  const [agreed, setAgreed] = useState(false);
  const [showDismissWarning, setShowDismissWarning] = useState(false);

  // Reset when dialog opens
  useEffect(() => {
    if (open) {
      setStep(1);
      setSelectedPack(preSelectedPackId ?? currentPackId ?? "growth");
      setPaymentMode("upi");
      setAgreed(false);
      setShowDismissWarning(false);
    }
  }, [open, preSelectedPackId, currentPackId]);

  const packOrder: PackId[] = ["starter", "growth", "scale"];
  const currentPackIdx = currentPackId ? packOrder.indexOf(currentPackId) : -1;
  const pack = BILLING_PACKS.find(p => p.id === selectedPack)!;
  const gst = pack ? Math.round(pack.amount * 0.18) : 0;
  const total = pack ? pack.amount + gst : 0;
  const upiLimit = 200000;

  function handleOpenChange(val: boolean) {
    if (!val && step < 4) {
      setShowDismissWarning(true);
    } else if (!val) {
      onClose();
    }
  }

  function handleConfirmDismiss() {
    setShowDismissWarning(false);
    onClose();
  }

  function handleSuccess() {
    const now = new Date().toISOString();
    onClose({ packId: selectedPack!, purchasedAt: now });
  }

  function logClickwrap() {
    console.log("clickwrap accepted", {
      userId: localStorage.getItem("bridge_email") ?? "unknown",
      deviceInfo: navigator.userAgent,
      timestamp: new Date().toISOString(),
      pack: selectedPack,
    });
  }

  const stepTitles = ["Select amount", "Review & pay", "Payment", "Success"];

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-base">
            {step < 4 ? "Top up credits" : "Payment successful"}
          </DialogTitle>
        </DialogHeader>

        {/* Step indicators */}
        {step < 4 && (
          <div className="flex items-center gap-2 mb-1">
            {stepTitles.slice(0, 3).map((t, i) => (
              <div key={t} className="flex items-center gap-2">
                <div className={`flex items-center justify-center w-5 h-5 rounded-full text-xs font-bold transition-colors ${i + 1 < step ? "bg-emerald-500 text-white" : i + 1 === step ? "bg-foreground text-background" : "bg-muted text-muted-foreground"}`}>
                  {i + 1 < step ? "✓" : i + 1}
                </div>
                <span className={`text-xs ${i + 1 === step ? "text-foreground font-medium" : "text-muted-foreground"}`}>{t}</span>
                {i < 2 && <div className="w-6 h-px bg-border mx-1" />}
              </div>
            ))}
          </div>
        )}

        {/* Dismiss warning */}
        {showDismissWarning && (
          <div className="rounded-lg border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/40 p-3 text-sm text-amber-800 dark:text-amber-200 space-y-2">
            <p>Are you sure? Your selection will be lost.</p>
            <div className="flex gap-2">
              <Button size="sm" variant="destructive" className="h-7 text-xs" onClick={handleConfirmDismiss}>Yes, cancel</Button>
              <Button size="sm" variant="outline" className="h-7 text-xs" onClick={() => setShowDismissWarning(false)}>Keep going</Button>
            </div>
          </div>
        )}

        {/* Step 1: Select Amount */}
        {step === 1 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between rounded-lg bg-muted px-4 py-2.5">
              <span className="text-xs text-muted-foreground">Current balance</span>
              <span className="text-sm font-semibold">{inr(currentBalance)}</span>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {BILLING_PACKS.map((p, idx) => {
                const isDowngrade = currentPackId && idx < currentPackIdx;
                const isSelected = selectedPack === p.id;
                return (
                  <button
                    key={p.id}
                    type="button"
                    disabled={!!isDowngrade}
                    onClick={() => !isDowngrade && setSelectedPack(p.id)}
                    className={`relative rounded-xl border p-4 text-left transition-all focus:outline-none overflow-hidden ${
                      isDowngrade ? "opacity-40 pointer-events-none" : "cursor-pointer"
                    } ${isSelected ? "border-foreground bg-muted ring-1 ring-foreground" : "border-border hover:border-foreground/40"}`}
                  >
                    <img
                      src={p.illustration}
                      alt=""
                      aria-hidden="true"
                      className="absolute top-4 right-4 h-10 w-auto object-contain pointer-events-none select-none"
                    />
                    <p className="text-xs font-semibold text-foreground">{p.label}</p>
                    <p className="text-lg font-bold text-foreground mt-1">₹{p.amount / 100000}L</p>
                    <p className="text-xs text-muted-foreground mt-1">{p.estimatedCalls}</p>
                  </button>
                );
              })}
            </div>
            <Button className="w-full" disabled={!selectedPack} onClick={() => setStep(2)}>
              Continue
            </Button>
          </div>
        )}

        {/* Step 2: Review & Pay */}
        {step === 2 && pack && (
          <div className="space-y-4">
            <div className="rounded-xl border border-border/60 divide-y divide-border/60">
              <div className="flex justify-between px-4 py-3">
                <span className="text-sm text-muted-foreground">{pack.label} pack</span>
                <span className="text-sm font-medium">{inr(pack.amount)}</span>
              </div>
              <div className="flex justify-between px-4 py-3">
                <span className="text-sm text-muted-foreground">GST (18%)</span>
                <span className="text-sm font-medium">{inr(gst)}</span>
              </div>
              <div className="flex justify-between px-4 py-3 bg-muted/50 rounded-b-xl">
                <span className="text-sm font-semibold">Total payable</span>
                <span className="text-sm font-bold">{inr(total)}</span>
              </div>
            </div>
            <div className="flex items-start gap-3 rounded-lg bg-muted/40 p-3">
              <Checkbox
                id="terms"
                checked={agreed}
                onCheckedChange={(v) => {
                  setAgreed(!!v);
                  if (v) logClickwrap();
                }}
                className="mt-0.5 shrink-0"
              />
              <label htmlFor="terms" className="text-xs text-muted-foreground leading-relaxed cursor-pointer">
                I agree to the <span className="text-foreground underline underline-offset-2">Terms &amp; Conditions</span>. I understand this amount is non-refundable.
              </label>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="flex-1" onClick={() => setStep(1)}>Back</Button>
              <Button className="flex-1" disabled={!agreed} onClick={() => setStep(3)}>
                Pay {inr(total)}
              </Button>
            </div>
          </div>
        )}

        {/* Step 3: Payment */}
        {step === 3 && (
          <div className="space-y-4">
            <div className="flex rounded-lg border border-border/60 overflow-hidden">
              {(["upi", "netbanking"] as const).map((mode) => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => setPaymentMode(mode)}
                  className={`flex-1 py-2.5 text-sm font-medium transition-colors ${paymentMode === mode ? "bg-sidebar-accent text-foreground" : "text-muted-foreground hover:text-foreground"}`}
                >
                  {mode === "upi" ? "UPI" : "Net Banking"}
                </button>
              ))}
            </div>
            {paymentMode === "upi" && pack && pack.amount > upiLimit && (
              <div className="flex items-start gap-2 rounded-lg border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/40 px-3 py-2.5">
                <WarningCircle size={15} weight="fill" className="text-amber-500 shrink-0 mt-0.5" />
                <p className="text-xs text-amber-800 dark:text-amber-200">
                  UPI payments are limited to {inr(upiLimit)}. Please use Net Banking.
                </p>
              </div>
            )}
            <div className="rounded-xl border border-dashed border-border/60 bg-muted/30 px-4 py-8 text-center space-y-1">
              <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Pine Labs payment gateway</p>
              <p className="text-xs text-muted-foreground">Mock UI — no real transaction will occur</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="flex-1" onClick={() => setStep(2)}>Back</Button>
              <Button
                className="flex-1"
                disabled={paymentMode === "upi" && pack && pack.amount > upiLimit}
                onClick={() => setStep(4)}
              >
                Confirm payment
              </Button>
            </div>
          </div>
        )}

        {/* Step 4: Success */}
        {step === 4 && pack && (
          <div className="space-y-4 text-center">
            <div className="flex justify-center">
              <CheckCircle size={52} weight="fill" className="text-emerald-500" />
            </div>
            <div>
              <p className="text-lg font-bold text-foreground">{inr(pack.amount)} credits added</p>
              <p className="text-sm text-muted-foreground mt-1">
                New balance: {inr(currentBalance + pack.amount)}
              </p>
              <p className="text-xs text-muted-foreground mt-2">
                Invoice will be sent to your registered email within 24 hours.
              </p>
            </div>
            <div className="flex flex-col gap-2">
              <button type="button" className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors">
                <DownloadSimple size={13} />
                Download invoice
              </button>
              <Button onClick={handleSuccess} className="w-full">Done</Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

/* ── Billing State 1: Empty State ── */
function EmptyStateBilling({ onBuyCredits }: { onBuyCredits: (packId: PackId) => void }) {
  return (
    <div className="space-y-6">
      {/* Plan cards */}
      <div className="space-y-5">
        <div>
          <h3 className="text-sm font-semibold text-foreground">No active credits</h3>
          <p className="text-xs text-muted-foreground mt-1">Purchase a credit pack to start using Bridge APIs. Credits are shared across all products.</p>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {BILLING_PACKS.map((p) => (
            <div key={p.id} className="relative rounded-xl bg-muted/70 p-5 flex flex-col gap-3 overflow-hidden">
              {/* Illustration — top right, 16px from edges */}
              <img
                src={p.illustration}
                alt=""
                aria-hidden="true"
                className="absolute top-4 right-4 h-14 w-auto object-contain pointer-events-none select-none"
              />
              <div>
                <p className="text-xs font-semibold text-foreground">{p.label}</p>
                <p className="text-2xl font-bold text-foreground mt-1">₹{p.amount / 100000}L</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">{p.estimatedCalls}</p>
                <span className="inline-flex items-center rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                  {p.validity} validity
                </span>
              </div>
              <Button size="sm" className="w-full mt-auto" onClick={() => onBuyCredits(p.id)}>
                Buy credits
              </Button>
            </div>
          ))}
        </div>
        <p className="text-xs text-muted-foreground">
          Credits are non-refundable and valid for 1 year from date of purchase. GST applicable.
        </p>
      </div>

      {/* Locked panel — below the plan cards */}
      <div className="rounded-xl bg-muted/30 p-6 flex items-center gap-4">
        <div className="w-9 h-9 rounded-full bg-muted flex items-center justify-center shrink-0">
          <Lock size={16} weight="duotone" className="text-muted-foreground" />
        </div>
        <p className="text-sm text-muted-foreground">Purchase credits to start tracking usage</p>
      </div>
    </div>
  );
}

/* ── Billing State 2: Active Credits ── */
function ActiveCredits({
  packId,
  purchasedAt,
  onTopUp,
}: {
  packId: PackId;
  purchasedAt: string;
  onTopUp: () => void;
}) {
  const [chartProducts, setChartProducts] = useState<string[]>([]);
  const [dateRange, setDateRange] = useState<DateRange>({
    from: new Date(2026, 1, 1),
    to: new Date(2026, 1, 28),
  });
  const [usageTab, setUsageTab] = useState<"overview" | "log">("overview");
  const [page, setPage] = useState(1);
  const [logProduct, setLogProduct] = useState("All");
  const [logStatus, setLogStatus] = useState("All");

  const pack = BILLING_PACKS.find(p => p.id === packId)!;
  const totalAmount = pack.amount;
  const usedAmount = Math.round(totalAmount * 0.42);
  const remainingAmount = totalAmount - usedAmount;
  const usedPercent = Math.round((usedAmount / totalAmount) * 100);
  const expiryDate = new Date(purchasedAt);
  expiryDate.setFullYear(expiryDate.getFullYear() + 1);
  const fmtDate = (d: Date) => d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });

  // Chart
  const dailyData = generateRangeData(dateRange.from!, dateRange.to ?? dateRange.from!);
  const chartMax = Math.max(...dailyData.map(d => d.success + d.failed), 1);
  const yMax = Math.ceil(chartMax / 25) * 25;
  const yTickFractions = [0, 0.25, 0.5, 0.75, 1];
  const yTicks = yTickFractions.map(f => Math.round(f * yMax));
  const fmtY = (v: number) => v >= 1000 ? `${(v / 1000).toFixed(1)}k` : String(v);
  const xLabels = dailyData.map((d, i) => ({ ...d, i })).filter(({ i }) => i === 0 || i % 6 === 0);

  // Line chart SVG
  const [chartType, setChartType] = useState<"line" | "bar">("line");
  const VW = 1000, VH = 208, PAD_TOP = 10;
  const svgPoints = dailyData.map((d, i) => ({
    x: (i / Math.max(dailyData.length - 1, 1)) * VW,
    y: VH - PAD_TOP - ((d.success + d.failed) / Math.max(yMax, 1)) * (VH - PAD_TOP),
  }));
  const buildCurve = (pts: { x: number; y: number }[]) => {
    if (pts.length === 0) return "";
    let d = `M ${pts[0].x.toFixed(1)} ${pts[0].y.toFixed(1)}`;
    for (let i = 1; i < pts.length; i++) {
      const cp = ((pts[i - 1].x + pts[i].x) / 2).toFixed(1);
      d += ` C ${cp} ${pts[i - 1].y.toFixed(1)} ${cp} ${pts[i].y.toFixed(1)} ${pts[i].x.toFixed(1)} ${pts[i].y.toFixed(1)}`;
    }
    return d;
  };
  const linePath = buildCurve(svgPoints);
  const areaPath = svgPoints.length > 0
    ? `${linePath} L ${VW} ${VH} L 0 ${VH} Z`
    : "";

  // Usage
  const totalCalls = USAGE_PRODUCTS.reduce((s, p) => s + p.calls, 0);
  const maxAmount = Math.max(...USAGE_PRODUCTS.map(p => p.amount));
  const totalUsedAmount = USAGE_PRODUCTS.reduce((s, p) => s + p.amount, 0);

  // Transaction log
  const PER_PAGE = 10;
  const filteredTxns = MOCK_TRANSACTIONS.filter(t =>
    (logProduct === "All" || t.product === logProduct) &&
    (logStatus === "All" || t.status === logStatus)
  );
  const totalPages = Math.ceil(filteredTxns.length / PER_PAGE);
  const pageTxns = filteredTxns.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  return (
    <div className="space-y-8">
      {/* Filter bar */}
      <div className="flex items-center gap-2 flex-wrap">
        <Popover>
          <PopoverTrigger asChild>
            <button className="flex items-center gap-2 rounded-lg border border-border/60 px-3 h-9 text-sm font-medium hover:bg-muted transition-colors">
              <CalendarBlank size={14} />
              {dateRange?.from && dateRange?.to
                ? `${format(dateRange.from, "MMM d")} – ${format(dateRange.to, "MMM d, yyyy")}`
                : "Select range"}
              <CaretDown size={12} />
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="range"
              selected={dateRange}
              onSelect={(range) => range && setDateRange(range)}
              numberOfMonths={2}
            />
          </PopoverContent>
        </Popover>
        <Popover>
          <PopoverTrigger asChild>
            <button className="flex items-center gap-2 rounded-lg border border-border/60 px-3 h-9 text-sm font-medium hover:bg-muted transition-colors">
              {chartProducts.length === 0
                ? "All products"
                : chartProducts.length === 1
                  ? chartProducts[0]
                  : `${chartProducts.length} products`}
              <CaretDown size={12} />
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-56 p-1" align="start">
            <label className={`w-full flex items-center gap-2 px-2 py-1.5 text-sm rounded-md hover:bg-muted transition-colors cursor-pointer ${chartProducts.length === 0 ? "text-foreground font-medium" : "text-muted-foreground"}`}>
              <Checkbox
                checked={chartProducts.length === 0}
                onCheckedChange={() => setChartProducts([])}
              />
              All products
            </label>
            <div className="h-px bg-border/50 my-1" />
            {USAGE_PRODUCTS.map(p => {
              const sel = chartProducts.includes(p.name);
              return (
                <label key={p.name} className="w-full flex items-center gap-2 px-2 py-1.5 text-sm rounded-md hover:bg-muted transition-colors cursor-pointer">
                  <Checkbox
                    checked={sel}
                    onCheckedChange={() => setChartProducts(prev => sel ? prev.filter(x => x !== p.name) : [...prev, p.name])}
                  />
                  <span className="truncate">{p.name}</span>
                </label>
              );
            })}
          </PopoverContent>
        </Popover>
        <div className="flex-1" />
        <Button variant="outline" className="gap-1.5">
          <DownloadSimple size={13} />
          Export
        </Button>
        <Button onClick={onTopUp} className="gap-1.5">
          <CurrencyInr size={13} />
          Add more credits
        </Button>
      </div>

      {/* Credit transactions */}
      <div className="space-y-2">
        <p className="text-sm font-semibold text-foreground">Active credit packs</p>
        {[
          { id: "TXN-0041", pack: "Scale", total: 500000, used: 8000,   expiresOn: "01 Mar 2027", status: "new" },
          { id: "TXN-0038", pack: "Growth", total: 200000, used: 90000,  expiresOn: "15 Mar 2026", status: "expiring" },
          { id: "TXN-0034", pack: "Growth", total: 200000, used: 172000, expiresOn: "01 Sep 2026", status: "high-usage" },
          { id: "TXN-0029", pack: "Starter", total: 100000, used: 100000, expiresOn: "05 Jan 2026", status: "exhausted" },
        ].map((tx) => {
          const usedPct = Math.round((tx.used / tx.total) * 100);
          const remaining = tx.total - tx.used;
          return (
            <div key={tx.id} className={`rounded-xl p-4 border ${tx.status === "exhausted" ? "bg-muted/30 border-border/40 opacity-70" : "bg-muted/50 border-transparent"}`}>
              <div className="flex items-start justify-between gap-3 mb-3">
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-medium text-foreground">{tx.pack} pack</span>
                    {tx.status === "exhausted" && <Badge variant="destructive">Exhausted</Badge>}
                    {tx.status === "high-usage" && <Badge variant="destructive">{usedPct}% used</Badge>}
                    {tx.status === "expiring"   && <Badge variant="destructive">Expires {tx.expiresOn}</Badge>}
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">Expires {tx.expiresOn}</p>
                </div>
                <div className="text-right shrink-0">
                  {tx.status === "exhausted" ? (
                    <span className="text-sm font-semibold text-muted-foreground tabular-nums">₹0 left</span>
                  ) : (
                    <span className="text-sm font-semibold text-foreground tabular-nums">{inr(remaining)} left</span>
                  )}
                  <p className="text-xs text-muted-foreground tabular-nums">of {inr(tx.total)}</p>
                </div>
              </div>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="h-2 w-full rounded-full bg-muted overflow-hidden cursor-default">
                      <div
                        className="h-full rounded-full transition-all bg-foreground"
                        style={{ width: `${usedPct}%` }}
                      />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>{usedPct}% used · {inr(tx.used)} of {inr(tx.total)}</TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <div className="flex items-center justify-between mt-1.5">
                <span className="text-xs text-muted-foreground tabular-nums">{inr(tx.used)} / {inr(tx.total)}</span>
                {tx.status !== "exhausted" && (
                  <span className="text-xs text-muted-foreground">Expires {tx.expiresOn}</span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Usage breakdown */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <p className="text-base font-semibold text-foreground">Usage breakdown</p>
          <div className="flex rounded-lg border border-border/60 overflow-hidden text-xs">
            {(["overview", "log"] as const).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => { setUsageTab(t); setPage(1); }}
                className={`h-9 px-4 flex items-center font-medium transition-colors ${usageTab === t ? "bg-sidebar-accent text-foreground" : "text-muted-foreground hover:text-foreground"}`}
              >
                {t === "overview" ? "Overview" : "Transaction log"}
              </button>
            ))}
          </div>
        </div>
        <div>
          {usageTab === "overview" && (
            <div className="space-y-3">
              {[...USAGE_PRODUCTS].sort((a, b) => b.amount - a.amount).map((p) => (
                <div key={p.name} className="flex items-center gap-3">
                  <span className="text-xs text-muted-foreground w-44 shrink-0 truncate">{p.name}</span>
                  <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
                    <div className="h-full rounded-full bg-foreground/50" style={{ width: `${(p.amount / maxAmount) * 100}%` }} />
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-xs tabular-nums text-muted-foreground w-16 text-right">{p.calls.toLocaleString()} calls</span>
                    <span className="text-xs tabular-nums font-medium w-16 text-right">{inr(p.amount)}</span>
                    <span className="text-xs tabular-nums text-muted-foreground w-8 text-right">{Math.round((p.amount / totalUsedAmount) * 100)}%</span>
                  </div>
                </div>
              ))}
            </div>
          )}
          {usageTab === "log" && (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <select
                  value={logProduct}
                  onChange={e => { setLogProduct(e.target.value); setPage(1); }}
                  className="text-xs rounded-md border border-input bg-background px-2.5 py-1.5 text-foreground focus:outline-none appearance-none cursor-pointer pr-6"
                >
                  <option value="All">All products</option>
                  {USAGE_PRODUCTS.map(p => <option key={p.name}>{p.name}</option>)}
                </select>
                <select
                  value={logStatus}
                  onChange={e => { setLogStatus(e.target.value); setPage(1); }}
                  className="text-xs rounded-md border border-input bg-background px-2.5 py-1.5 text-foreground focus:outline-none appearance-none cursor-pointer"
                >
                  <option value="All">All statuses</option>
                  <option>Success</option>
                  <option>Failed</option>
                </select>
                <div className="flex-1" />
                <Button size="sm" variant="outline" className="gap-1.5 h-7 text-xs">
                  <DownloadSimple size={12} />
                  Download report
                </Button>
              </div>
              <div className="rounded-lg border border-border/40 overflow-hidden">
                <table className="w-full text-xs">
                  <thead className="bg-muted/50">
                    <tr>
                      <th className="text-left px-4 py-2.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider whitespace-nowrap">Date</th>
                      <th className="text-left px-4 py-2.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider whitespace-nowrap">Transaction ID</th>
                      <th className="text-left px-4 py-2.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider whitespace-nowrap">Product</th>
                      <th className="text-left px-4 py-2.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider whitespace-nowrap">API</th>
                      <th className="text-left px-4 py-2.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider whitespace-nowrap">Status</th>
                      <th className="text-left px-4 py-2.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider whitespace-nowrap">API calls</th>
                      <th className="text-right px-4 py-2.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider whitespace-nowrap">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pageTxns.map((t, i) => (
                      <tr key={t.id} className={`border-t border-border/30 hover:bg-muted/50 transition-colors ${i % 2 === 0 ? "" : "bg-muted/20"}`}>
                        <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">{t.date}</td>
                        <td className="px-4 py-3 text-muted-foreground">{t.id}</td>
                        <td className="px-4 py-3 font-medium text-foreground">{t.product}</td>
                        <td className="px-4 py-3 text-muted-foreground">{t.api}</td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex items-center justify-center w-16 rounded-full px-2 py-0.5 text-xs font-semibold ${
                            t.status === "Success"
                              ? "bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400"
                              : "bg-red-100 dark:bg-red-950 text-red-600 dark:text-red-400"
                          }`}>{t.status}</span>
                        </td>
                        <td className="px-4 py-3 tabular-nums">{t.calls}</td>
                        <td className="px-4 py-3 tabular-nums font-medium text-right">{inr(t.amount)}</td>
                      </tr>
                    ))}
                    {pageTxns.length === 0 && (
                      <tr><td colSpan={7} className="px-4 py-8 text-center text-xs text-muted-foreground">No transactions found</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-xs text-muted-foreground">
                  Showing {Math.min((page - 1) * PER_PAGE + 1, filteredTxns.length)}–{Math.min(page * PER_PAGE, filteredTxns.length)} of {filteredTxns.length}
                </p>
                <div className="flex items-center gap-1">
                  <Button size="sm" variant="outline" className="h-7 px-2.5 text-xs" disabled={page === 1} onClick={() => setPage(p => p - 1)}>Previous</Button>
                  <Button size="sm" variant="outline" className="h-7 px-2.5 text-xs" disabled={page >= totalPages} onClick={() => setPage(p => p + 1)}>Next</Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ── BillingSection (state machine) ── */
function BillingSection() {
  const [packId, setPackId] = useState<PackId | null>(null);
  const [purchasedAt, setPurchasedAt] = useState<string | null>(null);
  const [topUpOpen, setTopUpOpen] = useState(false);
  const [preSelectedPack, setPreSelectedPack] = useState<PackId | undefined>(undefined);

  useEffect(() => {
    const stored = localStorage.getItem("billing_pack_id") as PackId | null;
    const storedAt = localStorage.getItem("billing_purchased_at");
    setPackId(stored);
    setPurchasedAt(storedAt);
  }, []);

  const currentBalance = packId
    ? Math.round((BILLING_PACKS.find(p => p.id === packId)?.amount ?? 0) * 0.58)
    : 0;

  const openTopUp = useCallback((preId?: PackId) => {
    setPreSelectedPack(preId);
    setTopUpOpen(true);
  }, []);

  function handlePurchase(result?: { packId: PackId; purchasedAt: string }) {
    setTopUpOpen(false);
    if (result) {
      localStorage.setItem("billing_pack_id", result.packId);
      localStorage.setItem("billing_purchased_at", result.purchasedAt);
      setPackId(result.packId);
      setPurchasedAt(result.purchasedAt);
    }
  }

  return (
    <>
      <div className="max-w-[1200px]">
        {packId === null ? (
          <EmptyStateBilling onBuyCredits={(id) => openTopUp(id)} />
        ) : (
          <ActiveCredits
            packId={packId}
            purchasedAt={purchasedAt ?? new Date().toISOString()}
            onTopUp={() => openTopUp()}
          />
        )}
      </div>
      <TopUpDialog
        open={topUpOpen}
        onClose={handlePurchase}
        currentPackId={packId}
        preSelectedPackId={preSelectedPack}
        currentBalance={currentBalance}
      />
    </>
  );
}

/* ── Sections ── */

function AccountSection() {
  const [kycFields, setKycFields] = useState(() =>
    Object.fromEntries(KYC_FIELDS.flatMap((g) => g.fields.map((f) => [f.id, f.enabled])))
  );
  return (
    <div className="space-y-6">
      <Card className="shadow-none border border-border/40">
        <CardHeader className="p-6 pb-3">
          <CardTitle className="text-sm font-medium">Organisation details</CardTitle>
        </CardHeader>
        <CardContent className="px-6 pb-6 space-y-4">
          {[["Organisation name", "Acme Technologies Pvt. Ltd."], ["PAN", "AABCA1234Z"], ["GSTIN", "27AABCA1234Z1Z5"], ["Contact email", "admin@acme.com"]].map(([label, value]) => (
            <div key={label} className="flex items-center justify-between py-2 border-b border-border/30 last:border-0">
              <span className="text-xs text-muted-foreground w-40 shrink-0">{label}</span>
              <span className="text-sm font-medium text-foreground flex-1">{value}</span>
            </div>
          ))}
        </CardContent>
      </Card>

      <section>
        <h2 className="text-sm font-semibold text-foreground mb-1 flex items-center gap-2">
          <ShieldCheck size={14} weight="duotone" className="text-primary" />
          KYC data access control
        </h2>
        <p className="text-xs text-muted-foreground mb-4">Control which KYC fields your integration can read.</p>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {KYC_FIELDS.map((group) => {
            const Icon = group.icon;
            return (
              <Card key={group.group} className="shadow-none border border-border/40">
                <CardHeader className="p-6 pb-3">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <Icon size={14} weight="duotone" className="text-primary" />
                    {group.group}
                  </CardTitle>
                </CardHeader>
                <CardContent className="px-6 pb-6 space-y-4">
                  {group.fields.map((field) => (
                    <div key={field.id} className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-foreground">{field.label}</p>
                        <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{field.description}</p>
                      </div>
                      <Toggle enabled={kycFields[field.id]} onChange={(v) => setKycFields((p) => ({ ...p, [field.id]: v }))} />
                    </div>
                  ))}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>
    </div>
  );
}

function ApiKeysSection() {
  const [revealed, setRevealed] = useState<Record<string, boolean>>({});
  const [copied, setCopied] = useState<string | null>(null);

  const copyKey = (id: string, secret: string) => {
    navigator.clipboard.writeText(secret).catch(() => {});
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-xs text-muted-foreground">API keys authenticate your server-side requests. Never expose secret keys client-side.</p>
        <Button size="sm" variant="outline" className="gap-1.5 shrink-0">
          <Plus size={14} />
          New key
        </Button>
      </div>
      <div className="grid grid-cols-2 gap-4">
      {API_KEYS.map((key) => (
        <Card key={key.id} className="shadow-none border border-border/40">
          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-sm font-semibold text-foreground">{key.name}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${key.env === "Production" ? "bg-red-100 dark:bg-red-950 text-red-600 dark:text-red-400" : "bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400"}`}>
                    {key.env}
                  </span>
                  <span className="text-xs text-muted-foreground">Created {key.created}</span>
                  <span className="text-xs text-muted-foreground">· Last used {key.lastUsed}</span>
                </div>
              </div>
              <button type="button" className="text-muted-foreground hover:text-destructive transition-colors">
                <Trash size={15} />
              </button>
            </div>
            <div className="flex items-center gap-2 rounded-lg bg-muted px-3 py-2">
              <code className="flex-1 text-xs font-mono text-foreground truncate">
                {revealed[key.id] ? key.secret : key.secret.slice(0, 12) + "•".repeat(24)}
              </code>
              <button type="button" onClick={() => setRevealed((p) => ({ ...p, [key.id]: !p[key.id] }))} className="text-muted-foreground hover:text-foreground transition-colors shrink-0">
                {revealed[key.id] ? <EyeSlash size={14} /> : <Eye size={14} />}
              </button>
              <button type="button" onClick={() => copyKey(key.id, key.secret)} className="text-muted-foreground hover:text-foreground transition-colors shrink-0">
                {copied === key.id ? <span className="text-xs text-emerald-600">Copied</span> : <Copy size={14} />}
              </button>
            </div>
          </CardContent>
        </Card>
      ))}
      </div>
    </div>
  );
}

function WebhooksSection() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-xs text-muted-foreground">Setu will POST event payloads to your endpoints in real time.</p>
        <Button size="sm" variant="outline" className="gap-1.5 shrink-0">
          <Plus size={14} />
          Add endpoint
        </Button>
      </div>
      {WEBHOOKS.map((wh) => (
        <Card key={wh.id} className="shadow-none border border-border/40">
          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <Globe size={15} className="text-muted-foreground shrink-0 mt-0.5" />
                <code className="text-sm font-mono text-foreground break-all">{wh.url}</code>
              </div>
              <span className="ml-4 shrink-0 inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400">
                {wh.status}
              </span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {wh.events.map((e) => (
                <span key={e} className="rounded-full bg-muted px-2.5 py-0.5 text-xs text-muted-foreground font-mono">{e}</span>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function TeamSection() {
  const ROLES = ["Admin", "Developer", "Viewer"];
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-xs text-muted-foreground">Manage who has access to your Bridge workspace.</p>
        <Button size="sm" variant="outline" className="gap-1.5 shrink-0">
          <Plus size={14} />
          Invite member
        </Button>
      </div>
      <Card className="shadow-none border border-border/40">
        <CardContent className="p-0">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border/40">
                <th className="text-left px-6 py-3 text-xs font-medium text-muted-foreground">Name</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-muted-foreground">Email</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-muted-foreground">Role</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-muted-foreground">Joined</th>
                <th className="px-6 py-3" />
              </tr>
            </thead>
            <tbody>
              {TEAM_MEMBERS.map((m, i) => (
                <tr key={m.email} className="group border-b border-border/30 last:border-0">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${AVATAR_COLORS[i % AVATAR_COLORS.length].bg}`}>
                        <span className={`text-xs font-semibold ${AVATAR_COLORS[i % AVATAR_COLORS.length].text}`}>
                          {m.name.split(" ").map((n) => n[0]).join("")}
                        </span>
                      </div>
                      <span className="font-medium text-foreground text-sm">{m.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-muted-foreground">{m.email}</td>
                  <td className="px-6 py-4">
                    <div className="relative inline-flex items-center">
                      <select defaultValue={m.role} className="text-xs rounded-md border border-input bg-background pl-2 pr-6 py-1 text-foreground focus:outline-none appearance-none cursor-pointer">
                        {ROLES.map((r) => <option key={r}>{r}</option>)}
                      </select>
                      <CaretDown size={10} className="absolute right-2 pointer-events-none text-muted-foreground" />
                    </div>
                  </td>
                  <td className="px-6 py-4 text-muted-foreground text-xs">{m.joined}</td>
                  <td className="px-6 py-4 text-right">
                    <button type="button" className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive transition-all">
                      <Trash size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}

/* ── Main ── */
const SECTION_TITLES: Record<string, { title: string; description: string }> = {
  Account:  { title: "Account", description: "Organisation details and KYC data access controls" },
  Team:     { title: "Team", description: "Manage members and their roles" },
  "API Keys": { title: "API keys", description: "Manage keys to authenticate API requests" },
  Webhooks: { title: "Webhooks", description: "Configure endpoints to receive event notifications" },
  "Credits & usage": { title: "Credits & usage", description: "Credit balance, usage history, and top-ups" },
};

export default function SettingsView({ section = "Account" }: { section?: string }) {
  const meta = SECTION_TITLES[section] ?? SECTION_TITLES["Account"];

  return (
    <div className="my-2 ml-2 mr-2 rounded-xl bg-background h-[calc(100vh-16px)] overflow-hidden flex flex-col">
      <div className="shrink-0 bg-background z-10 px-6 pt-6 pb-4">
        <h1 className="text-2xl font-bold text-foreground">{meta.title}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{meta.description}</p>
      </div>
      <div className="flex-1 overflow-y-auto px-6 pb-16 pt-2">
        {section === "Account"   && <AccountSection />}
        {section === "Team"      && <TeamSection />}
        {section === "API Keys"  && <ApiKeysSection />}
        {section === "Webhooks"  && <WebhooksSection />}
        {section === "Credits & usage" && <BillingSection />}
      </div>
    </div>
  );
}
