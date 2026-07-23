import type { Metadata } from "next";
import { Phone } from "lucide-react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Section, SectionHeading } from "@/components/ui/section";
import { Card } from "@/components/ui/card";
import { Accordion } from "@/components/ui/accordion";
import { TelegramIcon } from "@/components/ui/brand-icons";
import { JsonLd } from "@/components/seo/json-ld";
import { getFaqItems, getSettings } from "@/server/content";
import { buildMetadata } from "@/lib/metadata";
import { faqSchema } from "@/lib/schema";
import { telHref } from "@/lib/phone";
import type { Locale } from "@/i18n/routing";
import type { ContentLocale, FaqTopic } from "@/content/types";

const TOPIC_ORDER: FaqTopic[] = [
  "enrollment",
  "payment",
  "process",
  "exams",
  "documents",
];

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "faqPage.meta" });
  return buildMetadata({
    title: t("title"),
    description: t("description"),
    href: "/faq",
    locale,
  });
}

export default async function FaqPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const contentLocale = locale as ContentLocale;

  const [items, settings, t] = await Promise.all([
    getFaqItems(),
    getSettings(),
    getTranslations({ locale, namespace: "faqPage" }),
  ]);

  const phone = settings.phones[0];

  return (
    <>
      <Section>
        <SectionHeading title={t("title")} lead={t("intro")} />

        <div className="mx-auto mt-10 flex max-w-3xl flex-col gap-8">
          {TOPIC_ORDER.map((topic) => {
            const topicItems = items.filter((item) => item.topic === topic);
            if (topicItems.length === 0) return null;
            return (
              <div key={topic}>
                <h2 className="mb-4 text-lg font-bold text-ink-900">{t(`topics.${topic}`)}</h2>
                <Accordion
                  items={topicItems.map((item) => ({
                    id: item.id,
                    question: item.question[contentLocale],
                    answer: item.answer[contentLocale],
                  }))}
                />
              </div>
            );
          })}
        </div>

        <Card className="mx-auto mt-12 flex max-w-3xl flex-col items-center gap-5 bg-brand-50/50 p-8 text-center">
          <div>
            <h2 className="text-xl font-bold text-ink-900">{t("still.title")}</h2>
            <p className="mt-2 text-pretty text-ink-600">{t("still.body")}</p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            {phone ? (
              <a
                href={telHref(phone.number)}
                className="inline-flex items-center justify-center gap-2 rounded-control bg-brand-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-700"
              >
                <Phone className="size-5" aria-hidden="true" />
                {phone.label[contentLocale]}
              </a>
            ) : null}
            <a
              href={settings.telegramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-control bg-white px-6 py-3 text-sm font-semibold text-ink-800 ring-1 ring-inset ring-ink-200 transition-colors hover:bg-ink-50"
            >
              <TelegramIcon className="size-5" />
              {t("still.telegram")}
            </a>
          </div>
        </Card>
      </Section>

      <JsonLd data={faqSchema(items, locale)} />
    </>
  );
}
