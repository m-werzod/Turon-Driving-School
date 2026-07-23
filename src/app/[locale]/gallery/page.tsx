import type { Metadata } from "next";
import { Images } from "lucide-react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Section, SectionHeading } from "@/components/ui/section";
import { EmptyState } from "@/components/ui/empty-state";
import { CtaBand } from "@/components/sections/cta-band";
import { GalleryGrid, type FlatMediaItem } from "@/components/sections/gallery-grid";
import { getGalleryAlbums } from "@/server/content";
import { buildMetadata } from "@/lib/metadata";
import type { Locale } from "@/i18n/routing";
import type { AlbumKind, ContentLocale } from "@/content/types";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "galleryPage.meta" });
  return buildMetadata({
    title: t("title"),
    description: t("description"),
    href: "/gallery",
    locale,
  });
}

export default async function GalleryPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const contentLocale = locale as ContentLocale;

  const [albums, t, tFilters] = await Promise.all([
    getGalleryAlbums(),
    getTranslations({ locale, namespace: "galleryPage" }),
    getTranslations({ locale, namespace: "galleryPage.filters" }),
  ]);

  const items: FlatMediaItem[] = albums.flatMap((album) =>
    album.items.map((media, index) => ({
      id: `${album.id}-${index}`,
      src: media.src,
      poster: media.poster,
      video: media.video,
      alt: media.alt[contentLocale],
      width: media.width,
      height: media.height,
      kind: album.kind,
    })),
  );

  const kinds = Array.from(new Set(albums.map((album) => album.kind)));
  const filterLabels = {
    all: tFilters("all"),
    ...Object.fromEntries(kinds.map((kind) => [kind, tFilters(kind)])),
  } as Record<"all" | AlbumKind, string>;

  return (
    <>
      <Section className="pb-0">
        <SectionHeading eyebrow={t("title")} title={t("title")} lead={t("intro")} />
      </Section>

      <Section className="pt-10">
        {items.length > 0 ? (
          <GalleryGrid items={items} kinds={kinds} filterLabels={filterLabels} />
        ) : (
          <EmptyState icon={Images} title={t("empty.title")} body={t("empty.body")} />
        )}
      </Section>

      <CtaBand locale={locale} />
    </>
  );
}
