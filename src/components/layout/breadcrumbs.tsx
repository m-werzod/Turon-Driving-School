import { ChevronRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Container } from "@/components/ui/container";
import type { ComponentProps } from "react";

export interface Crumb {
  label: string;
  href?: ComponentProps<typeof Link>["href"];
}

/**
 * Breadcrumb trail for level-2+ pages (TZ §5.5); never rendered on Home.
 * Visual only — the matching BreadcrumbList JSON-LD is emitted by the page
 * via the SEO schema helpers so the two share one source of truth per page.
 * The leading "Home" crumb is prepended here.
 */
export function Breadcrumbs({ items }: { items: Crumb[] }) {
  const t = useTranslations("breadcrumbs");
  const trail: Crumb[] = [{ label: t("home"), href: "/" }, ...items];

  return (
    <nav aria-label="Breadcrumb" className="border-b border-ink-100 bg-ink-50/60">
      <Container>
        <ol className="flex flex-wrap items-center gap-1.5 py-3 text-sm">
          {trail.map((crumb, index) => {
            const isLast = index === trail.length - 1;
            return (
              <li key={index} className="flex items-center gap-1.5">
                {index > 0 ? (
                  <ChevronRight className="size-4 text-ink-300" aria-hidden="true" />
                ) : null}
                {crumb.href && !isLast ? (
                  <Link
                    href={crumb.href}
                    className="rounded text-ink-500 transition-colors hover:text-brand-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600"
                  >
                    {crumb.label}
                  </Link>
                ) : (
                  <span
                    className="font-medium text-ink-800"
                    aria-current={isLast ? "page" : undefined}
                  >
                    {crumb.label}
                  </span>
                )}
              </li>
            );
          })}
        </ol>
      </Container>
    </nav>
  );
}
