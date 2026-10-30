import * as React from "react";
import { ResourceItem } from "@/lib/types";
import { LinkBadge, TypeBadge } from "./badge";
import { ExternalLink, Search, Clock, Award, Compass } from "lucide-react";

export function ResultCard({ resource }: { resource: ResourceItem }) {
  return (
    <div className="bg-white dark:bg-sherpa-nightSurface rounded-2xl p-5 sm:p-6 border border-sherpa-teal/15 dark:border-sherpa-mist/10 shadow-xs hover:shadow-md hover:border-sherpa-teal/35 dark:hover:border-sherpa-mist/25 transition-all duration-200 space-y-4">
      {/* Top Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          {/* Summit Rank Badge */}
          <div className="w-9 h-9 rounded-xl bg-sherpa-deep dark:bg-sherpa-teal text-white font-bold flex items-center justify-center text-sm shadow-sm shrink-0">
            #{resource.rank}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <TypeBadge type={resource.type} />
            <LinkBadge status={resource.link_status} />
          </div>
        </div>

        {/* Action Button */}
        <div className="flex items-center gap-2">
          {resource.url && resource.link_status !== 'dead_link' ? (
            <a
              href={resource.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-sherpa-deep hover:bg-sherpa-teal text-white text-xs font-semibold rounded-xl shadow-xs hover:shadow-glow-teal transition-all active:scale-95 whitespace-nowrap"
            >
              <span>Explore Resource</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          ) : (
            <a
              href={resource.fallback_search_url || `https://www.google.com/search?q=${encodeURIComponent(resource.title + ' tutorial')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-sherpa-ink text-xs font-bold rounded-xl shadow-xs transition-all active:scale-95 whitespace-nowrap"
            >
              <span>Search Safe Source</span>
              <Search className="w-3.5 h-3.5" />
            </a>
          )}
        </div>
      </div>

      {/* Title & Metadata */}
      <div>
        <h3 className="font-serif text-lg font-bold text-sherpa-ink dark:text-white leading-snug">
          {resource.title}
        </h3>

        <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 dark:text-slate-400 mt-2">
          <div className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-sherpa-teal" />
            <span>{resource.estimated_time}</span>
          </div>
          <span>•</span>
          <div className="flex items-center gap-1">
            <Award className="w-3.5 h-3.5 text-sherpa-amberDark dark:text-sherpa-amber" />
            <span>{resource.difficulty}</span>
          </div>
          <span>•</span>
          <div className="flex items-center gap-1">
            <Compass className="w-3.5 h-3.5 text-indigo-500" />
            <span>Match: {resource.relevance_score}/10</span>
          </div>
        </div>
      </div>

      {/* Pedagogical Rationale */}
      <div className="p-3.5 rounded-xl bg-sherpa-mist/40 dark:bg-sherpa-nightElevated/40 border border-sherpa-teal/10 dark:border-sherpa-mist/5 text-xs text-sherpa-ink/80 dark:text-slate-300 leading-relaxed">
        <span className="font-bold text-sherpa-deep dark:text-sherpa-mist block mb-1">
          Why this fits your climb:
        </span>
        {resource.why_it_fits}
      </div>

      {/* Relevance Meter Bar */}
      <div>
        <div className="flex justify-between text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1">
          <span>Relevance to Goal</span>
          <span>{resource.relevance_score * 10}%</span>
        </div>
        <div className="w-full h-1.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-sherpa-teal to-sherpa-amber rounded-full"
            style={{ width: `${Math.min(100, resource.relevance_score * 10)}%` }}
          />
        </div>
      </div>
    </div>
  );
}

