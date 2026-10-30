import * as React from "react";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "elevated" | "flat" | "ridge";
}

export function Card({ className = "", variant = "default", children, ...props }: CardProps) {
  const variantStyles = {
    default:
      "bg-white dark:bg-sherpa-nightSurface border border-sherpa-teal/15 dark:border-sherpa-mist/10 shadow-xs hover:border-sherpa-teal/30 dark:hover:border-sherpa-mist/20 transition-all",
    elevated:
      "bg-white dark:bg-sherpa-nightSurface border border-sherpa-teal/20 dark:border-sherpa-mist/15 shadow-ridge hover:shadow-xl transition-all duration-300",
    flat:
      "bg-sherpa-mist/40 dark:bg-sherpa-nightElevated/50 border border-transparent",
    ridge:
      "bg-gradient-to-br from-white via-white to-sherpa-mist/30 dark:from-sherpa-nightSurface dark:to-sherpa-nightElevated border border-sherpa-teal/20 dark:border-sherpa-mist/10 shadow-sm",
  }[variant];

  return (
    <div className={`rounded-2xl p-6 ${variantStyles} ${className}`} {...props}>
      {children}
    </div>
  );
}

