"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { LiquidNavbar, NimbusIcons, LiquidNavItem } from "@/components/ui/liquid-glass-navbar";
import { Menu, X, ArrowRight } from "lucide-react";

export function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);

  // Synchronize dark theme state with document element class
  useEffect(() => {
    const checkDark = () => {
      setIsDark(document.documentElement.classList.contains("dark"));
    };
    checkDark();

    const observer = new MutationObserver(checkDark);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
    return () => observer.disconnect();
  }, []);

  // The 5 core interactive Liquid Glass Navbar items with bespoke Nimbus animation scenes
  const liquidNavItems: LiquidNavItem[] = [
    { label: "Home", href: "/", icon: NimbusIcons.home, fx: "glow" },
    { label: "Recommend", href: "/recommend", icon: NimbusIcons.globe, fx: "spin" },
    { label: "How It Works", href: "/how-it-works", icon: NimbusIcons.plane, fx: "plane" },
    { label: "Compare Prompts", href: "/compare", icon: NimbusIcons.drop, fx: "drop" },
    { label: "History", href: "/history", icon: NimbusIcons.user, fx: "wave" },
  ];

  // Full route list for mobile drawer navigation
  const mobileNavLinks = [
    { label: "Home", href: "/" },
    { label: "Recommend", href: "/recommend" },
    { label: "How It Works", href: "/how-it-works" },
    { label: "Compare Prompts", href: "/compare" },
    { label: "History", href: "/history" },
    { label: "About & Responsible AI", href: "/about" },
  ];

  const getActiveIndex = () => {
    if (pathname === "/") return 0;
    if (pathname.startsWith("/recommend")) return 1;
    if (pathname.startsWith("/how-it-works")) return 2;
    if (pathname.startsWith("/compare")) return 3;
    if (pathname.startsWith("/history")) return 4;
    return -1; // If on /about or another subpage, no active liquid tab
  };

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <header className="sticky top-0 z-50 liquid-glass border-b border-sherpa-teal/15 dark:border-sherpa-mist/10 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        {/* Brand: Sherpa */}
        <Link href="/" className="flex items-center gap-3 group shrink-0">
          <div className="relative">
            <img
              src="/sherpa-logo.png"
              alt="Sherpa Logo"
              className="w-10 h-10 rounded-xl object-contain shadow-xs group-hover:scale-105 transition-transform duration-200"
            />
            {/* Subtle summit marker pin */}
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-sherpa-amber animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-serif text-2xl font-black text-sherpa-ink dark:text-white tracking-tight">
                Sherpa
              </span>
            </div>
            <p className="text-[10px] uppercase font-bold tracking-widest text-sherpa-teal dark:text-sherpa-tealLight leading-none">
              Learning Guide
            </p>
          </div>
        </Link>

        {/* Center: The Liquid Glass Navbar (Desktop) */}
        <div className="hidden lg:flex items-center justify-center flex-1 px-4">
          <LiquidNavbar
            tone={isDark ? "dark" : "light"}
            active={getActiveIndex()}
            sound={false}
            items={liquidNavItems}
            className="shadow-sm"
          />
        </div>

        {/* Right Section: About Link + Theme Switcher + Primary CTA */}
        <div className="hidden sm:flex items-center gap-3 shrink-0">
          <Link
            href="/about"
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all duration-150 ${
              pathname.startsWith("/about")
                ? "bg-sherpa-deep text-white dark:bg-sherpa-teal shadow-xs"
                : "text-slate-600 dark:text-slate-300 hover:text-sherpa-deep dark:hover:text-white hover:bg-sherpa-mist/50 dark:hover:bg-white/5"
            }`}
          >
            About
          </Link>

          <ThemeSwitcher />

          <Link
            href="/recommend"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-sherpa-amber hover:bg-sherpa-amberDark text-sherpa-ink shadow-sm hover:shadow-glow-amber transition-all duration-200 active:scale-95"
          >
            <span>Get Recommendations</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Mobile Hamburger Button */}
        <div className="flex items-center gap-2 lg:hidden">
          <ThemeSwitcher />
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-sherpa-mist dark:hover:bg-sherpa-nightElevated transition-colors"
            aria-label="Toggle navigation menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Accessible Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-sherpa-teal/15 dark:border-sherpa-mist/10 bg-white/95 dark:bg-sherpa-night/95 backdrop-blur-md p-4 space-y-2 shadow-xl animate-in slide-in-from-top-2">
          {mobileNavLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className={`block px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                isActive(link.href)
                  ? "bg-sherpa-deep text-white dark:bg-sherpa-teal"
                  : "text-slate-700 dark:text-slate-200 hover:bg-sherpa-mist/50 dark:hover:bg-sherpa-nightElevated"
              }`}
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-2">
            <Link
              href="/recommend"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-bold bg-sherpa-amber text-sherpa-ink shadow-sm"
            >
              <span>Get Recommendations</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}

export default Navbar;
