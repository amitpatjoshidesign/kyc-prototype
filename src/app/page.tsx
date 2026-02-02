"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
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

export default function HomePage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const auth = localStorage.getItem("bridge_auth");
    if (!auth) {
      router.replace("/login");
    }
  }, [router]);

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
                        onClick={() => router.push(product.href)}
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
    </div>
  );
}
