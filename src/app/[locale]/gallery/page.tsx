import type { Metadata } from "next";
import { Images } from "lucide-react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Section, SectionHeading } from "@/components/ui/section";
import { EmptyState } from "@/components/ui/empty-state";
import { CtaBand } from "@/components/sections/cta-band";
import { getGalleryAlbums } from "@/server/content";
import { buildMetadata } from "@/lib/metadata";
import type { Locale } from "@/i18n/routing";

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
  const [albums, t] = await Promise.all([
    getGalleryAlbums(),
    getTranslations({ locale, namespace: "galleryPage" }),
  ]);

  return (
    <>
      <Section>
        <SectionHeading title={t("title")} lead={t("intro")} />
        <div className="mt-12">
          {albums.length > 0 ? (
            // The lightbox gallery grid ships with the media milestone once
            // curated assets exist (docs/OPEN_ITEMS.md #8); until then the
            // designed empty state stands in.
            <p className="text-center text-ink-500">{albums.length}</p>
          ) : (
            <EmptyState icon={Images} title={t("empty.title")} body={t("empty.body")} />
          )}
        </div>
      </Section>

      <CtaBand locale={locale} />
    </>
  );
}
