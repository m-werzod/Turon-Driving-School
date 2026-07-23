import type { Metadata } from "next";
import { Clock, Phone } from "lucide-react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Section, SectionHeading } from "@/components/ui/section";
import { Card } from "@/components/ui/card";
import { LeadFormSection } from "@/components/sections/lead-form-section";
import { TelegramIcon, InstagramIcon } from "@/components/ui/brand-icons";
import { getBranches, getSettings } from "@/server/content";
import { buildMetadata } from "@/lib/metadata";
import { formatUzPhone, telHref } from "@/lib/phone";
import type { Locale } from "@/i18n/routing";
import type { ContentLocale } from "@/content/types";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "contactPage.meta" });
  return buildMetadata({
    title: t("title"),
    description: t("description"),
    href: "/contact",
    locale,
  });
}

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const contentLocale = locale as ContentLocale;

  const [settings, branches, t] = await Promise.all([
    getSettings(),
    getBranches(),
    getTranslations({ locale, namespace: "contactPage" }),
  ]);

  return (
    <>
      <Section>
        <SectionHeading title={t("title")} lead={t("intro")} />

        <div className="mt-10 grid grid-cols-1 gap-5 lg:grid-cols-3">
          <Card className="flex flex-col gap-3 p-6">
            <h2 className="text-sm font-semibold text-ink-500">{t("phonesTitle")}</h2>
            {settings.phones.map((phone) => (
              <a
                key={phone.number}
                href={telHref(phone.number)}
                className="inline-flex items-center gap-2 text-lg font-bold text-brand-700 transition-colors hover:text-brand-800"
              >
                <Phone className="size-5" aria-hidden="true" />
                {formatUzPhone(phone.number)}
              </a>
            ))}
          </Card>

          <Card className="flex flex-col gap-3 p-6">
            <h2 className="text-sm font-semibold text-ink-500">{t("socialsTitle")}</h2>
            <div className="flex items-center gap-3">
              <a
                href={settings.telegramUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Telegram"
                className="rounded-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600"
              >
                <TelegramIcon className="size-10" />
              </a>
              <a
                href={settings.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="rounded-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600"
              >
                <InstagramIcon className="size-10" />
              </a>
            </div>
          </Card>

          <Card className="flex flex-col gap-3 p-6">
            <h2 className="flex items-center gap-2 text-sm font-semibold text-ink-500">
              <Clock className="size-4" aria-hidden="true" />
              {t("hoursTitle")}
            </h2>
            <p className="font-medium text-ink-800">{settings.hours[contentLocale]}</p>
          </Card>
        </div>

        <div className="mt-10">
          <h2 className="mb-4 text-lg font-bold text-ink-900">{t("branchesTitle")}</h2>
          <div className="flex flex-wrap gap-3">
            {branches.map((branch) => (
              <Link
                key={branch.slug}
                href={{ pathname: "/branches/[slug]", params: { slug: branch.slug } }}
                className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-ink-800 ring-1 ring-inset ring-ink-200 transition-colors hover:bg-brand-50 hover:text-brand-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600"
              >
                {branch.name[contentLocale]}
              </Link>
            ))}
          </div>
        </div>
      </Section>

      <LeadFormSection
        locale={locale}
        title={t("form.title")}
        subtitle={t("form.subtitle")}
        className="bg-ink-50/60"
      />
    </>
  );
}
