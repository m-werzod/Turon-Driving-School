import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Section, SectionHeading } from "@/components/ui/section";
import { Reveal } from "@/components/ui/reveal";
import type { Locale } from "@/i18n/routing";

const FLEET = [
  { src: "/assets/photos/vehicles/image.png", w: 1280, h: 960 },
  { src: "/assets/photos/vehicles/image%20copy.png", w: 1280, h: 960 },
  { src: "/assets/photos/vehicles/image%20copy%202.png", w: 640, h: 640 },
  { src: "/assets/photos/vehicles/image%20copy%203.png", w: 960, h: 1280 },
  { src: "/assets/photos/vehicles/image%20copy%204.png", w: 749, h: 1280 },
  { src: "/assets/photos/vehicles/image%20copy%205.png", w: 960, h: 1280 },
];

/** Real training-vehicle fleet — a horizontal scroll-snap strip on mobile. */
export async function VehicleFleet({ locale }: { locale: Locale }) {
  const t = await getTranslations({ locale, namespace: "home.fleet" });

  return (
    <Section className="bg-ink-50/70">
      <SectionHeading eyebrow={t("eyebrow")} title={t("title")} lead={t("subtitle")} />

      <div className="mt-14 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-4 lg:grid lg:grid-cols-6 lg:gap-5 lg:overflow-visible">
        {FLEET.map((photo, index) => (
          <Reveal
            key={photo.src}
            delay={index * 60}
            className="w-[70vw] shrink-0 snap-start sm:w-[42vw] lg:w-auto"
          >
            <div className="group relative aspect-3/4 overflow-hidden rounded-2xl shadow-(--shadow-card)">
              <Image
                src={photo.src}
                alt=""
                width={photo.w}
                height={photo.h}
                sizes="(min-width: 1024px) 16vw, 60vw"
                className="h-full w-full object-cover transition-transform duration-700 ease-premium group-hover:scale-110"
              />
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-linear-to-t from-ink-950/50 via-transparent to-transparent"
              />
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
