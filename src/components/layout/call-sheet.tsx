"use client";

import { useEffect } from "react";
import { Phone, X } from "lucide-react";
import { useTranslations } from "next-intl";
import type { NavPhone } from "./nav-data";
import { formatUzPhone, telHref } from "@/lib/phone";

/**
 * Bottom-sheet listing official numbers (TZ §5.3 call action). When exactly
 * one number is configured the caller dials it directly and never opens this
 * sheet. Dismissable by backdrop, close button, or Escape.
 */
export function CallSheet({
  open,
  onClose,
  phones,
}: {
  open: boolean;
  onClose: () => void;
  phones: NavPhone[];
}) {
  const t = useTranslations("actionBar");

  useEffect(() => {
    if (!open) return;
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] lg:hidden" role="dialog" aria-modal="true" aria-label={t("chooseNumber")}>
      <button
        type="button"
        aria-label={t("close")}
        onClick={onClose}
        className="absolute inset-0 bg-ink-950/40 backdrop-blur-sm"
      />
      <div className="absolute inset-x-0 bottom-0 rounded-t-3xl bg-white p-5 pb-[calc(1.25rem+env(safe-area-inset-bottom))] shadow-2xl">
        <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-ink-200" aria-hidden="true" />
        <div className="mb-3 flex items-center justify-between">
          <p className="text-base font-semibold text-ink-900">{t("chooseNumber")}</p>
          <button
            type="button"
            onClick={onClose}
            aria-label={t("close")}
            className="grid size-9 place-items-center rounded-lg text-ink-500 hover:bg-ink-100"
          >
            <X className="size-5" aria-hidden="true" />
          </button>
        </div>
        <ul className="flex flex-col gap-2">
          {phones.map((phone) => (
            <li key={phone.number}>
              <a
                href={telHref(phone.number)}
                className="flex items-center gap-3 rounded-control bg-ink-50 px-4 py-3 transition-colors hover:bg-ink-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600"
              >
                <span className="grid size-10 shrink-0 place-items-center rounded-full bg-brand-600 text-white">
                  <Phone className="size-5" aria-hidden="true" />
                </span>
                <span className="min-w-0">
                  <span className="block text-base font-semibold text-ink-900">
                    {formatUzPhone(phone.number)}
                  </span>
                  <span className="block truncate text-sm text-ink-500">{phone.label}</span>
                </span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
