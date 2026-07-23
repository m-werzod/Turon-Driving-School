import { CreditCard, MapPin, Route, Users, type LucideIcon } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Section, SectionHeading } from "@/components/ui/section";
import { Card } from "@/components/ui/card";
import { Reveal } from "@/components/ui/reveal";
import type { Locale } from "@/i18n/routing";

type WhyItemHref = Parameters<typeof Link>[0]["href"];

/** "Why Turon" differentiators grid (TZ template T-01) — each card links to the page that backs its claim. */
export async function WhyGrid({ locale }: { locale: Locale }) {
  const t = await getTranslations({ locale, namespace: "home.why" });

  const items: { icon: LucideIcon; title: string; body: string; href: WhyItemHref }[] = [
    {
      icon: Route,
      title: t("autodromeTitle"),
      body: t("autodromeBody"),
      href: { pathname: "/branches/[slug]", params: { slug: "buloq-avtodrom" } },
    },
    { icon: MapPin, title: t("branchesTitle"), body: t("branchesBody"), href: "/branches" },
    { icon: Users, title: t("instructorsTitle"), body: t("instructorsBody"), href: "/about" },
    { icon: CreditCard, title: t("paymentTitle"), body: t("paymentBody"), href: "/pricing" },
  ];

  return (
    <Section className="bg-ink-50/70">
      <SectionHeading eyebrow={t("eyebrow")} title={t("title")} />
      <div className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((item, index) => (
          <Reveal key={item.title} delay={index * 90}>
            <Card interactive className="h-full">
              <Link
                href={item.href}
                className="flex h-full flex-col gap-5 p-7 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-500"
              >
                <span className="grid size-14 place-items-center rounded-2xl bg-brand-900 text-white shadow-(--shadow-glow-brand)">
                  <item.icon className="size-6" aria-hidden="true" />
                </span>
                <div>
                  <h3 className="font-display text-lg font-bold text-ink-900">{item.title}</h3>
                  <p className="mt-2 text-pretty text-sm text-ink-600">{item.body}</p>
                </div>
              </Link>
            </Card>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
