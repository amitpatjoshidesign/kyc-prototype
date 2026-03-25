"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { CheckCircle, ArrowLeft } from "@phosphor-icons/react";

const CREDIT_PACKS = [
  {
    id: "1l",
    title: "Starter",
    credits: "1 Lakh",
    subtitle: "For low-volume testing",
    features: [
      "1,00,000 eSign credits",
      "Valid for 12 months",
      "Standard support",
    ],
    price: "₹10,000",
    popular: false,
  },
  {
    id: "3l",
    title: "Growth",
    credits: "3 Lakhs",
    subtitle: "Most popular",
    features: [
      "3,00,000 eSign credits",
      "Valid for 12 months",
      "Priority support",
    ],
    price: "₹27,000",
    popular: true,
  },
  {
    id: "5l",
    title: "Scale",
    credits: "5 Lakhs",
    subtitle: "Best value",
    features: [
      "5,00,000 eSign credits",
      "Valid for 24 months",
      "Dedicated support",
    ],
    price: "₹40,000",
    popular: false,
  },
];

export default function EsignCreditsPage() {
  const router = useRouter();
  const [purchased, setPurchased] = useState<string | null>(
    typeof window !== "undefined" ? localStorage.getItem("esign_credits") : null
  );

  function handleBuy(packId: string) {
    localStorage.setItem("esign_credits", packId);
    setPurchased(packId);
  }

  return (
    <div className="min-h-screen bg-muted/50">
      <div className="max-w-5xl mx-auto px-6 py-10">
        {/* Back link */}
        <button
          type="button"
          onClick={() => router.push("/")}
          className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
        >
          <ArrowLeft size={16} />
          Back to workspace
        </button>

        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-6">
          <button
            type="button"
            onClick={() => router.push("/")}
            className="hover:text-foreground transition-colors"
          >
            Home
          </button>
          <span>/</span>
          <span>eSign</span>
          <span>/</span>
          <span className="text-foreground font-medium">Buy Credits</span>
        </div>

        <div className="mb-10">
          <h1 className="text-2xl font-bold text-foreground">Buy eSign Credits</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Purchase credits to enable Aadhaar eSign for your customers
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {CREDIT_PACKS.map((pack) => {
            const isPurchased = purchased === pack.id;
            return (
              <Card
                key={pack.id}
                className={`flex flex-col shadow-none relative ${
                  pack.popular ? "border-primary border-2" : "border border-border/40"
                }`}
              >
                {pack.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="rounded-full bg-primary px-3 py-1 text-[10px] font-semibold text-primary-foreground">
                      Most popular
                    </span>
                  </div>
                )}
                <CardHeader className="p-5 pb-3">
                  <CardTitle className="text-base">{pack.title}</CardTitle>
                  <div className="mt-2">
                    <span className="text-3xl font-bold text-foreground">{pack.credits}</span>
                  </div>
                  <CardDescription className="text-xs">{pack.subtitle}</CardDescription>
                </CardHeader>
                <CardContent className="flex-1 px-5 pb-5 space-y-4">
                  <ul className="space-y-2">
                    {pack.features.map((f) => (
                      <li key={f} className="flex items-center gap-2 text-xs text-foreground">
                        <CheckCircle size={14} weight="fill" className="text-emerald-500 shrink-0" />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <div className="pt-2">
                    <p className="text-sm font-semibold text-foreground mb-3">{pack.price}</p>
                    {isPurchased ? (
                      <div className="flex items-center gap-2 rounded-xl bg-emerald-50 dark:bg-emerald-950 px-4 py-2.5">
                        <CheckCircle size={16} weight="fill" className="text-emerald-500" />
                        <span className="text-sm font-medium text-emerald-700 dark:text-emerald-400">
                          Purchased
                        </span>
                      </div>
                    ) : (
                      <Button
                        className="w-full"
                        variant={pack.popular ? "default" : "outline"}
                        onClick={() => handleBuy(pack.id)}
                        disabled={purchased !== null && purchased !== pack.id}
                      >
                        Buy {pack.credits}
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
