"use client"

import React, { useEffect, useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { LiquidNavbar, NimbusIcons, LiquidNavItem } from "@/components/ui/liquid-glass-navbar"
import { ThemeSwitcher } from "@/components/theme-switcher"

export function HeaderNavigation() {
  const pathname = usePathname()
  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    const checkDark = () => {
      setIsDark(document.documentElement.classList.contains("dark"))
    }
    checkDark()

    const observer = new MutationObserver(checkDark)
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    })
    return () => observer.disconnect()
  }, [])

  const navItems: LiquidNavItem[] = [
    { label: "Recommender", href: "/", icon: NimbusIcons.home, fx: "glow" },
    { label: "Compare Prompts", href: "/compare", icon: NimbusIcons.globe, fx: "spin" },
    { label: "History", href: "/#history-section", icon: NimbusIcons.plane, fx: "plane" },
    { label: "Test Suite", href: "/#tests-modal", icon: NimbusIcons.drop, fx: "drop" },
  ]

  const getActiveIndex = () => {
    if (pathname === "/compare") return 1
    return 0
  }

  return (
    <header className="sticky top-0 z-50 liquid-glass border-b border-white/30 dark:border-white/10 shadow-sm transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        {/* Brand: Sherpa */}
        <Link href="/" className="flex items-center gap-3 group shrink-0">
          <img
            src="/sherpa-logo.png"
            alt="Sherpa Logo"
            className="w-10 h-10 rounded-xl object-contain shadow-xs group-hover:scale-105 transition-transform"
          />
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-slate-900 dark:text-white text-xl tracking-tight transition-colors">
              Sherpa
            </span>
          </div>
        </Link>

        {/* Right Section: Liquid Glass Navbar + Theme Switcher */}
        <div className="flex items-center justify-end gap-3 sm:gap-4">
          <LiquidNavbar
            tone={isDark ? "dark" : "light"}
            active={getActiveIndex()}
            sound={false}
            items={navItems}
            className="shadow-sm"
          />

          {/* Minimalist 3-State Theme Switcher */}
          <ThemeSwitcher />
        </div>
      </div>
    </header>
  )
}

export default HeaderNavigation

