"use client";

import * as React from "react";
import { PipelineStageProgress } from "@/lib/types";
import { Check, Loader2, X, Circle } from "lucide-react";

export interface StepperProps {
  stages: PipelineStageProgress[];
  activeStage?: number;
}

const STAGE_CONFIG = [
  { stage: 1, name: "Validation", desc: "Checking topic & goal semantics" },
  { stage: 2, name: "AI Ranking", desc: "Synthesizing collegiate curriculum" },
  { stage: 3, name: "Link Verification", desc: "Live HTTP HEAD integrity checks" },
  { stage: 4, name: "Persistence", desc: "Saving run to database" },
  { stage: 5, name: "Automated Action", desc: "Dispatching proof & notification" },
];

export function Stepper({ stages }: StepperProps) {
  return (
    <div className="w-full space-y-3" role="status" aria-live="polite">
      <div className="flex items-center justify-between text-xs font-bold text-sherpa-deep dark:text-sherpa-mist uppercase tracking-wider mb-2">
        <span>Curriculum Pipeline Progress</span>
        <span>5 Stages</span>
      </div>

      <div className="space-y-2">
        {STAGE_CONFIG.map((conf) => {
          const recorded = stages.find((s) => s.stage === conf.stage);
          const status = recorded?.status || "pending";

          let statusIcon = (
            <div className="w-6 h-6 rounded-full border border-slate-300 dark:border-slate-600 text-slate-400 flex items-center justify-center text-xs">
              {conf.stage}
            </div>
          );

          let statusClass = "bg-white/60 dark:bg-sherpa-nightElevated/40 border-slate-200/60 dark:border-white/5 text-slate-500";

          if (status === "completed") {
            statusIcon = (
              <div className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-xs">
                <Check className="w-3.5 h-3.5 stroke-[3]" />
              </div>
            );
            statusClass = "bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-300/40 dark:border-emerald-700/30 text-emerald-900 dark:text-emerald-100";
          } else if (status === "in_progress") {
            statusIcon = (
              <div className="w-6 h-6 rounded-full bg-sherpa-deep dark:bg-sherpa-teal text-white flex items-center justify-center shadow-xs animate-pulse">
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              </div>
            );
            statusClass = "bg-sherpa-mist/60 dark:bg-sherpa-nightElevated border-sherpa-teal/30 dark:border-sherpa-teal/40 text-sherpa-ink dark:text-white shadow-xs";
          } else if (status === "failed") {
            statusIcon = (
              <div className="w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center shadow-xs">
                <X className="w-3.5 h-3.5 stroke-[3]" />
              </div>
            );
            statusClass = "bg-red-50/50 dark:bg-red-950/20 border-red-300/40 text-red-900 dark:text-red-200";
          }

          return (
            <div
              key={conf.stage}
              className={`p-3 rounded-xl border flex items-center justify-between gap-3 transition-all duration-200 ${statusClass}`}
            >
              <div className="flex items-center gap-3">
                {statusIcon}
                <div>
                  <p className="text-xs font-bold leading-tight">{conf.name}</p>
                  <p className="text-[11px] opacity-75 mt-0.5">
                    {recorded?.message || conf.desc}
                  </p>
                </div>
              </div>

              <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-black/5 dark:bg-white/5">
                {status.replace("_", " ")}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

