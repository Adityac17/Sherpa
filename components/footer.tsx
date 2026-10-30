import * as React from "react";
import Link from "next/link";
import { Mountain, ShieldCheck, ExternalLink } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-sherpa-teal/15 dark:border-sherpa-mist/10 bg-white dark:bg-sherpa-night transition-colors mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 space-y-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand & Mission */}
          <div className="md:col-span-2 space-y-3">
            <Link href="/" className="flex items-center gap-2.5">
              <img src="/sherpa-logo.png" alt="Sherpa" className="w-8 h-8 rounded-lg object-contain" />
              <span className="font-serif text-2xl font-bold text-sherpa-ink dark:text-white">
                Sherpa
              </span>
            </Link>
            <p className="font-serif italic text-base text-sherpa-teal dark:text-sherpa-amber">
              &ldquo;Tell us what you want to learn. We&apos;ll guide the way.&rdquo;
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm leading-relaxed">
              Curated, link-verified collegiate study roadmaps. We test every resource via live HTTP HEAD checks to guarantee zero dead links and eliminate generic placeholders.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-2 text-xs">
            <p className="font-bold uppercase tracking-wider text-sherpa-deep dark:text-sherpa-mist">
              Navigation
            </p>
            <ul className="space-y-1.5 text-slate-600 dark:text-slate-400">
              <li>
                <Link href="/" className="hover:text-sherpa-teal dark:hover:text-white transition">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/recommend" className="hover:text-sherpa-teal dark:hover:text-white transition">
                  Recommend Tool
                </Link>
              </li>
              <li>
                <Link href="/how-it-works" className="hover:text-sherpa-teal dark:hover:text-white transition">
                  How It Works
                </Link>
              </li>
              <li>
                <Link href="/compare" className="hover:text-sherpa-teal dark:hover:text-white transition">
                  Compare Prompts
                </Link>
              </li>
              <li>
                <Link href="/history" className="hover:text-sherpa-teal dark:hover:text-white transition">
                  Run History
                </Link>
              </li>
            </ul>
          </div>

          {/* Responsible AI & Integrity */}
          <div className="space-y-2 text-xs">
            <p className="font-bold uppercase tracking-wider text-sherpa-deep dark:text-sherpa-mist">
              Standards
            </p>
            <ul className="space-y-1.5 text-slate-600 dark:text-slate-400">
              <li>
                <Link href="/about" className="hover:text-sherpa-teal dark:hover:text-white transition">
                  About & Mission
                </Link>
              </li>
              <li>
                <Link href="/about#responsible-ai" className="hover:text-sherpa-teal dark:hover:text-white transition">
                  Responsible AI Policy
                </Link>
              </li>
              <li>
                <span className="text-slate-400 dark:text-slate-500">HTTP 200 Live Verification</span>
              </li>
              <li>
                <span className="text-slate-400 dark:text-slate-500">Firebase Firestore Backed</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Responsible AI Disclaimer & Bottom Row */}
        <div className="pt-8 border-t border-sherpa-teal/10 dark:border-sherpa-mist/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>
              <strong>Responsible AI Notice:</strong> Recommendations are AI-synthesized and validated against collegiate syllabi. Always consult your university course syllabus.
            </span>
          </div>

          <p className="shrink-0">
            © {new Date().getFullYear()} Sherpa · Built for College Students
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;

