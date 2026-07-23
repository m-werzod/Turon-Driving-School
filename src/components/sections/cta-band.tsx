import Image from "next/image";
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
 * Real classroom photo underneath a brand-navy gradient wash — a photo
 * background reads more premium than a flat color fill.
 */
export async function CtaBand({ locale }: { locale: Locale }) {
  const t = await getTranslations({ locale, namespace: "home.cta" });
  const tNav = await getTranslations({ locale, namespace: "nav" });
  const tCommon = await getTranslations({ locale, namespace: "common" });
  const settings = await getSettings();
  const phone = settings.phones[0];

  return (
    <Section bleed className="relative isolate overflow-hidden bg-ink-950">
      <Image
        src="/assets/photos/classrooms/5.png"
        alt=""
        fill
        sizes="100vw"
        className="absolute inset-0 -z-10 object-cover opacity-40"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-linear-to-t from-ink-950 via-ink-950/85 to-brand-950/70"
      />

      <div className="mx-auto flex max-w-2xl flex-col items-center gap-6 px-5 py-20 text-center sm:px-8 sm:py-28">
        <h2 className="text-balance font-display text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl">
          {t("title")}
        </h2>
        <p className="text-pretty text-base text-white/70 sm:text-lg">{t("subtitle")}</p>
        <div className="mt-2 flex flex-col gap-3 sm:flex-row">
          <Link href="/register" className={buttonClasses({ variant: "primary", size: "lg" })}>
            {tNav("register")}
          </Link>
          {phone ? (
            <a href={telHref(phone.number)} className={buttonClasses({ variant: "glass", size: "lg" })}>
              <Phone className="size-5" aria-hidden="true" />
              {tCommon("call")}
            </a>
          ) : null}
        </div>
      </div>
    </Section>
  );
}
