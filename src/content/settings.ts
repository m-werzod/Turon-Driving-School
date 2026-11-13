import type { SiteSettings } from "./types";

/**
 * Counters and license are still provisional pending the authoritative
 * client input (docs/OPEN_ITEMS.md #5). Phone numbers below are the real,
 * client-provided registration lines (Telegram announcement, 2026-07-22).
 */
export const settings: SiteSettings = {
  brandName: "Turon Avtomaktab",
  phones: [
    {
      number: "+998552523737",
      label: { uz: "Qabul bo'limi", ru: "Приёмная" },
    },
    {
      number: "+998552553737",
      label: { uz: "Qabul bo'limi", ru: "Приёмная" },
    },
    {
      number: "+998911653737",
      label: { uz: "Qabul bo'limi", ru: "Приёмная" },
    },
  ],
  telegramUrl: "https://t.me/AVTOMAKTABTURON",
  instagramUrl: "https://www.instagram.com/avtomaktab_turon/",
  hours: {
    uz: "Har kuni, 08:00 – 19:00",
    ru: "Ежедневно, 08:00 – 19:00",
  },
  counters: {
    branches: 7,
    graduates: 12000,
    yearsActive: 10,
  },
  license: null,
};
