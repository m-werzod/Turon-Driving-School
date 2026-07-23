import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Container } from "@/components/ui/container";
import { Card } from "@/components/ui/card";
import { LeadForm } from "@/components/forms/lead-form";
import { getLeadFormOptions } from "@/server/lead-form";
import { buildMetadata } from "@/lib/metadata";
import type { Locale } from "@/i18n/routing";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "registerPage.meta" });
  return buildMetadata({
    title: t("title"),
    description: t("description"),
    href: "/register",
    locale,
  });
}

export default async function RegisterPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const [options, t] = await Promise.all([
    getLeadFormOptions(locale),
    getTranslations({ locale, namespace: "registerPage" }),
  ]);

  const steps = [1, 2, 3].map((n) => ({
    title: t(`steps.s${n}Title`),
    body: t(`steps.s${n}Body`),
  }));

  return (
    <Container className="py-14 sm:py-20">
      <div className="mx-auto max-w-5xl">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:items-start">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-ink-900 sm:text-4xl">
              {t("title")}
            </h1>
            <p className="mt-3 text-pretty text-lg text-ink-600">{t("intro")}</p>
            <div className="mt-8">
              <h2 className="mb-5 text-lg font-bold text-ink-900">{t("steps.title")}</h2>
              <ol className="flex flex-col gap-4">
                {steps.map((step, index) => (
                  <li key={index} className="flex gap-4">
                    <span className="grid size-9 shrink-0 place-items-center rounded-full bg-brand-600 text-sm font-bold text-white">
                      {index + 1}
                    </span>
                    <div>
                      <h3 className="font-bold text-ink-900">{step.title}</h3>
                      <p className="mt-0.5 text-pretty text-sm text-ink-600">{step.body}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </div>

          <Card className="p-6 sm:p-8 lg:sticky lg:top-24">
            <LeadForm options={options} compact />
          </Card>
        </div>
      </div>
    </Container>
  );
}
