"use client";

import { useEffect, useRef, useState } from "react";
import { Phone, UserPlus } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { CallSheet } from "./call-sheet";
import type { NavPhone } from "./nav-data";
import { telHref } from "@/lib/phone";
import { cn } from "@/lib/cn";

/**
 * Sticky mobile action bar (TZ §5.3) — the site's highest-leverage conversion
 * element. Two actions: call and register. Appears once past the first
 * viewport, but only while scrolling up (same show/hide-on-direction
 * behavior as the header) so it doesn't sit over content while reading down
 * the page; hides while a lead form is on screen (forms tag themselves with
 * data-lead-form, observed here) so it never covers the very form it points
 * to. Respects safe-area insets. Mobile only.
 */
export function StickyActionBar({ phones }: { phones: NavPhone[] }) {
  const t = useTranslations("actionBar");
  const [visible, setVisible] = useState(false);
  const [formOnScreen, setFormOnScreen] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);
  const lastScroll = useRef(0);

  useEffect(() => {
    function onScroll() {
      const y = window.scrollY;
      const scrollingDown = y > lastScroll.current;
      setVisible(y > window.innerHeight * 0.8 && !scrollingDown);
      lastScroll.current = y;
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Observe any on-page lead form; hide the bar while one is visible.
  useEffect(() => {
    const forms = document.querySelectorAll("[data-lead-form]");
    if (forms.length === 0) return;
    const observer = new IntersectionObserver(
      (entries) => {
        setFormOnScreen(entries.some((entry) => entry.isIntersecting));
      },
      { threshold: 0.2 },
    );
    forms.forEach((form) => observer.observe(form));
    return () => observer.disconnect();
  }, []);

  const single = phones.length === 1 ? phones[0] : null;
  const show = visible && !formOnScreen;

  return (
    <>
      <div
        aria-hidden={!show}
        className={cn(
          "glass-light fixed inset-x-0 bottom-0 z-40 border-t border-ink-200/70 shadow-[0_-4px_20px_rgb(16_19_31/0.06)] transition-transform duration-300 lg:hidden",
          show ? "translate-y-0" : "translate-y-full",
        )}
      >
        <div className="grid grid-cols-2 gap-2 px-4 py-2.5 pb-[calc(0.625rem+env(safe-area-inset-bottom))]">
          {single ? (
            <a
              href={telHref(single.number)}
              tabIndex={show ? 0 : -1}
              className="inline-flex h-12 items-center justify-center gap-2 rounded-control bg-white text-sm font-semibold text-ink-800 ring-1 ring-inset ring-ink-200 active:bg-ink-100"
            >
              <Phone className="size-5 text-accent-500" aria-hidden="true" />
              {t("call")}
            </a>
          ) : (
            <button
              type="button"
              onClick={() => setSheetOpen(true)}
              tabIndex={show ? 0 : -1}
              className="inline-flex h-12 items-center justify-center gap-2 rounded-control bg-white text-sm font-semibold text-ink-800 ring-1 ring-inset ring-ink-200 active:bg-ink-100"
            >
              <Phone className="size-5 text-accent-500" aria-hidden="true" />
              {t("call")}
            </button>
          )}
          <Link
            href="/register"
            tabIndex={show ? 0 : -1}
            className="inline-flex h-12 items-center justify-center gap-2 rounded-control bg-accent-500 text-sm font-semibold text-white active:bg-accent-700"
          >
            <UserPlus className="size-5" aria-hidden="true" />
            {t("register")}
          </Link>
        </div>
      </div>

      {!single ? (
        <CallSheet open={sheetOpen} onClose={() => setSheetOpen(false)} phones={phones} />
      ) : null}
    </>
  );
}
