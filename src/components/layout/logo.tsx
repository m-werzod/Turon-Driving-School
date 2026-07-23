import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/cn";

export function Logo({
  label,
  className,
  onClick,
}: {
  label: string;
  className?: string;
  onClick?: () => void;
}) {
  return (
    <Link
      href="/"
      onClick={onClick}
      aria-label={label}
      className={cn(
        "inline-flex items-center gap-2 rounded-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600",
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
        className="size-9 rounded-lg object-contain"
      />
      <span className="text-lg font-extrabold tracking-tight text-ink-900">
        Turon <span className="font-semibold text-ink-500">Avtomaktab</span>
      </span>
    </Link>
  );
}
