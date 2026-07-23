import { Clock, MapPin, Phone } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Logo } from "./logo";
import { LanguageSwitcher } from "./language-switcher";
import { TelegramIcon, InstagramIcon } from "@/components/ui/brand-icons";
import { FOOTER_PAGE_LINKS, type FooterData } from "./nav-data";
import { formatUzPhone, telHref } from "@/lib/phone";

/**
 * Global footer (TZ §5.4). Dark navy surface — a deliberate contrast beat
 * after the light content pages, with the logo given real room to breathe.
 * Four groups — brand, pages, categories, branches — plus a bottom bar with
 * copyright, license number, privacy link, and the language switcher.
 */
export function SiteFooter({ data }: { data: FooterData }) {
  const t = useTranslations();
  const year = new Date().getFullYear();

  const pageLabels: Record<(typeof FOOTER_PAGE_LINKS)[number], string> = {
    "/": t("nav.home"),
    "/categories": t("nav.categories"),
    "/express-courses": t("nav.express"),
    "/pricing": t("nav.pricing"),
    "/branches": t("nav.branches"),
    "/results": t("nav.results"),
    "/gallery": t("nav.gallery"),
    "/about": t("nav.about"),
    "/faq": t("nav.faq"),
    "/contact": t("nav.contact"),
  };

  return (
    <footer className="bg-ink-950">
      <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:px-10 lg:py-24">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-12 lg:gap-8">
          {/* Brand */}
          <div className="lg:col-span-4">
            <Logo label={t("nav.home")} size="lg" tone="light" />
            <p className="mt-5 max-w-xs text-pretty text-sm text-white/50">
              {t("footer.tagline")}
            </p>

            {data.phones[0] ? (
              <a
                href={telHref(data.phones[0].number)}
                className="mt-6 inline-flex items-center gap-2.5 text-xl font-bold text-white transition-colors hover:text-accent-400"
              >
                <span className="grid size-10 place-items-center rounded-full bg-accent-500/15 text-accent-400">
                  <Phone className="size-4.5" aria-hidden="true" />
                </span>
                {formatUzPhone(data.phones[0].number)}
              </a>
            ) : null}
            <p className="mt-2 flex items-center gap-2 text-sm text-white/40">
              <Clock className="size-3.5 text-white/30" aria-hidden="true" />
              {data.hours}
            </p>

            <div className="mt-6 flex items-center gap-3">
              <a
                href={data.telegramUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Telegram"
                className="rounded-lg transition-transform hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-500"
              >
                <TelegramIcon className="size-9" />
              </a>
              <a
                href={data.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="rounded-lg transition-transform hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-500"
              >
                <InstagramIcon className="size-9" />
              </a>
            </div>
          </div>

          {/* Pages */}
          <nav aria-label={t("footer.pages")} className="lg:col-span-2">
            <h2 className="text-sm font-semibold text-white">{t("footer.pages")}</h2>
            <ul className="mt-5 flex flex-col gap-3 text-sm text-white/55">
              {FOOTER_PAGE_LINKS.map((href) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="rounded transition-colors hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-500"
                  >
                    {pageLabels[href]}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Categories */}
          <nav aria-label={t("footer.categories")} className="lg:col-span-2">
            <h2 className="text-sm font-semibold text-white">{t("footer.categories")}</h2>
            <ul className="mt-5 flex flex-col gap-3 text-sm text-white/55">
              <li>
                <Link
                  href="/express-courses"
                  className="rounded font-semibold text-accent-400 transition-colors hover:text-accent-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-500"
                >
                  {t("nav.express")}
                </Link>
              </li>
              {data.categories.map((category) => (
                <li key={category.slug}>
                  <Link
                    href={{ pathname: "/categories/[slug]", params: { slug: category.slug } }}
                    className="rounded transition-colors hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-500"
                  >
                    {category.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Branches — names only; phone/hours/map live on each branch page */}
          <nav aria-label={t("footer.branches")} className="lg:col-span-4">
            <h2 className="text-sm font-semibold text-white">{t("footer.branches")}</h2>
            <ul className="mt-5 grid grid-cols-1 gap-x-6 gap-y-3 text-sm text-white/55 sm:grid-cols-2">
              {data.branches.map((branch) => (
                <li key={branch.slug}>
                  <Link
                    href={{ pathname: "/branches/[slug]", params: { slug: branch.slug } }}
                    className="inline-flex items-center gap-1.5 transition-colors hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-500"
                  >
                    <MapPin className="size-3.5 shrink-0 text-white/30" aria-hidden="true" />
                    {branch.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="mt-14 flex flex-col gap-4 border-t border-white/10 pt-7 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col gap-1 text-sm text-white/40">
            <p>
              © {year} {t("common.brand")}. {t("footer.rights")}
            </p>
            {data.licenseNumber ? (
              <p>
                {t("aboutPage.license.title")}: {data.licenseNumber}
              </p>
            ) : null}
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/privacy"
              className="rounded text-sm text-white/40 transition-colors hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-500"
            >
              {t("nav.privacy")}
            </Link>
            <LanguageSwitcher label={t("header.languageLabel")} tone="light" />
          </div>
        </div>
      </div>
    </footer>
  );
}
