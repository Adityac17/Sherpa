import * as React from "react";

export function StatBlock({
  value,
  label,
  sublabel,
  icon,
}: {
  value: string;
  label: string;
  sublabel?: string;
  icon?: React.ReactNode;
}) {
  return (
    <div className="p-6 rounded-2xl bg-white dark:bg-sherpa-nightSurface border border-sherpa-teal/15 dark:border-sherpa-mist/10 shadow-xs hover:border-sherpa-teal/30 transition-all text-center sm:text-left">
      <div className="flex items-center gap-3 mb-2 justify-center sm:justify-start">
        {icon && <div className="text-sherpa-teal dark:text-sherpa-amber">{icon}</div>}
        <div className="font-serif text-3xl sm:text-4xl font-extrabold text-sherpa-ink dark:text-white">
          {value}
        </div>
      </div>
      <p className="text-sm font-bold text-sherpa-deep dark:text-sherpa-mist">{label}</p>
      {sublabel && <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{sublabel}</p>}
    </div>
  );
}

export function MountainRidgeline({ className = "" }: { className?: string }) {
  return (
    <div className={`overflow-hidden pointer-events-none select-none ${className}`} aria-hidden="true">
      <svg
        viewBox="0 0 1200 320"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto opacity-70 dark:opacity-30"
        preserveAspectRatio="none"
      >
        {/* Distant mountain layer */}
        <path
          d="M0 320L180 160L380 260L600 110L820 220L1020 90L1200 240V320H0Z"
          fill="url(#distant-ridge)"
          opacity="0.4"
        />

        {/* Mid-range ridge */}
        <path
          d="M0 320L240 190L460 270L700 150L940 250L1200 130V320H0Z"
          fill="url(#mid-ridge)"
          opacity="0.6"
        />

        {/* Foreground sharp ridge */}
        <path
          d="M0 320L140 220L320 290L520 180L740 280L980 170L1200 250V320H0Z"
          fill="url(#fore-ridge)"
        />

        {/* Glowing trail path ascending */}
        <path
          d="M80 310 Q 300 280 520 185 T 980 170"
          stroke="url(#trail-glow)"
          strokeWidth="3"
          strokeLinecap="round"
          className="trail-path"
        />

        {/* Summit Beacon Flag at (980, 170) */}
        <circle cx="980" cy="170" r="6" fill="#F4B942" className="animate-pulse" />
        <circle cx="980" cy="170" r="14" stroke="#F4B942" strokeWidth="1.5" opacity="0.6" className="animate-ping" />

        <defs>
          <linearGradient id="distant-ridge" x1="600" y1="90" x2="600" y2="320" gradientUnits="userSpaceOnUse">
            <stop stopColor="#0F766E" />
            <stop offset="1" stopColor="#0F3D44" stopOpacity="0.8" />
          </linearGradient>
          <linearGradient id="mid-ridge" x1="600" y1="130" x2="600" y2="320" gradientUnits="userSpaceOnUse">
            <stop stopColor="#0F3D44" />
            <stop offset="1" stopColor="#11262B" />
          </linearGradient>
          <linearGradient id="fore-ridge" x1="600" y1="170" x2="600" y2="320" gradientUnits="userSpaceOnUse">
            <stop stopColor="#11262B" />
            <stop offset="1" stopColor="#071619" />
          </linearGradient>
          <linearGradient id="trail-glow" x1="80" y1="310" x2="980" y2="170" gradientUnits="userSpaceOnUse">
            <stop stopColor="#14B8A6" />
            <stop offset="0.6" stopColor="#F4B942" />
            <stop offset="1" stopColor="#F4B942" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}

