import React from "react";
import { Card } from "@/components/ui/card";

export interface StatBlockProps {
  value: string | number;
  label: string;
  sublabel?: string;
  icon?: React.ReactNode;
  trend?: string;
  className?: string;
}

export function StatBlock({
  value,
  label,
  sublabel,
  icon,
  trend,
  className = "",
}: StatBlockProps) {
  return (
    <Card variant="flat" className={`p-5 space-y-2 relative overflow-hidden group ${className}`}>
      <div className="flex items-center justify-between">
        <p className="text-xs uppercase font-bold tracking-wider text-sherpa-teal dark:text-sherpa-mist">
          {label}
        </p>
        {icon && (
          <div className="w-8 h-8 rounded-lg bg-sherpa-mist/60 dark:bg-sherpa-nightElevated text-sherpa-teal dark:text-sherpa-amber flex items-center justify-center shrink-0">
            {icon}
          </div>
        )}
      </div>

      <div className="flex items-baseline gap-2">
        <span className="font-serif text-3xl font-bold text-sherpa-ink dark:text-white tracking-tight">
          {value}
        </span>
        {trend && (
          <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
            {trend}
          </span>
        )}
      </div>

      {sublabel && (
        <p className="text-xs text-slate-500 dark:text-slate-400">
          {sublabel}
        </p>
      )}
    </Card>
  );
}

