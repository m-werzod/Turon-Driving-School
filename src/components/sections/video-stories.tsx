import { PlayCircle } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Section } from "@/components/ui/section";
import { buttonClasses } from "@/components/ui/button";
import { LoopingVideo } from "@/components/ui/looping-video";
import type { Locale } from "@/i18n/routing";

/**
 * Full-bleed graduation-footage banner — a distinct beat from the
 * split-layout Autodrome story, centered text over motion for an
 * emotional "real students, real day" moment.
 */
export async function VideoStories({ locale }: { locale: Locale }) {
  const t = await getTranslations({ locale, namespace: "home.videoStories" });

  return (
    <Section bleed className="relative isolate overflow-hidden bg-ink-950">
      <LoopingVideo
        src="/assets/videos/showcase/graduation-showcase.mp4"
        poster="/assets/videos/posters/vdgr.jpg"
        className="absolute inset-0 -z-10 h-full w-full object-cover opacity-70"
        controlClassName="bottom-6 right-6"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-linear-to-t from-ink-950 via-ink-950/60 to-ink-950/40"
      />

      <div className="mx-auto flex min-h-[60vh] max-w-2xl flex-col items-center justify-center gap-5 px-5 py-24 text-center sm:px-8">
        <span className="grid size-16 place-items-center rounded-full bg-white/10 text-white ring-1 ring-inset ring-white/20 backdrop-blur">
          <PlayCircle className="size-8" aria-hidden="true" />
        </span>
        <h2 className="text-balance font-display text-3xl font-extrabold tracking-tight text-white sm:text-5xl">
          {t("title")}
        </h2>
        <p className="text-pretty text-base text-white/70 sm:text-lg">{t("subtitle")}</p>
        <Link href="/gallery" className={buttonClasses({ variant: "glass", size: "lg", className: "mt-3" })}>
          {t("cta")}
        </Link>
      </div>
    </Section>
  );
}
