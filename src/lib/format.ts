import type { ContentLocale } from "@/content/types";

const UZS_SUFFIX: Record<ContentLocale, string> = {
  uz: "so'm",
  ru: "сум",
};

/** Non-breaking space: keeps grouped digits and the currency word unbroken. */
const NBSP = "\u00a0";

/**
 * Formats a UZS amount: NBSP-grouped digits + localized currency word
 * (doc 10 §5 formatting standards). Manual grouping keeps output byte-for-byte
 * identical across server and client runtimes (no Intl locale-data drift).
 */
export function formatUzs(amount: number, locale: ContentLocale): string {
  const grouped = Math.round(amount)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, NBSP);
  return `${grouped}${NBSP}${UZS_SUFFIX[locale]}`;
}

const MONTHS: Record<ContentLocale, string[]> = {
  uz: [
    "Yanvar",
    "Fevral",
    "Mart",
    "Aprel",
    "May",
    "Iyun",
    "Iyul",
    "Avgust",
    "Sentabr",
    "Oktabr",
    "Noyabr",
    "Dekabr",
  ],
  ru: [
    "Январь",
    "Февраль",
    "Март",
    "Апрель",
    "Май",
    "Июнь",
    "Июль",
    "Август",
    "Сентябрь",
    "Октябрь",
    "Ноябрь",
    "Декабрь",
  ],
};

/** Formats a "YYYY-MM" content month as "Iyun 2026" / "Июнь 2026". */
export function formatMonth(month: string, locale: ContentLocale): string {
  const [year, monthPart] = month.split("-");
  const index = Number(monthPart) - 1;
  const name = MONTHS[locale][index];
  return name ? `${name} ${year}` : month;
}

const RU_GENITIVE_MONTHS = [
  "января",
  "февраля",
  "марта",
  "апреля",
  "мая",
  "июня",
  "июля",
  "августа",
  "сентября",
  "октября",
  "ноября",
  "декабря",
];

/** Formats an ISO date (YYYY-MM-DD) as "31-avgust" / "31 августа". */
export function formatDeadline(isoDate: string, locale: ContentLocale): string {
  const [, monthPart, dayPart] = isoDate.split("-");
  const index = Number(monthPart) - 1;
  const day = Number(dayPart);
  const name = MONTHS[locale][index];
  if (!name) return isoDate;
  if (locale === "ru") {
    return `${day} ${RU_GENITIVE_MONTHS[index]}`;
  }
  return `${day}-${name.toLowerCase()}`;
}

/** Formats a course duration in months: 1.5 → "1,5" (comma in both locales). */
export function formatDuration(months: number): string {
  return months.toString().replace(".", ",");
}
