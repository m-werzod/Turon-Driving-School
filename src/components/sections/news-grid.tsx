"use client";

import { useState } from "react";
import Image from "next/image";
import { Play } from "lucide-react";
import { Reveal } from "@/components/ui/reveal";
import { Card } from "@/components/ui/card";
import { Lightbox } from "./lightbox";
import type { FlatMediaItem } from "./gallery-grid";

export interface NewsCardData {
  id: string;
  title: string;
  body: string;
  media: FlatMediaItem;
}

/**
 * News feed grid — one card per post (title, short body, media thumbnail).
 * Reuses the Gallery's Lightbox for the full-screen media view so opening a
 * video behaves identically everywhere on the site, but is otherwise its
 * own layout: cards carry real text, not just a media tile, and there is no
 * kind-filter bar (a news feed doesn't need one).
 */
export function NewsGrid({ posts }: { posts: NewsCardData[] }) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const items = posts.map((post) => post.media);

  return (
    <div className="mx-auto grid max-w-3xl grid-cols-1 gap-6 sm:grid-cols-2">
      {posts.map((post, index) => (
        <Reveal key={post.id} delay={(index % 4) * 60}>
          <Card interactive className="h-full overflow-hidden">
            <button
              type="button"
              onClick={() => setLightboxIndex(index)}
              className="group block w-full text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-500"
            >
              <div className="relative aspect-video w-full overflow-hidden bg-ink-100">
                <Image
                  src={post.media.video ? (post.media.poster ?? post.media.src) : post.media.src}
                  alt={post.media.alt}
                  fill
                  sizes="(min-width: 640px) 40vw, 90vw"
                  className="object-cover transition-transform duration-700 ease-premium group-hover:scale-[1.04]"
                />
                <span
                  aria-hidden="true"
                  className="absolute inset-0 bg-linear-to-t from-ink-950/40 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                />
                {post.media.video ? (
                  <span className="absolute inset-0 grid place-items-center">
                    <span className="glass-dark grid size-12 place-items-center rounded-full text-white ring-1 ring-inset ring-white/30 transition-transform duration-300 group-hover:scale-110">
                      <Play className="ml-0.5 size-5 fill-white" aria-hidden="true" />
                    </span>
                  </span>
                ) : null}
              </div>
              <div className="p-5">
                <h2 className="font-display text-lg font-bold text-ink-900">{post.title}</h2>
                <p className="mt-1.5 text-pretty text-sm text-ink-600">{post.body}</p>
              </div>
            </button>
          </Card>
        </Reveal>
      ))}

      {lightboxIndex !== null ? (
        <Lightbox
          items={items}
          index={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
          onNavigate={setLightboxIndex}
        />
      ) : null}
    </div>
  );
}
