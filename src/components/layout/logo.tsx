import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/cn";

const sizes = {
  md: { box: "size-10", wordmark: "text-lg" },
  lg: { box: "size-11 sm:size-14 lg:size-18", wordmark: "text-xl sm:text-2xl lg:text-[1.75rem]" },
} as const;

export function Logo({
  label,
  className,
  onClick,
  size = "md",
  tone = "dark",
}: {
  label: string;
  className?: string;
  onClick?: () => void;
  size?: keyof typeof sizes;
  tone?: "dark" | "light";
}) {
  const s = sizes[size];
  return (
    <Link
      href="/"
      onClick={onClick}
      aria-label={label}
      className={cn(
        "group inline-flex items-center gap-2.5 rounded-md focus-visible:outline-2 focus-visible:outline-offset-4",
        className,
      )}
    >
      <Image
        src="/assets/logo/logo.png"
        alt=""
        aria-hidden="true"
        width={1024}
        height={1024}
        priority
        className={cn(
          s.box,
          "shrink-0 rounded-xl object-contain drop-shadow-[0_4px_16px_rgb(16_19_31/0.25)] transition-transform duration-300 group-hover:scale-[1.04]",
        )}
      />
      <span
        className={cn(
          "font-extrabold leading-tight tracking-tight",
          s.wordmark,
          tone === "light" ? "text-white" : "text-ink-900",
        )}
      >
        Turon{" "}
        <span
          className={cn(
            "font-semibold",
            tone === "light" ? "text-white/70" : "text-ink-500",
          )}
        >
          Avtomaktab
        </span>
      </span>
    </Link>
  );
}
