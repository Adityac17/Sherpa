"use client";

import * as React from "react";
import Link from "next/link";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "amber";
  size?: "sm" | "md" | "lg";
  href?: string;
  icon?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = "", variant = "primary", size = "md", href, icon, children, disabled, ...props }, ref) => {
    const baseStyles =
      "inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-200 sherpa-focus active:scale-[0.98] select-none";

    const sizeStyles = {
      sm: "px-3.5 py-1.5 text-xs gap-1.5",
      md: "px-5 py-2.5 text-sm gap-2",
      lg: "px-7 py-3.5 text-base gap-2.5",
    }[size];

    const variantStyles = {
      primary:
        "bg-sherpa-deep hover:bg-sherpa-teal text-white shadow-md hover:shadow-glow-teal disabled:opacity-50 disabled:pointer-events-none",
      amber:
        "bg-sherpa-amber hover:bg-sherpa-amberDark text-sherpa-ink font-bold shadow-md hover:shadow-glow-amber disabled:opacity-50 disabled:pointer-events-none",
      secondary:
        "bg-sherpa-mist dark:bg-sherpa-nightElevated hover:bg-sherpa-mistDark dark:hover:bg-sherpa-nightSurface text-sherpa-ink dark:text-sherpa-mist border border-sherpa-teal/20",
      outline:
        "bg-transparent border border-sherpa-teal/30 dark:border-sherpa-mist/20 text-sherpa-deep dark:text-sherpa-mist hover:bg-sherpa-teal/10 dark:hover:bg-sherpa-mist/10",
      ghost:
        "bg-transparent hover:bg-sherpa-teal/10 dark:hover:bg-sherpa-mist/10 text-sherpa-deep dark:text-sherpa-mist",
    }[variant];

    const combinedClassName = `${baseStyles} ${sizeStyles} ${variantStyles} ${className}`;

    if (href) {
      return (
        <Link href={href} className={combinedClassName}>
          {icon && <span className="shrink-0">{icon}</span>}
          <span>{children}</span>
        </Link>
      );
    }

    return (
      <button ref={ref} className={combinedClassName} disabled={disabled} {...props}>
        {icon && <span className="shrink-0">{icon}</span>}
        <span>{children}</span>
      </button>
    );
  }
);

Button.displayName = "Button";

