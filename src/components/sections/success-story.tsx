import Image from "next/image";
import { ArrowRight, GraduationCap, MapPin, ShieldCheck } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Section, SectionHeading } from "@/components/ui/section";
import { buttonClasses } from "@/components/ui/button";
import { Reveal } from "@/components/ui/reveal";
import { getSettings } from "@/server/content";
import type { Locale } from "@/i18n/routing";

/**
 * Student-success storytelling section (brief: certificates, graduation
 * moments, pass numbers). An asymmetric photo collage of real certificate
 * and graduation shots next to the trust numbers already in settings — no
 * fabricated pass-rate percentage, only figures the content model backs.
 */
export async function SuccessStory({ locale }: { locale: Locale }) {
  const t = await getTranslations({ locale, namespace: "home.success" });
  const settings = await getSettings();

  const stats = [
    { icon: GraduationCap, value: `${settings.counters.graduates.toLocaleString("ru-RU")}+`, label: t("statGraduates") },
    { icon: MapPin, value: String(settings.counters.branches), label: t("statBranches") },
    { icon: ShieldCheck, value: `${settings.counters.yearsActive}+`, label: t("statYears") },
  ];

  return (
    <Section>
      <SectionHeading eyebrow={t("eyebrow")} title={t("title")} lead={t("subtitle")} />

      <div className="mt-16 grid grid-cols-1 gap-10 lg:grid-cols-12 lg:items-center lg:gap-8">
        <div className="lg:col-span-5 lg:order-2">
          <Reveal
            variant="scale"
            className="relative mx-auto grid aspect-square max-w-md grid-cols-5 grid-rows-5 gap-3 sm:gap-4"
          >
            <div className="relative col-span-3 row-span-3 overflow-hidden rounded-2xl shadow-(--shadow-card-hover)">
              <Image
                src="/assets/photos/certificates/image.png"
                alt=""
                fill
                sizes="(min-width: 1024px) 20vw, 45vw"
                className="object-cover"
              />
            </div>
            <div className="relative col-span-2 col-start-4 row-span-2 overflow-hidden rounded-2xl shadow-(--shadow-card)">
              <Image
                src="/assets/photos/certificates/image%20copy%203.png"
                alt=""
                fill
                sizes="(min-width: 1024px) 14vw, 30vw"
                className="object-cover"
              />
            </div>
            <div className="relative col-span-2 col-start-4 row-span-2 row-start-3 overflow-hidden rounded-2xl shadow-(--shadow-card)">
              <Image
                src="/assets/photos/students/image%20copy%202.png"
                alt=""
                fill
                sizes="(min-width: 1024px) 14vw, 30vw"
                className="object-cover"
              />
            </div>
            <div className="relative col-span-3 row-span-2 row-start-4 overflow-hidden rounded-2xl shadow-(--shadow-card)">
              <Image
                src="/assets/photos/certificates/image%20copy%206.png"
                alt=""
                fill
                sizes="(min-width: 1024px) 20vw, 45vw"
                className="object-cover"
              />
            </div>
            <div
              aria-hidden="true"
              className="absolute -inset-6 -z-10 rounded-4xl bg-brand-50/60 blur-2xl"
            />
          </Reveal>
        </div>

        <div className="flex flex-col items-start gap-8 lg:col-span-7 lg:order-1">
          <div className="grid w-full grid-cols-3 gap-3 sm:gap-5">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="flex flex-col items-start gap-3 rounded-2xl bg-ink-50 p-5 ring-1 ring-ink-100 sm:p-6"
              >
                <span className="grid size-10 place-items-center rounded-xl bg-white text-accent-600 shadow-(--shadow-card)">
                  <stat.icon className="size-5" aria-hidden="true" />
                </span>
                <div className="flex flex-col">
                  <span className="font-display text-2xl font-extrabold text-ink-900 sm:text-3xl">
                    {stat.value}
                  </span>
                  <span className="text-xs font-medium text-ink-500 sm:text-sm">{stat.label}</span>
                </div>
              </div>
            ))}
          </div>

          <Link href="/gallery" className={buttonClasses({ variant: "dark", size: "lg" })}>
            {t("cta")}
            <ArrowRight className="size-5" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </Section>
  );
}
