import { CreditCard, MapPin, Route, Users, type LucideIcon } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { Section, SectionHeading } from "@/components/ui/section";
import { Card } from "@/components/ui/card";
import { Reveal } from "@/components/ui/reveal";
import type { Locale } from "@/i18n/routing";

/** "Why Turon" differentiators grid (TZ template T-01). */
export async function WhyGrid({ locale }: { locale: Locale }) {
  const t = await getTranslations({ locale, namespace: "home.why" });

  const items: { icon: LucideIcon; title: string; body: string }[] = [
    { icon: Route, title: t("autodromeTitle"), body: t("autodromeBody") },
    { icon: MapPin, title: t("branchesTitle"), body: t("branchesBody") },
    { icon: Users, title: t("instructorsTitle"), body: t("instructorsBody") },
    { icon: CreditCard, title: t("paymentTitle"), body: t("paymentBody") },
  ];

  return (
    <Section className="bg-ink-50/70">
      <SectionHeading eyebrow={t("eyebrow")} title={t("title")} />
      <div className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((item, index) => (
          <Reveal key={item.title} delay={index * 90}>
            <Card interactive className="flex h-full flex-col gap-5 p-7">
              <span className="grid size-14 place-items-center rounded-2xl bg-brand-900 text-white shadow-(--shadow-glow-brand)">
                <item.icon className="size-6" aria-hidden="true" />
              </span>
              <div>
                <h3 className="font-display text-lg font-bold text-ink-900">{item.title}</h3>
                <p className="mt-2 text-pretty text-sm text-ink-600">{item.body}</p>
              </div>
            </Card>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
