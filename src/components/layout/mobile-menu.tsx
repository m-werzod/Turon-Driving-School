"use client";

import { useEffect, useState } from "react";
import { ChevronDown, Phone, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { buttonClasses } from "@/components/ui/button";
import { Logo } from "./logo";
import { LanguageSwitcher } from "./language-switcher";
import { TelegramIcon, InstagramIcon } from "@/components/ui/brand-icons";
import type { HeaderData } from "./nav-data";
import { formatUzPhone, telHref } from "@/lib/phone";
import { cn } from "@/lib/cn";

/**
 * Right-side mobile navigation drawer — 60% of the viewport width (capped
 * for readability on tablets), sliding in over a blurred backdrop. Stays
 * mounted at all times and animates via translate-x so both open and close
 * play; `inert` keeps its contents out of the tab order while closed. Body
 * scroll is locked while open; the parent closes it on route change.
 * Rendered only on mobile/tablet.
 */
export function MobileMenu({
  open,
  onClose,
  data,
}: {
  open: boolean;
  onClose: () => void;
  data: HeaderData;
}) {
  const t = useTranslations("nav");
  const tHeader = useTranslations("header");
  const [expanded, setExpanded] = useState<"categories" | "branches" | null>(null);

  useEffect(() => {
    if (!open) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = original;
      document.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  return (
    <div className={cn("fixed inset-0 z-50 lg:hidden", !open && "pointer-events-none")}>
      {/* Backdrop */}
      <div
        onClick={onClose}
        aria-hidden="true"
        className={cn(
          "absolute inset-0 bg-ink-950/55 backdrop-blur-sm transition-opacity duration-300 ease-premium",
          open ? "opacity-100" : "pointer-events-none opacity-0",
        )}
      />

      {/* Drawer panel — 60vw, floored at 280px, capped at 24rem */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label={tHeader("openMenu")}
        inert={!open}
        className={cn(
          "absolute inset-y-0 right-0 flex h-full w-[60vw] min-w-[280px] max-w-sm flex-col bg-white shadow-2xl transition-transform duration-300 ease-premium",
          open ? "translate-x-0" : "translate-x-full",
        )}
      >
        <div className="flex items-center justify-between gap-2 border-b border-ink-100 px-4 py-3">
          <Logo label={t("home")} onClick={onClose} />
          <button
            type="button"
            onClick={onClose}
            aria-label={tHeader("closeMenu")}
            className="grid size-10 shrink-0 place-items-center rounded-lg text-ink-700 hover:bg-ink-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600"
          >
            <X className="size-5" aria-hidden="true" />
          </button>
        </div>

        <nav
          aria-label={tHeader("openMenu")}
          className="flex-1 overflow-y-auto overscroll-contain px-3 py-3"
        >
          <ul className="flex flex-col gap-1 text-base font-semibold text-ink-900">
            <li>
              <ExpandableGroup
                label={t("categories")}
                isOpen={expanded === "categories"}
                onToggle={() =>
                  setExpanded(expanded === "categories" ? null : "categories")
                }
              >
                <MenuLink href="/express-courses" onClick={onClose} highlight>
                  {t("express")}
                </MenuLink>
                {data.categories.map((category) => (
                  <MenuLink
                    key={category.slug}
                    href={{ pathname: "/categories/[slug]", params: { slug: category.slug } }}
                    onClick={onClose}
                  >
                    {category.name}
                  </MenuLink>
                ))}
              </ExpandableGroup>
            </li>
            <li>
              <MenuTopLink href="/pricing" onClick={onClose}>
                {t("pricing")}
              </MenuTopLink>
            </li>
            <li>
              <ExpandableGroup
                label={t("branches")}
                isOpen={expanded === "branches"}
                onToggle={() =>
                  setExpanded(expanded === "branches" ? null : "branches")
                }
              >
                {data.branches.map((branch) => (
                  <MenuLink
                    key={branch.slug}
                    href={{ pathname: "/branches/[slug]", params: { slug: branch.slug } }}
                    onClick={onClose}
                  >
                    {branch.name}
                  </MenuLink>
                ))}
              </ExpandableGroup>
            </li>
            <li>
              <MenuTopLink href="/results" onClick={onClose}>
                {t("results")}
              </MenuTopLink>
            </li>
            <li>
              <MenuTopLink href="/gallery" onClick={onClose}>
                {t("gallery")}
              </MenuTopLink>
            </li>
            <li>
              <MenuTopLink href="/about" onClick={onClose}>
                {t("about")}
              </MenuTopLink>
            </li>
            <li>
              <MenuTopLink href="/faq" onClick={onClose}>
                {t("faq")}
              </MenuTopLink>
            </li>
            <li>
              <MenuTopLink href="/contact" onClick={onClose}>
                {t("contact")}
              </MenuTopLink>
            </li>
          </ul>
        </nav>

        <div className="border-t border-ink-100 px-4 pb-[calc(1rem+env(safe-area-inset-bottom))] pt-3">
          <Link
            href="/register"
            onClick={onClose}
            className={buttonClasses({ variant: "primary", size: "lg", className: "w-full" })}
          >
            {t("register")}
          </Link>
          <div className="mt-3 flex flex-col gap-1">
            {data.phones.map((phone) => (
              <a
                key={phone.number}
                href={telHref(phone.number)}
                className="inline-flex items-center gap-2 py-1.5 text-sm font-semibold text-ink-800"
              >
                <Phone className="size-4 shrink-0 text-brand-600" aria-hidden="true" />
                {formatUzPhone(phone.number)}
              </a>
            ))}
          </div>
          <div className="mt-3 flex items-center gap-3">
            <LanguageSwitcher label={tHeader("languageLabel")} />
            <a
              href={data.telegramUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Telegram"
              className="rounded-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600"
            >
              <TelegramIcon className="size-7" />
            </a>
            <a
              href={data.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="rounded-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600"
            >
              <InstagramIcon className="size-7" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

function MenuTopLink({
  href,
  onClick,
  children,
}: {
  href: Parameters<typeof Link>[0]["href"];
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="block rounded-lg px-3 py-2.5 hover:bg-ink-50 focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-brand-600"
    >
      {children}
    </Link>
  );
}

function ExpandableGroup({
  label,
  isOpen,
  onToggle,
  children,
}: {
  label: string;
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <div>
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        className="flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left hover:bg-ink-50 focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-brand-600"
      >
        {label}
        <ChevronDown
          className={cn("size-5 text-ink-400 transition-transform", isOpen && "rotate-180")}
          aria-hidden="true"
        />
      </button>
      {isOpen ? (
        <ul className="mb-1 ml-2.5 flex flex-col gap-0.5 border-l border-ink-100 pl-2.5 text-sm font-medium text-ink-700">
          {children}
        </ul>
      ) : null}
    </div>
  );
}

function MenuLink({
  href,
  onClick,
  highlight = false,
  children,
}: {
  href: Parameters<typeof Link>[0]["href"];
  onClick: () => void;
  highlight?: boolean;
  children: React.ReactNode;
}) {
  return (
    <li>
      <Link
        href={href}
        onClick={onClick}
        className={cn(
          "block rounded-lg px-3 py-2 hover:bg-ink-50 focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-brand-600",
          highlight && "font-semibold text-brand-700",
        )}
      >
        {children}
      </Link>
    </li>
  );
}
