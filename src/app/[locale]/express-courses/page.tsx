import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Section, SectionHeading } from "@/components/ui/section";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckList, NumberedSteps } from "@/components/sections/feature-list";
import { LeadFormSection } from "@/components/sections/lead-form-section";
import { getExpressCourses } from "@/server/content";
import { buildMetadata } from "@/lib/metadata";
import { formatUzs } from "@/lib/format";
import type { Locale } from "@/i18n/routing";
import type { ContentLocale } from "@/content/types";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "expressPage.meta" });
  return buildMetadata({
    title: t("title"),
    description: t("description"),
    href: "/express-courses",
    locale,
  });
}

export default async function ExpressPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const contentLocale = locale as ContentLocale;

  const [courses, t] = await Promise.all([
    getExpressCourses(),
    getTranslations({ locale, namespace: "expressPage" }),
  ]);

  const steps = [1, 2, 3].map((n) => ({
    title: t(`how.s${n}Title`),
    body: t(`how.s${n}Body`),
  }));

  return (
    <>
      <Section>
        <SectionHeading title={t("title")} lead={t("intro")} />
        <div className="mx-auto mt-10 grid max-w-4xl grid-cols-1 gap-6 md:grid-cols-2">
          {courses.map((course) => (
            <Card key={course.slug} className="flex flex-col p-6 sm:p-8">
              <Badge tone="brand">{course.audience[contentLocale]}</Badge>
              <h2 className="mt-4 text-xl font-bold text-ink-900">{course.name[contentLocale]}</h2>
              <p className="mt-2 text-pretty text-ink-600">{course.description[contentLocale]}</p>
              <div className="mt-5">
                <CheckList items={course.features[contentLocale]} />
              </div>
              <div className="mt-6 flex items-end justify-between border-t border-ink-100 pt-5">
                <div>
                  <p className="text-xs font-semibold text-ink-500">{t("durationLabel")}</p>
                  <p className="font-semibold text-ink-800">{course.duration[contentLocale]}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-semibold text-ink-500">{t("priceLabel")}</p>
                  <p className="text-2xl font-bold text-ink-900">
                    {formatUzs(course.price, contentLocale)}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </Section>

      <Section className="bg-ink-50/60">
        <SectionHeading title={t("how.title")} />
        <div className="mx-auto mt-10 max-w-4xl">
          <NumberedSteps steps={steps} />
        </div>
      </Section>

      <LeadFormSection
        locale={locale}
        title={t("form.title")}
        subtitle={t("form.subtitle")}
        preselect={{ courseType: "express", courseSlug: courses[0]?.slug ?? "theory" }}
      />
    </>
  );
}
