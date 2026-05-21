"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { BridgeLoginCard } from "@/components/BridgeLoginCard";
import { LoginGrainientBackground } from "@/components/LoginGrainientBackground";

export default function LoginPage() {
  const router = useRouter();

  useEffect(() => {
    const stored = localStorage.getItem("theme");

    if (stored === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#032428] p-4 sm:p-6">
      <LoginGrainientBackground />
      <div className="relative z-10 flex w-full justify-center">
        <BridgeLoginCard
          variant="center-card"
          onSuccess={() => router.push("/")}
        />
      </div>
    </main>
  );
}
