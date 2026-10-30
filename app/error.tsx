"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { MountainRidgeline } from "@/components/ui/mountain-ridgeline";
import { Button } from "@/components/ui/button";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Sherpa runtime caught an unhandled trail error:", error);
  }, [error]);

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-16">
      <div className="max-w-xl w-full text-center space-y-8">
        <div className="w-48 mx-auto opacity-70">
          <MountainRidgeline />
        </div>

        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-red-100 dark:bg-red-950/60 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Trail Condition Alert</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-sherpa-ink dark:text-white">
            Rough Weather on the Ascent
          </h1>

          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
            Something unexpected occurred while rendering this path. Our trail guides have logged the issue.
          </p>

          {error?.message && (
            <div className="p-3 bg-red-50 dark:bg-red-950/30 rounded-xl border border-red-100 dark:border-red-900 text-xs text-red-700 dark:text-red-300 font-mono text-left max-h-32 overflow-y-auto">
              {error.message}
            </div>
          )}
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
          <Button variant="primary" size="md" onClick={() => reset()}>
            <RefreshCw className="w-4 h-4" />
            <span>Try Again</span>
          </Button>

          <Link href="/">
            <Button variant="secondary" size="md">
              <Home className="w-4 h-4" />
              <span>Back to Basecamp</span>
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

