import { Phone } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Section } from "@/components/ui/section";
import { buttonClasses } from "@/components/ui/button";
import { getSettings } from "@/server/content";
import { telHref } from "@/lib/phone";
import type { Locale } from "@/i18n/routing";

/**
 * Closing conversion band (TZ §10: every trust page ends in a CTA band).
 * Register + call actions on a brand surface. Server component; pulls the
 * primary phone from settings for the call action.
 */
export async function CtaBand({ locale }: { locale: Locale }) {
  const t = await getTranslations({ locale, namespace: "home.cta" });
  const tNav = await getTranslations({ locale, namespace: "nav" });
  const tCommon = await getTranslations({ locale, namespace: "common" });
  const settings = await getSettings();
  const phone = settings.phones[0];

  return (
    <Section className="bg-brand-700">
      <div className="mx-auto flex max-w-2xl flex-col items-center gap-6 text-center">
        <h2 className="text-balance text-2xl font-bold tracking-tight text-white sm:text-3xl lg:text-4xl">
          {t("title")}
        </h2>
        <p className="text-pretty text-base text-brand-100 sm:text-lg">{t("subtitle")}</p>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Link
            href="/register"
            className={buttonClasses({ variant: "accent", size: "lg" })}
          >
            {tNav("register")}
          </Link>
          {phone ? (
            <a
              href={telHref(phone.number)}
              className="inline-flex h-13 items-center justify-center gap-2 rounded-control bg-brand-600 px-7 text-base font-semibold text-white ring-1 ring-inset ring-brand-400/40 transition-colors hover:bg-brand-500"
            >
              <Phone className="size-5" aria-hidden="true" />
              {tCommon("call")}
            </a>
          ) : null}
        </div>
      </div>
    </Section>
  );
}
