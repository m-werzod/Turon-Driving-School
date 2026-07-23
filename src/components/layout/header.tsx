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
 * Global header (TZ §5.1). Transparent over the Home hero and turns into a
 * glass bar once scrolled (or immediately on every non-Home page, since
 * those never have a dark hero under it). Sticky; condenses on scroll-down
 * and reappears on scroll-up. Desktop shows six primary nav items with
 * Toifalar/Filiallar mega-menus; mobile shows logo + switcher + menu button.
 */
export function SiteHeader({ data }: { data: HeaderData }) {
  const t = useTranslations("nav");
  const tHeader = useTranslations("header");
  const pathname = usePathname();
  const isHome = pathname === "/";

  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const lastScroll = useRef(0);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    function onScroll() {
      const y = window.scrollY;
      setScrolled(y > 24);
      if (y > lastScroll.current && y > 200) {
        setHidden(true);
      } else {
        setHidden(false);
      }
      lastScroll.current = y;
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const firstPhone = data.phones[0];
  const transparent = isHome && !scrolled;

  return (
    <>
      <header
        className={cn(
          "sticky top-0 z-40 transition-[transform,background-color,box-shadow,border-color] duration-500 ease-premium",
          hidden && !menuOpen ? "-translate-y-full" : "translate-y-0",
          transparent
            ? "border-b border-white/0 bg-transparent"
            : "glass-light border-b border-ink-200/60 shadow-[0_1px_0_rgb(16_19_31/0.04)]",
        )}
      >
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between gap-4 px-5 sm:px-8 lg:h-24 lg:px-10">
          <Logo label={t("home")} size="lg" tone={transparent ? "light" : "dark"} />

          <nav aria-label="Primary" className="hidden items-center gap-1 lg:flex">
            <DesktopDropdown
              label={t("categories")}
              transparent={transparent}
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
            <NavLink href="/pricing" transparent={transparent}>
              {t("pricing")}
            </NavLink>
            <DesktopDropdown
              label={t("branches")}
              transparent={transparent}
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
            <NavLink href="/results" transparent={transparent}>
              {t("results")}
            </NavLink>
            <NavLink href="/gallery" transparent={transparent}>
              {t("gallery")}
            </NavLink>
            <NavLink href="/about" transparent={transparent}>
              {t("about")}
            </NavLink>
          </nav>

          <div className="hidden items-center gap-4 lg:flex">
            {firstPhone ? (
              <a
                href={telHref(firstPhone.number)}
                className={cn(
                  "inline-flex items-center gap-2 text-sm font-semibold transition-colors",
                  transparent
                    ? "text-white/90 hover:text-white"
                    : "text-ink-700 hover:text-accent-600",
                )}
              >
                <Phone
                  className={cn("size-4", transparent ? "text-white/70" : "text-accent-500")}
                  aria-hidden="true"
                />
                {formatUzPhone(firstPhone.number)}
              </a>
            ) : null}
            <LanguageSwitcher label={tHeader("languageLabel")} tone={transparent ? "light" : "dark"} />
            <Link
              href="/register"
              className={buttonClasses({ variant: "primary", className: "shadow-none" })}
            >
              {t("register")}
            </Link>
          </div>

          <div className="flex items-center gap-2 lg:hidden">
            <LanguageSwitcher label={tHeader("languageLabel")} tone={transparent ? "light" : "dark"} />
            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              aria-label={tHeader("openMenu")}
              aria-expanded={menuOpen}
              className={cn(
                "grid size-11 place-items-center rounded-xl transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-500",
                transparent
                  ? "text-white hover:bg-white/10"
                  : "text-ink-800 hover:bg-ink-100",
              )}
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
  transparent,
  children,
}: {
  href: Parameters<typeof Link>[0]["href"];
  transparent: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "rounded-pill px-3.5 py-2.5 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-500",
        transparent
          ? "text-white/85 hover:bg-white/10 hover:text-white"
          : "text-ink-700 hover:bg-ink-100 hover:text-ink-900",
      )}
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

function DesktopDropdown({
  label,
  items,
  transparent,
}: {
  label: string;
  items: DropdownItem[];
  transparent: boolean;
}) {
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
    closeTimer.current = setTimeout(() => setOpen(false), 140);
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
        className={cn(
          "inline-flex items-center gap-1 rounded-pill px-3.5 py-2.5 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-500",
          transparent
            ? "text-white/85 hover:bg-white/10 hover:text-white"
            : "text-ink-700 hover:bg-ink-100 hover:text-ink-900",
        )}
      >
        {label}
        <ChevronDown
          className={cn(
            "size-4 transition-transform",
            transparent ? "text-white/60" : "text-ink-400",
            open && "rotate-180",
          )}
          aria-hidden="true"
        />
      </button>
      {open ? (
        <div className="absolute left-1/2 top-full w-max -translate-x-1/2 pt-3">
          <ul className="glass-light w-80 overflow-hidden rounded-2xl border border-white/60 p-2 shadow-(--shadow-card-hover)">
            {items.map((item) => (
              <li key={item.key}>
                <Link
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "flex items-start justify-between gap-3 rounded-xl px-3.5 py-3 transition-colors hover:bg-white focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-accent-500",
                    item.highlight && "bg-accent-50/70 hover:bg-accent-50",
                  )}
                >
                  <span className="min-w-0">
                    <span
                      className={cn(
                        "block text-sm font-semibold",
                        item.highlight ? "text-accent-700" : "text-ink-900",
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
