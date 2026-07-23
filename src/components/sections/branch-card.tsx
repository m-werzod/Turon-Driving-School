import Image from "next/image";
import { ArrowRight, Clock, MapPin, Phone, Route } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatUzPhone, telHref } from "@/lib/phone";
import type { Branch, ContentLocale } from "@/content/types";

/**
 * Representative facility photo per branch. We don't have a photo taken at
 * each specific address, so branches rotate through real autodrome /
 * classroom / vehicle shots — authentic Turon photos, not stock imagery.
 */
const FACILITY_PHOTOS = [
  { src: "/assets/photos/classrooms/2.png", w: 1280, h: 960 },
  { src: "/assets/photos/vehicles/image.png", w: 1280, h: 960 },
  { src: "/assets/photos/classrooms/image3.png", w: 1280, h: 960 },
  { src: "/assets/photos/vehicles/image%20copy.png", w: 1280, h: 960 },
  { src: "/assets/photos/classrooms/image4.png", w: 1280, h: 960 },
  { src: "/assets/photos/vehicles/image%20copy%203.png", w: 960, h: 1280 },
];
const AUTODROME_PHOTO = { src: "/assets/photos/autodrome/fullshown.png", w: 1024, h: 1024 };

function facilityPhoto(branch: Branch, index: number) {
  return branch.hasAutodrome ? AUTODROME_PHOTO : FACILITY_PHOTOS[index % FACILITY_PHOTOS.length];
}

/** Branch card for the hub and Home preview (TZ templates T-01/T-06). */
export function BranchCard({ branch, index = 0 }: { branch: Branch; index?: number }) {
  const locale = useLocale() as ContentLocale;
  const t = useTranslations("branchDetail");
  const phone = branch.phones[0];
  const photo = facilityPhoto(branch, index);

  return (
    <Card interactive className="group flex h-full flex-col overflow-hidden">
      <div className="relative aspect-16/10 overflow-hidden">
        <Image
          src={photo.src}
          alt=""
          width={photo.w}
          height={photo.h}
          sizes="(min-width: 1024px) 30vw, 90vw"
          className="h-full w-full object-cover transition-transform duration-700 ease-premium group-hover:scale-[1.06]"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-linear-to-t from-ink-950/70 via-ink-950/0 to-transparent"
        />
        {branch.hasAutodrome ? (
          <Badge tone="accent" className="absolute left-4 top-4">
            <Route className="size-3.5" aria-hidden="true" />
            {t("autodromeBadge")}
          </Badge>
        ) : null}
        <div className="absolute inset-x-4 bottom-4">
          <h3 className="font-display text-lg font-bold text-white">{branch.name[locale]}</h3>
          <p className="text-sm text-white/70">{branch.district[locale]}</p>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-6">
        <p className="flex items-start gap-2 text-pretty text-sm text-ink-600">
          <MapPin className="mt-0.5 size-4 shrink-0 text-ink-400" aria-hidden="true" />
          {branch.landmark[locale]}
        </p>
        <p className="mt-2 flex items-center gap-2 text-sm text-ink-500">
          <Clock className="size-4 shrink-0 text-ink-400" aria-hidden="true" />
          {branch.hours[locale]}
        </p>

        <div className="mt-auto flex items-center justify-between gap-3 pt-6">
          {phone ? (
            <a
              href={telHref(phone)}
              className="inline-flex items-center gap-2 text-sm font-semibold text-ink-900 transition-colors hover:text-accent-600"
            >
              <Phone className="size-4 text-accent-500" aria-hidden="true" />
              {formatUzPhone(phone)}
            </a>
          ) : (
            <span />
          )}
          <Link
            href={{ pathname: "/branches/[slug]", params: { slug: branch.slug } }}
            aria-label={branch.name[locale]}
            className="inline-flex items-center gap-1 text-sm font-semibold text-ink-600 transition-colors hover:text-accent-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-500"
          >
            {t("directionsTitle")}
            <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </Card>
  );
}
