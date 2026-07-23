import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Container } from "@/components/ui/container";
import { buttonClasses } from "@/components/ui/button";

/**
 * Localized 404 (TZ template T-15). No site search in v1 by design; recovery
 * is via links to the primary destinations. Rendered inside the locale layout
 * so the header/footer chrome and language are correct.
 */
export default function LocaleNotFound() {
  const t = useTranslations("notFound");

  return (
    <Container className="flex min-h-[60vh] flex-col items-center justify-center py-20 text-center">
      <p className="text-7xl font-black text-brand-600">404</p>
      <h1 className="mt-4 text-2xl font-bold text-ink-900 sm:text-3xl">{t("title")}</h1>
      <p className="mt-3 max-w-md text-pretty text-ink-600">{t("body")}</p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Link href="/" className={buttonClasses({ variant: "primary" })}>
          {t("home")}
        </Link>
        <Link href="/categories" className={buttonClasses({ variant: "secondary" })}>
          {t("categories")}
        </Link>
        <Link href="/pricing" className={buttonClasses({ variant: "secondary" })}>
          {t("pricing")}
        </Link>
        <Link href="/contact" className={buttonClasses({ variant: "ghost" })}>
          {t("contact")}
        </Link>
      </div>
    </Container>
  );
}
