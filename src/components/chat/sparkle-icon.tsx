import type { SVGProps } from "react";

/**
 * AI sparkle mark used by the launcher and the assistant avatar. A custom
 * glyph rather than a Lucide icon so the four-point star keeps its weight
 * at 20px and the small accent sparkle stays legible.
 */
export function SparkleIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <path
        d="M12 2.5c.35 3.9 1.6 5.95 5.6 6.6-4 .65-5.25 2.7-5.6 6.6-.35-3.9-1.6-5.95-5.6-6.6 4-.65 5.25-2.7 5.6-6.6Z"
        fill="currentColor"
      />
      <path
        d="M18.2 14.6c.2 2.1.9 3.2 3 3.55-2.1.35-2.8 1.45-3 3.55-.2-2.1-.9-3.2-3-3.55 2.1-.35 2.8-1.45 3-3.55Z"
        fill="currentColor"
        opacity="0.75"
      />
    </svg>
  );
}
