"use client";

import React, { useEffect, useState } from "react";

export type Theme = "system" | "light" | "dark";

export function ThemeSwitcher({ className = "" }: { className?: string }) {
  const [theme, setTheme] = useState<Theme>("system");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem("sherpa_theme") as Theme | null;
    if (stored && ["system", "light", "dark"].includes(stored)) {
      setTheme(stored);
      applyTheme(stored);
    } else {
      applyTheme("system");
    }
  }, []);

  const applyTheme = (t: Theme) => {
    const root = document.documentElement;
    if (t === "dark") {
      root.classList.add("dark");
    } else if (t === "light") {
      root.classList.remove("dark");
    } else {
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      if (prefersDark) {
        root.classList.add("dark");
      } else {
        root.classList.remove("dark");
      }
    }
  };

  const handleSelect = (t: Theme) => {
    setTheme(t);
    localStorage.setItem("sherpa_theme", t);
    applyTheme(t);
  };

  useEffect(() => {
    if (!mounted) return;
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = () => {
      const stored = localStorage.getItem("sherpa_theme") as Theme | null;
      if (!stored || stored === "system") {
        applyTheme("system");
      }
    };
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [mounted]);

  // Pill positions: 0 = system, 1 = light, 2 = dark
  const activeIndex = theme === "system" ? 0 : theme === "light" ? 1 : 2;

  return (
    <div
      className={`relative inline-flex items-center bg-[#090d16] p-1 rounded-full border border-slate-700/70 shadow-lg select-none transition-colors ${className}`}
      role="group"
      aria-label="Theme Switcher"
    >
      {/* Sliding illuminated circular disc indicator */}
      <div
        className="absolute top-1 bottom-1 w-8 h-8 rounded-full pointer-events-none transition-transform duration-300 ease-out"
        style={{
          transform: `translateX(${activeIndex * 32}px)`,
          background: "radial-gradient(100% 100% at 30% 20%, #1f293d 0%, #0d121c 100%)",
          boxShadow: "inset 0 1.5px 1.5px rgba(255, 255, 255, 0.85), inset 0 -1px 2px rgba(0, 0, 0, 0.8), 0 0 0 1px rgba(255, 255, 255, 0.2), 0 4px 12px rgba(0, 0, 0, 0.7)",
          borderRadius: "9999px",
        }}
      />

      {/* 1. System / Desktop Monitor Icon */}
      <button
        type="button"
        onClick={() => handleSelect("system")}
        title="System Theme"
        aria-pressed={theme === "system"}
        className={`relative z-10 w-8 h-8 flex items-center justify-center rounded-full transition-colors ${
          theme === "system" ? "text-white" : "text-slate-400 hover:text-slate-200"
        }`}
      >
        <svg
          viewBox="0 0 24 24"
          width="16"
          height="16"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
          <line x1="8" y1="21" x2="16" y2="21" />
          <line x1="12" y1="17" x2="12" y2="21" />
        </svg>
      </button>

      {/* 2. Sun / Light Icon */}
      <button
        type="button"
        onClick={() => handleSelect("light")}
        title="Light Theme"
        aria-pressed={theme === "light"}
        className={`relative z-10 w-8 h-8 flex items-center justify-center rounded-full transition-colors ${
          theme === "light" ? "text-white" : "text-slate-400 hover:text-slate-200"
        }`}
      >
        <svg
          viewBox="0 0 24 24"
          width="16"
          height="16"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2" />
          <path d="M12 20v2" />
          <path d="m4.93 4.93 1.41 1.41" />
          <path d="m17.66 17.66 1.41 1.41" />
          <path d="M2 12h2" />
          <path d="M20 12h2" />
          <path d="m6.34 17.66-1.41 1.41" />
          <path d="m19.07 4.93-1.41 1.41" />
        </svg>
      </button>

      {/* 3. Crescent Moon with Sparkle Icon */}
      <button
        type="button"
        onClick={() => handleSelect("dark")}
        title="Dark Theme"
        aria-pressed={theme === "dark"}
        className={`relative z-10 w-8 h-8 flex items-center justify-center rounded-full transition-colors ${
          theme === "dark" ? "text-white" : "text-slate-400 hover:text-slate-200"
        }`}
      >
        <svg
          viewBox="0 0 24 24"
          width="16"
          height="16"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {/* Crescent Moon */}
          <path d="M12 3a9 9 0 1 0 9 9c0-.46-.04-.92-.1-1.36a5.389 5.389 0 0 1-4.4 2.26 5.403 5.403 0 0 1-3.14-9.8c-.44-.06-.9-.1-1.36-.1Z" />
          {/* Sparkle star in crook */}
          <path d="M19 3v4" />
          <path d="M17 5h4" />
        </svg>
      </button>
    </div>
  );
}

export default ThemeSwitcher;
