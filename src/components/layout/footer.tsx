import { Clock, Phone } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Logo } from "./logo";
import { LanguageSwitcher } from "./language-switcher";
import { TelegramIcon, InstagramIcon } from "@/components/ui/brand-icons";
import { FOOTER_PAGE_LINKS, type FooterData } from "./nav-data";
import { formatUzPhone, telHref } from "@/lib/phone";

/**
 * Global footer (TZ §5.4). Four groups — brand, pages, categories, branches —
 * plus a bottom bar with copyright, license number, privacy link, and the
 * language switcher. Server component; only the switcher is client.
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
    <footer className="border-t border-ink-200 bg-ink-50">
      <div className="mx-auto max-w-6xl px-5 py-14 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-12">
          {/* Brand */}
          <div className="lg:col-span-4">
            <Logo label={t("nav.home")} />
            <p className="mt-4 max-w-xs text-pretty text-sm text-ink-600">
              {t("footer.tagline")}
            </p>
            <div className="mt-5 flex items-center gap-3">
              <a
                href={data.telegramUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Telegram"
                className="rounded-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600"
              >
                <TelegramIcon className="size-8" />
              </a>
              <a
                href={data.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="rounded-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600"
              >
                <InstagramIcon className="size-8" />
              </a>
            </div>
          </div>

          {/* Pages */}
          <nav aria-label={t("footer.pages")} className="lg:col-span-2">
            <h2 className="text-sm font-semibold text-ink-900">{t("footer.pages")}</h2>
            <ul className="mt-4 flex flex-col gap-2.5 text-sm text-ink-600">
              {FOOTER_PAGE_LINKS.map((href) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="rounded transition-colors hover:text-brand-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600"
                  >
                    {pageLabels[href]}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Categories */}
          <nav aria-label={t("footer.categories")} className="lg:col-span-2">
            <h2 className="text-sm font-semibold text-ink-900">{t("footer.categories")}</h2>
            <ul className="mt-4 flex flex-col gap-2.5 text-sm text-ink-600">
              <li>
                <Link
                  href="/express-courses"
                  className="rounded font-semibold text-brand-700 transition-colors hover:text-brand-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600"
                >
                  {t("nav.express")}
                </Link>
              </li>
              {data.categories.map((category) => (
                <li key={category.slug}>
                  <Link
                    href={{ pathname: "/categories/[slug]", params: { slug: category.slug } }}
                    className="rounded transition-colors hover:text-brand-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600"
                  >
                    {category.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Branches */}
          <nav aria-label={t("footer.branches")} className="lg:col-span-4">
            <h2 className="text-sm font-semibold text-ink-900">{t("footer.branches")}</h2>
            <ul className="mt-4 flex flex-col gap-4 text-sm text-ink-600">
              {data.branches.map((branch) => (
                <li key={branch.slug}>
                  <Link
                    href={{ pathname: "/branches/[slug]", params: { slug: branch.slug } }}
                    className="rounded font-semibold text-ink-800 transition-colors hover:text-brand-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600"
                  >
                    {branch.name}
                  </Link>
                  <div className="mt-1 flex flex-col gap-1">
                    {branch.phones.map((phone) => (
                      <a
                        key={phone}
                        href={telHref(phone)}
                        className="inline-flex items-center gap-1.5 text-ink-600 transition-colors hover:text-brand-700"
                      >
                        <Phone className="size-3.5 text-ink-400" aria-hidden="true" />
                        {formatUzPhone(phone)}
                      </a>
                    ))}
                    <span className="inline-flex items-center gap-1.5 text-xs text-ink-500">
                      <Clock className="size-3.5 text-ink-400" aria-hidden="true" />
                      {branch.hours}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-ink-200 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col gap-1 text-sm text-ink-500">
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
              className="rounded text-sm text-ink-500 transition-colors hover:text-brand-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600"
            >
              {t("nav.privacy")}
            </Link>
            <LanguageSwitcher label={t("header.languageLabel")} />
          </div>
        </div>
      </div>
    </footer>
  );
}
