import type { Metadata } from "next";
import { GraduationCap, MapPin, TrendingUp } from "lucide-react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Section, SectionHeading } from "@/components/ui/section";
import { Card } from "@/components/ui/card";
import { Reveal } from "@/components/ui/reveal";
import { EmptyState } from "@/components/ui/empty-state";
import { CtaBand } from "@/components/sections/cta-band";
import { getBranches, getResultPosts, getSettings } from "@/server/content";
import { buildMetadata } from "@/lib/metadata";
import { formatMonth } from "@/lib/format";
import type { Locale } from "@/i18n/routing";
import type { ContentLocale } from "@/content/types";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "resultsPage.meta" });
  return buildMetadata({
    title: t("title"),
    description: t("description"),
    href: "/results",
    locale,
  });
}

export default async function ResultsPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const contentLocale = locale as ContentLocale;

  const [posts, branches, settings, t] = await Promise.all([
    getResultPosts(),
    getBranches(),
    getSettings(),
    getTranslations({ locale, namespace: "resultsPage" }),
  ]);

  const branchName = (branchSlug: string) =>
    branches.find((branch) => branch.slug === branchSlug)?.name[contentLocale] ?? "";

  const counters = [
    { icon: MapPin, value: settings.counters.branches, label: t("counters.branches") },
    {
      icon: GraduationCap,
      value: `${settings.counters.graduates.toLocaleString("ru-RU")}+`,
      label: t("counters.graduates"),
    },
    { icon: TrendingUp, value: `${settings.counters.yearsActive}+`, label: t("counters.years") },
  ];

  return (
    <>
      <Section>
        <SectionHeading title={t("title")} lead={t("intro")} />

        <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-3">
          {counters.map((counter) => (
            <Card key={counter.label} className="flex flex-col items-center gap-2 p-8 text-center">
              <counter.icon className="size-8 text-brand-600" aria-hidden="true" />
              <p className="text-3xl font-extrabold text-ink-900">{counter.value}</p>
              <p className="text-sm text-ink-500">{counter.label}</p>
            </Card>
          ))}
        </div>

        {posts.length > 0 ? (
          <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post, index) => (
              <Reveal key={post.id} delay={(index % 3) * 60}>
                <Card className="flex h-full flex-col p-6">
                  <p className="text-sm font-semibold text-brand-600">
                    {formatMonth(post.month, contentLocale)}
                  </p>
                  <p className="mt-1 flex items-center gap-1.5 text-sm text-ink-500">
                    <MapPin className="size-4 text-ink-400" aria-hidden="true" />
                    {branchName(post.branchSlug)}
                  </p>
                  <p className="mt-4 text-4xl font-extrabold text-ink-900">{post.passedCount}</p>
                  <p className="mt-1 text-pretty text-sm text-ink-600">
                    {t("passed", { count: post.passedCount })}
                  </p>
                  {post.note ? (
                    <p className="mt-3 text-pretty text-sm text-ink-500">{post.note[contentLocale]}</p>
                  ) : null}
                </Card>
              </Reveal>
            ))}
          </div>
        ) : (
          <div className="mt-12">
            <EmptyState
              icon={GraduationCap}
              title={t("empty.title")}
              body={t("empty.body")}
            />
          </div>
        )}
      </Section>

      <CtaBand locale={locale} />
    </>
  );
}
