import React from "react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MountainRidgeline } from "@/components/ui/mountain-ridgeline";
import {
  Compass,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  Cpu,
  Layers,
  Database,
  Mail,
  Flame,
  ArrowRight,
  BookOpen,
  Award,
  Users,
} from "lucide-react";

export const metadata = {
  title: "About Sherpa | Mission, Responsible AI & Architecture",
  description: "Learn about Sherpa's mission to eliminate dead links and hallucinations from college learning resources through rigorous link-verification and prompt engineering.",
};

export default function AboutPage() {
  const techStack = [
    {
      category: "Frontend & Framework",
      items: [
        { name: "Next.js 14", desc: "React framework with App Router, server and client components" },
        { name: "TypeScript", desc: "Strict type safety across curriculum models and pipeline states" },
        { name: "Tailwind CSS", desc: "Custom Sherpa palette (Deep Teal, Mist, Amber, Night)" },
        { name: "next/font", desc: "Fraunces serif headings & Inter sans body" },
      ],
    },
    {
      category: "AI & Synthesis Engine",
      items: [
        { name: "Google Gemini 1.5", desc: "High-reasoning prompt v3 with JSON schema formatting" },
        { name: "FreeLLMAPI 7B", desc: "Failover conversational engine for zero-downtime student requests" },
        { name: "Prompt v3 Architecture", desc: "Few-shot grounded prompts with strict anti-hallucination rules" },
        { name: "Academic Grounding Registry", desc: "Curated collegiate database for top university syllabi" },
      ],
    },
    {
      category: "Verification & Infrastructure",
      items: [
        { name: "HTTP HEAD Verifier", desc: "Concurrent link validation with 4-second timeout defense" },
        { name: "Firebase Firestore", desc: "Persistent audit log of all recommendation runs" },
        { name: "Local JSON Fallback", desc: "Graceful degradation when cloud credentials are unconfigured" },
        { name: "Resend / n8n Automation", desc: "Automated student roadmap dispatch & execution proof logging" },
      ],
    },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16">
      {/* Hero Header */}
      <div className="relative rounded-3xl p-8 sm:p-12 overflow-hidden bg-gradient-to-br from-sherpa-deep via-sherpa-teal to-sherpa-deep text-white shadow-xl">
        <div className="relative z-10 max-w-2xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-white/10 backdrop-blur-xs text-sherpa-amber border border-white/10">
            <Compass className="w-3.5 h-3.5" />
            <span>Our Origin & Purpose</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight">
            A calm, expert guide that gets you up the climb.
          </h1>

          <p className="font-serif italic text-lg sm:text-xl text-sherpa-mist/90">
            &ldquo;Tell us what you want to learn. We&apos;ll guide the way.&rdquo;
          </p>

          <p className="text-sm sm:text-base text-sherpa-mist/80 leading-relaxed pt-2">
            Sherpa was built to bridge the gap between massive, unstructured internet tutorials and the rigorous depth needed for university course exams and engineering interviews.
          </p>
        </div>

        {/* Decorative Mountain Ridgeline */}
        <div className="absolute right-0 bottom-0 w-80 sm:w-96 opacity-25 pointer-events-none">
          <MountainRidgeline />
        </div>
      </div>

      {/* The Problem & The Solution */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card variant="flat" className="p-8 space-y-4 border-red-200 dark:border-red-900/30">
          <div className="w-10 h-10 rounded-xl bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-400 flex items-center justify-center font-bold">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <h2 className="font-serif text-2xl font-bold text-sherpa-ink dark:text-white">
            The Problem College Students Face
          </h2>
          <ul className="space-y-3 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            <li className="flex items-start gap-2">
              <span className="text-red-500 font-bold shrink-0">✕</span>
              <span><strong>Search Engine Overload:</strong> Top results are optimized for SEO and affiliate revenue, not collegiate pedagogical value.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-red-500 font-bold shrink-0">✕</span>
              <span><strong>Chatbot Hallucinations:</strong> Standard LLMs confidently invent realistic-looking URLs (e.g. <code className="text-xs bg-slate-200 dark:bg-slate-700 px-1 py-0.5 rounded">mit.edu/6.824/notes.pdf</code>) that lead to frustrating 404 pages.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-red-500 font-bold shrink-0">✕</span>
              <span><strong>Level Mismatch:</strong> An intermediate student preparing for an OS exam gets treated to either toddler-level "What is a computer?" blogs or incomprehensible academic papers.</span>
            </li>
          </ul>
        </Card>

        <Card variant="elevated" className="p-8 space-y-4 border-sherpa-teal/20 dark:border-sherpa-teal/40">
          <div className="w-10 h-10 rounded-xl bg-sherpa-mist dark:bg-sherpa-nightElevated text-sherpa-teal dark:text-sherpa-amber flex items-center justify-center font-bold">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <h2 className="font-serif text-2xl font-bold text-sherpa-ink dark:text-white">
            The Sherpa Solution
          </h2>
          <ul className="space-y-3 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            <li className="flex items-start gap-2">
              <span className="text-emerald-500 font-bold shrink-0">✓</span>
              <span><strong>Zero Dead Links Guaranteed:</strong> An automated HTTP HEAD verification step tests every single link in milliseconds before surfacing it to the user.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-500 font-bold shrink-0">✓</span>
              <span><strong>Anti-Hallucination Fallback:</strong> If our AI is less than 100% confident in an exact canonical URL, it withholds the direct link and provides a targeted search fallback instead.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-500 font-bold shrink-0">✓</span>
              <span><strong>Collegiate Syllabi Grounding:</strong> Structured resources (Docs, Interactive Courses, Deep-Dive Videos, Practice Repositories) ranked directly for exam readiness.</span>
            </li>
          </ul>
        </Card>
      </section>

      {/* Responsible AI Framework Section */}
      <section id="responsible-ai" className="space-y-6 pt-4">
        <div className="border-b border-sherpa-teal/15 dark:border-sherpa-mist/10 pb-4">
          <div className="inline-flex items-center gap-2 text-xs font-bold text-sherpa-teal dark:text-sherpa-amber uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4" />
            <span>Academic Integrity Standard</span>
          </div>
          <h2 className="font-serif text-3xl font-bold text-sherpa-ink dark:text-white mt-1">
            Our Responsible AI Principles
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 max-w-2xl mt-1">
            How Sherpa ensures responsible, safe, and academically grounded recommendations for students and professors.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card variant="flat" className="p-6 space-y-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold text-sm">
              1
            </div>
            <h3 className="font-bold text-sherpa-ink dark:text-white text-base">
              Factuality Over Fluency
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              We penalize hallucinated fluency. In Prompt v3, the AI is explicitly instructed that returning fewer, strictly real resources with verified URLs is infinitely preferable to inventing plausible-looking resources.
            </p>
          </Card>

          <Card variant="flat" className="p-6 space-y-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-100 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-sm">
              2
            </div>
            <h3 className="font-bold text-sherpa-ink dark:text-white text-base">
              Transparent Quality Scoring
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Every roadmap is audited across 5 criteria (Relevance, Match to Level, Match to Goal, Link Validity, Clarity) on a 100-point scale. We make the score transparent so students know how trustworthy a path is.
            </p>
          </Card>

          <Card variant="flat" className="p-6 space-y-3">
            <div className="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-950/60 text-sherpa-amberDark dark:text-sherpa-amber flex items-center justify-center font-bold text-sm">
              3
            </div>
            <h3 className="font-bold text-sherpa-ink dark:text-white text-base">
              Course Syllabus Primacy
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              AI roadmaps are a study aid, not an authoritative replacement for your university professor or prescribed textbook. We urge students to cross-reference recommendations with their course grading guidelines.
            </p>
          </Card>
        </div>
      </section>

      {/* Tech Stack */}
      <section className="space-y-6 pt-4">
        <div className="border-b border-sherpa-teal/15 dark:border-sherpa-mist/10 pb-4">
          <div className="inline-flex items-center gap-2 text-xs font-bold text-sherpa-teal dark:text-sherpa-amber uppercase tracking-wider">
            <Cpu className="w-4 h-4" />
            <span>Architecture & Specs</span>
          </div>
          <h2 className="font-serif text-3xl font-bold text-sherpa-ink dark:text-white mt-1">
            Engineered with Modern Web & AI Standards
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {techStack.map((col, idx) => (
            <Card key={idx} variant="default" className="p-6 space-y-4">
              <h3 className="font-serif text-lg font-bold text-sherpa-deep dark:text-sherpa-amber border-b border-sherpa-teal/10 pb-2">
                {col.category}
              </h3>
              <div className="space-y-3">
                {col.items.map((item, itemIdx) => (
                  <div key={itemIdx} className="space-y-1">
                    <p className="font-bold text-xs text-sherpa-ink dark:text-white">
                      {item.name}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-snug">
                      {item.desc}
                    </p>
                  </div>
                ))}
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Project Credits & Call to Action */}
      <section className="rounded-3xl p-8 bg-sherpa-mist/40 dark:bg-sherpa-nightElevated/30 border border-sherpa-teal/15 dark:border-sherpa-mist/10 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center sm:text-left">
          <div className="flex items-center justify-center sm:justify-start gap-2">
            <Award className="w-4 h-4 text-sherpa-amber" />
            <span className="text-xs font-bold uppercase tracking-wider text-sherpa-deep dark:text-sherpa-mist">
              Project Credits
            </span>
          </div>
          <h3 className="font-serif text-xl sm:text-2xl font-bold text-sherpa-ink dark:text-white">
            Designed for Learners. Ready for the Climb.
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-xl">
            Created as an AI Mini Project demonstrating end-to-end prompt engineering, link integrity verification, multi-stage pipelines, and real-time evaluation.
          </p>
        </div>

        <Link href="/recommend" className="shrink-0">
          <Button variant="primary" size="lg" className="shadow-md">
            <span>Find My Path</span>
            <ArrowRight className="w-4 h-4" />
          </Button>
        </Link>
      </section>
    </div>
  );
}

