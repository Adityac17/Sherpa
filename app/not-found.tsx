import React from "react";
import Link from "next/link";
import { MountainRidgeline } from "@/components/ui/mountain-ridgeline";
import { Button } from "@/components/ui/button";
import { Compass, Home, ArrowRight } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-16">
      <div className="max-w-xl w-full text-center space-y-8">
        {/* Mountain illustration */}
        <div className="w-48 mx-auto opacity-70">
          <MountainRidgeline />
        </div>

        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-sherpa-amber/15 text-sherpa-amberDark dark:text-sherpa-amber border border-sherpa-amber/30">
            <Compass className="w-3.5 h-3.5" />
            <span>Off the Marked Trail · 404</span>
          </div>

          <h1 className="font-serif text-4xl sm:text-5xl font-bold text-sherpa-ink dark:text-white">
            Lost on the Ridge
          </h1>

          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
            The peak or trail you are looking for does not exist, or has been rerouted to a safer path. Let us guide you back to basecamp.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
          <Link href="/">
            <Button variant="primary" size="md">
              <Home className="w-4 h-4" />
              <span>Return to Basecamp</span>
            </Button>
          </Link>

          <Link href="/recommend">
            <Button variant="secondary" size="md">
              <span>Find Study Paths</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

