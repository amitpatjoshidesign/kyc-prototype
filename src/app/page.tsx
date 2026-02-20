"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  InputGroup,
  InputGroupInput,
  InputGroupAddon,
} from "@/components/ui/input-group";
import { Separator } from "@/components/ui/separator";
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
  Moon,
  Sun,
  SignOut,
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

/* ── Login overlay content ── */
function LoginOverlay({ onSuccess }: { onSuccess: () => void }) {
  const [isSignUp, setIsSignUp] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    localStorage.setItem("bridge_auth", "true");
    if (email) localStorage.setItem("bridge_email", email);
    onSuccess();
  }

  function handleSocialLogin() {
    localStorage.setItem("bridge_auth", "true");
    localStorage.setItem("bridge_email", "amit@setu.co");
    onSuccess();
  }

  return (
    <div className="flex min-h-[520px] max-h-[90vh]">
      {/* Left panel — splash image */}
      <div className="hidden lg:block flex-1 relative overflow-hidden rounded-l-lg">
        <img
          src="/splash2.png"
          alt="Bridge KYC & Onboarding"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <img
          src="/setulogo-full.svg"
          alt="Setu"
          className="absolute top-6 left-6 h-8"
        />
      </div>

      {/* Right panel — form */}
      <div className="shrink-0 flex items-center justify-center overflow-y-auto p-8">
          <div className="w-full max-w-[300px] flex flex-col h-full">
            {/* Mobile logo */}
            <div className="flex lg:hidden items-center gap-2 mb-6">
              <svg
                width={24}
                height={24}
                viewBox="0 0 32 32"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="text-foreground"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M0 16C0 8.45753 0 4.68629 2.34315 2.34315C4.68629 0 8.45753 0 16 0C23.5425 0 27.3137 0 29.6569 2.34315C32 4.68629 32 8.45753 32 16C32 23.5425 32 27.3137 29.6569 29.6569C27.3137 32 23.5425 32 16 32C8.45753 32 4.68629 32 2.34315 29.6569C0 27.3137 0 23.5425 0 16ZM18.0223 14.8714C17.3694 14.6863 16.6923 14.589 15.9983 14.589C15.2785 14.589 14.5769 14.6937 13.9016 14.8924C10.8292 15.7963 8.29946 18.6452 7.06511 22.4288C6.8191 23.1829 6.6961 23.56 6.9275 23.8098C7.15891 24.0596 7.56431 23.9609 8.37511 23.7634L9.69397 23.4422C10.2182 23.3146 10.4802 23.2508 10.6618 23.0864C10.8434 22.9221 10.9411 22.6448 11.1364 22.0902C11.7931 20.2252 12.7594 18.6085 13.9016 17.8211C14.5517 17.373 15.2588 17.1272 15.9983 17.1272C16.7103 17.1272 17.3923 17.3551 18.0223 17.7721C19.1997 18.5514 20.1954 20.1971 20.8661 22.1072C21.0612 22.6629 21.1588 22.9407 21.3405 23.1053C21.5221 23.2699 21.7846 23.3338 22.3095 23.4616L23.6275 23.7826C24.4373 23.9798 24.8423 24.0784 25.0737 23.829C25.3051 23.5795 25.1827 23.2027 24.938 22.4491C23.6964 18.6256 21.1329 15.7531 18.0223 14.8714ZM15.9993 11.7891C18.7869 11.7891 21.1926 12.3891 22.7131 12.8889C23.5399 13.1607 23.9533 13.2966 24.193 13.1231C24.4327 12.9496 24.4327 12.5351 24.4327 11.706V11.255C24.4327 10.3091 24.4327 9.83619 24.1437 9.50784C23.8547 9.1795 23.3996 9.12124 22.4895 9.00471C18.1633 8.45082 13.8412 8.45212 9.515 9.00518C8.60432 9.1216 8.14898 9.17981 7.85992 9.50817C7.57086 9.83654 7.57086 10.3096 7.57086 11.2558V11.704C7.57086 12.5332 7.57086 12.9477 7.81053 13.1213C8.05019 13.2948 8.46371 13.1589 9.29073 12.8871C10.8099 12.3879 13.2129 11.7891 15.9993 11.7891Z"
                  fill="currentColor"
                />
              </svg>
              <span className="text-base font-semibold text-foreground">Bridge</span>
            </div>

            <h1 className="text-xl font-bold text-foreground mb-5">
              {isSignUp ? "Sign up on Bridge" : "Sign in to Bridge"}
            </h1>

            <form onSubmit={handleSubmit} className="space-y-4 min-h-[420px]">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-foreground">
                  Email
                </label>
                <Input
                  type="email"
                  placeholder="you@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-foreground">
                  Password
                </label>
                <Input
                  type="password"
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              {isSignUp && (
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-foreground">
                    Confirm your password
                  </label>
                  <Input
                    type="password"
                    placeholder="Confirm password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>
              )}

              <div className="relative !my-5">
                <Separator />
                <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-background px-3 text-[10px] uppercase text-muted-foreground tracking-wider">
                  or sign in with
                </span>
              </div>

              <div className="flex items-center justify-center gap-4">
                <button
                  type="button"
                  onClick={handleSocialLogin}
                  className="flex h-10 flex-1 items-center justify-center rounded-md border border-input bg-background transition-colors hover:bg-stone-100 dark:hover:bg-stone-800"
                  aria-label="Sign in with Google"
                >
                  <svg width="20" height="20" viewBox="0 0 18 18" fill="none">
                    <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 01-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
                    <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.26c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z" fill="#34A853"/>
                    <path d="M3.964 10.71A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
                    <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
                  </svg>
                </button>

                <button
                  type="button"
                  onClick={handleSocialLogin}
                  className="flex h-10 flex-1 items-center justify-center rounded-md border border-input bg-background transition-colors hover:bg-stone-100 dark:hover:bg-stone-800"
                  aria-label="Sign in with Teams"
                >
                  <svg width="20" height="20" viewBox="0 0 18 18" fill="none">
                    <path d="M1.5 1.5h6.75v6.75H1.5z" fill="#6264A7"/>
                    <path d="M9.75 1.5h6.75v6.75H9.75z" fill="#6264A7"/>
                    <path d="M1.5 9.75h6.75v6.75H1.5z" fill="#6264A7"/>
                    <path d="M9.75 9.75h6.75v6.75H9.75z" fill="#6264A7"/>
                  </svg>
                </button>

                <button
                  type="button"
                  onClick={handleSocialLogin}
                  className="flex h-10 flex-1 items-center justify-center rounded-md border border-input bg-background transition-colors hover:bg-stone-100 dark:hover:bg-stone-800"
                  aria-label="Sign in with Zoho"
                >
                  <svg width="20" height="20" viewBox="0 0 18 18" fill="none">
                    <circle cx="9" cy="9" r="7.5" stroke="#1CA4E0" strokeWidth="1.5" fill="none"/>
                    <path d="M5.5 9.5L8 12l4.5-6" stroke="#1CA4E0" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                  </svg>
                </button>
              </div>

              <Button type="submit" className="w-full !mt-5">
                {isSignUp ? "Sign up" : "Sign in"}
              </Button>

              <button
                type="button"
                onClick={() => setIsSignUp(!isSignUp)}
                className="w-full mt-[8px] text-center text-sm font-medium text-primary hover:underline"
              >
                {isSignUp ? "Sign in instead" : "Sign up instead"}
              </button>
            </form>

            <p className="mt-auto pt-8 text-center text-xs text-muted-foreground">
              By signing up you are agreeing to our{" "}
              <span className="text-primary cursor-pointer hover:underline">
                terms &amp; conditions
              </span>
            </p>
          </div>
      </div>
    </div>
  );
}

/* ── Home page ── */
export default function HomePage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const [showKycBanner, setShowKycBanner] = useState(false);
  const [activeTab, setActiveTab] = useState<"home" | "dashboard" | "docs" | "settings" | "configuration">("home");
  const [filter, setFilter] = useState<"All" | "Payments" | "Data">("All");
  const [search, setSearch] = useState("");
  const [bannerDismissed, setBannerDismissed] = useState(false);
  const [dark, setDark] = useState(false);
  const [email, setEmail] = useState<string | null>(null);
  const [docsProductId, setDocsProductId] = useState("bbps");
  const [dashboardProductId, setDashboardProductId] = useState("upi");
  const [settingsSection, setSettingsSection] = useState("Account");
  const pendingHref = useRef<string | null>(null);

  useEffect(() => {
    setMounted(true);
    const started = localStorage.getItem("kyc_started");
    const completed = localStorage.getItem("kyc_completed");
    if (started === "true" && completed !== "true") {
      setShowKycBanner(true);
    }
    const stored = localStorage.getItem("theme");
    if (stored === "dark" || (!stored && window.matchMedia("(prefers-color-scheme: dark)").matches)) {
      setDark(true);
      document.documentElement.classList.add("dark");
    }
    const auth = localStorage.getItem("bridge_auth");
    if (auth === "true") {
      setEmail(localStorage.getItem("bridge_email"));
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
    const href = pendingHref.current ?? "/kyc";
    pendingHref.current = null;
    router.push(href);
  }

  if (!mounted) return null;

  const NAV_ITEMS = [
    { icon: House, label: "Home", tab: "home" as const },
    { icon: Speedometer, label: "Dashboard", tab: "dashboard" as const },
    { icon: BookOpen, label: "Docs", tab: "docs" as const },
    { icon: SquaresFour, label: "Products" },
    { icon: PlusSquare, label: "Create" },
  ];

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
                    onClick={() => item.tab && setActiveTab(item.tab)}
                    className={`relative flex h-10 w-10 items-center justify-center rounded-xl transition-colors ${
                      isActive
                        ? "bg-foreground/15 text-foreground"
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
        {activeTab !== "home" && (
        <motion.aside
          key="secondary-panel"
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -12 }}
          transition={{ duration: 0.18, ease: "easeOut" }}
          className="hidden md:flex fixed left-[68px] top-2 bottom-2 w-[216px] z-40 flex-col bg-background rounded-xl overflow-hidden"
        >
          <div className="p-3 pt-5 flex-1 overflow-y-auto">
            {activeTab === "dashboard" && (() => {
              const CONFIGURED = [
                { id: "upi", title: "UPI", category: "PAYMENTS" },
                { id: "creditline", title: "Credit Line", category: "PAYMENTS" },
                { id: "insights", title: "Insights", category: "DATA" },
              ];
              const allItems = PRODUCTS.flatMap((g) => g.items);
              return (
                <div className="mb-4">
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-1 px-2">Your products</p>
                  <div className="space-y-0.5">
                    {CONFIGURED.map((cfg) => {
                      const item = allItems.find((p) => p.id === cfg.id)!;
                      const Icon = item.icon;
                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => setDashboardProductId(item.id)}
                          className={`w-full text-left flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                            dashboardProductId === item.id
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
                  {["Account", "Team", "API Keys", "Webhooks", "Billing"].map((item) => (
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
                <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-3 px-2">Configuration</p>
                <div className="space-y-0.5">
                  {["UPI", "Payment Gateway", "Payouts"].map((item) => (
                    <button
                      key={item}
                      type="button"
                      className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-foreground hover:bg-muted transition-colors"
                    >
                      {item}
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
        <div className={`flex-1 transition-[margin] duration-200 ${activeTab === "home" ? "md:ml-[68px]" : "md:ml-[284px]"}`}>
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
          key="configuration"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
        >
          <ConfigurationView />
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
        <h1 className="text-2xl font-bold text-foreground">Products</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Choose a product to get started with Bridge
        </p>
      </div>
      <div className="flex-1 overflow-y-auto px-6 pb-16">

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
        </motion.div>
      )}
      </AnimatePresence>

      {/* Bottom fade gradient */}
      <div
        className="pointer-events-none fixed bottom-0 left-0 right-0 h-[120px] z-30 bg-gradient-to-t from-background to-transparent"
      />

      {/* Login overlay */}
      <Dialog open={loginOpen} onOpenChange={setLoginOpen}>
        <DialogContent className="max-w-[860px] p-0 gap-0 overflow-hidden">
          <VisuallyHidden>
            <DialogTitle>Sign in to Bridge</DialogTitle>
          </VisuallyHidden>
          <LoginOverlay onSuccess={handleLoginSuccess} />
        </DialogContent>
      </Dialog>
        </div>
      </div>
    </div>
  );
}
