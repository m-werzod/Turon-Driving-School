import type { Metadata } from "next";
import { Award, Heart, ShieldCheck, Target } from "lucide-react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Container } from "@/components/ui/container";
import { Section, SectionHeading } from "@/components/ui/section";
import { Card } from "@/components/ui/card";
import { LearningProcess } from "@/components/sections/learning-process";
import { AutodromeStory } from "@/components/sections/autodrome-story";
import { VehicleFleet } from "@/components/sections/vehicle-fleet";
import { CtaBand } from "@/components/sections/cta-band";
import { getSettings } from "@/server/content";
import { buildMetadata } from "@/lib/metadata";
import type { Locale } from "@/i18n/routing";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "aboutPage.meta" });
  return buildMetadata({
    title: t("title"),
    description: t("description"),
    href: "/about",
    locale,
  });
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const [settings, t] = await Promise.all([
    getSettings(),
    getTranslations({ locale, namespace: "aboutPage" }),
  ]);

  const numbers = [
    { value: settings.counters.branches, label: t("numbers.branches") },
    {
      value: `${settings.counters.graduates.toLocaleString("ru-RU")}+`,
      label: t("numbers.graduates"),
    },
    { value: `${settings.counters.yearsActive}+`, label: t("numbers.years") },
  ];

  const values = [
    { icon: Heart, title: t("values.v1Title"), body: t("values.v1Body") },
    { icon: ShieldCheck, title: t("values.v2Title"), body: t("values.v2Body") },
    { icon: Target, title: t("values.v3Title"), body: t("values.v3Body") },
  ];

  return (
    <>
      <section className="bg-linear-to-b from-brand-50/60 to-white">
        <Container className="py-14 sm:py-20">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-3xl font-extrabold tracking-tight text-ink-900 sm:text-4xl lg:text-5xl">
              {t("title")}
            </h1>
            <p className="mt-4 text-pretty text-lg text-ink-600">{t("intro")}</p>
          </div>
        </Container>
      </section>

      <Section>
        <div className="mx-auto max-w-3xl space-y-5 text-pretty text-ink-700 sm:text-lg">
          <p>{t("storyP1")}</p>
          <p>{t("storyP2")}</p>
        </div>
      </Section>

      <Section className="bg-ink-900">
        <SectionHeading title={t("numbers.title")} className="[&_h2]:text-white" />
        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-3">
          {numbers.map((number) => (
            <div key={number.label} className="flex flex-col items-center gap-1 text-center">
              <p className="text-4xl font-extrabold text-white sm:text-5xl">{number.value}</p>
              <p className="text-ink-400">{number.label}</p>
            </div>
          ))}
        </div>
      </Section>

      <LearningProcess locale={locale} />

      <AutodromeStory locale={locale} />

      <VehicleFleet locale={locale} />

      <Section className="bg-ink-50/60">
        <SectionHeading title={t("values.title")} />
        <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-3">
          {values.map((value) => (
            <div key={value.title} className="flex flex-col items-center gap-3 text-center">
              <span className="grid size-12 place-items-center rounded-xl bg-white text-brand-600 ring-1 ring-brand-100">
                <value.icon className="size-6" aria-hidden="true" />
              </span>
              <h3 className="font-bold text-ink-900">{value.title}</h3>
              <p className="text-pretty text-sm text-ink-600">{value.body}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* License block renders only when the client provides the number (OPEN_ITEMS #5) */}
      {settings.license ? (
        <Section>
          <Card className="mx-auto flex max-w-2xl flex-col items-center gap-4 p-8 text-center">
            <span className="grid size-12 place-items-center rounded-xl bg-brand-50 text-brand-600">
              <Award className="size-6" aria-hidden="true" />
            </span>
            <h2 className="text-xl font-bold text-ink-900">{t("license.title")}</h2>
            <p className="text-pretty text-ink-600">{t("license.body")}</p>
            <p className="font-mono text-sm font-semibold text-ink-800">
              {settings.license.number}
            </p>
          </Card>
        </Section>
      ) : null}

      <CtaBand locale={locale} />
    </>
  );
}
