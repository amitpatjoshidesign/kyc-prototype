"use client";

import React, { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  MagnifyingGlass,
  PenNib,
  TreeStructure,
  ChartLine,
  Speedometer,
  Receipt,
  CurrencyCircleDollar,
  CreditCard,
  Wallet,
  Coins,
  Warning,
  ArrowRight,
  X,
  House,
  Compass,
  SquaresFour,
  PlusSquare,
  Bell,
  ChatCircleDots,
  GearSix,
  BookOpen,
  CaretDown,
  CaretRight,
  Moon,
  Sun,
  SignOut,
  Faders,
  ArrowCounterClockwise,
} from "@phosphor-icons/react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import Link from "next/link";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "framer-motion";
import { OnboardingSurvey } from "@/components/OnboardingSurvey";
import { BridgeLoginCard } from "@/components/BridgeLoginCard";
import { LoginGrainientBackground } from "@/components/LoginGrainientBackground";

const DashboardView = dynamic(() => import("@/components/DashboardView"), {
  ssr: false,
  loading: () => (
    <div className="px-6 pt-6 pb-16">
      <div className="h-8 w-48 bg-muted rounded animate-pulse mb-6" />
      <div className="grid grid-cols-5 gap-4 mb-8">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-24 bg-muted rounded-lg animate-pulse" />
        ))}
      </div>
    </div>
  ),
});

const SettingsView = dynamic(() => import("@/components/SettingsView"), {
  ssr: false,
  loading: () => (
    <div className="px-6 pt-6 pb-16">
      <div className="h-8 w-48 bg-muted rounded animate-pulse mb-6" />
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-32 bg-muted rounded-lg animate-pulse" />
        ))}
      </div>
    </div>
  ),
});

const ConfigurationView = dynamic(() => import("@/components/ConfigurationView"), {
  ssr: false,
  loading: () => (
    <div className="px-6 pt-6 pb-16">
      <div className="h-8 w-48 bg-muted rounded animate-pulse mb-6" />
      <div className="h-12 bg-muted rounded animate-pulse mb-8" />
      <div className="h-64 bg-muted rounded-lg animate-pulse" />
    </div>
  ),
});

const EsignConfigurationView = dynamic(() => import("@/components/EsignConfigurationView"), {
  ssr: false,
  loading: () => (
    <div className="px-6 pt-6 pb-16">
      <div className="h-8 w-48 bg-muted rounded animate-pulse mb-6" />
      <div className="h-12 bg-muted rounded animate-pulse mb-8" />
      <div className="h-64 bg-muted rounded-lg animate-pulse" />
    </div>
  ),
});

const DocsView = dynamic(() => import("@/components/DocsView"), {
  ssr: false,
  loading: () => (
    <div className="px-6 pt-6 pb-16">
      <div className="h-8 w-48 bg-muted rounded animate-pulse mb-6" />
      <div className="flex gap-6">
        <div className="hidden md:block w-[220px] space-y-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-6 bg-muted rounded animate-pulse" />
          ))}
        </div>
        <div className="flex-1 space-y-4">
          <div className="h-24 bg-muted rounded-lg animate-pulse" />
          <div className="h-64 bg-muted rounded-lg animate-pulse" />
        </div>
      </div>
    </div>
  ),
});

const PRODUCTS = [
  {
    category: "PAYMENTS",
    items: [
      {
        id: "bbps",
        title: "BBPS",
        description: "Power payments over BBPS",
        features: ["BBPS BOU", "BBPS COU"],
        icon: Receipt,
        href: "/kyc/bbps",
      },
      {
        id: "upi",
        title: "UPI",
        description: "Power seamless UPI payment journeys",
        features: ["Recur", "Deeplinks", "Flash", "Reserve", "Third Party Verification"],
        icon: CurrencyCircleDollar,
        href: "/kyc",
      },
      {
        id: "pg",
        title: "Payment Gateway",
        description: "Accept online payments with ease",
        features: ["Cards", "Net banking", "UPI", "Wallets"],
        icon: CreditCard,
        href: "/kyc",
      },
      {
        id: "payouts",
        title: "Payouts",
        description: "Disburse payments at scale",
        features: ["Bank transfers", "UPI payouts", "Bulk disbursals"],
        icon: Wallet,
        href: "/kyc",
      },
      {
        id: "creditline",
        title: "Credit Line",
        description: "Enable credit for your customers",
        features: ["Instant approval", "Flexible limits", "EMI options"],
        icon: Coins,
        href: "/kyc",
      },
    ],
  },
  {
    category: "DATA",
    items: [
      {
        id: "kyc",
        title: "KYC",
        description: "Verify individuals or businesses with ease",
        features: ["Bank account verification", "PAN", "eKYC Setu (for Aadhaar)", "DigiLocker"],
        icon: MagnifyingGlass,
        href: "/kyc",
      },
      {
        id: "esign",
        title: "eSign Gateway",
        description: "Integrate India's best Aadhaar eSign experience",
        features: ["Aadhaar eSign", "Digital signatures", "Document workflow"],
        icon: PenNib,
        href: "/kyc",
      },
      {
        id: "aa",
        title: "Account Aggregator",
        description: "Access financial data with user consent",
        features: ["Consent management", "Financial data", "Multi-FIP support"],
        icon: TreeStructure,
        href: "/kyc/insights",
      },
      {
        id: "insights",
        title: "Insights",
        description: "Analysing your customers' financial data, made easy",
        features: ["Credit scoring", "Risk analysis", "Income verification"],
        icon: ChartLine,
        href: "/kyc/insights",
      },
    ],
  },
];

const ESIGN_CONFIG_STEPS = [
  "Configure product",
  "Test product",
  "Add details for production",
];

const DASHBOARD_PRODUCT_NAV: Record<
  string,
  {
    id: string;
    label: string;
    icon: React.ElementType;
    children?: { id: string; label: string }[];
  }[]
> = {
  upi: [
    { id: "transactions", label: "Transactions", icon: Receipt },
    {
      id: "mandates",
      label: "Mandates",
      icon: CurrencyCircleDollar,
      children: [
        { id: "mandate-registrations", label: "Registrations" },
        { id: "pre-debit", label: "Pre-Debit Notifications" },
        { id: "executions", label: "Executions" },
      ],
    },
    { id: "refunds", label: "Refunds", icon: Wallet },
    {
      id: "settlements",
      label: "Settlements",
      icon: CreditCard,
      children: [
        { id: "payouts", label: "Payouts" },
        { id: "transaction-breakup", label: "Transaction Breakup" },
      ],
    },
    { id: "disputes", label: "Disputes", icon: Warning },
    { id: "merchants", label: "Merchants", icon: SquaresFour },
    { id: "api-docs", label: "API Docs", icon: BookOpen },
  ],
  creditline: [
    { id: "applications", label: "Applications", icon: Receipt },
    { id: "approvals", label: "Approvals", icon: PlusSquare },
    { id: "disbursals", label: "Disbursals", icon: Wallet },
    { id: "repayments", label: "Repayments", icon: CreditCard },
    { id: "risk-reports", label: "Risk reports", icon: ChartLine },
    { id: "merchants", label: "Merchants", icon: SquaresFour },
    { id: "api-docs", label: "API Docs", icon: BookOpen },
  ],
  insights: [
    { id: "reports", label: "Reports", icon: ChartLine },
    { id: "consents", label: "Consent journeys", icon: TreeStructure },
    { id: "segments", label: "Customer segments", icon: SquaresFour },
    { id: "risk-signals", label: "Risk signals", icon: Warning },
    { id: "merchants", label: "Merchants", icon: MagnifyingGlass },
    { id: "api-docs", label: "API Docs", icon: BookOpen },
  ],
};

/* ── Home page ── */
export default function HomePage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const [loginSurfaceVariant, setLoginSurfaceVariant] = useState<"split" | "center-card">("center-card");
  const [surveyOpen, setSurveyOpen] = useState(false);
  const [showKycBanner, setShowKycBanner] = useState(false);
  const [activeTab, setActiveTab] = useState<"home" | "products" | "dashboard" | "docs" | "settings" | "configuration">("home");
  const [configProduct, setConfigProduct] = useState<"upi" | "esign">("upi");
  const [esignActivated, setEsignActivated] = useState(false);
  const [filter, setFilter] = useState<"All" | "Payments" | "Data">("All");
  const [search, setSearch] = useState("");
  const [bannerDismissed, setBannerDismissed] = useState(false);
  const [dark, setDark] = useState(false);
  const [email, setEmail] = useState<string | null>(null);
  const [docsProductId, setDocsProductId] = useState("bbps");
  const [dashboardProductId, setDashboardProductId] = useState("upi");
  const [dashboardSectionId, setDashboardSectionId] = useState("transactions");
  const [settingsSection, setSettingsSection] = useState("Account");
  const [configStep, setConfigStep] = useState(0);
  const [homeProductId, setHomeProductId] = useState<string>("esign");

  const CONFIG_STEPS = [
    "Environment",
    "API Credentials",
    "Webhooks",
    "Settlement Account",
    "Transaction Limits",
    "Payment Modes",
    "VPA Handle",
    "Go-Live Checklist",
  ];
  const pendingHref = useRef<string | null>(null);

  useEffect(() => {
    setMounted(true);
    const started = localStorage.getItem("kyc_started");
    const completed = localStorage.getItem("kyc_completed");
    if (started === "true" && completed !== "true") {
      setShowKycBanner(true);
    }
    const stored = localStorage.getItem("theme");
    if (stored === "dark") {
      setDark(true);
      document.documentElement.classList.add("dark");
    } else {
      setDark(false);
      document.documentElement.classList.remove("dark");
    }
    const auth = localStorage.getItem("bridge_auth");
    if (auth === "true") {
      setEmail(localStorage.getItem("bridge_email"));
    }
    if (localStorage.getItem("esign_activated") === "true") {
      setEsignActivated(true);
    }
  }, []);

  function handleLogout() {
    localStorage.removeItem("bridge_auth");
    localStorage.removeItem("bridge_email");
    localStorage.removeItem("kyc_started");
    localStorage.removeItem("kyc_completed");
    setEmail(null);
    router.push("/");
    router.refresh();
  }

  function toggleTheme() {
    document.documentElement.classList.add("theme-transition");
    setDark((prev) => {
      const next = !prev;
      if (next) {
        document.documentElement.classList.add("dark");
        localStorage.setItem("theme", "dark");
      } else {
        document.documentElement.classList.remove("dark");
        localStorage.setItem("theme", "light");
      }
      return next;
    });
    setTimeout(() => {
      document.documentElement.classList.remove("theme-transition");
    }, 500);
  }

  function handleStartEsign() {
    const auth = localStorage.getItem("bridge_auth");
    if (!auth) {
      pendingHref.current = "__esign__";
      setLoginOpen(true);
      return;
    }
    localStorage.setItem("esign_activated", "true");
    setEsignActivated(true);
    setConfigProduct("esign");
    setConfigStep(0);
    setActiveTab("configuration");
  }

  function navigatePending() {
    const href = pendingHref.current ?? "/kyc";
    pendingHref.current = null;
    if (href === "__esign__") {
      handleStartEsign();
    } else {
      router.push(href);
    }
  }

  function handleStartClick(href: string) {
    const auth = localStorage.getItem("bridge_auth");
    if (auth) {
      router.push(href);
    } else {
      pendingHref.current = href;
      setLoginOpen(true);
    }
  }

  function handleLoginSuccess() {
    setLoginOpen(false);
    const storedEmail = localStorage.getItem("bridge_email");
    setEmail(storedEmail);
    const surveyed = localStorage.getItem("bridge_survey_completed");
    if (!surveyed) {
      setSurveyOpen(true);
    } else {
      navigatePending();
    }
  }

  function handleSurveyComplete(data: Record<string, string>) {
    localStorage.setItem("bridge_survey", JSON.stringify(data));
    localStorage.setItem("bridge_survey_completed", "true");
    setSurveyOpen(false);
    navigatePending();
  }

  function handleSurveySkip() {
    localStorage.setItem("bridge_survey_completed", "skipped");
    setSurveyOpen(false);
    navigatePending();
  }

  if (!mounted) return null;

  const NAV_ITEMS: { icon: React.ElementType; label: string; tab?: typeof activeTab }[] = [
    { icon: House, label: "Home", tab: "home" },
    { icon: Speedometer, label: "Dashboard", tab: "dashboard" },
    { icon: BookOpen, label: "Docs", tab: "docs" },
    { icon: SquaresFour, label: "Products", tab: "products" },
    { icon: Faders, label: "Configuration", tab: "configuration" },
  ];
  const isFullLoginSurface = loginSurfaceVariant === "center-card";

  const logoSvg = (
    <svg width={26} height={26} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-foreground">
      <path fillRule="evenodd" clipRule="evenodd" d="M0 16C0 8.45753 0 4.68629 2.34315 2.34315C4.68629 0 8.45753 0 16 0C23.5425 0 27.3137 0 29.6569 2.34315C32 4.68629 32 8.45753 32 16C32 23.5425 32 27.3137 29.6569 29.6569C27.3137 32 23.5425 32 16 32C8.45753 32 4.68629 32 2.34315 29.6569C0 27.3137 0 23.5425 0 16ZM18.0223 14.8714C17.3694 14.6863 16.6923 14.589 15.9983 14.589C15.2785 14.589 14.5769 14.6937 13.9016 14.8924C10.8292 15.7963 8.29946 18.6452 7.06511 22.4288C6.8191 23.1829 6.6961 23.56 6.9275 23.8098C7.15891 24.0596 7.56431 23.9609 8.37511 23.7634L9.69397 23.4422C10.2182 23.3146 10.4802 23.2508 10.6618 23.0864C10.8434 22.9221 10.9411 22.6448 11.1364 22.0902C11.7931 20.2252 12.7594 18.6085 13.9016 17.8211C14.5517 17.373 15.2588 17.1272 15.9983 17.1272C16.7103 17.1272 17.3923 17.3551 18.0223 17.7721C19.1997 18.5514 20.1954 20.1971 20.8661 22.1072C21.0612 22.6629 21.1588 22.9407 21.3405 23.1053C21.5221 23.2699 21.7846 23.3338 22.3095 23.4616L23.6275 23.7826C24.4373 23.9798 24.8423 24.0784 25.0737 23.829C25.3051 23.5795 25.1827 23.2027 24.938 22.4491C23.6964 18.6256 21.1329 15.7531 18.0223 14.8714ZM15.9993 11.7891C18.7869 11.7891 21.1926 12.3891 22.7131 12.8889C23.5399 13.1607 23.9533 13.2966 24.193 13.1231C24.4327 12.9496 24.4327 12.5351 24.4327 11.706V11.255C24.4327 10.3091 24.4327 9.83619 24.1437 9.50784C23.8547 9.1795 23.3996 9.12124 22.4895 9.00471C18.1633 8.45082 13.8412 8.45212 9.515 9.00518C8.60432 9.1216 8.14898 9.17981 7.85992 9.50817C7.57086 9.83654 7.57086 10.3096 7.57086 11.2558V11.704C7.57086 12.5332 7.57086 12.9477 7.81053 13.1213C8.05019 13.2948 8.46371 13.1589 9.29073 12.8871C10.8099 12.3879 13.2129 11.7891 15.9993 11.7891Z" fill="currentColor"/>
    </svg>
  );

  return (
    <div className="relative min-h-screen bg-muted/50">
      <div className="flex">
        {/* Left navigation */}
        <TooltipProvider delayDuration={200}>
        <nav className="hidden md:flex fixed left-0 top-0 bottom-0 z-50 w-16 flex-col items-center">
          {/* Logo */}
          <div className="flex h-16 w-full items-center justify-center shrink-0">
            <Tooltip>
              <TooltipTrigger asChild>
                <Link href="/" aria-label="Bridge home" className="flex items-center justify-center h-10 w-10 rounded-xl hover:bg-muted transition-colors">
                  {logoSvg}
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right">Bridge</TooltipContent>
            </Tooltip>
          </div>

          {/* Nav items */}
          <div className="flex flex-1 flex-col items-center gap-1 py-2">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = item.tab ? activeTab === item.tab : false;
            return (
              <Tooltip key={item.label}>
                <TooltipTrigger asChild>
                  <button
                    type="button"
                    onClick={() => item.tab ? setActiveTab(item.tab) : setActiveTab("home")}
                    className={`relative flex h-10 w-10 items-center justify-center rounded-xl transition-colors ${
                      isActive
                        ? "bg-sidebar-accent text-foreground"
                        : "text-muted-foreground hover:text-foreground hover:bg-foreground/8"
                    }`}
                    aria-label={item.label}
                  >
                    <Icon size={22} weight={isActive ? "fill" : "regular"} />
                  </button>
                </TooltipTrigger>
                <TooltipContent side="right">{item.label}</TooltipContent>
              </Tooltip>
            );
          })}
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                type="button"
                onClick={() => setActiveTab("settings")}
                className={`flex h-10 w-10 items-center justify-center rounded-xl transition-colors ${
                  activeTab === "settings"
                    ? "bg-foreground/15 text-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-foreground/8"
                }`}
                aria-label="Settings"
              >
                <GearSix size={22} weight={activeTab === "settings" ? "fill" : "regular"} />
              </button>
            </TooltipTrigger>
            <TooltipContent side="right">Settings</TooltipContent>
          </Tooltip>
          </div>

          {/* Bottom: theme switcher + account */}
          <div className="flex flex-col items-center gap-1 pb-4">
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  onClick={() => {
                    localStorage.removeItem("billing_pack_id");
                    localStorage.removeItem("billing_purchased_at");
                    localStorage.removeItem("esign_credits");
                    window.location.reload();
                  }}
                  className="flex h-10 w-10 items-center justify-center rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                  aria-label="Reset credits"
                >
                  <ArrowCounterClockwise size={20} weight="regular" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="right">Reset credits</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  onClick={toggleTheme}
                  className="flex h-10 w-10 items-center justify-center rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                  aria-label="Toggle dark mode"
                >
                  {dark ? <Sun size={20} weight="regular" /> : <Moon size={20} weight="regular" />}
                </button>
              </TooltipTrigger>
              <TooltipContent side="right">{dark ? "Light mode" : "Dark mode"}</TooltipContent>
            </Tooltip>

            {email ? (
              <Popover>
                <PopoverTrigger asChild>
                  <button
                    type="button"
                    className="flex h-10 w-10 items-center justify-center rounded-xl transition-colors hover:bg-muted"
                    aria-label="User menu"
                  >
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-orange-500 text-xs font-medium text-white">
                      {email[0].toUpperCase()}
                    </span>
                  </button>
                </PopoverTrigger>
                <PopoverContent side="right" align="end" className="w-56 p-2">
                  <div className="px-2 py-1.5 mb-1">
                    <p className="text-sm font-medium text-foreground truncate">{email}</p>
                  </div>
                  <div className="h-px bg-border my-1" />
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-stone-100 dark:hover:bg-stone-800 hover:text-foreground"
                  >
                    <SignOut size={16} />
                    Sign out
                  </button>
                </PopoverContent>
              </Popover>
            ) : (
              <button
                type="button"
                onClick={() => setLoginOpen(true)}
                className="flex h-10 w-10 items-center justify-center rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                aria-label="Sign in"
              >
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-muted-foreground/20 text-xs font-medium text-muted-foreground">
                  ?
                </span>
              </button>
            )}
          </div>
        </nav>
        </TooltipProvider>

        {/* Secondary navigation panel */}
        <AnimatePresence>
        {((activeTab !== "home" && activeTab !== "products") || (activeTab === "home" && esignActivated)) && (
        <motion.aside
          key="secondary-panel"
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -12 }}
          transition={{ duration: 0.18, ease: "easeOut" }}
          className="hidden md:flex fixed left-[68px] top-2 bottom-2 w-[216px] z-40 flex-col bg-background rounded-xl overflow-hidden"
        >
          <div className="p-3 pt-5 flex-1 overflow-y-auto">
            {activeTab === "home" && esignActivated && (() => {
              const configDone = localStorage.getItem("esign_config_completed") === "true";

              // Build the activated product list (extensible as more products are added)
              const activatedProducts = [
                {
                  id: "insights",
                  title: "Insights",
                  icon: ChartLine,
                  complete: true,
                },
                {
                  id: "esign",
                  title: "eSign Gateway",
                  icon: PenNib,
                  complete: configDone,
                },
              ];

              const inUse = activatedProducts.filter((p) => p.complete);
              const inProgress = activatedProducts.filter((p) => !p.complete);

              return (
                <>
                  {inUse.length > 0 && (
                    <div className="mb-4">
                      <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-1 px-2">Products in use</p>
                      <div className="space-y-0.5">
                        {inUse.map((item) => {
                          const Icon = item.icon;
                          return (
                            <button
                              key={item.id}
                              type="button"
                              onClick={() => setHomeProductId(item.id)}
                              className={`w-full text-left flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                                homeProductId === item.id
                                  ? "bg-sidebar-accent text-foreground"
                                  : "text-foreground hover:bg-muted"
                              }`}
                            >
                              <Icon size={16} weight="regular" className="shrink-0" />
                              {item.title}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                  {inProgress.length > 0 && (
                    <div className="mb-4">
                      <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-1 px-2">Continue setup</p>
                      <div className="space-y-0.5">
                        {inProgress.map((item) => {
                          const Icon = item.icon;
                          return (
                            <button
                              key={item.id}
                              type="button"
                              onClick={() => setHomeProductId(item.id)}
                              className={`w-full text-left flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                                homeProductId === item.id
                                  ? "bg-sidebar-accent text-foreground"
                                  : "text-foreground hover:bg-muted"
                              }`}
                            >
                              <Icon size={16} weight="regular" className="shrink-0" />
                              {item.title}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </>
              );
            })()}
            {activeTab === "dashboard" && (() => {
              const CONFIGURED = [
                { id: "upi", title: "UPI", category: "PAYMENTS" },
                { id: "creditline", title: "Credit Line", category: "PAYMENTS" },
                { id: "insights", title: "Insights", category: "DATA" },
              ];
              const allItems = PRODUCTS.flatMap((g) => g.items);
              const selectProduct = (productId: string) => {
                setDashboardProductId(productId);
                setDashboardSectionId(DASHBOARD_PRODUCT_NAV[productId]?.[0]?.id ?? "overview");
              };
              return (
                <div className="mb-4">
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-1 px-2">Your products</p>
                  <div className="flex flex-col gap-0.5">
                    {CONFIGURED.map((cfg) => {
                      const item = allItems.find((p) => p.id === cfg.id)!;
                      const Icon = item.icon;
                      const isProductActive = dashboardProductId === item.id;
                      const submenu = DASHBOARD_PRODUCT_NAV[item.id] ?? [];
                      return (
                        <div key={item.id}>
                          <button
                            type="button"
                            onClick={() => selectProduct(item.id)}
                            className={`w-full text-left flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                              isProductActive
                                ? "bg-sidebar-accent text-foreground"
                                : "text-foreground hover:bg-muted"
                            }`}
                          >
                            <Icon size={16} weight={isProductActive ? "fill" : "regular"} className="shrink-0" />
                            <span className="min-w-0 flex-1 truncate">{item.title}</span>
                            {isProductActive ? (
                              <CaretDown size={14} className="shrink-0 text-muted-foreground" />
                            ) : (
                              <CaretRight size={14} className="shrink-0 text-muted-foreground" />
                            )}
                          </button>
                          {isProductActive && submenu.length > 0 && (
                            <div className="ml-6 mt-1 flex flex-col gap-0.5 border-l border-border pl-2">
                              {submenu.map((navItem) => {
                                const NavIcon = navItem.icon;
                                const isItemActive =
                                  dashboardSectionId === navItem.id ||
                                  Boolean(navItem.children?.some((child) => child.id === dashboardSectionId));
                                const showChildren = Boolean(navItem.children && isItemActive);

                                return (
                                  <div key={navItem.id}>
                                    <button
                                      type="button"
                                      onClick={() => setDashboardSectionId(navItem.id)}
                                      className={`w-full text-left flex items-center gap-2 rounded-md px-2 py-1.5 text-xs transition-colors ${
                                        isItemActive
                                          ? "bg-sidebar-accent/70 text-foreground font-medium"
                                          : "text-muted-foreground hover:bg-muted hover:text-foreground"
                                      }`}
                                    >
                                      <NavIcon size={14} weight={isItemActive ? "fill" : "regular"} className="shrink-0" />
                                      <span className="min-w-0 flex-1 truncate">{navItem.label}</span>
                                      {navItem.children && (
                                        <CaretRight
                                          size={12}
                                          className={`shrink-0 transition-transform ${showChildren ? "rotate-90" : ""}`}
                                        />
                                      )}
                                    </button>
                                    {showChildren && (
                                      <div className="ml-6 mt-0.5 flex flex-col gap-0.5">
                                        {navItem.children?.map((child) => (
                                          <button
                                            key={child.id}
                                            type="button"
                                            onClick={() => setDashboardSectionId(child.id)}
                                            className={`rounded-md px-2 py-1 text-left text-xs transition-colors ${
                                              dashboardSectionId === child.id
                                                ? "font-medium text-foreground"
                                                : "text-muted-foreground hover:text-foreground"
                                            }`}
                                          >
                                            {child.label}
                                          </button>
                                        ))}
                                      </div>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })()}
            {activeTab === "docs" && (
              <>
                {PRODUCTS.map((group) => (
                  <div key={group.category} className="mb-4">
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-1 px-2">{group.category}</p>
                    <div className="space-y-0.5">
                      {group.items.map((item) => {
                        const Icon = item.icon;
                        return (
                          <button
                            key={item.id}
                            type="button"
                            onClick={() => setDocsProductId(item.id)}
                            className={`w-full text-left flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                              docsProductId === item.id
                                ? "bg-sidebar-accent text-foreground"
                                : "text-foreground hover:bg-muted"
                            }`}
                          >
                            <Icon size={16} weight="regular" className="shrink-0" />
                            {item.title}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </>
            )}
            {activeTab === "settings" && (
              <>
                <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-3 px-2">Settings</p>
                <div className="space-y-0.5">
                  {["Account", "Credits & usage", "Team", "API Keys", "Webhooks"].map((item) => (
                    <button
                      key={item}
                      type="button"
                      onClick={() => setSettingsSection(item)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        settingsSection === item
                          ? "bg-sidebar-accent text-foreground"
                          : "text-foreground hover:bg-muted"
                      }`}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </>
            )}
            {activeTab === "configuration" && (
              <>
                <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-2 px-2">Configuration</p>
                {/* Product switcher */}
                <div className="flex gap-1 mb-3 px-1">
                  {(["upi", "esign"] as const).map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => { setConfigProduct(p); setConfigStep(0); }}
                      className={`flex-1 text-center py-1.5 rounded-lg text-xs font-medium transition-colors ${
                        configProduct === p
                          ? "bg-sidebar-accent text-foreground"
                          : "text-muted-foreground hover:text-foreground hover:bg-muted"
                      }`}
                    >
                      {p === "upi" ? "UPI" : "eSign"}
                    </button>
                  ))}
                </div>
                <div className="space-y-0.5">
                  {(configProduct === "upi" ? CONFIG_STEPS : ESIGN_CONFIG_STEPS).map((label, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setConfigStep(i)}
                      className={`w-full text-left flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-sm transition-colors ${
                        configStep === i
                          ? "bg-sidebar-accent text-foreground font-medium"
                          : "text-muted-foreground hover:text-foreground hover:bg-muted"
                      }`}
                    >
                      <span className="tabular-nums text-[11px] w-3.5 shrink-0 text-muted-foreground">{i + 1}</span>
                      {label}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </motion.aside>
        )}
        </AnimatePresence>

        {/* Main content */}
        <div className={`flex-1 min-w-0 transition-[margin] duration-200 ${(activeTab === "home" && !esignActivated) || activeTab === "products" ? "md:ml-[68px]" : "md:ml-[284px]"}`}>
      <AnimatePresence mode="wait" initial={false}>
      {activeTab === "dashboard" ? (
        <motion.div
          key="dashboard"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
        >
          <DashboardView />
        </motion.div>
      ) : activeTab === "docs" ? (
        <motion.div
          key="docs"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
        >
          <DocsView selectedProductId={docsProductId} onSelectProduct={setDocsProductId} />
        </motion.div>
      ) : activeTab === "settings" ? (
        <motion.div
          key="settings"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
        >
          <SettingsView section={settingsSection} />
        </motion.div>
      ) : activeTab === "configuration" ? (
        <motion.div
          key={`configuration-${configProduct}`}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
        >
          {configProduct === "esign" ? (
            <EsignConfigurationView currentStep={configStep} onStepChange={setConfigStep} />
          ) : (
            <ConfigurationView currentStep={configStep} onStepChange={setConfigStep} />
          )}
        </motion.div>
      ) : activeTab === "products" ? (
        <motion.div
          key="products"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
        >
      <div className="my-2 ml-2 mr-2 rounded-xl bg-background h-[calc(100vh-16px)] overflow-hidden flex flex-col">
      <div className="shrink-0 bg-background z-10 px-6 pt-6 pb-4">
        <div className="max-w-[1400px] mx-auto">
          <h1 className="text-2xl font-bold text-foreground">Products</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Choose a product to get started with Bridge
          </p>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto px-6 pb-16">
        <div className="max-w-[1400px] mx-auto">

        {!bannerDismissed && (
          <div className="mb-6 rounded-2xl bg-muted p-4 sm:p-6">
            <span className="inline-block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4">
              {showKycBanner ? "Action needed" : "Get started"}
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-2">
              {showKycBanner ? "Your KYC verification is incomplete" : "Complete KYC to start using products"}
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground mb-6 max-w-lg">
              {showKycBanner
                ? "Continue where you left off to activate your products."
                : "KYC verification is required before you can activate any product."}
            </p>
            <Link href="/kyc">
              <Button size="lg">
                {showKycBanner ? "Continue KYC" : "Start KYC"}
              </Button>
            </Link>
          </div>
        )}

        {PRODUCTS.filter((group) => filter === "All" || group.category === filter.toUpperCase()).map((group) => {
          const filteredItems = search
            ? group.items.filter((p) => p.title.toLowerCase().includes(search.toLowerCase()) || p.description.toLowerCase().includes(search.toLowerCase()))
            : group.items;
          if (filteredItems.length === 0) return null;
          return (
          <div key={group.category}>
            <div className="mb-10">
              <h2 className="mb-4 text-xs font-semibold tracking-wide text-foreground capitalize">
                {group.category}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredItems.map((product) => {
                  const Icon = product.icon;
                  const isEsign = product.id === "esign";
                  return (
                    <Card
                      key={product.title}
                      className="flex flex-col shadow-none border border-border/40"
                    >
                      <CardHeader className="p-4 pb-2 space-y-4">
                        <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${group.category === "DATA" ? "bg-orange-100 dark:bg-orange-950" : "bg-secondary"}`}>
                          <Icon size={20} weight="duotone" className={group.category === "DATA" ? "text-orange-600 dark:text-orange-400" : "text-primary"} />
                        </div>
                        <div className="space-y-2">
                          <CardTitle className="text-lg">{product.title}</CardTitle>
                          <CardDescription>
                            {product.description}
                          </CardDescription>
                        </div>
                      </CardHeader>
                      <CardContent className="flex-1 px-4 pb-4">
                        <div className="flex flex-wrap gap-1.5">
                          {product.features.map((f) => (
                            <span
                              key={f}
                              className="inline-block rounded-full bg-muted px-2.5 py-0.5 text-xs text-muted-foreground"
                            >
                              {f}
                            </span>
                          ))}
                        </div>
                      </CardContent>
                      <CardFooter className="p-4 pt-0 gap-2">
                        {isEsign ? (
                          <>
                            <Button
                              variant="outline"
                              size="lg"
                              className="flex-1 group"
                              onClick={handleStartEsign}
                            >
                              {esignActivated ? "Continue configuring" : "Start using eSign"}
                              <ArrowRight size={16} className="opacity-0 -ml-5 transition-all group-hover:opacity-100 group-hover:ml-0" />
                            </Button>
                            {esignActivated && (
                              <Button
                                variant="outline"
                                size="lg"
                                onClick={() => setActiveTab("home")}
                              >
                                Workspace
                              </Button>
                            )}
                          </>
                        ) : (
                          <>
                            <Button
                              variant="outline"
                              size="lg"
                              className="w-full group"
                              onClick={() => handleStartClick(product.href)}
                            >
                              Start using {product.title}
                              <ArrowRight size={16} className="opacity-0 -ml-5 transition-all group-hover:opacity-100 group-hover:ml-0" />
                            </Button>
                            {product.title === "UPI" && (
                              <Button
                                variant="outline"
                                size="lg"
                                onClick={() => setActiveTab("configuration")}
                              >
                                Configure
                              </Button>
                            )}
                          </>
                        )}
                      </CardFooter>
                    </Card>
                  );
                })}
              </div>
            </div>
          </div>
          );
        })}
        </div>
      </div>
      </div>
        </motion.div>
      ) : (
        <motion.div
          key="home"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
        >
      <div className="my-2 ml-2 mr-2 rounded-xl bg-background h-[calc(100vh-16px)] overflow-hidden flex flex-col">
      <div className="shrink-0 bg-background z-10 px-6 pt-6 pb-4">
        <div className="max-w-[1400px] mx-auto">
          <h1 className="text-2xl font-bold text-foreground">Home</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Your activated products and workspace
          </p>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto px-6 pb-16">
        <div className="max-w-[1400px] mx-auto">
          {!esignActivated ? (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-muted">
                <SquaresFour size={28} weight="duotone" className="text-muted-foreground" />
              </div>
              <h2 className="text-lg font-semibold text-foreground mb-2">No products activated yet</h2>
              <p className="text-sm text-muted-foreground mb-6 max-w-xs">
                Go to Products to browse and activate products for your workspace.
              </p>
              <Button onClick={() => setActiveTab("products")}>Browse products</Button>
            </div>
          ) : homeProductId === "esign" ? (() => {
            const kycDone = localStorage.getItem("kyc_completed") === "true";
            const configDone = localStorage.getItem("esign_config_completed") === "true";
            const credits = localStorage.getItem("esign_credits");
            const creditLabel: Record<string, string> = { "1l": "Starter (1 Lakh)", "3l": "Growth (3 Lakhs)", "5l": "Scale (5 Lakhs)" };
            const rows = [
              {
                step: "KYC",
                statusLabel: kycDone ? "Complete" : "Not started",
                statusClass: kycDone
                  ? "bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400"
                  : "bg-muted text-muted-foreground",
                cta: kycDone ? null : (
                  <Button size="sm" variant="outline" onClick={() => router.push("/kyc")}>
                    Start KYC
                  </Button>
                ),
                ctaDone: kycDone ? (
                  <Button size="sm" variant="outline" disabled>Done ✓</Button>
                ) : null,
              },
              {
                step: "Configure",
                statusLabel: configDone ? "Complete" : `In progress (${configStep}/3)`,
                statusClass: configDone
                  ? "bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400"
                  : configStep > 0
                  ? "bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-400"
                  : "bg-muted text-muted-foreground",
                cta: configDone ? null : (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => { setConfigProduct("esign"); setActiveTab("configuration"); }}
                  >
                    Configure
                  </Button>
                ),
                ctaDone: configDone ? (
                  <Button size="sm" variant="outline" disabled>Done ✓</Button>
                ) : null,
              },
              {
                step: "Buy Credits",
                statusLabel: credits ? creditLabel[credits] ?? credits : "Not purchased",
                statusClass: credits
                  ? "bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400"
                  : "bg-muted text-muted-foreground",
                cta: !credits ? (
                  <Button size="sm" variant="outline" onClick={() => router.push("/esign/credits")}>
                    Buy Credits
                  </Button>
                ) : null,
                ctaDone: credits ? (
                  <Button size="sm" variant="outline" disabled>Done ✓</Button>
                ) : null,
              },
            ];
            return (
              <div className="max-w-xl">
                <Card className="shadow-none border border-border/40">
                  <CardHeader className="p-5 pb-3">
                    <div className="flex items-center gap-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-100 dark:bg-orange-950">
                        <PenNib size={16} weight="duotone" className="text-orange-600 dark:text-orange-400" />
                      </div>
                      <CardTitle className="text-base">eSign Gateway</CardTitle>
                    </div>
                    <CardDescription className="text-xs mt-1">3-step activation</CardDescription>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="divide-y divide-border">
                      {rows.map((row) => (
                        <div key={row.step} className="flex items-center justify-between px-5 py-3 gap-4">
                          <div className="flex items-center gap-3">
                            <span className="text-sm font-medium text-foreground">{row.step}</span>
                            <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-medium ${row.statusClass}`}>
                              {row.statusLabel}
                            </span>
                          </div>
                          <div>{row.cta ?? row.ctaDone}</div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            );
          })() : (
            <div className="max-w-xl">
              <Card className="shadow-none border border-border/40">
                <CardHeader className="p-5 pb-3">
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-100 dark:bg-orange-950">
                      <ChartLine size={16} weight="duotone" className="text-orange-600 dark:text-orange-400" />
                    </div>
                    <CardTitle className="text-base">Insights</CardTitle>
                  </div>
                  <CardDescription className="text-xs mt-1">Live — financial data analytics</CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="divide-y divide-border">
                    {[
                      { step: "KYC", status: "Complete", cls: "bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400" },
                      { step: "Configure", status: "Complete", cls: "bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400" },
                      { step: "Go Live", status: "Live", cls: "bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400" },
                    ].map((row) => (
                      <div key={row.step} className="flex items-center justify-between px-5 py-3 gap-4">
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-medium text-foreground">{row.step}</span>
                          <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-medium ${row.cls}`}>
                            {row.status}
                          </span>
                        </div>
                        <Button size="sm" variant="outline" disabled>Done ✓</Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
      </div>
        </motion.div>
      )}
      </AnimatePresence>

      {/* Bottom fade gradient */}
      <div
        className="pointer-events-none fixed bottom-0 left-0 right-0 h-[120px] z-30 bg-gradient-to-t from-background to-transparent"
      />

      {/* Login overlay */}
      <Dialog modal={false} open={loginOpen} onOpenChange={setLoginOpen}>
        <DialogContent
          onInteractOutside={(event) => event.preventDefault()}
          onPointerDownOutside={(event) => event.preventDefault()}
          onOpenAutoFocus={(event) => event.preventDefault()}
          className="h-screen max-h-screen w-screen max-w-none rounded-none border-0 bg-transparent p-0 gap-0 overflow-hidden shadow-none sm:rounded-none [&>button]:hidden"
        >
          {isFullLoginSurface && (
            <div className="absolute inset-0 overflow-hidden rounded-none">
              <LoginGrainientBackground />
            </div>
          )}
          {!isFullLoginSurface && (
            <div className="fixed inset-0 z-0 rounded-none bg-black/50" />
          )}
          <div
            className={`absolute left-1/2 z-30 flex -translate-x-1/2 rounded-full border border-white/40 bg-white/80 p-1 shadow-lg backdrop-blur ${
              isFullLoginSurface ? "top-6" : "top-6"
            }`}
          >
            {[
              ["center-card", "Full-screen"],
              ["split", "Split modal"],
            ].map(([variant, label]) => (
              <button
                key={variant}
                type="button"
                onClick={() =>
                  setLoginSurfaceVariant(variant as "split" | "center-card")
                }
                className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                  loginSurfaceVariant === variant
                    ? "bg-[#006976] text-white"
                    : "text-slate-600 hover:bg-white"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
          <VisuallyHidden>
            <DialogTitle>Sign in to Bridge</DialogTitle>
            <DialogDescription>
              Sign in to Bridge to continue using this workspace.
            </DialogDescription>
          </VisuallyHidden>
          <div
            className={
              isFullLoginSurface
                ? "relative z-10 flex min-h-screen w-full items-center justify-center px-6 pb-4 pt-8"
                : "relative z-10 flex min-h-screen w-full items-center justify-center px-6 pb-4 pt-8"
            }
          >
            <div className="relative">
              <BridgeLoginCard
                variant={loginSurfaceVariant}
                onClose={() => setLoginOpen(false)}
                onSuccess={handleLoginSuccess}
              />
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Onboarding survey */}
      <OnboardingSurvey
        open={surveyOpen}
        onComplete={handleSurveyComplete}
        onSkip={handleSurveySkip}
      />
        </div>
      </div>
    </div>
  );
}
