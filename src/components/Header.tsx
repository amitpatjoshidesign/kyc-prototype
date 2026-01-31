"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "@phosphor-icons/react";

export default function Header() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("theme");
    if (stored === "dark" || (!stored && window.matchMedia("(prefers-color-scheme: dark)").matches)) {
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

  return (
    <header className="flex h-16 items-center justify-between px-6">
      {/* Logo */}
      <div className="flex items-center gap-2">
        <img src="/setulogo.svg" alt="Setu" width={28} height={28} />
        <span className="text-lg font-semibold text-foreground">
          Bridge <span className="text-sm font-normal text-muted-foreground">v4.0</span>
        </span>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={toggleTheme}
          className="flex h-8 w-8 items-center justify-center rounded-md border border-input text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
          aria-label="Toggle dark mode"
        >
          {dark ? <Sun size={16} weight="bold" /> : <Moon size={16} weight="bold" />}
        </button>
        <span className="text-sm text-muted-foreground">rahul@example.com</span>
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary text-sm font-medium text-secondary-foreground">
          R
        </div>
      </div>
    </header>
  );
}
