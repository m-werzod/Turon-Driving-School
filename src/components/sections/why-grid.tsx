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
    <Section className="bg-ink-50/60">
      <SectionHeading title={t("title")} />
      <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((item, index) => (
          <Reveal key={item.title} delay={index * 60}>
            <Card className="flex h-full flex-col gap-4 p-6">
              <span className="grid size-12 place-items-center rounded-xl bg-brand-600 text-white">
                <item.icon className="size-6" aria-hidden="true" />
              </span>
              <h3 className="text-base font-bold text-ink-900">{item.title}</h3>
              <p className="text-pretty text-sm text-ink-600">{item.body}</p>
            </Card>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
