import { Award, BookOpen, Car, Route, UserPlus, type LucideIcon } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { Section, SectionHeading } from "@/components/ui/section";
import { Reveal } from "@/components/ui/reveal";
import type { Locale } from "@/i18n/routing";

const STEP_ICONS: LucideIcon[] = [UserPlus, BookOpen, Route, Car, Award];

/**
 * "How training works" — reuses the category-detail process copy (same
 * five stages apply platform-wide) so the homepage tells the same story
 * without duplicating translation content.
 */
export async function LearningProcess({ locale }: { locale: Locale }) {
  const t = await getTranslations({ locale, namespace: "categoryDetail.process" });
  const th = await getTranslations({ locale, namespace: "home.process" });

  const steps = [1, 2, 3, 4, 5].map((n) => ({
    title: t(`s${n}Title`),
    body: t(`s${n}Body`),
    icon: STEP_ICONS[n - 1],
  }));

  return (
    <Section>
      <SectionHeading eyebrow={th("eyebrow")} title={t("title")} lead={th("subtitle")} />

      <div className="relative mt-16">
        <div
          aria-hidden="true"
          className="absolute left-6 top-6 hidden h-[calc(100%-3rem)] w-px bg-ink-200 sm:block lg:left-0 lg:right-0 lg:top-8 lg:h-px lg:w-full"
        />
        <ol className="relative grid grid-cols-1 gap-8 sm:gap-10 lg:grid-cols-5 lg:gap-6">
          {steps.map((step, index) => (
            <Reveal key={step.title} delay={index * 80}>
              <li className="flex gap-4 lg:flex-col lg:gap-5">
                <span className="relative grid size-12 shrink-0 place-items-center rounded-2xl bg-ink-900 font-display text-lg font-extrabold text-white shadow-(--shadow-glow-brand)">
                  {index + 1}
                  <step.icon
                    className="absolute -bottom-2 -right-2 size-6 rounded-full bg-accent-500 p-1 text-white ring-4 ring-white"
                    aria-hidden="true"
                  />
                </span>
                <div>
                  <h3 className="font-display text-base font-bold text-ink-900">{step.title}</h3>
                  <p className="mt-1.5 text-pretty text-sm text-ink-600">{step.body}</p>
                </div>
              </li>
            </Reveal>
          ))}
        </ol>
      </div>
    </Section>
  );
}
