"use client";

import { Phone } from "lucide-react";
import { useTranslations } from "next-intl";
import type { NavPhone } from "./nav-data";
import { formatUzPhone, telHref } from "@/lib/phone";

/**
 * Persistent floating call button — a direct `tel:` link, not a menu or
 * sheet, so a tap goes straight to the dialer. Sits above the mobile sticky
 * action bar (which itself only appears after scroll) so the two never
 * overlap, and stays visible on desktop too since nothing else there offers
 * a one-tap call. The periodic "jump" draws the eye without being a
 * continuous, distracting bounce.
 */
export function FloatingCallButton({ phones }: { phones: NavPhone[] }) {
  const t = useTranslations("actionBar");
  const phone = phones[0];
  if (!phone) return null;

  return (
    <a
      href={telHref(phone.number)}
      aria-label={`${t("call")}: ${formatUzPhone(phone.number)}`}
      className="animate-jump fixed bottom-24 right-5 z-40 grid size-15 place-items-center rounded-full bg-accent-500 text-white shadow-(--shadow-glow-accent) ring-4 ring-white/30 transition-transform duration-300 ease-premium hover:scale-110 active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent-500 lg:bottom-8 lg:right-8"
    >
      <span
        aria-hidden="true"
        className="animate-ping absolute inset-0 -z-10 rounded-full bg-accent-500/60"
      />
      <Phone className="size-6" aria-hidden="true" />
    </a>
  );
}
