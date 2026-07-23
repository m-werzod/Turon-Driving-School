import { ArrowRight, Check } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Section } from "@/components/ui/section";
import { buttonClasses } from "@/components/ui/button";
import { Reveal } from "@/components/ui/reveal";
import type { Locale } from "@/i18n/routing";

/**
 * Autodrome storytelling section (brief: "Create premium storytelling
 * sections" for video content). Full-bleed autoplay showcase clip paired
 * with an editorial text column — the training-ground trust signal gets its
 * own moment instead of a plain feature-grid entry.
 */
export async function AutodromeStory({ locale }: { locale: Locale }) {
  const t = await getTranslations({ locale, namespace: "home.autodrome" });
  const bullets = [t("bullet1"), t("bullet2"), t("bullet3")];

  return (
    <Section bleed className="overflow-hidden bg-ink-950">
      <div className="grid grid-cols-1 items-center lg:grid-cols-2">
        <Reveal
          variant="left"
          className="relative aspect-4/5 sm:aspect-16/10 lg:aspect-auto lg:h-160"
        >
          <video
            autoPlay
            muted
            loop
            playsInline
            poster="/assets/videos/posters/vd4.jpg"
            className="absolute inset-0 h-full w-full object-cover"
            aria-hidden="true"
          >
            <source src="/assets/videos/showcase/autodrome-showcase.mp4" type="video/mp4" />
          </video>
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-linear-to-t from-ink-950 via-ink-950/10 to-transparent lg:bg-linear-to-r lg:from-transparent lg:via-transparent lg:to-ink-950"
          />
        </Reveal>

        <div className="relative px-6 py-16 sm:px-12 sm:py-20 lg:px-16 lg:py-0">
          <span className="inline-flex items-center gap-2 rounded-pill bg-accent-500/15 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.14em] text-accent-400 ring-1 ring-inset ring-accent-500/25">
            {t("eyebrow")}
          </span>
          <h2 className="mt-5 text-balance font-display text-3xl font-extrabold leading-[1.08] tracking-tight text-white sm:text-4xl lg:text-5xl">
            {t("title")}
          </h2>
          <p className="mt-5 max-w-lg text-pretty text-base text-white/65 sm:text-lg">
            {t("body")}
          </p>
          <ul className="mt-7 flex flex-col gap-3.5">
            {bullets.map((bullet) => (
              <li key={bullet} className="flex items-start gap-3 text-white/85">
                <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-accent-500/20 text-accent-400">
                  <Check className="size-3.5" aria-hidden="true" />
                </span>
                <span className="text-pretty text-sm sm:text-base">{bullet}</span>
              </li>
            ))}
          </ul>
          <Link href="/gallery" className={buttonClasses({ variant: "primary", size: "lg", className: "mt-9" })}>
            {t("cta")}
            <ArrowRight className="size-5" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </Section>
  );
}
