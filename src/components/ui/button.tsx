import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/cn";

type Variant = "primary" | "secondary" | "ghost" | "accent";
type Size = "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 rounded-control font-semibold transition-colors transition-shadow duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-60 select-none";

const variants: Record<Variant, string> = {
  primary:
    "bg-brand-600 text-white shadow-sm hover:bg-brand-700 active:bg-brand-800 focus-visible:outline-brand-600",
  secondary:
    "bg-white text-ink-800 ring-1 ring-inset ring-ink-200 hover:bg-ink-50 hover:ring-ink-300 active:bg-ink-100 focus-visible:outline-brand-600",
  ghost:
    "text-ink-700 hover:bg-ink-100 active:bg-ink-200 focus-visible:outline-brand-600",
  accent:
    "bg-accent-500 text-ink-950 shadow-sm hover:bg-accent-600 active:bg-accent-700 focus-visible:outline-accent-600",
};

const sizes: Record<Size, string> = {
  md: "h-11 px-5 text-sm",
  lg: "h-13 px-7 text-base",
};

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
}

/** Shared button surface. Anchor-shaped CTAs use `buttonClasses` on a Link. */
export function buttonClasses({
  variant = "primary",
  size = "md",
  className,
}: {
  variant?: Variant;
  size?: Size;
  className?: string;
} = {}) {
  return cn(base, variants[variant], sizes[size], className);
}

export function Button({
  variant = "primary",
  size = "md",
  className,
  children,
  type = "button",
  ...props
}: ButtonProps & { children: ReactNode }) {
  return (
    <button type={type} className={buttonClasses({ variant, size, className })} {...props}>
      {children}
    </button>
  );
}
