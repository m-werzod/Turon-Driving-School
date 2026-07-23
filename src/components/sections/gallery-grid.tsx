"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { Play } from "lucide-react";
import { useTranslations } from "next-intl";
import { Reveal } from "@/components/ui/reveal";
import { Lightbox } from "./lightbox";
import { cn } from "@/lib/cn";
import type { AlbumKind } from "@/content/types";

export interface FlatMediaItem {
  id: string;
  src: string;
  poster?: string;
  video?: boolean;
  alt: string;
  width: number;
  height: number;
  kind: AlbumKind;
}

export function GalleryGrid({
  items,
  kinds,
  filterLabels,
}: {
  items: FlatMediaItem[];
  kinds: AlbumKind[];
  filterLabels: Record<"all" | AlbumKind, string>;
}) {
  const t = useTranslations("galleryPage");
  const [active, setActive] = useState<"all" | AlbumKind>("all");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const filtered = useMemo(
    () => (active === "all" ? items : items.filter((item) => item.kind === active)),
    [items, active],
  );

  return (
    <div>
      <div className="flex flex-wrap items-center justify-center gap-2">
        <FilterPill
          active={active === "all"}
          onClick={() => setActive("all")}
          label={filterLabels.all}
        />
        {kinds.map((kind) => (
          <FilterPill
            key={kind}
            active={active === kind}
            onClick={() => setActive(kind)}
            label={filterLabels[kind]}
          />
        ))}
      </div>

      <p className="mt-6 text-center text-sm font-medium text-ink-500">
        {t("itemCount", { count: filtered.length })}
      </p>

      <div className="mt-8 columns-2 gap-4 sm:columns-3 lg:columns-4 lg:gap-5">
        {filtered.map((item, index) => (
          <Reveal
            key={item.id}
            delay={(index % 8) * 40}
            className="mb-4 block w-full break-inside-avoid lg:mb-5"
          >
            <button
              type="button"
              onClick={() => setLightboxIndex(index)}
              className="group relative block w-full overflow-hidden rounded-2xl bg-ink-100 text-left ring-1 ring-ink-200/60 transition-all duration-500 hover:ring-ink-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-500"
            >
              <Image
                src={item.video ? (item.poster ?? item.src) : item.src}
                alt={item.alt}
                width={item.width}
                height={item.height}
                sizes="(min-width: 1024px) 24vw, (min-width: 640px) 32vw, 48vw"
                className="w-full object-cover transition-transform duration-700 ease-premium group-hover:scale-[1.04]"
              />
              <span
                aria-hidden="true"
                className="absolute inset-0 bg-linear-to-t from-ink-950/40 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
              />
              {item.video ? (
                <span className="absolute inset-0 grid place-items-center">
                  <span className="glass-dark grid size-12 place-items-center rounded-full text-white ring-1 ring-inset ring-white/30 transition-transform duration-300 group-hover:scale-110">
                    <Play className="ml-0.5 size-5 fill-white" aria-hidden="true" />
                  </span>
                </span>
              ) : null}
            </button>
          </Reveal>
        ))}
      </div>

      {lightboxIndex !== null ? (
        <Lightbox
          items={filtered}
          index={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
          onNavigate={setLightboxIndex}
        />
      ) : null}
    </div>
  );
}

function FilterPill({
  active,
  onClick,
  label,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-pill px-4 py-2 text-sm font-semibold transition-all duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-500",
        active
          ? "bg-ink-900 text-white shadow-(--shadow-glow-brand)"
          : "bg-ink-100 text-ink-600 hover:bg-ink-200",
      )}
    >
      {label}
    </button>
  );
}
