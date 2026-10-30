import * as React from "react";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helperText?: string;
  error?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className = "", label, helperText, error, id, ...props }, ref) => {
    const inputId = id || React.useId();

    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label htmlFor={inputId} className="block text-xs font-bold text-sherpa-ink dark:text-sherpa-mist uppercase tracking-wider">
            {label}
          </label>
        )}
        <input
          id={inputId}
          ref={ref}
          className={`w-full px-4 py-2.5 text-sm rounded-xl bg-white dark:bg-sherpa-nightSurface text-sherpa-ink dark:text-white border ${
            error
              ? "border-red-500 focus:ring-red-400"
              : "border-sherpa-teal/20 dark:border-sherpa-mist/15 focus:border-sherpa-teal focus:ring-2 focus:ring-sherpa-teal/20"
          } sherpa-focus transition-all duration-150 placeholder:text-slate-400 dark:placeholder:text-slate-500 ${className}`}
          {...props}
        />
        {helperText && !error && (
          <p className="text-[11px] text-slate-500 dark:text-slate-400">{helperText}</p>
        )}
        {error && <p className="text-xs text-red-600 dark:text-red-400 font-medium">{error}</p>}
      </div>
    );
  }
);

Input.displayName = "Input";

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  helperText?: string;
  error?: string;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className = "", label, helperText, error, id, children, ...props }, ref) => {
    const selectId = id || React.useId();

    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label htmlFor={selectId} className="block text-xs font-bold text-sherpa-ink dark:text-sherpa-mist uppercase tracking-wider">
            {label}
          </label>
        )}
        <select
          id={selectId}
          ref={ref}
          className={`w-full px-4 py-2.5 text-sm rounded-xl bg-white dark:bg-sherpa-nightSurface text-sherpa-ink dark:text-white border ${
            error
              ? "border-red-500 focus:ring-red-400"
              : "border-sherpa-teal/20 dark:border-sherpa-mist/15 focus:border-sherpa-teal focus:ring-2 focus:ring-sherpa-teal/20"
          } sherpa-focus transition-all duration-150 ${className}`}
          {...props}
        >
          {children}
        </select>
        {helperText && !error && (
          <p className="text-[11px] text-slate-500 dark:text-slate-400">{helperText}</p>
        )}
        {error && <p className="text-xs text-red-600 dark:text-red-400 font-medium">{error}</p>}
      </div>
    );
  }
);

Select.displayName = "Select";

