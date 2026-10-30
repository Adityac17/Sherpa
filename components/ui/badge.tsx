import * as React from "react";
import { LinkStatus, ResourceType } from "@/lib/types";
import { CheckCircle2, AlertTriangle, XCircle, Search } from "lucide-react";

export function LinkBadge({ status }: { status?: LinkStatus }) {
  if (status === "verified_200") {
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-300/60 dark:border-emerald-700/60">
        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
        <span>Verified 200 OK</span>
      </span>
    );
  }

  if (status === "dead_link") {
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-50 dark:bg-red-950/60 text-red-700 dark:text-red-300 border border-red-300/60 dark:border-red-700/60">
        <XCircle className="w-3.5 h-3.5 text-red-600 dark:text-red-400" />
        <span>Dead Link (Flagged)</span>
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-sherpa-amber/15 dark:bg-sherpa-amber/20 text-sherpa-amberDark dark:text-sherpa-amber border border-sherpa-amber/40">
      <Search className="w-3.5 h-3.5" />
      <span>Search Fallback</span>
    </span>
  );
}

export function TypeBadge({ type }: { type: ResourceType | string }) {
  const styles: Record<string, string> = {
    course: "bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800",
    video: "bg-red-50 dark:bg-red-950/60 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800",
    docs: "bg-teal-50 dark:bg-teal-950/60 text-sherpa-teal dark:text-teal-300 border-teal-200 dark:border-teal-800",
    practice: "bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800",
    book: "bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-800",
    article: "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700",
  };

  const currentStyle = styles[type.toLowerCase()] || styles.article;

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider border ${currentStyle}`}>
      {type}
    </span>
  );
}

