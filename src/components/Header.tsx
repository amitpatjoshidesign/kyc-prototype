"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Moon, Sun, SignOut } from "@phosphor-icons/react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

export default function Header({ showStatus = false }: { showStatus?: boolean }) {
  const router = useRouter();
  const [dark, setDark] = useState(false);
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
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

  return (
    <header className="sticky top-0 z-40 flex h-16 items-center justify-between px-4 md:px-6 bg-[hsl(30,3%,98%)] dark:bg-[hsl(20,6%,12.5%)]">
      {/* Logo */}
      <Link href="/" className="flex items-center gap-2">
        <svg width={28} height={28} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-foreground">
          <path fillRule="evenodd" clipRule="evenodd" d="M0 16C0 8.45753 0 4.68629 2.34315 2.34315C4.68629 0 8.45753 0 16 0C23.5425 0 27.3137 0 29.6569 2.34315C32 4.68629 32 8.45753 32 16C32 23.5425 32 27.3137 29.6569 29.6569C27.3137 32 23.5425 32 16 32C8.45753 32 4.68629 32 2.34315 29.6569C0 27.3137 0 23.5425 0 16ZM18.0223 14.8714C17.3694 14.6863 16.6923 14.589 15.9983 14.589C15.2785 14.589 14.5769 14.6937 13.9016 14.8924C10.8292 15.7963 8.29946 18.6452 7.06511 22.4288C6.8191 23.1829 6.6961 23.56 6.9275 23.8098C7.15891 24.0596 7.56431 23.9609 8.37511 23.7634L9.69397 23.4422C10.2182 23.3146 10.4802 23.2508 10.6618 23.0864C10.8434 22.9221 10.9411 22.6448 11.1364 22.0902C11.7931 20.2252 12.7594 18.6085 13.9016 17.8211C14.5517 17.373 15.2588 17.1272 15.9983 17.1272C16.7103 17.1272 17.3923 17.3551 18.0223 17.7721C19.1997 18.5514 20.1954 20.1971 20.8661 22.1072C21.0612 22.6629 21.1588 22.9407 21.3405 23.1053C21.5221 23.2699 21.7846 23.3338 22.3095 23.4616L23.6275 23.7826C24.4373 23.9798 24.8423 24.0784 25.0737 23.829C25.3051 23.5795 25.1827 23.2027 24.938 22.4491C23.6964 18.6256 21.1329 15.7531 18.0223 14.8714ZM15.9993 11.7891C18.7869 11.7891 21.1926 12.3891 22.7131 12.8889C23.5399 13.1607 23.9533 13.2966 24.193 13.1231C24.4327 12.9496 24.4327 12.5351 24.4327 11.706V11.255C24.4327 10.3091 24.4327 9.83619 24.1437 9.50784C23.8547 9.1795 23.3996 9.12124 22.4895 9.00471C18.1633 8.45082 13.8412 8.45212 9.515 9.00518C8.60432 9.1216 8.14898 9.17981 7.85992 9.50817C7.57086 9.83654 7.57086 10.3096 7.57086 11.2558V11.704C7.57086 12.5332 7.57086 12.9477 7.81053 13.1213C8.05019 13.2948 8.46371 13.1589 9.29073 12.8871C10.8099 12.3879 13.2129 11.7891 15.9993 11.7891Z" fill="currentColor"/>
        </svg>
        <span className="text-lg font-semibold text-foreground">
          Bridge
        </span>
      </Link>

      {/* Right side */}
      <div className="flex items-center gap-3">
        {showStatus && (
          <div className="hidden sm:flex items-center gap-1.5 rounded-lg border border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950 h-8 px-2.5">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500" />
            </span>
            <span className="text-xs font-medium text-green-600 dark:text-green-400">All systems live</span>
          </div>
        )}
        <button
          type="button"
          onClick={toggleTheme}
          className="relative flex h-8 w-[60px] items-center rounded-lg bg-stone-300/30 dark:bg-stone-500/50 p-0.5 transition-colors"
          aria-label="Toggle dark mode"
        >
          {/* Sliding thumb */}
          <span
            className={`absolute top-0.5 h-7 w-7 rounded-md bg-white dark:bg-stone-600 shadow-md ring-1 ring-black/10 dark:ring-white/10 transition-transform duration-300 ${
              dark ? "translate-x-0" : "translate-x-[28px]"
            }`}
          />
          {/* Moon icon (left) */}
          <span className="relative z-10 flex h-7 w-7 items-center justify-center">
            <Moon size={14} weight="bold" className={`transition-colors ${dark ? "text-white" : "text-stone-500 dark:text-stone-400"}`} />
          </span>
          {/* Sun icon (right) */}
          <span className="relative z-10 flex h-7 w-7 items-center justify-center">
            <Sun size={14} weight="bold" className={`transition-colors ${dark ? "text-stone-400" : "text-stone-700"}`} />
          </span>
        </button>
        {email && (
          <Popover>
            <PopoverTrigger asChild>
              <button
                type="button"
                className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-500 text-sm font-medium text-white cursor-pointer transition-opacity hover:opacity-80"
                aria-label="User menu"
              >
                {email[0].toUpperCase()}
              </button>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-56 p-2">
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
        )}
      </div>
    </header>
  );
}
