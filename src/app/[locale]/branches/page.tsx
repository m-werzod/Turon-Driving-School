import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Section, SectionHeading } from "@/components/ui/section";
import { Reveal } from "@/components/ui/reveal";
import { BranchCard } from "@/components/sections/branch-card";
import { CtaBand } from "@/components/sections/cta-band";
import { getBranches } from "@/server/content";
import { buildMetadata } from "@/lib/metadata";
import type { Locale } from "@/i18n/routing";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "branchesPage.meta" });
  return buildMetadata({
    title: t("title"),
    description: t("description"),
    href: "/branches",
    locale,
  });
}

export default async function BranchesPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const [branches, t] = await Promise.all([
    getBranches(),
    getTranslations({ locale, namespace: "branchesPage" }),
  ]);

  return (
    <>
      <Section>
        <SectionHeading title={t("title")} lead={t("intro")} />
        <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {branches.map((branch, index) => (
            <Reveal key={branch.slug} delay={(index % 3) * 60}>
              <BranchCard branch={branch} />
            </Reveal>
          ))}
        </div>
      </Section>

      <CtaBand locale={locale} />
    </>
  );
}
