"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown, Menu, Phone } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { buttonClasses } from "@/components/ui/button";
import { Logo } from "./logo";
import { LanguageSwitcher } from "./language-switcher";
import { MobileMenu } from "./mobile-menu";
import type { HeaderData } from "./nav-data";
import { formatUzPhone, telHref } from "@/lib/phone";
import { cn } from "@/lib/cn";

/**
 * Global header (TZ §5.1). Sticky; condenses on scroll-down and reappears on
 * scroll-up. Desktop shows six primary nav items (the spec ceiling) with
 * Toifalar/Filiallar dropdowns; mobile shows logo + switcher + menu button.
 * All content data arrives as serializable props from the server layout.
 */
export function SiteHeader({ data }: { data: HeaderData }) {
  const t = useTranslations("nav");
  const tHeader = useTranslations("header");
  const pathname = usePathname();

  const [menuOpen, setMenuOpen] = useState(false);
  const [condensed, setCondensed] = useState(false);
  const [hidden, setHidden] = useState(false);
  const lastScroll = useRef(0);

  // Close the mobile menu whenever the route changes (TZ §5.2).
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    function onScroll() {
      const y = window.scrollY;
      setCondensed(y > 8);
      // Hide on scroll-down past the hero; always reveal on scroll-up.
      if (y > lastScroll.current && y > 160) {
        setHidden(true);
      } else {
        setHidden(false);
      }
      lastScroll.current = y;
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const firstPhone = data.phones[0];

  return (
    <>
      <header
        className={cn(
          "sticky top-0 z-40 border-b transition-[transform,background-color,box-shadow,border-color] duration-300",
          hidden && !menuOpen ? "-translate-y-full" : "translate-y-0",
          condensed
            ? "border-ink-200/70 bg-white/85 shadow-sm backdrop-blur-md"
            : "border-transparent bg-white",
        )}
      >
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-5 sm:px-6 lg:h-18 lg:px-8">
          <Logo label={t("home")} />

          <nav aria-label="Primary" className="hidden items-center gap-1 lg:flex">
            <DesktopDropdown
              label={t("categories")}
              items={[
                {
                  key: "express",
                  href: "/express-courses",
                  title: t("express"),
                  highlight: true,
                },
                ...data.categories.map((category) => ({
                  key: category.slug,
                  href: {
                    pathname: "/categories/[slug]" as const,
                    params: { slug: category.slug },
                  },
                  title: category.name,
                  description: category.tagline,
                  meta: category.priceFrom ?? undefined,
                })),
              ]}
            />
            <NavLink href="/pricing">{t("pricing")}</NavLink>
            <DesktopDropdown
              label={t("branches")}
              items={data.branches.map((branch) => ({
                key: branch.slug,
                href: {
                  pathname: "/branches/[slug]" as const,
                  params: { slug: branch.slug },
                },
                title: branch.name,
                description: branch.district,
              }))}
            />
            <NavLink href="/results">{t("results")}</NavLink>
            <NavLink href="/gallery">{t("gallery")}</NavLink>
            <NavLink href="/about">{t("about")}</NavLink>
          </nav>

          <div className="hidden items-center gap-3 lg:flex">
            {firstPhone ? (
              <a
                href={telHref(firstPhone.number)}
                className="inline-flex items-center gap-2 text-sm font-semibold text-ink-700 transition-colors hover:text-brand-700"
              >
                <Phone className="size-4 text-brand-600" aria-hidden="true" />
                {formatUzPhone(firstPhone.number)}
              </a>
            ) : null}
            <LanguageSwitcher label={tHeader("languageLabel")} />
            <Link href="/register" className={buttonClasses({ variant: "primary" })}>
              {t("register")}
            </Link>
          </div>

          <div className="flex items-center gap-2 lg:hidden">
            <LanguageSwitcher label={tHeader("languageLabel")} />
            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              aria-label={tHeader("openMenu")}
              aria-expanded={menuOpen}
              className="grid size-11 place-items-center rounded-lg text-ink-800 hover:bg-ink-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600"
            >
              <Menu className="size-6" aria-hidden="true" />
            </button>
          </div>
        </div>
      </header>

      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} data={data} />
    </>
  );
}

function NavLink({
  href,
  children,
}: {
  href: Parameters<typeof Link>[0]["href"];
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="rounded-lg px-3 py-2 text-sm font-semibold text-ink-700 transition-colors hover:bg-ink-100 hover:text-ink-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600"
    >
      {children}
    </Link>
  );
}

interface DropdownItem {
  key: string;
  href: Parameters<typeof Link>[0]["href"];
  title: string;
  description?: string;
  meta?: string;
  highlight?: boolean;
}

function DesktopDropdown({ label, items }: { label: string; items: DropdownItem[] }) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    function onPointerDown(event: PointerEvent) {
      if (!containerRef.current?.contains(event.target as Node)) setOpen(false);
    }
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  function scheduleClose() {
    closeTimer.current = setTimeout(() => setOpen(false), 120);
  }
  function cancelClose() {
    if (closeTimer.current) clearTimeout(closeTimer.current);
  }

  return (
    <div
      ref={containerRef}
      className="relative"
      onMouseEnter={() => {
        cancelClose();
        setOpen(true);
      }}
      onMouseLeave={scheduleClose}
    >
      <button
        type="button"
        aria-expanded={open}
        aria-haspopup="true"
        onClick={() => setOpen((v) => !v)}
        className="inline-flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-semibold text-ink-700 transition-colors hover:bg-ink-100 hover:text-ink-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600"
      >
        {label}
        <ChevronDown
          className={cn("size-4 text-ink-400 transition-transform", open && "rotate-180")}
          aria-hidden="true"
        />
      </button>
      {open ? (
        <div className="absolute left-0 top-full pt-2">
          <ul className="w-80 overflow-hidden rounded-card bg-white p-2 shadow-[var(--shadow-card-hover)] ring-1 ring-ink-200">
            {items.map((item) => (
              <li key={item.key}>
                <Link
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "flex items-start justify-between gap-3 rounded-lg px-3 py-2.5 transition-colors hover:bg-ink-50 focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-brand-600",
                    item.highlight && "bg-brand-50/60 hover:bg-brand-50",
                  )}
                >
                  <span className="min-w-0">
                    <span
                      className={cn(
                        "block text-sm font-semibold",
                        item.highlight ? "text-brand-700" : "text-ink-900",
                      )}
                    >
                      {item.title}
                    </span>
                    {item.description ? (
                      <span className="mt-0.5 block truncate text-xs text-ink-500">
                        {item.description}
                      </span>
                    ) : null}
                  </span>
                  {item.meta ? (
                    <span className="shrink-0 whitespace-nowrap text-xs font-semibold text-ink-600">
                      {item.meta}
                    </span>
                  ) : null}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}
