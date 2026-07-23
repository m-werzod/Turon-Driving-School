import type { Metadata } from "next";
import { HelpCircle } from "lucide-react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Section, SectionHeading } from "@/components/ui/section";
import { Card } from "@/components/ui/card";
import { Reveal } from "@/components/ui/reveal";
import { CategoryCard } from "@/components/sections/category-card";
import { CtaBand } from "@/components/sections/cta-band";
import { getCategories } from "@/server/content";
import { buildMetadata } from "@/lib/metadata";
import type { Locale } from "@/i18n/routing";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "categoriesPage.meta" });
  return buildMetadata({
    title: t("title"),
    description: t("description"),
    href: "/categories",
    locale,
  });
}

export default async function CategoriesPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const [categories, t] = await Promise.all([
    getCategories(),
    getTranslations({ locale, namespace: "categoriesPage" }),
  ]);

  return (
    <>
      <Section>
        <SectionHeading title={t("title")} lead={t("intro")} />
        <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category, index) => (
            <Reveal key={category.slug} delay={(index % 3) * 60}>
              <CategoryCard category={category} />
            </Reveal>
          ))}
        </div>

        <Card className="mt-10 flex flex-col gap-4 bg-brand-50/50 p-6 sm:flex-row sm:items-start sm:p-8">
          <span className="grid size-12 shrink-0 place-items-center rounded-xl bg-white text-brand-600 ring-1 ring-brand-100">
            <HelpCircle className="size-6" aria-hidden="true" />
          </span>
          <div>
            <h2 className="text-lg font-bold text-ink-900">{t("which.title")}</h2>
            <p className="mt-2 text-pretty text-ink-600">{t("which.body")}</p>
          </div>
        </Card>
      </Section>

      <CtaBand locale={locale} />
    </>
  );
}
