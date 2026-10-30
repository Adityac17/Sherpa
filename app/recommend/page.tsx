"use client";

import React, { useState, useEffect } from "react";
import {
  RecommendationRun,
  PipelineStageProgress,
  ProficiencyLevel,
  ResourceItem,
  SyllabusSubject,
  SyllabusUnit,
} from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input, Select } from "@/components/ui/input";
import { Stepper } from "@/components/ui/stepper";
import { ResultCard } from "@/components/ui/result-card";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/toast";
import {
  Compass,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  FileText,
  Mail,
  Database,
  Layers,
  Sparkles,
  BookOpen,
} from "lucide-react";

export default function RecommendPage() {
  const toast = useToast();

  // Form State
  const [topic, setTopic] = useState("");
  const [proficiency, setProficiency] = useState<ProficiencyLevel>("Intermediate");
  const [learningGoal, setLearningGoal] = useState("Pass final exam");
  const [promptVersion, setPromptVersion] = useState<"v1" | "v2" | "v3">("v3");
  const [studentEmail, setStudentEmail] = useState("");

  // Pipeline execution state
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [currentRun, setCurrentRun] = useState<RecommendationRun | null>(null);
  const [stages, setStages] = useState<PipelineStageProgress[]>([]);

  // Syllabus quick select
  const [subjects, setSubjects] = useState<SyllabusSubject[]>([]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("sherpa_syllabus_v1");
      if (saved) {
        setSubjects(JSON.parse(saved));
      }
    } catch (e) {
      console.warn("Could not load syllabus:", e);
    }
  }, []);

  const handleQuickPreset = (presetTopic: string, presetLevel: ProficiencyLevel, presetGoal: string) => {
    setTopic(presetTopic);
    setProficiency(presetLevel);
    setLearningGoal(presetGoal);
    setErrorMsg(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) return;

    setErrorMsg(null);
    setLoading(true);
    setCurrentRun(null);

    const initialStages: PipelineStageProgress[] = [
      { stage: 1, name: "Validation", status: "in_progress", message: "Checking topic & goal semantics...", timestamp: new Date().toISOString() },
      { stage: 2, name: "AI Ranking", status: "pending", message: "Synthesizing collegiate curriculum...", timestamp: new Date().toISOString() },
      { stage: 3, name: "Link Verification", status: "pending", message: "Live HTTP HEAD integrity checks...", timestamp: new Date().toISOString() },
      { stage: 4, name: "Persistence", status: "pending", message: "Saving run to database...", timestamp: new Date().toISOString() },
      { stage: 5, name: "Automated Action", status: "pending", message: "Dispatching proof & notification...", timestamp: new Date().toISOString() },
    ];
    setStages(initialStages);

    try {
      const res = await fetch("/api/recommend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic,
          proficiency,
          learning_goal: learningGoal,
          prompt_version: promptVersion,
          student_email: studentEmail || undefined,
        }),
      });

      const data = await res.json();

      if (data.stages) {
        setStages(data.stages);
      }

      if (!res.ok || !data.success) {
        const msg = data.error || "Failed to generate study roadmap. Please try again.";
        setErrorMsg(msg);
        toast.error("Generation Failed", msg);
        return;
      }

      setCurrentRun(data.run);
      toast.success(
        "Study Roadmap Generated!",
        `Saved to ${data.run?.storage_target || "database"} · Quality Score: ${data.run?.overall_quality_score}/100`
      );
      if (studentEmail) {
        toast.info("Email Automation", `Dispatched curriculum to ${studentEmail}`);
      }
    } catch (err: any) {
      const msg = err.message || "Network connection failed.";
      setErrorMsg(msg);
      toast.error("Network Error", msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Page Header */}
      <div className="space-y-2 border-b border-sherpa-teal/15 dark:border-sherpa-mist/10 pb-6">
        <div className="inline-flex items-center gap-2 text-xs font-bold text-sherpa-teal dark:text-sherpa-amber uppercase tracking-widest">
          <Compass className="w-4 h-4" />
          <span>Curriculum Architect</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-5xl font-bold text-sherpa-ink dark:text-white">
          Generate Your Learning Path
        </h1>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-2xl">
          Enter your course subject and goals. Sherpa validates the curriculum, checks all links live, and returns a verified roadmap.
        </p>
      </div>

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Input Form & Presets (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          <Card className="p-6 sm:p-7 space-y-5">
            <h2 className="font-serif text-xl font-bold text-sherpa-ink dark:text-white">
              Course Details
            </h2>

            {/* Quick Presets */}
            <div className="space-y-1.5">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                Quick Sample Presets:
              </span>
              <div className="flex flex-wrap gap-1.5">
                <button
                  type="button"
                  onClick={() => handleQuickPreset("Operating Systems: Memory Management & Paging", "Intermediate", "Pass final university exam")}
                  className="px-2.5 py-1 text-xs rounded-lg bg-sherpa-mist/60 dark:bg-sherpa-nightElevated text-sherpa-ink dark:text-sherpa-mist hover:bg-sherpa-mistDark transition-colors"
                >
                  Operating Systems
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickPreset("Distributed Consensus (Raft & Paxos)", "Advanced", "Build replicated state machine")}
                  className="px-2.5 py-1 text-xs rounded-lg bg-sherpa-mist/60 dark:bg-sherpa-nightElevated text-sherpa-ink dark:text-sherpa-mist hover:bg-sherpa-mistDark transition-colors"
                >
                  Distributed Consensus
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickPreset("Python Programming Foundations", "Beginner", "Pass CS101 midterm")}
                  className="px-2.5 py-1 text-xs rounded-lg bg-sherpa-mist/60 dark:bg-sherpa-nightElevated text-sherpa-ink dark:text-sherpa-mist hover:bg-sherpa-mistDark transition-colors"
                >
                  Python CS101
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Topic or Course Subject"
                placeholder="e.g. Distributed Consensus, Virtual Memory, React"
                required
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                helperText="Enter a specific academic topic or technology."
              />

              <Select
                label="Proficiency Level"
                value={proficiency}
                onChange={(e) => setProficiency(e.target.value as ProficiencyLevel)}
              >
                <option value="Beginner">Beginner (Foundations & syntax)</option>
                <option value="Intermediate">Intermediate (Core implementation & patterns)</option>
                <option value="Advanced">Advanced (System architecture & internals)</option>
              </Select>

              <Input
                label="Learning Goal"
                placeholder="e.g. Pass final exam, build a project, get a job"
                required
                value={learningGoal}
                onChange={(e) => setLearningGoal(e.target.value)}
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <Select
                  label="Prompt Version"
                  value={promptVersion}
                  onChange={(e) => setPromptVersion(e.target.value as any)}
                >
                  <option value="v3">v3: Production Guardrails (Best)</option>
                  <option value="v2">v2: Structured Modalities</option>
                  <option value="v1">v1: Basic Zero-Shot</option>
                </Select>

                <Input
                  label="Student Email (Optional)"
                  type="email"
                  placeholder="student@university.edu"
                  value={studentEmail}
                  onChange={(e) => setStudentEmail(e.target.value)}
                />
              </div>

              {errorMsg && (
                <div className="p-3.5 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-300 dark:border-red-800 text-xs text-red-700 dark:text-red-300 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <Button
                type="submit"
                variant="amber"
                size="lg"
                disabled={loading || !topic.trim()}
                className="w-full shadow-md"
              >
                {loading ? "Synthesizing & Verifying Links..." : "Generate Ranked Roadmap"}
              </Button>
            </form>
          </Card>

          {/* Stepper Progress Box */}
          {(loading || stages.length > 0) && (
            <Card className="p-6">
              <Stepper stages={stages} />
            </Card>
          )}
        </div>

        {/* Right Column: Results & Confirmations (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Confirmation Banners */}
          {currentRun && (
            <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300/70 dark:border-emerald-700/60 text-xs text-emerald-900 dark:text-emerald-200 space-y-1.5 shadow-2xs">
              <div className="flex items-center justify-between font-bold">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span>Saved to database ({currentRun.storage_target})</span>
                </span>
                {currentRun.execution_proof && (
                  <span className="font-mono text-[11px] opacity-80">
                    ID: {currentRun.execution_proof.transaction_id}
                  </span>
                )}
              </div>
              {currentRun.execution_proof && (
                <p className="text-[11px] font-mono opacity-85">
                  {currentRun.execution_proof.details}
                </p>
              )}
            </div>
          )}

          {/* Quality Summary Header when run is loaded */}
          {currentRun && (
            <div className="p-6 rounded-2xl bg-white dark:bg-sherpa-nightSurface border border-sherpa-teal/20 dark:border-sherpa-mist/10 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-6">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-sherpa-teal dark:text-sherpa-amber">
                  Curriculum Quality Audit
                </span>
                <h2 className="font-serif text-2xl font-bold text-sherpa-ink dark:text-white mt-1">
                  {currentRun.topic}
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Goal: {currentRun.learning_goal} · Prompt: {currentRun.prompt_version}
                </p>
              </div>

              <div className="flex items-center gap-4 bg-sherpa-mist/40 dark:bg-sherpa-nightElevated p-4 rounded-xl border border-sherpa-teal/15 shrink-0">
                <div className="text-center">
                  <div className="font-serif text-3xl font-extrabold text-sherpa-deep dark:text-white">
                    {currentRun.overall_quality_score}
                    <span className="text-sm font-sans text-slate-400">/100</span>
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Quality Score
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Loading Skeleton */}
          {loading && !currentRun && (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="bg-white dark:bg-sherpa-nightSurface p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3 animate-pulse"
                >
                  <div className="flex justify-between">
                    <div className="w-1/3 h-5 bg-slate-200 dark:bg-slate-700 rounded" />
                    <div className="w-20 h-5 bg-slate-200 dark:bg-slate-700 rounded-full" />
                  </div>
                  <div className="w-3/4 h-6 bg-slate-200 dark:bg-slate-700 rounded" />
                  <div className="w-full h-12 bg-slate-100 dark:bg-slate-800 rounded" />
                </div>
              ))}
            </div>
          )}

          {/* Results List */}
          {currentRun && currentRun.resources && (
            <div className="space-y-4">
              <h3 className="font-serif text-lg font-bold text-sherpa-ink dark:text-white">
                Ranked Educational Resources
              </h3>
              {currentRun.resources.map((res) => (
                <ResultCard key={res.rank} resource={res} />
              ))}
            </div>
          )}

          {/* Friendly Empty State */}
          {!loading && !currentRun && (
            <div className="text-center py-16 px-6 rounded-3xl border-2 border-dashed border-sherpa-teal/20 dark:border-sherpa-mist/10 space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-sherpa-mist dark:bg-sherpa-nightElevated text-sherpa-teal dark:text-sherpa-amber flex items-center justify-center mx-auto">
                <Compass className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="font-serif text-xl font-bold text-sherpa-ink dark:text-white">
                  No Roadmap Generated Yet
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                  Pick a sample preset or enter your course details on the left to synthesize a link-verified collegiate study guide.
                </p>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
