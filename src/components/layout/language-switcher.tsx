"use client";

import { useParams } from "next/navigation";
import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { cn } from "@/lib/cn";

/**
 * UZ / RU text switcher (no flags — TZ §5.1). Re-navigates the current route
 * through the localized pathname map so switching lands on the equivalent
 * page, never the homepage (§5.6). next-intl persists the choice to the
 * locale cookie honored by middleware on return visits.
 */
export function LanguageSwitcher({
  label,
  className,
}: {
  label: string;
  className?: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();
  const active = useLocale();

  function switchTo(next: string) {
    if (next === active) return;
    // params carries dynamic segments (e.g. [slug]) for the current route.
    router.replace(
      // @ts-expect-error -- pathname+params are a valid pair for this route
      { pathname, params },
      { locale: next, scroll: false },
    );
  }

  return (
    <div
      role="group"
      aria-label={label}
      className={cn(
        "inline-flex items-center rounded-full bg-ink-100 p-0.5 text-sm font-semibold",
        className,
      )}
    >
      {routing.locales.map((locale) => {
        const isActive = locale === active;
        return (
          <button
            key={locale}
            type="button"
            onClick={() => switchTo(locale)}
            aria-current={isActive ? "true" : undefined}
            className={cn(
              "rounded-full px-3 py-1 uppercase transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600",
              isActive
                ? "bg-white text-brand-700 shadow-sm"
                : "text-ink-500 hover:text-ink-800",
            )}
          >
            {locale}
          </button>
        );
      })}
    </div>
  );
}
