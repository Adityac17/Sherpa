"use client";

import React, { useState } from "react";
import Link from "next/link";
import { PromptComparisonResult, ProficiencyLevel } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input, Select } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { ResultCard } from "@/components/ui/result-card";
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Clock,
  Layers,
  Compass,
} from "lucide-react";

export default function ComparePage() {
  const [topic, setTopic] = useState("Operating Systems: Memory Management & Paging");
  const [proficiency, setProficiency] = useState<ProficiencyLevel>("Intermediate");
  const [learningGoal, setLearningGoal] = useState("Pass final university examination");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [results, setResults] = useState<PromptComparisonResult[] | null>(null);

  const handleRunComparison = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);
    setResults(null);

    try {
      const res = await fetch("/api/compare", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic,
          proficiency,
          learning_goal: learningGoal,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setErrorMsg(data.error || "Failed to execute multi-prompt comparison.");
        return;
      }

      setResults(data.comparison);
    } catch (err: any) {
      setErrorMsg(err.message || "Network request failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Header */}
      <div className="space-y-2 border-b border-sherpa-teal/15 dark:border-sherpa-mist/10 pb-6">
        <div className="inline-flex items-center gap-2 text-xs font-bold text-sherpa-teal dark:text-sherpa-amber uppercase tracking-widest">
          <Sparkles className="w-4 h-4" />
          <span>Evaluation Laboratory</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-5xl font-bold text-sherpa-ink dark:text-white">
          Side-by-Side Prompt Comparison
        </h1>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-2xl">
          Evaluate curriculum quality, hallucination prevention, and link verification across v1 (Basic), v2 (Structured), and v3 (Production Guardrails).
        </p>
      </div>

      {/* Input Parameters Box */}
      <Card className="p-6 sm:p-7">
        <form onSubmit={handleRunComparison} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
          <div className="md:col-span-5">
            <Input
              label="Topic or Subject"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              required
            />
          </div>

          <div className="md:col-span-3">
            <Select
              label="Proficiency"
              value={proficiency}
              onChange={(e) => setProficiency(e.target.value as ProficiencyLevel)}
            >
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </Select>
          </div>

          <div className="md:col-span-4">
            <Input
              label="Learning Goal"
              value={learningGoal}
              onChange={(e) => setLearningGoal(e.target.value)}
              required
            />
          </div>

          <div className="md:col-span-12 flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="text-slate-500 dark:text-slate-400 font-medium">Quick Presets:</span>
              <button
                type="button"
                onClick={() => {
                  setTopic("Operating Systems Virtual Memory");
                  setProficiency("Intermediate");
                  setLearningGoal("Pass final exam");
                }}
                className="px-2.5 py-1 rounded-lg bg-sherpa-mist dark:bg-sherpa-nightElevated text-sherpa-ink dark:text-sherpa-mist hover:bg-sherpa-mistDark"
              >
                Virtual Memory
              </button>
              <button
                type="button"
                onClick={() => {
                  setTopic("Distributed Consensus (Raft & Paxos)");
                  setProficiency("Advanced");
                  setLearningGoal("Build fault-tolerant state machine");
                }}
                className="px-2.5 py-1 rounded-lg bg-sherpa-mist dark:bg-sherpa-nightElevated text-sherpa-ink dark:text-sherpa-mist hover:bg-sherpa-mistDark"
              >
                Raft & Paxos
              </button>
            </div>

            <Button
              type="submit"
              variant="amber"
              disabled={loading}
              className="w-full sm:w-auto"
            >
              {loading ? "Evaluating Concurrently..." : "⚡ Run 3-Way Comparison"}
            </Button>
          </div>
        </form>

        {errorMsg && (
          <div className="mt-4 p-3.5 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-300 dark:border-red-800 text-xs text-red-700 dark:text-red-300">
            {errorMsg}
          </div>
        )}
      </Card>

      {/* Comparison Results */}
      {results && (
        <div className="space-y-8 animate-in fade-in-50 duration-300">
          {/* Comparative Metrics Summary Card */}
          <Card className="p-6">
            <h3 className="font-serif text-lg font-bold text-sherpa-ink dark:text-white mb-4">
              Comparative Evaluation Matrix
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 divide-y md:divide-y-0 md:divide-x divide-sherpa-teal/15 dark:divide-sherpa-mist/10">
              {results.map((r) => (
                <div key={r.version} className="pt-4 md:pt-0 md:px-4 first:pl-0 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-serif font-bold text-sherpa-ink dark:text-white">
                      {r.prompt_name}
                    </span>
                    <span className="font-mono text-xs px-2 py-0.5 rounded bg-sherpa-mist dark:bg-sherpa-nightElevated font-semibold">
                      {r.version}
                    </span>
                  </div>

                  <div className="flex items-baseline gap-2">
                    <span className="font-serif text-4xl font-extrabold text-sherpa-deep dark:text-sherpa-amber">
                      {r.overall_quality_score}
                    </span>
                    <span className="text-xs text-slate-500 font-medium">/100 Quality</span>
                  </div>

                  <div className="space-y-1 text-xs text-slate-600 dark:text-slate-300">
                    <div className="flex justify-between">
                      <span>Verified 200 OK links:</span>
                      <strong className="text-emerald-600 dark:text-emerald-400">
                        {r.verified_links_count} / {r.resources.length}
                      </strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Dead / Hallucinated links:</span>
                      <strong className={r.dead_links_count > 0 ? "text-red-500" : "text-slate-400"}>
                        {r.dead_links_count}
                      </strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Execution Latency:</span>
                      <span className="font-mono text-slate-500">{r.generation_time_ms}ms</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* 3 Columns of Result Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {results.map((r) => (
              <div key={r.version} className="space-y-4">
                <div className="p-3 rounded-xl bg-sherpa-mist/40 dark:bg-sherpa-nightElevated text-center font-bold text-xs uppercase tracking-wider text-sherpa-deep dark:text-sherpa-mist border border-sherpa-teal/15">
                  {r.prompt_name} ({r.version})
                </div>

                <div className="space-y-3">
                  {r.resources.map((res) => (
                    <ResultCard key={res.rank} resource={res} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Default Prompt Descriptions */}
      {!results && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="p-6 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-sherpa-ink dark:text-white">Version 1: Basic</span>
              <span className="font-mono text-xs text-slate-500">v1_basic.txt</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Direct zero-shot prompt with bare JSON schema. Vulnerable to link hallucination and uncalibrated difficulty levels.
            </p>
          </Card>

          <Card className="p-6 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-sherpa-ink dark:text-white">Version 2: Structured</span>
              <span className="font-mono text-xs text-blue-600 dark:text-blue-400">v2_structured.txt</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Higher education curriculum advisor persona + strict modality coverage requirements. Prevents tutorial monoculture.
            </p>
          </Card>

          <Card className="p-6 space-y-3 border-sherpa-amber/40">
            <div className="flex items-center justify-between">
              <span className="font-bold text-sherpa-ink dark:text-white">Version 3: Guardrails</span>
              <span className="font-mono text-xs text-sherpa-amberDark dark:text-sherpa-amber font-bold">v3_production.txt</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              In-context learning worked example + negative constraints + strict uncertainty rule: &ldquo;url: null if uncertain&rdquo;. Highest rubric scores.
            </p>
          </Card>
        </div>
      )}
    </div>
  );
}
