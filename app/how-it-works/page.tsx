import React from "react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Layers,
  Sparkles,
  ShieldCheck,
  Database,
  Mail,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Code2,
  Cpu,
} from "lucide-react";

export default function HowItWorksPage() {
  const stages = [
    {
      num: "01",
      name: "Input Semantic Validation",
      icon: <Layers className="w-5 h-5 text-sherpa-teal" />,
      desc: "Validates incoming subject queries against academic patterns. Empty queries, character spam, or nonsense smashing (e.g. 'asdfghjkl1234!@#$%') are rejected with friendly HTTP 400 feedback before querying models.",
    },
    {
      num: "02",
      name: "AI Structured Synthesis",
      icon: <Sparkles className="w-5 h-5 text-sherpa-amberDark dark:text-sherpa-amber" />,
      desc: "Sends the validated request to Gemini / FreeLLMAPI with strict JSON schema constraints. The prompt enforces 6 modalities (docs, course, video, practice, book, article) and mandates the anti-hallucination uncertainty rule.",
    },
    {
      num: "03",
      name: "Asynchronous HTTP HEAD Link Verification",
      icon: <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />,
      desc: "Every candidate URL is pinged asynchronously with an HTTP HEAD request and a 4000ms safety timeout. Live resources are verified (HTTP 200), while dead or non-existent URLs are flagged and replaced with safe fallback search queries.",
    },
    {
      num: "04",
      name: "Run Persistence & Scoring",
      icon: <Database className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />,
      desc: "A multi-dimensional rubric score (Relevance, Match to Level, Match to Goal, Link Validity, Clarity) is computed (0-100). The run is persisted to Firebase Firestore (collection 'runs') with local JSON fallback.",
    },
    {
      num: "05",
      name: "Automated Action & Proof Logging",
      icon: <Mail className="w-5 h-5 text-purple-600 dark:text-purple-400" />,
      desc: "If a student email is provided, an automated notification is dispatched via Resend or n8n webhook. An immutable execution proof containing transaction ID and timestamp is logged for verification.",
    },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 text-xs font-bold text-sherpa-teal dark:text-sherpa-amber uppercase tracking-widest">
          <Layers className="w-4 h-4" />
          <span>Architecture & Integrity</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-5xl font-bold text-sherpa-ink dark:text-white">
          The 5-Stage Verification Pipeline
        </h1>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300">
          How Sherpa turns open-ended curriculum prompts into link-verified, collegiate study roadmaps.
        </p>
      </div>

      {/* SVG Pipeline Architecture Diagram */}
      <div className="bg-white dark:bg-sherpa-nightSurface p-6 sm:p-8 rounded-3xl border border-sherpa-teal/15 dark:border-sherpa-mist/10 shadow-xs space-y-4">
        <h3 className="font-serif text-lg font-bold text-sherpa-ink dark:text-white text-center">
          End-to-End Pipeline Dataflow
        </h3>
        <div className="overflow-x-auto py-4">
          <svg
            viewBox="0 0 900 180"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full min-w-[700px] h-auto mx-auto"
          >
            {/* Connecting Track Line */}
            <line x1="80" y1="90" x2="820" y2="90" stroke="currentColor" strokeWidth="2" strokeDasharray="6 6" className="text-sherpa-teal/40 dark:text-sherpa-mist/20" />

            {/* Stage 1 */}
            <g transform="translate(40, 40)">
              <rect width="120" height="100" rx="16" strokeWidth="1.5" className="fill-sherpa-mist/60 dark:fill-sherpa-nightElevated stroke-sherpa-teal/30" />
              <text x="60" y="35" textAnchor="middle" fill="currentColor" className="text-sherpa-ink dark:text-white font-bold text-xs">Stage 1</text>
              <text x="60" y="55" textAnchor="middle" fill="currentColor" className="text-slate-500 dark:text-slate-300 text-[11px]">Semantic</text>
              <text x="60" y="70" textAnchor="middle" fill="currentColor" className="text-slate-500 dark:text-slate-300 text-[11px]">Validation</text>
            </g>

            {/* Stage 2 */}
            <g transform="translate(210, 40)">
              <rect width="120" height="100" rx="16" strokeWidth="1.5" className="fill-sherpa-mist/60 dark:fill-sherpa-nightElevated stroke-sherpa-amber/50" />
              <text x="60" y="35" textAnchor="middle" fill="currentColor" className="text-sherpa-ink dark:text-white font-bold text-xs">Stage 2</text>
              <text x="60" y="55" textAnchor="middle" fill="currentColor" className="text-slate-500 dark:text-slate-300 text-[11px]">Gemini AI</text>
              <text x="60" y="70" textAnchor="middle" fill="currentColor" className="text-slate-500 dark:text-slate-300 text-[11px]">Structured Ranking</text>
            </g>

            {/* Stage 3 */}
            <g transform="translate(380, 40)">
              <rect width="130" height="100" rx="16" strokeWidth="1.5" className="fill-emerald-50 dark:fill-emerald-950/40 stroke-emerald-500/60" />
              <text x="65" y="35" textAnchor="middle" fill="currentColor" className="text-emerald-900 dark:text-emerald-200 font-bold text-xs">Stage 3</text>
              <text x="65" y="55" textAnchor="middle" fill="currentColor" className="text-emerald-800 dark:text-emerald-300 text-[11px]">HTTP HEAD</text>
              <text x="65" y="70" textAnchor="middle" fill="currentColor" className="text-emerald-800 dark:text-emerald-300 text-[11px]">Link Verification</text>
            </g>

            {/* Stage 4 */}
            <g transform="translate(560, 40)">
              <rect width="120" height="100" rx="16" strokeWidth="1.5" className="fill-sherpa-mist/60 dark:fill-sherpa-nightElevated stroke-indigo-400/40" />
              <text x="60" y="35" textAnchor="middle" fill="currentColor" className="text-sherpa-ink dark:text-white font-bold text-xs">Stage 4</text>
              <text x="60" y="55" textAnchor="middle" fill="currentColor" className="text-slate-500 dark:text-slate-300 text-[11px]">Firestore &</text>
              <text x="60" y="70" textAnchor="middle" fill="currentColor" className="text-slate-500 dark:text-slate-300 text-[11px]">Rubric Scoring</text>
            </g>

            {/* Stage 5 */}
            <g transform="translate(730, 40)">
              <rect width="130" height="100" rx="16" strokeWidth="1.5" className="fill-sherpa-mist/60 dark:fill-sherpa-nightElevated stroke-purple-400/40" />
              <text x="65" y="35" textAnchor="middle" fill="currentColor" className="text-sherpa-ink dark:text-white font-bold text-xs">Stage 5</text>
              <text x="65" y="55" textAnchor="middle" fill="currentColor" className="text-slate-500 dark:text-slate-300 text-[11px]">Automated Proof</text>
              <text x="65" y="70" textAnchor="middle" fill="currentColor" className="text-slate-500 dark:text-slate-300 text-[11px]">& Notification</text>
            </g>
          </svg>
        </div>
      </div>

      {/* Vertical Timeline */}
      <div className="space-y-6">
        <h2 className="font-serif text-2xl font-bold text-sherpa-ink dark:text-white">
          Detailed Stage Specifications
        </h2>

        <div className="space-y-4">
          {stages.map((stg) => (
            <Card key={stg.num} className="p-6 flex flex-col sm:flex-row items-start gap-5">
              <div className="w-12 h-12 rounded-2xl bg-sherpa-mist dark:bg-sherpa-nightElevated flex items-center justify-center shrink-0 border border-sherpa-teal/15">
                {stg.icon}
              </div>

              <div className="space-y-1 flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-sherpa-teal dark:text-sherpa-amber">
                    STAGE {stg.num}
                  </span>
                  <span className="text-slate-400">•</span>
                  <h3 className="font-serif text-lg font-bold text-sherpa-ink dark:text-white">
                    {stg.name}
                  </h3>
                </div>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  {stg.desc}
                </p>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Prompt Engineering Rationale */}
      <div className="space-y-6 border-t border-sherpa-teal/15 dark:border-sherpa-mist/10 pt-10">
        <div className="max-w-2xl">
          <p className="text-xs font-bold uppercase tracking-widest text-sherpa-teal dark:text-sherpa-amber">
            Prompt Engineering Research
          </p>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-sherpa-ink dark:text-white mt-1">
            Why 3 Prompt Versions?
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-2">
            We systematically designed and benchmarked three prompt architectures to isolate how few-shot demonstrations and negative constraints eliminate hallucinated links.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="p-5 space-y-3">
            <span className="font-mono text-xs font-bold text-slate-500">v1_basic.txt</span>
            <h3 className="font-serif text-base font-bold text-sherpa-ink dark:text-white">
              v1: Zero-Shot Direct
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Basic instruction asking for 5 recommendations. Observed vulnerability: frequently confabulates plausible-sounding URLs that return HTTP 404.
            </p>
          </Card>

          <Card className="p-5 space-y-3">
            <span className="font-mono text-xs font-bold text-blue-600 dark:text-blue-400">v2_structured.txt</span>
            <h3 className="font-serif text-base font-bold text-sherpa-ink dark:text-white">
              v2: Persona & Modalities
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Adds Higher Education Advisor role + mandatory modality balancing (docs, course, video, practice, book). Solves tutorial monoculture.
            </p>
          </Card>

          <Card className="p-5 space-y-3 border-sherpa-amber/40">
            <span className="font-mono text-xs font-bold text-sherpa-amberDark dark:text-sherpa-amber">v3_structured_examples.txt</span>
            <h3 className="font-serif text-base font-bold text-sherpa-ink dark:text-white">
              v3: Production Guardrails
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Role + Context + Negative Constraints + 1 Worked Example + Uncertainty Rule (&ldquo;url: null if uncertain&rdquo;). Near-zero link fabrication.
            </p>
          </Card>
        </div>

        <div className="pt-2">
          <Button href="/compare" variant="primary" icon={<ArrowRight className="w-4 h-4" />}>
            Run 3-Way Prompt Comparison Lab
          </Button>
        </div>
      </div>
    </div>
  );
}
