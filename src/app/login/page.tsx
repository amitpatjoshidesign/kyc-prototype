"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Moon, Sun } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

export default function LoginPage() {
  const router = useRouter();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("theme");
    if (
      stored === "dark" ||
      (!stored && window.matchMedia("(prefers-color-scheme: dark)").matches)
    ) {
      setDark(true);
      document.documentElement.classList.add("dark");
    }
  }, []);

  function toggleTheme() {
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
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    localStorage.setItem("bridge_auth", "true");
    router.push("/");
  }

  function handleSocialLogin() {
    localStorage.setItem("bridge_auth", "true");
    router.push("/");
  }

  return (
    <div className="relative min-h-screen bg-accent flex flex-col">
      {/* Header */}
      <header className="flex h-16 items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-2">
          <svg
            width={28}
            height={28}
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
          <span className="text-lg font-semibold text-foreground">
            Bridge <span className="text-sm font-normal text-muted-foreground">v4.0</span>
          </span>
        </div>
        <button
          type="button"
          onClick={toggleTheme}
          className="flex h-8 w-8 items-center justify-center rounded-md border border-input text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
          aria-label="Toggle dark mode"
        >
          {dark ? <Sun size={16} weight="bold" /> : <Moon size={16} weight="bold" />}
        </button>
      </header>

      {/* Login card */}
      <div className="flex flex-1 items-center justify-center px-4 pb-16">
        <div className="w-full max-w-[400px] rounded-xl border bg-card p-8 shadow-sm">
          <div className="mb-6 text-center">
            <h1 className="text-xl font-bold text-foreground">
              {isSignUp ? "Create your account" : "Welcome back"}
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {isSignUp
                ? "Sign up to get started with Bridge"
                : "Sign in to your Bridge account"}
            </p>
          </div>

          {/* Social buttons */}
          <div className="space-y-3">
            <button
              type="button"
              onClick={handleSocialLogin}
              className="flex h-10 w-full items-center justify-center gap-3 rounded-md border border-input bg-background text-sm font-medium text-foreground shadow-sm transition-colors hover:bg-accent"
            >
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 01-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
                <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.26c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z" fill="#34A853"/>
                <path d="M3.964 10.71A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
                <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
              </svg>
              Continue with Google
            </button>

            <button
              type="button"
              onClick={handleSocialLogin}
              className="flex h-10 w-full items-center justify-center gap-3 rounded-md border border-input bg-background text-sm font-medium text-foreground shadow-sm transition-colors hover:bg-accent"
            >
              <svg width="18" height="18" viewBox="0 0 21 21" fill="none">
                <rect x="1" y="1" width="9" height="9" fill="#F25022"/>
                <rect x="11" y="1" width="9" height="9" fill="#7FBA00"/>
                <rect x="1" y="11" width="9" height="9" fill="#00A4EF"/>
                <rect x="11" y="11" width="9" height="9" fill="#FFB900"/>
              </svg>
              Continue with Microsoft
            </button>
          </div>

          {/* Divider */}
          <div className="relative my-6">
            <Separator />
            <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-card px-3 text-xs text-muted-foreground">
              or
            </span>
          </div>

          {/* Email form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {isSignUp && (
              <div>
                <label className="mb-1.5 block text-sm font-medium text-foreground">
                  Full name
                </label>
                <Input
                  type="text"
                  placeholder="Rahul Sharma"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
            )}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">
                Email
              </label>
              <Input
                type="email"
                placeholder="rahul@example.com"
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
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <Button type="submit" className="w-full">
              {isSignUp ? "Create account" : "Sign in"}
            </Button>
          </form>

          {/* Toggle */}
          <p className="mt-6 text-center text-sm text-muted-foreground">
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
