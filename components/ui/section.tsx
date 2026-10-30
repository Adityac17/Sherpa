import React from "react";

export interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  badge?: string;
  badgeIcon?: React.ReactNode;
  title?: string;
  description?: string;
  align?: "left" | "center";
  children: React.ReactNode;
}

export function Section({
  badge,
  badgeIcon,
  title,
  description,
  align = "left",
  children,
  className = "",
  ...props
}: SectionProps) {
  const isCenter = align === "center";

  return (
    <section className={`space-y-8 ${className}`} {...props}>
      {(badge || title || description) && (
        <div className={`space-y-2 ${isCenter ? "text-center max-w-3xl mx-auto" : "max-w-3xl"}`}>
          {badge && (
            <div
              className={`inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-sherpa-teal dark:text-sherpa-amber ${
                isCenter ? "justify-center" : ""
              }`}
            >
              {badgeIcon}
              <span>{badge}</span>
            </div>
          )}
          {title && (
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-sherpa-ink dark:text-white tracking-tight">
              {title}
            </h2>
          )}
          {description && (
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed">
              {description}
            </p>
          )}
        </div>
      )}
      {children}
    </section>
  );
}

