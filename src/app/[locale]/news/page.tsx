import type { Metadata } from "next";
import { Newspaper } from "lucide-react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Section, SectionHeading } from "@/components/ui/section";
import { EmptyState } from "@/components/ui/empty-state";
import { CtaBand } from "@/components/sections/cta-band";
import { NewsGrid, type NewsCardData } from "@/components/sections/news-grid";
import type { AlbumKind, ContentLocale } from "@/content/types";
import { getNewsPosts } from "@/server/content";
import { buildMetadata } from "@/lib/metadata";
import type { Locale } from "@/i18n/routing";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "newsPage.meta" });
  return buildMetadata({
    title: t("title"),
    description: t("description"),
    href: "/news",
    locale,
  });
}

/** News media doesn't belong to any Gallery kind; "events" is the closest fit. */
const NEWS_MEDIA_KIND: AlbumKind = "events";

export default async function NewsPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const contentLocale = locale as ContentLocale;

  const [posts, t] = await Promise.all([
    getNewsPosts(),
    getTranslations({ locale, namespace: "newsPage" }),
  ]);

  const cards: NewsCardData[] = posts.map((post) => ({
    id: post.id,
    title: post.title[contentLocale],
    body: post.body[contentLocale],
    media: {
      id: post.id,
      src: post.media.src,
      poster: post.media.poster,
      video: post.media.video,
      alt: post.media.alt[contentLocale],
      width: post.media.width,
      height: post.media.height,
      kind: NEWS_MEDIA_KIND,
    },
  }));

  return (
    <>
      <Section className="pb-0">
        <SectionHeading eyebrow={t("title")} title={t("title")} lead={t("intro")} />
      </Section>

      <Section className="pt-10">
        {cards.length > 0 ? (
          <NewsGrid posts={cards} />
        ) : (
          <EmptyState icon={Newspaper} title={t("empty.title")} body={t("empty.body")} />
        )}
      </Section>

      <CtaBand locale={locale} />
    </>
  );
}
