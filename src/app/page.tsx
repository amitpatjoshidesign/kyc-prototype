"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  Receipt,
  CurrencyCircleDollar,
  CreditCard,
  Wallet,
  Coins,
  ArrowRight,
} from "@phosphor-icons/react";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

const PRODUCTS = [
  {
    category: "DATA",
    items: [
      {
        title: "KYC",
        description: "Verify individuals or businesses with ease",
        features: ["Bank account verification", "PAN", "eKYC Setu (for Aadhaar)", "DigiLocker"],
        icon: MagnifyingGlass,
        href: "/kyc",
      },
      {
        title: "eSign Gateway",
        description: "Integrate India's best Aadhaar eSign experience",
        features: ["Aadhaar eSign", "Digital signatures", "Document workflow"],
        icon: PenNib,
        href: "/kyc",
      },
      {
        title: "Account Aggregator",
        description: "Access financial data with user consent",
        features: ["Consent management", "Financial data", "Multi-FIP support"],
        icon: TreeStructure,
        href: "/kyc",
      },
      {
        title: "Insights",
        description: "Analysing your customers' financial data, made easy",
        features: ["Credit scoring", "Risk analysis", "Income verification"],
        icon: ChartLine,
        href: "/kyc",
      },
    ],
  },
  {
    category: "PAYMENTS",
    items: [
      {
        title: "BBPS",
        description: "Power payments over BBPS",
        features: ["BBPS BOU", "BBPS COU"],
        icon: Receipt,
        href: "/kyc",
      },
      {
        title: "UPI",
        description: "Power seamless UPI payment journeys",
        features: ["Recur", "Deeplinks", "Flash", "Reserve", "Third Party Verification"],
        icon: CurrencyCircleDollar,
        href: "/kyc",
      },
      {
        title: "Payment Gateway",
        description: "Accept online payments with ease",
        features: ["Cards", "Net banking", "UPI", "Wallets"],
        icon: CreditCard,
        href: "/kyc",
      },
      {
        title: "Payouts",
        description: "Disburse payments at scale",
        features: ["Bank transfers", "UPI payouts", "Bulk disbursals"],
        icon: Wallet,
        href: "/kyc",
      },
      {
        title: "Credit Line",
        description: "Enable credit for your customers",
        features: ["Instant approval", "Flexible limits", "EMI options"],
        icon: Coins,
        href: "/kyc",
      },
    ],
  },
];

/* ── Skeleton helpers ── */
function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={`animate-pulse rounded-md bg-muted ${className ?? ""}`}
    />
  );
}

function FormSkeleton() {
  return (
    <div className="w-full space-y-6 p-8 md:p-10">
      <Skeleton className="h-8 w-32" />
      <div className="space-y-4">
        <div>
          <Skeleton className="h-4 w-16 mb-2" />
          <Skeleton className="h-10 w-full" />
        </div>
        <div>
          <Skeleton className="h-4 w-20 mb-2" />
          <Skeleton className="h-10 w-full" />
        </div>
        <div>
          <Skeleton className="h-4 w-36 mb-2" />
          <Skeleton className="h-10 w-full" />
        </div>
      </div>
      <Skeleton className="h-[1px] w-full" />
      <div className="space-y-3">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
      </div>
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-4 w-64 mx-auto" />
    </div>
  );
}

/* ── Login overlay content ── */
function LoginOverlay({ onSuccess }: { onSuccess: () => void }) {
  const [isSignUp, setIsSignUp] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    localStorage.setItem("bridge_auth", "true");
    onSuccess();
  }

  function handleSocialLogin() {
    localStorage.setItem("bridge_auth", "true");
    onSuccess();
  }

  return (
    <div className="flex min-h-[520px] max-h-[90vh]">
      {/* Left panel — dark brand area */}
      <div className="hidden lg:flex lg:w-[380px] shrink-0 relative bg-[#1a1a2e] items-end overflow-hidden rounded-l-lg">
        <div
          className="absolute top-0 left-0 right-0 h-1"
          style={{
            background: "linear-gradient(90deg, #009CB0 0%, #D5FFFF 100%)",
          }}
        />
        <div className="relative z-10 p-10 pb-12">
          <div className="flex items-center gap-2.5 mb-6">
            <svg
              width={28}
              height={28}
              viewBox="0 0 32 32"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M0 16C0 8.45753 0 4.68629 2.34315 2.34315C4.68629 0 8.45753 0 16 0C23.5425 0 27.3137 0 29.6569 2.34315C32 4.68629 32 8.45753 32 16C32 23.5425 32 27.3137 29.6569 29.6569C27.3137 32 23.5425 32 16 32C8.45753 32 4.68629 32 2.34315 29.6569C0 27.3137 0 23.5425 0 16ZM18.0223 14.8714C17.3694 14.6863 16.6923 14.589 15.9983 14.589C15.2785 14.589 14.5769 14.6937 13.9016 14.8924C10.8292 15.7963 8.29946 18.6452 7.06511 22.4288C6.8191 23.1829 6.6961 23.56 6.9275 23.8098C7.15891 24.0596 7.56431 23.9609 8.37511 23.7634L9.69397 23.4422C10.2182 23.3146 10.4802 23.2508 10.6618 23.0864C10.8434 22.9221 10.9411 22.6448 11.1364 22.0902C11.7931 20.2252 12.7594 18.6085 13.9016 17.8211C14.5517 17.373 15.2588 17.1272 15.9983 17.1272C16.7103 17.1272 17.3923 17.3551 18.0223 17.7721C19.1997 18.5514 20.1954 20.1971 20.8661 22.1072C21.0612 22.6629 21.1588 22.9407 21.3405 23.1053C21.5221 23.2699 21.7846 23.3338 22.3095 23.4616L23.6275 23.7826C24.4373 23.9798 24.8423 24.0784 25.0737 23.829C25.3051 23.5795 25.1827 23.2027 24.938 22.4491C23.6964 18.6256 21.1329 15.7531 18.0223 14.8714ZM15.9993 11.7891C18.7869 11.7891 21.1926 12.3891 22.7131 12.8889C23.5399 13.1607 23.9533 13.2966 24.193 13.1231C24.4327 12.9496 24.4327 12.5351 24.4327 11.706V11.255C24.4327 10.3091 24.4327 9.83619 24.1437 9.50784C23.8547 9.1795 23.3996 9.12124 22.4895 9.00471C18.1633 8.45082 13.8412 8.45212 9.515 9.00518C8.60432 9.1216 8.14898 9.17981 7.85992 9.50817C7.57086 9.83654 7.57086 10.3096 7.57086 11.2558V11.704C7.57086 12.5332 7.57086 12.9477 7.81053 13.1213C8.05019 13.2948 8.46371 13.1589 9.29073 12.8871C10.8099 12.3879 13.2129 11.7891 15.9993 11.7891Z"
                fill="white"
              />
            </svg>
            <span className="text-lg font-semibold text-white">Bridge</span>
          </div>
          <h2 className="text-xl font-bold text-white mb-3">
            KYC &amp; Onboarding
          </h2>
          <p className="text-sm text-white/60 max-w-sm leading-relaxed">
            Streamline your business verification with India&apos;s most trusted
            KYC platform. Fast, secure, and compliant.
          </p>
        </div>
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse at 30% 80%, rgba(0,156,176,0.15) 0%, transparent 60%)",
          }}
        />
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex items-center justify-center overflow-y-auto">
        {loading ? (
          <FormSkeleton />
        ) : (
          <div className="w-full max-w-[380px] p-8 md:p-10">
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
              {isSignUp ? "Sign up" : "Sign in"}
            </h1>

            <form onSubmit={handleSubmit} className="space-y-4">
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
                <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-background px-3 text-xs uppercase text-muted-foreground tracking-wider">
                  or
                </span>
              </div>

              <div className="space-y-3">
                <button
                  type="button"
                  onClick={handleSocialLogin}
                  className="flex h-10 w-full items-center justify-center gap-3 rounded-md border border-input bg-background text-sm font-medium text-foreground transition-colors hover:bg-accent"
                >
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                    <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 01-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
                    <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.26c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z" fill="#34A853"/>
                    <path d="M3.964 10.71A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
                    <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
                  </svg>
                  Sign in with Google
                </button>

                <button
                  type="button"
                  onClick={handleSocialLogin}
                  className="flex h-10 w-full items-center justify-center gap-3 rounded-md border border-input bg-background text-sm font-medium text-foreground transition-colors hover:bg-accent"
                >
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                    <path d="M1.5 1.5h6.75v6.75H1.5z" fill="#6264A7"/>
                    <path d="M9.75 1.5h6.75v6.75H9.75z" fill="#6264A7"/>
                    <path d="M1.5 9.75h6.75v6.75H1.5z" fill="#6264A7"/>
                    <path d="M9.75 9.75h6.75v6.75H9.75z" fill="#6264A7"/>
                  </svg>
                  Signup using Teams
                </button>

                <button
                  type="button"
                  onClick={handleSocialLogin}
                  className="flex h-10 w-full items-center justify-center gap-3 rounded-md border border-input bg-background text-sm font-medium text-foreground transition-colors hover:bg-accent"
                >
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                    <circle cx="9" cy="9" r="7.5" stroke="#1CA4E0" strokeWidth="1.5" fill="none"/>
                    <path d="M5.5 9.5L8 12l4.5-6" stroke="#1CA4E0" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                  </svg>
                  Signup using Zoho
                </button>
              </div>

              <Button type="submit" className="w-full !mt-5">
                {isSignUp ? "Sign up" : "Sign in"}
              </Button>
            </form>

            <p className="mt-3 text-xs text-muted-foreground">
              By signing up you are agreeing to our{" "}
              <span className="text-primary cursor-pointer hover:underline">
                terms &amp; conditions
              </span>
            </p>

            <p className="mt-5 text-center text-sm text-muted-foreground">
              {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
              <button
                type="button"
                onClick={() => setIsSignUp(!isSignUp)}
                className="font-medium text-primary hover:underline"
              >
                {isSignUp ? "Sign in" : "Sign up"}
              </button>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

/* ── Home page ── */
export default function HomePage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const pendingHref = useRef<string | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

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

  return (
    <div className="relative min-h-screen bg-accent">
      <Header />

      <div className="mx-auto max-w-[1080px] px-4 pt-6 pb-16">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-foreground">Products</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Choose a product to get started with Bridge
          </p>
        </div>

        {PRODUCTS.map((group) => (
          <div key={group.category} className="mb-10">
            <h2 className="mb-4 text-xs font-semibold uppercase tracking-wider text-primary">
              {group.category}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {group.items.map((product) => {
                const Icon = product.icon;
                return (
                  <Card
                    key={product.title}
                    className="flex flex-col transition-shadow hover:shadow-md"
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-start gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-secondary">
                          <Icon size={20} weight="duotone" className="text-primary" />
                        </div>
                        <div>
                          <CardTitle className="text-base">{product.title}</CardTitle>
                          <CardDescription className="mt-1">
                            {product.description}
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="flex-1">
                      <ul className="space-y-1">
                        {product.features.map((f) => (
                          <li
                            key={f}
                            className="text-xs text-muted-foreground"
                          >
                            {f}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                    <CardFooter>
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full gap-2"
                        onClick={() => handleStartClick(product.href)}
                      >
                        Start
                        <ArrowRight size={14} weight="bold" />
                      </Button>
                    </CardFooter>
                  </Card>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Teal gradient */}
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
  );
}
