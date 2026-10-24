"use client";

import { X } from "lucide-react";
import {
  useEffect,
  type ButtonHTMLAttributes,
  type InputHTMLAttributes,
  type ReactNode,
  type SelectHTMLAttributes,
  type TextareaHTMLAttributes,
} from "react";

export function cn(...values: Array<string | false | null | undefined>): string {
  return values.filter(Boolean).join(" ");
}

type ButtonVariant = "primary" | "dark" | "outline" | "ghost" | "danger";
type ButtonSize = "sm" | "md" | "lg";

const buttonVariants: Record<ButtonVariant, string> = {
  primary:
    "border border-orange bg-orange text-white hover:bg-[#d94c1e] hover:border-[#d94c1e]",
  dark: "border border-ink bg-ink text-paper hover:bg-graphite",
  outline: "border border-line bg-transparent text-ink hover:bg-paper2",
  ghost: "border border-transparent bg-transparent text-ink hover:bg-paper2",
  danger: "border border-danger/30 bg-transparent text-danger hover:bg-danger/10",
};

const buttonSizes: Record<ButtonSize, string> = {
  sm: "h-8 px-3 text-xs",
  md: "h-10 px-4 text-sm",
  lg: "h-12 px-5 text-sm",
};

export function Button({
  variant = "outline",
  size = "md",
  className,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
}) {
  return (
    <button
      className={cn(
        "inline-flex select-none items-center justify-center gap-2 font-medium transition-colors disabled:pointer-events-none disabled:opacity-40",
        buttonVariants[variant],
        buttonSizes[size],
        className,
      )}
      {...props}
    />
  );
}

export function IconButton({
  label,
  className,
  children,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  label: string;
  children: ReactNode;
}) {
  return (
    <button
      aria-label={label}
      title={label}
      className={cn(
        "inline-flex h-9 w-9 items-center justify-center text-muted transition-colors hover:bg-paper2 hover:text-ink disabled:opacity-30",
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}

export function Field({
  label,
  hint,
  children,
  className,
}: {
  label: string;
  hint?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <label className={cn("block", className)}>
      <span className="mb-1.5 block font-mono text-[10px] uppercase tracking-[0.16em] text-muted">
        {label}
      </span>
      {children}
      {hint ? <span className="mt-1 block text-xs text-muted">{hint}</span> : null}
    </label>
  );
}

export function Input({
  className,
  ...props
}: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        "h-10 w-full border border-line bg-white/60 px-3 text-sm text-ink outline-none transition-colors placeholder:text-muted/60 focus:border-ink",
        className,
      )}
      {...props}
    />
  );
}

export function Textarea({
  className,
  ...props
}: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={cn(
        "min-h-24 w-full resize-y border border-line bg-white/60 px-3 py-2 text-sm text-ink outline-none transition-colors placeholder:text-muted/60 focus:border-ink",
        className,
      )}
      {...props}
    />
  );
}

export function Select({
  className,
  children,
  ...props
}: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      className={cn(
        "h-9 w-full appearance-none border border-line bg-white/60 px-2 text-xs text-ink outline-none transition-colors focus:border-ink",
        className,
      )}
      {...props}
    >
      {children}
    </select>
  );
}

export type PillTone = "neutral" | "orange" | "green" | "red" | "amber" | "cyan";

const pillTones: Record<PillTone, string> = {
  neutral: "border-line text-muted",
  orange: "border-orange/40 bg-orange/10 text-orange",
  green: "border-success/30 bg-success/10 text-success",
  red: "border-danger/30 bg-danger/10 text-danger",
  amber: "border-amber/40 bg-amber/10 text-[#9A6618]",
  cyan: "border-cyan/40 bg-cyan/10 text-[#2E7A8C]",
};

export function Pill({
  tone = "neutral",
  className,
  children,
}: {
  tone?: PillTone;
  className?: string;
  children: ReactNode;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 border px-1.5 py-0.5 font-mono text-[9px] font-medium uppercase tracking-[0.12em]",
        pillTones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}

export function ProgressBar({
  value,
  tone = "orange",
  className,
}: {
  value: number;
  tone?: "orange" | "green" | "cyan";
  className?: string;
}) {
  const colors = {
    orange: "bg-orange",
    green: "bg-success",
    cyan: "bg-cyan",
  };
  return (
    <div
      className={cn("h-1.5 w-full overflow-hidden bg-line/70", className)}
      role="progressbar"
      aria-valuenow={Math.round(value)}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div
        className={cn("h-full transition-[width] duration-500", colors[tone])}
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      />
    </div>
  );
}

export function Modal({
  open,
  onClose,
  title,
  eyebrow,
  children,
  footer,
  width = "max-w-md",
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  eyebrow?: string;
  children: ReactNode;
  footer?: ReactNode;
  width?: string;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="no-print fixed inset-0 z-50 flex items-end justify-center bg-ink/50 p-0 backdrop-blur-[2px] sm:items-center sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-label={title}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        className={cn(
          "rise w-full border border-line bg-paper shadow-[0_24px_80px_rgba(0,0,0,0.25)]",
          width,
        )}
      >
        <div className="flex items-start justify-between gap-4 border-b border-line px-5 py-4">
          <div>
            {eyebrow ? (
              <div className="mb-1 font-mono text-[10px] uppercase tracking-[0.18em] text-muted">
                {eyebrow}
              </div>
            ) : null}
            <h2 className="font-display text-lg font-bold tracking-tight">{title}</h2>
          </div>
          <IconButton label="Fermer" onClick={onClose} className="-mr-2 -mt-1">
            <X size={18} />
          </IconButton>
        </div>
        <div className="px-5 py-5">{children}</div>
        {footer ? (
          <div className="flex items-center justify-end gap-2 border-t border-line px-5 py-3">
            {footer}
          </div>
        ) : null}
      </div>
    </div>
  );
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  className,
}: {
  icon: ReactNode;
  title: string;
  description: string;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center border border-dashed border-line px-6 py-14 text-center",
        className,
      )}
    >
      <div className="mb-4 flex h-12 w-12 items-center justify-center border border-line text-muted">
        {icon}
      </div>
      <h3 className="font-display text-base font-bold">{title}</h3>
      <p className="mt-1 max-w-sm text-sm text-muted">{description}</p>
      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  );
}

export function PageHeader({
  eyebrow,
  title,
  description,
  actions,
  className,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  actions?: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4 border-b border-line pb-5 sm:flex-row sm:items-end sm:justify-between",
        className,
      )}
    >
      <div>
        <div className="mb-2 font-mono text-[10px] uppercase tracking-[0.2em] text-muted">
          {eyebrow}
        </div>
        <h1 className="font-display text-3xl font-extrabold tracking-[-0.03em] sm:text-4xl">
          {title}
        </h1>
        {description ? (
          <p className="mt-2 max-w-2xl text-sm text-muted">{description}</p>
        ) : null}
      </div>
      {actions ? (
        <div className="no-print flex flex-wrap items-center gap-2">{actions}</div>
      ) : null}
    </div>
  );
}

export function Segmented<T extends string>({
  value,
  options,
  onChange,
  className,
}: {
  value: T;
  options: { value: T; label: string }[];
  onChange: (value: T) => void;
  className?: string;
}) {
  return (
    <div className={cn("inline-flex border border-line p-0.5", className)}>
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() => onChange(option.value)}
          className={cn(
            "px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.1em] transition-colors",
            value === option.value
              ? "bg-ink text-paper"
              : "text-muted hover:text-ink",
          )}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
