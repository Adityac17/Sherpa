"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { RecommendationRun } from "@/lib/types";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ResultCard } from "@/components/ui/result-card";
import {
  History,
  Search,
  Filter,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  Clock,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";

export default function HistoryPage() {
  const [history, setHistory] = useState<RecommendationRun[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [levelFilter, setLevelFilter] = useState("all");
  const [promptFilter, setPromptFilter] = useState("all");
  const [expandedRunId, setExpandedRunId] = useState<string | null>(null);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/history");
      const data = await res.json();
      if (data.success && data.history) {
        setHistory(data.history);
      }
    } catch (e) {
      console.warn("Failed to load history:", e);
    } finally {
      setLoading(false);
    }
  };

  // Filtered runs
  const filteredHistory = history.filter((run) => {
    const matchesSearch =
      run.topic.toLowerCase().includes(searchQuery.toLowerCase()) ||
      run.learning_goal.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesLevel = levelFilter === "all" || run.proficiency === levelFilter;
    const matchesPrompt = promptFilter === "all" || run.prompt_version === promptFilter;
    return matchesSearch && matchesLevel && matchesPrompt;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-sherpa-teal/15 dark:border-sherpa-mist/10 pb-6">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 text-xs font-bold text-sherpa-teal dark:text-sherpa-amber uppercase tracking-widest">
            <History className="w-4 h-4" />
            <span>Audit Trail & Runs</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-sherpa-ink dark:text-white">
            Curriculum Run History
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-300">
            Audit verified roadmaps, quality rubrics, and storage proofs saved across sessions.
          </p>
        </div>

        <div>
          <Button
            onClick={fetchHistory}
            variant="outline"
            size="sm"
            icon={<RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />}
          >
            Refresh History
          </Button>
        </div>
      </div>

      {/* Filter Bar */}
      <Card className="p-4 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search topic or goal..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl bg-sherpa-mist/40 dark:bg-sherpa-nightElevated border border-sherpa-teal/20 text-sherpa-ink dark:text-white focus:outline-none focus:ring-2 focus:ring-sherpa-teal/30"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <Filter className="w-3.5 h-3.5" />
            <span>Filter:</span>
          </div>

          <select
            value={levelFilter}
            onChange={(e) => setLevelFilter(e.target.value)}
            className="px-3 py-1.5 text-xs rounded-xl bg-sherpa-mist/40 dark:bg-sherpa-nightElevated border border-sherpa-teal/20 text-sherpa-ink dark:text-white focus:outline-none"
          >
            <option value="all">All Levels</option>
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
          </select>

          <select
            value={promptFilter}
            onChange={(e) => setPromptFilter(e.target.value)}
            className="px-3 py-1.5 text-xs rounded-xl bg-sherpa-mist/40 dark:bg-sherpa-nightElevated border border-sherpa-teal/20 text-sherpa-ink dark:text-white focus:outline-none"
          >
            <option value="all">All Prompts</option>
            <option value="v3">v3: Guardrails</option>
            <option value="v2">v2: Structured</option>
            <option value="v1">v1: Basic</option>
          </select>
        </div>
      </Card>

      {/* Runs Table & Expandable Rows */}
      <Card className="p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700 dark:text-slate-300">
            <thead className="bg-sherpa-mist/60 dark:bg-sherpa-nightElevated text-sherpa-deep dark:text-sherpa-mist font-bold uppercase text-[10px] tracking-wider border-b border-sherpa-teal/15">
              <tr>
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4">Topic / Course</th>
                <th className="py-3 px-4">Proficiency</th>
                <th className="py-3 px-4">Learning Goal</th>
                <th className="py-3 px-4">Prompt</th>
                <th className="py-3 px-4">Score</th>
                <th className="py-3 px-4">Storage Target</th>
                <th className="py-3 px-4 text-right">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-sherpa-teal/10 dark:divide-sherpa-mist/5">
              {filteredHistory.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    {loading ? "Loading runs from database..." : "No runs match your search filters."}
                  </td>
                </tr>
              ) : (
                filteredHistory.map((run) => {
                  const isExpanded = expandedRunId === run.id;
                  return (
                    <React.Fragment key={run.id}>
                      <tr
                        onClick={() => setExpandedRunId(isExpanded ? null : run.id)}
                        className="hover:bg-sherpa-mist/30 dark:hover:bg-sherpa-nightElevated/40 transition-colors cursor-pointer select-none"
                      >
                        <td className="py-3 px-4 font-mono text-[11px] text-slate-500 whitespace-nowrap">
                          {new Date(run.created_at).toLocaleString([], {
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </td>
                        <td className="py-3 px-4 font-serif font-bold text-sherpa-ink dark:text-white max-w-[200px] truncate">
                          {run.topic}
                        </td>
                        <td className="py-3 px-4">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-sherpa-mist dark:bg-sherpa-nightElevated">
                            {run.proficiency}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-slate-600 dark:text-slate-300 max-w-[180px] truncate">
                          {run.learning_goal}
                        </td>
                        <td className="py-3 px-4 font-mono font-bold text-[10px] text-sherpa-teal dark:text-sherpa-amber">
                          {run.prompt_version}
                        </td>
                        <td className="py-3 px-4 font-serif font-bold text-sm text-sherpa-deep dark:text-white">
                          {run.overall_quality_score}/100
                        </td>
                        <td className="py-3 px-4 text-[11px] font-mono text-slate-500">
                          {run.storage_target}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <button
                            type="button"
                            className="p-1 rounded-lg text-sherpa-teal dark:text-sherpa-amber hover:bg-sherpa-mist dark:hover:bg-sherpa-nightElevated"
                          >
                            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                          </button>
                        </td>
                      </tr>

                      {/* Expandable Details Drawer */}
                      {isExpanded && (
                        <tr>
                          <td colSpan={8} className="p-6 bg-sherpa-mist/20 dark:bg-sherpa-nightElevated/20 border-b border-sherpa-teal/15">
                            <div className="space-y-4">
                              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                <div>
                                  <h4 className="font-serif text-base font-bold text-sherpa-ink dark:text-white">
                                    Roadmap: {run.topic}
                                  </h4>
                                  <p className="text-xs text-slate-500">
                                    Model: {run.ai_model_used} · Verified Links:{" "}
                                    {run.resources.filter((r) => r.link_status === "verified_200").length}/{run.resources.length}
                                  </p>
                                </div>

                                {run.execution_proof && (
                                  <div className="p-2.5 rounded-xl bg-white dark:bg-sherpa-nightSurface border border-sherpa-teal/20 text-xs font-mono">
                                    <span className="font-bold text-emerald-600">Proof: </span>
                                    <span>{run.execution_proof.transaction_id}</span>
                                  </div>
                                )}
                              </div>

                              {/* Resource Cards Grid */}
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {run.resources.map((res) => (
                                  <ResultCard key={res.rank} resource={res} />
                                ))}
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

