import { ArrowRight, MapPin, Phone } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatUzPhone, telHref } from "@/lib/phone";
import type { Branch, ContentLocale } from "@/content/types";

/** Branch card for the hub and Home preview (TZ templates T-01/T-06). */
export function BranchCard({ branch }: { branch: Branch }) {
  const locale = useLocale() as ContentLocale;
  const t = useTranslations("branchDetail");
  const phone = branch.phones[0];

  return (
    <Card className="flex h-full flex-col p-6">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-lg font-bold text-ink-900">{branch.name[locale]}</h3>
          <p className="text-sm text-ink-500">{branch.district[locale]}</p>
        </div>
        {branch.hasAutodrome ? <Badge tone="brand">{t("autodromeBadge")}</Badge> : null}
      </div>

      <p className="mt-3 flex items-start gap-2 text-pretty text-sm text-ink-600">
        <MapPin className="mt-0.5 size-4 shrink-0 text-ink-400" aria-hidden="true" />
        {branch.landmark[locale]}
      </p>

      <div className="mt-auto flex items-center justify-between gap-3 pt-5">
        {phone ? (
          <a
            href={telHref(phone)}
            className="inline-flex items-center gap-2 text-sm font-semibold text-brand-700 transition-colors hover:text-brand-800"
          >
            <Phone className="size-4" aria-hidden="true" />
            {formatUzPhone(phone)}
          </a>
        ) : (
          <span />
        )}
        <Link
          href={{ pathname: "/branches/[slug]", params: { slug: branch.slug } }}
          aria-label={branch.name[locale]}
          className="inline-flex items-center gap-1 text-sm font-semibold text-ink-600 transition-colors hover:text-brand-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600"
        >
          {t("directionsTitle")}
          <ArrowRight className="size-4" aria-hidden="true" />
        </Link>
      </div>
    </Card>
  );
}
