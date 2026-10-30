"use client";

import React, { useState } from "react";
import Link from "next/link";
import { MountainRidgeline } from "@/components/ui/mountain-ridgeline";
import { Button } from "@/components/ui/button";
import { ResultCard } from "@/components/ui/result-card";
import { StatBlock } from "@/components/ui/stat-block";
import { LinkBadge, TypeBadge } from "@/components/ui/badge";
import {
  Compass,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  Layers,
  GraduationCap,
  ExternalLink,
  ChevronRight,
  BookOpen,
  Code2,
  Cpu,
  Database,
} from "lucide-react";
import { ResourceItem } from "@/lib/types";

// Static demo data for instant load in sample results preview
const SAMPLE_ROADMAPS: Record<string, { topic: string; level: string; score: number; resources: ResourceItem[] }> = {
  os: {
    topic: "Operating Systems: Virtual Memory & Paging",
    level: "Intermediate",
    score: 96,
    resources: [
      {
        rank: 1,
        title: "Operating Systems: Three Easy Pieces (OSTEP) - Paging & Virtual Memory",
        type: "docs",
        url: "https://pages.cs.wisc.edu/~remzi/OSTEP/vm-paging.pdf",
        why_it_fits: "Authoritative chapters on TLBs, multi-level page tables, and page replacement policies needed for university exams.",
        difficulty: "Intermediate",
        estimated_time: "6 hours",
        relevance_score: 10,
        link_status: "verified_200",
      },
      {
        rank: 2,
        title: "Stanford CS110: Principles of Computer Systems",
        type: "course",
        url: "https://web.stanford.edu/class/cs110/",
        why_it_fits: "Multiprocessing, pipe IPC, non-blocking I/O multiplexing (epoll), and socket programming in C/C++.",
        difficulty: "Intermediate",
        estimated_time: "30 hours",
        relevance_score: 9,
        link_status: "verified_200",
      },
      {
        rank: 3,
        title: "xv6 Page Table Lab: Copy-on-Write (MIT 6.828)",
        type: "practice",
        url: "https://pdos.csail.mit.edu/6.828/2021/labs/cow.html",
        why_it_fits: "Build a working copy-on-write page fault handler in C with RISC-V PTE supervisor permissions.",
        difficulty: "Intermediate",
        estimated_time: "12 hours",
        relevance_score: 9,
        link_status: "verified_200",
      },
    ],
  },
  dist: {
    topic: "Distributed Consensus: Raft & Paxos",
    level: "Advanced",
    score: 94,
    resources: [
      {
        rank: 1,
        title: "MIT 6.824: Distributed Systems (Prof. Robert Morris)",
        type: "course",
        url: "https://pdos.csail.mit.edu/6.824/",
        why_it_fits: "Gold-standard university course with labs building Raft consensus and replicated key-value stores in Go.",
        difficulty: "Advanced",
        estimated_time: "45 hours",
        relevance_score: 10,
        link_status: "verified_200",
      },
      {
        rank: 2,
        title: "In Search of an Understandable Consensus Algorithm (Diego Ongaro)",
        type: "article",
        url: "https://raft.github.io/raft.pdf",
        why_it_fits: "Original Stanford paper introducing the Raft algorithm; required reading for systems engineers.",
        difficulty: "Advanced",
        estimated_time: "5 hours",
        relevance_score: 10,
        link_status: "verified_200",
      },
      {
        rank: 3,
        title: "The Raft Interactive Visualization Simulator",
        type: "practice",
        url: "https://raft.github.io/",
        why_it_fits: "Visually step through leader election, term counters, log replication, and split-brain recovery.",
        difficulty: "Advanced",
        estimated_time: "2 hours",
        relevance_score: 9,
        link_status: "verified_200",
      },
    ],
  },
  dsa: {
    topic: "Data Structures & Algorithms: NeetCode 150 Patterns",
    level: "Beginner",
    score: 95,
    resources: [
      {
        rank: 1,
        title: "NeetCode 150: Core Coding Interview Patterns",
        type: "practice",
        url: "https://neetcode.io/practice",
        why_it_fits: "Categorized algorithmic practice covering two pointers, sliding window, trees, and graphs.",
        difficulty: "Beginner",
        estimated_time: "60 hours",
        relevance_score: 10,
        link_status: "verified_200",
      },
      {
        rank: 2,
        title: "Introduction to Algorithms (CLRS 4th Edition)",
        type: "book",
        url: null,
        why_it_fits: "The definitive MIT Press reference for asymptotic runtime analysis, master theorem, and graph proofs.",
        difficulty: "Beginner",
        estimated_time: "50 hours",
        relevance_score: 9,
        link_status: "null_or_unverified",
        fallback_search_url: "https://www.google.com/search?q=CLRS+Introduction+to+Algorithms+4th+edition",
      },
      {
        rank: 3,
        title: "Harvard CS50x: Introduction to Computer Science",
        type: "course",
        url: "https://cs50.harvard.edu/x/",
        why_it_fits: "Engaging university foundation on memory pointers, linked lists, hash tables, and algorithm efficiency.",
        difficulty: "Beginner",
        estimated_time: "40 hours",
        relevance_score: 9,
        link_status: "verified_200",
      },
    ],
  },
};

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<"os" | "dist" | "dsa">("os");

  // Hero interactive mini-demo state
  const [demoTopic, setDemoTopic] = useState("Operating Systems Paging");
  const [demoLevel, setDemoLevel] = useState("Intermediate");

  return (
    <div className="space-y-24 sm:space-y-32">
      {/* ========================================================
          HERO SECTION (The Standout)
          ======================================================== */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-32 bg-gradient-to-b from-sherpa-mist/60 via-sherpa-mist/20 to-transparent dark:from-sherpa-nightElevated/30 dark:via-sherpa-night/50 dark:to-transparent border-b border-sherpa-teal/10 dark:border-sherpa-mist/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            
            {/* Left Column: Headline, Value Prop & CTAs */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              {/* Trust Badge / Milestone */}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold bg-white dark:bg-sherpa-nightSurface border border-sherpa-teal/20 dark:border-sherpa-mist/10 shadow-2xs">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-sherpa-deep dark:text-sherpa-mist">
                  HTTP 200 Link-Verified Curriculum Engine
                </span>
              </div>

              {/* Serif Headline */}
              <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-extrabold text-sherpa-ink dark:text-white tracking-tight leading-[1.08]">
                Tell us what you want to learn.{" "}
                <span className="text-sherpa-teal dark:text-sherpa-amber">
                  We&apos;ll guide the way.
                </span>
              </h1>

              {/* Supporting sentence */}
              <p className="text-base sm:text-xl text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed">
                Sherpa builds structured, college-caliber study roadmaps with{" "}
                <strong className="text-sherpa-ink dark:text-white font-semibold">
                  zero dead links
                </strong>
                . Every resource is live-verified against university course standards.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                <Button
                  href="/recommend"
                  variant="amber"
                  size="lg"
                  icon={<Compass className="w-5 h-5 text-sherpa-ink" />}
                  className="w-full sm:w-auto shadow-md"
                >
                  Find My Path
                </Button>

                <Button
                  href="/how-it-works"
                  variant="outline"
                  size="lg"
                  icon={<ArrowRight className="w-4 h-4" />}
                  className="w-full sm:w-auto"
                >
                  See How It Works
                </Button>
              </div>

              {/* Trust Chips */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 pt-4 text-xs font-medium text-slate-500 dark:text-slate-400">
                <span className="inline-flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  Verified live links
                </span>
                <span>•</span>
                <span className="inline-flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  Ranked for your level
                </span>
                <span>•</span>
                <span className="inline-flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  100% Free for students
                </span>
              </div>
            </div>

            {/* Right Column: Interactive Mountain Ridge & Floating Cards Visual */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md w-full">
                {/* Glow Backdrop */}
                <div className="absolute -inset-4 bg-gradient-to-r from-sherpa-teal/20 via-sherpa-amber/15 to-sherpa-deep/20 rounded-3xl blur-2xl -z-10" />

                {/* Main Interactive Showcase Card */}
                <div className="bg-white/95 dark:bg-sherpa-nightSurface/95 backdrop-blur-md rounded-3xl p-6 border border-sherpa-teal/20 dark:border-sherpa-mist/15 shadow-xl space-y-5">
                  
                  {/* Interactive Mini-Input Demo */}
                  <div>
                    <div className="flex items-center justify-between text-xs font-bold text-sherpa-deep dark:text-sherpa-mist mb-2">
                      <span>Try Quick Subject Pill:</span>
                      <span className="text-[11px] text-sherpa-teal dark:text-sherpa-amber">Live Preview</span>
                    </div>

                    <div className="flex flex-wrap gap-1.5">
                      {[
                        { topic: "Operating Systems Paging", level: "Intermediate" },
                        { topic: "Distributed Consensus Raft", level: "Advanced" },
                        { topic: "Python CS101 Fundamentals", level: "Beginner" },
                      ].map((item) => (
                        <button
                          key={item.topic}
                          type="button"
                          onClick={() => {
                            setDemoTopic(item.topic);
                            setDemoLevel(item.level);
                          }}
                          className={`px-2.5 py-1 text-xs rounded-lg font-medium transition-all ${
                            demoTopic === item.topic
                              ? "bg-sherpa-deep text-white dark:bg-sherpa-teal shadow-xs scale-105"
                              : "bg-slate-100 dark:bg-sherpa-nightElevated text-slate-700 dark:text-slate-300 hover:bg-slate-200"
                          }`}
                        >
                          {item.topic.split(" ")[0]}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Stylized Mountain Ridge Graphic */}
                  <div className="relative rounded-2xl overflow-hidden bg-gradient-to-b from-sherpa-deep/90 via-sherpa-deep to-sherpa-ink p-4 text-white">
                    <div className="relative z-10 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] uppercase font-mono tracking-widest text-sherpa-amber">
                          Summit Route · {demoLevel}
                        </span>
                        <span className="text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                          ✓ 200 OK
                        </span>
                      </div>
                      <p className="font-serif text-base font-bold leading-tight">{demoTopic}</p>
                    </div>

                    {/* SVG Ridgeline inside demo card */}
                    <MountainRidgeline className="mt-3 -mb-3" />
                  </div>

                  {/* 3 Floating Recommended Resources Preview */}
                  <div className="space-y-2.5 pt-1">
                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-sherpa-nightElevated/60 border border-slate-200/60 dark:border-white/5 flex items-center justify-between gap-3 transform hover:-translate-y-0.5 transition-transform duration-200">
                      <div className="flex items-center gap-2.5">
                        <span className="w-6 h-6 rounded-lg bg-sherpa-deep text-white font-bold flex items-center justify-center text-[10px] shrink-0">
                          #1
                        </span>
                        <div>
                          <p className="text-xs font-bold text-slate-900 dark:text-white leading-tight">
                            Authoritative Course Notes
                          </p>
                          <p className="text-[10px] text-slate-500 dark:text-slate-400">
                            MIT / Stanford Accredited Material
                          </p>
                        </div>
                      </div>
                      <TypeBadge type="docs" />
                    </div>

                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-sherpa-nightElevated/60 border border-slate-200/60 dark:border-white/5 flex items-center justify-between gap-3 transform hover:-translate-y-0.5 transition-transform duration-200">
                      <div className="flex items-center gap-2.5">
                        <span className="w-6 h-6 rounded-lg bg-sherpa-deep text-white font-bold flex items-center justify-center text-[10px] shrink-0">
                          #2
                        </span>
                        <div>
                          <p className="text-xs font-bold text-slate-900 dark:text-white leading-tight">
                            Interactive Lab Implementation
                          </p>
                          <p className="text-[10px] text-slate-500 dark:text-slate-400">
                            Hands-on practice & simulator
                          </p>
                        </div>
                      </div>
                      <TypeBadge type="practice" />
                    </div>

                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-sherpa-nightElevated/60 border border-slate-200/60 dark:border-white/5 flex items-center justify-between gap-3 transform hover:-translate-y-0.5 transition-transform duration-200">
                      <div className="flex items-center gap-2.5">
                        <span className="w-6 h-6 rounded-lg bg-sherpa-deep text-white font-bold flex items-center justify-center text-[10px] shrink-0">
                          #3
                        </span>
                        <div>
                          <p className="text-xs font-bold text-slate-900 dark:text-white leading-tight">
                            Definitive Textbook Chapters
                          </p>
                          <p className="text-[10px] text-slate-500 dark:text-slate-400">
                            Verified citations & problem sets
                          </p>
                        </div>
                      </div>
                      <TypeBadge type="book" />
                    </div>
                  </div>

                  {/* Card Footer Link */}
                  <div className="pt-1 text-center">
                    <Link
                      href="/recommend"
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-sherpa-teal dark:text-sherpa-amber hover:underline"
                    >
                      <span>Generate full study guide</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ========================================================
          FEATURED VALUE STATS
          ======================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatBlock
            value="100%"
            label="Live Link Verification"
            sublabel="Zero 404 dead links via HTTP HEAD checks"
            icon={<CheckCircle2 className="w-6 h-6" />}
          />
          <StatBlock
            value="5"
            label="Pipeline Stages"
            sublabel="Transparent end-to-end audit trail"
            icon={<Layers className="w-6 h-6" />}
          />
          <StatBlock
            value="3"
            label="Calibrated Prompts"
            sublabel="v1, v2 & v3 production guardrails"
            icon={<Sparkles className="w-6 h-6" />}
          />
          <StatBlock
            value="Free"
            label="Student First"
            sublabel="Open access curriculum intelligence"
            icon={<GraduationCap className="w-6 h-6" />}
          />
        </div>
      </section>

      {/* ========================================================
          HOW IT WORKS (Visual 3-Step Overview)
          ======================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <p className="text-xs font-bold uppercase tracking-widest text-sherpa-teal dark:text-sherpa-amber">
            The Climbing Strategy
          </p>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-sherpa-ink dark:text-white">
            How Sherpa guides your ascent
          </h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300">
            A reliable 3-step ascent that replaces superficial YouTube searching with validated collegiate authority.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Step 1 */}
          <div className="bg-white dark:bg-sherpa-nightSurface rounded-2xl p-6 border border-sherpa-teal/15 dark:border-sherpa-mist/10 shadow-xs relative">
            <div className="w-10 h-10 rounded-xl bg-sherpa-mist dark:bg-sherpa-nightElevated text-sherpa-deep dark:text-sherpa-mist font-bold flex items-center justify-center text-base mb-4">
              01
            </div>
            <h3 className="font-serif text-lg font-bold text-sherpa-ink dark:text-white mb-2">
              Set Your Coordinates
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Enter your course subject, proficiency level (Beginner, Intermediate, Advanced), and your target objective (pass final exam, build portfolio project, prep for interview).
            </p>
          </div>

          {/* Step 2 */}
          <div className="bg-white dark:bg-sherpa-nightSurface rounded-2xl p-6 border border-sherpa-teal/15 dark:border-sherpa-mist/10 shadow-xs relative">
            <div className="w-10 h-10 rounded-xl bg-sherpa-mist dark:bg-sherpa-nightElevated text-sherpa-deep dark:text-sherpa-mist font-bold flex items-center justify-center text-base mb-4">
              02
            </div>
            <h3 className="font-serif text-lg font-bold text-sherpa-ink dark:text-white mb-2">
              AI Synthesis & HTTP Checks
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Sherpa queries Gemini with production few-shot guardrails, then sends asynchronous HTTP HEAD requests to test every link live before you see it.
            </p>
          </div>

          {/* Step 3 */}
          <div className="bg-white dark:bg-sherpa-nightSurface rounded-2xl p-6 border border-sherpa-teal/15 dark:border-sherpa-mist/10 shadow-xs relative">
            <div className="w-10 h-10 rounded-xl bg-sherpa-mist dark:bg-sherpa-nightElevated text-sherpa-deep dark:text-sherpa-mist font-bold flex items-center justify-center text-base mb-4">
              03
            </div>
            <h3 className="font-serif text-lg font-bold text-sherpa-ink dark:text-white mb-2">
              Conquer the Material
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Receive a ranked, verified curriculum with time estimates, difficulty tags, and pedagogical explanations. Save to database or dispatch to your student email.
            </p>
          </div>
        </div>

        <div className="text-center pt-2">
          <Link
            href="/how-it-works"
            className="inline-flex items-center gap-2 text-sm font-bold text-sherpa-teal dark:text-sherpa-amber hover:underline"
          >
            <span>Explore the complete 5-stage pipeline and prompt architecture</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* ========================================================
          SAMPLE RESULTS PREVIEW (Instant Static Load)
          ======================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-sherpa-teal dark:text-sherpa-amber">
              Curriculum Showcase
            </p>
            <h2 className="font-serif text-3xl font-bold text-sherpa-ink dark:text-white mt-1">
              Sample Verified Roadmaps
            </h2>
          </div>

          {/* Preset Category Switcher */}
          <div className="flex p-1 rounded-xl bg-sherpa-mist/60 dark:bg-sherpa-nightElevated border border-sherpa-teal/15 text-xs font-semibold">
            <button
              onClick={() => setActiveTab("os")}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeTab === "os"
                  ? "bg-sherpa-deep text-white dark:bg-sherpa-teal shadow-2xs"
                  : "text-slate-600 dark:text-slate-300 hover:text-sherpa-deep"
              }`}
            >
              Operating Systems
            </button>
            <button
              onClick={() => setActiveTab("dist")}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeTab === "dist"
                  ? "bg-sherpa-deep text-white dark:bg-sherpa-teal shadow-2xs"
                  : "text-slate-600 dark:text-slate-300 hover:text-sherpa-deep"
              }`}
            >
              Distributed Systems
            </button>
            <button
              onClick={() => setActiveTab("dsa")}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeTab === "dsa"
                  ? "bg-sherpa-deep text-white dark:bg-sherpa-teal shadow-2xs"
                  : "text-slate-600 dark:text-slate-300 hover:text-sherpa-deep"
              }`}
            >
              Data Structures
            </button>
          </div>
        </div>

        {/* Current Sample Output Cards */}
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs font-bold p-3 rounded-xl bg-sherpa-mist/30 dark:bg-sherpa-nightElevated/30 border border-sherpa-teal/10">
            <div className="flex items-center gap-2">
              <span className="text-sherpa-deep dark:text-sherpa-mist">{SAMPLE_ROADMAPS[activeTab].topic}</span>
              <span className="text-slate-400">•</span>
              <span className="text-slate-600 dark:text-slate-400">Level: {SAMPLE_ROADMAPS[activeTab].level}</span>
            </div>
            <span className="text-emerald-700 dark:text-emerald-400 font-bold">
              Quality Score: {SAMPLE_ROADMAPS[activeTab].score}/100
            </span>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {SAMPLE_ROADMAPS[activeTab].resources.map((res) => (
              <ResultCard key={res.rank} resource={res} />
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================
          TRUST & RESPONSIBLE AI SECTION
          ======================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-sherpa-deep to-sherpa-ink rounded-3xl p-8 sm:p-12 text-white relative overflow-hidden shadow-xl">
          {/* Subtle Mountain Accent in Background */}
          <MountainRidgeline className="absolute inset-x-0 bottom-0 opacity-20" />

          <div className="relative z-10 max-w-2xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-sherpa-amber text-xs font-bold">
              <ShieldCheck className="w-4 h-4" />
              <span>Academic Integrity Guaranteed</span>
            </div>

            <h2 className="font-serif text-3xl sm:text-4xl font-bold leading-tight">
              We never invent links. We never compromise on quality.
            </h2>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              Small language models frequently hallucinate dead 404 links or generic blog placeholders. Sherpa eliminates this via two strict invariants:
            </p>

            <ul className="space-y-2 text-xs sm:text-sm text-slate-200 pt-2">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                <span>
                  <strong>Strict Uncertainty Rule:</strong> If Gemini is not certain a resource exists, it returns <code className="bg-white/15 px-1 py-0.5 rounded text-[11px] font-mono">url: null</code> instead of confabulating a link.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                <span>
                  <strong>Live HTTP HEAD Verification:</strong> Every URL is tested asynchronously before the response is returned. Non-200 links are flagged or paired with safe search fallbacks.
                </span>
              </li>
            </ul>

            <div className="pt-4">
              <Link
                href="/about#responsible-ai"
                className="inline-flex items-center gap-2 text-xs font-bold text-sherpa-amber hover:underline"
              >
                <span>Read our complete Responsible AI framework</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          FINAL CALL TO ACTION
          ======================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-12 space-y-6">
        <h2 className="font-serif text-3xl sm:text-5xl font-bold text-sherpa-ink dark:text-white">
          Ready to reach the summit?
        </h2>
        <p className="text-base text-slate-600 dark:text-slate-300 max-w-xl mx-auto">
          Start your personalized roadmap in 30 seconds. No registration required.
        </p>
        <div>
          <Button
            href="/recommend"
            variant="amber"
            size="lg"
            icon={<Compass className="w-5 h-5 text-sherpa-ink" />}
            className="shadow-lg hover:shadow-glow-amber"
          >
            Start Your Climb Now
          </Button>
        </div>
      </section>
    </div>
  );
}
