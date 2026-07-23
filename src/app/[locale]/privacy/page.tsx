import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Container } from "@/components/ui/container";
import { buildMetadata } from "@/lib/metadata";
import type { Locale } from "@/i18n/routing";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "privacyPage.meta" });
  return buildMetadata({
    title: t("title"),
    description: t("description"),
    href: "/privacy",
    locale,
  });
}

export default async function PrivacyPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "privacyPage" });

  const sections = ["collect", "use", "store", "rights", "contact"] as const;

  return (
    <Container className="py-14 sm:py-20">
      <article className="mx-auto max-w-3xl">
        <h1 className="text-3xl font-extrabold tracking-tight text-ink-900 sm:text-4xl">
          {t("title")}
        </h1>
        <p className="mt-4 text-pretty text-lg text-ink-600">{t("intro")}</p>

        <div className="mt-10 flex flex-col gap-8">
          {sections.map((section) => (
            <section key={section}>
              <h2 className="text-xl font-bold text-ink-900">{t(`${section}.title`)}</h2>
              <p className="mt-2 text-pretty text-ink-700">{t(`${section}.body`)}</p>
            </section>
          ))}
        </div>
      </article>
    </Container>
  );
}
