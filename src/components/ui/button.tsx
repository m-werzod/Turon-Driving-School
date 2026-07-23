import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/cn";

type Variant = "primary" | "secondary" | "ghost" | "dark" | "glass";
type Size = "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 rounded-pill font-semibold transition-all duration-300 ease-premium focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-60 select-none active:scale-[0.97]";

const variants: Record<Variant, string> = {
  primary:
    "bg-accent-500 text-white shadow-(--shadow-glow-accent) hover:bg-accent-600 hover:shadow-[0_16px_40px_-8px_rgb(244_104_54/0.55)] hover:-translate-y-0.5 focus-visible:outline-accent-600",
  secondary:
    "bg-white text-ink-900 ring-1 ring-inset ring-ink-200 shadow-(--shadow-card) hover:ring-ink-300 hover:-translate-y-0.5 hover:shadow-(--shadow-card-hover) focus-visible:outline-brand-600",
  ghost:
    "text-ink-700 hover:bg-ink-100 active:bg-ink-200 focus-visible:outline-brand-600",
  dark:
    "bg-ink-900 text-white shadow-(--shadow-glow-brand) hover:bg-brand-800 hover:-translate-y-0.5 focus-visible:outline-brand-600",
  glass:
    "glass-light text-ink-900 ring-1 ring-inset ring-white/60 hover:bg-white/90 hover:-translate-y-0.5 focus-visible:outline-white",
};

const sizes: Record<Size, string> = {
  md: "h-11 px-5 text-sm",
  lg: "h-14 px-8 text-base",
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
