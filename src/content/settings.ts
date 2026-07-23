import type { SiteSettings } from "./types";

/**
 * PROVISIONAL CONTENT — phone numbers, counters and license await the
 * authoritative client input (docs/OPEN_ITEMS.md #3, #5). The phone number
 * below is a structural stand-in and MUST be replaced before launch.
 */
export const settings: SiteSettings = {
  brandName: "Turon Avtomaktab",
  phones: [
    {
      number: "+998900000000",
      label: { uz: "Qabul bo'limi", ru: "Приёмная" },
    },
  ],
  telegramUrl: "https://t.me/turon_avtomaktab",
  instagramUrl: "https://instagram.com/turon_avtomaktab",
  hours: {
    uz: "Dushanba – shanba, 09:00 – 18:00",
    ru: "Понедельник – суббота, 09:00 – 18:00",
  },
  counters: {
    branches: 7,
    graduates: 12000,
    yearsActive: 10,
  },
  license: null,
};
