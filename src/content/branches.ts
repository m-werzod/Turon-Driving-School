import type { Branch } from "./types";
import { settings } from "./settings";

const sharedPhones = settings.phones.map((phone) => phone.number);

const standardHours = {
  uz: "Dush – Shan, 09:00 – 18:00",
  ru: "Пн – Сб, 09:00 – 18:00",
};

/**
 * PROVISIONAL CONTENT — landmarks, offered categories and coordinates are
 * seeded from public knowledge of the locations and MUST be verified with the
 * client before launch (docs/OPEN_ITEMS.md #3, #11). Structure per TZ doc 04
 * §3.1 (7 branches, entity slugs shared across locales).
 */
export const branches: Branch[] = [
  {
    slug: "kosonsoy",
    name: { uz: "Kosonsoy filiali", ru: "Филиал Касансай" },
    district: { uz: "Kosonsoy tumani", ru: "Касансайский район" },
    landmark: {
      uz: "Kosonsoy shahri, markaziy bozor yaqinida",
      ru: "г. Касансай, рядом с центральным рынком",
    },
    phones: sharedPhones,
    hours: standardHours,
    geo: { lat: 41.2561, lng: 71.5497 },
    categorySlugs: ["b", "bc", "a"],
    hasAutodrome: false,
  },
  {
    slug: "tergachi",
    name: { uz: "Tergachi filiali", ru: "Филиал Тергачи" },
    district: { uz: "Namangan tumani", ru: "Наманганский район" },
    landmark: {
      uz: "Tergachi qishlog'i, katta yo'l bo'yida",
      ru: "село Тергачи, у главной дороги",
    },
    phones: sharedPhones,
    hours: standardHours,
    geo: { lat: 41.0468, lng: 71.7108 },
    categorySlugs: ["b", "bc", "c"],
    hasAutodrome: false,
  },
  {
    slug: "buloq-avtodrom",
    name: { uz: "Buloq filiali (avtodrom)", ru: "Филиал Булак (автодром)" },
    district: { uz: "Namangan tumani", ru: "Наманганский район" },
    landmark: {
      uz: "Buloq qishlog'i, Turon avtodromi hududida",
      ru: "село Булак, на территории автодрома Turon",
    },
    phones: sharedPhones,
    hours: standardHours,
    geo: { lat: 41.0825, lng: 71.6329 },
    categorySlugs: ["b", "bc", "c", "ce", "be", "d"],
    hasAutodrome: true,
  },
  {
    slug: "kamuna",
    name: { uz: "Kamuna filiali", ru: "Филиал Камуна" },
    district: { uz: "Namangan tumani", ru: "Наманганский район" },
    landmark: {
      uz: "Kamuna mahallasi, maktab ro'parasida",
      ru: "махалля Камуна, напротив школы",
    },
    phones: sharedPhones,
    hours: standardHours,
    geo: { lat: 41.0619, lng: 71.6014 },
    categorySlugs: ["b", "bc"],
    hasAutodrome: false,
  },
  {
    slug: "bogishamol",
    name: { uz: "Bog'ishamol filiali", ru: "Филиал Богишамол" },
    district: { uz: "Namangan shahri", ru: "г. Наманган" },
    landmark: {
      uz: "Bog'ishamol dahasi, avtobus bekati yonida",
      ru: "массив Богишамол, рядом с автобусной остановкой",
    },
    phones: sharedPhones,
    hours: standardHours,
    geo: { lat: 41.0203, lng: 71.6512 },
    categorySlugs: ["b", "bc", "a"],
    hasAutodrome: false,
  },
  {
    slug: "namangan-shahar",
    name: { uz: "Namangan shahar filiali", ru: "Филиал в г. Наманган" },
    district: { uz: "Namangan shahri, markaz", ru: "г. Наманган, центр" },
    landmark: {
      uz: "Namangan shahri markazi, amfiteatr yaqinida",
      ru: "центр г. Наманган, рядом с амфитеатром",
    },
    phones: sharedPhones,
    hours: standardHours,
    geo: { lat: 41.0011, lng: 71.6725 },
    categorySlugs: ["b", "bc", "c", "be"],
    hasAutodrome: false,
  },
  {
    slug: "toraqorgon",
    name: { uz: "To'raqo'rg'on filiali", ru: "Филиал Туракурган" },
    district: { uz: "To'raqo'rg'on tumani", ru: "Туракурганский район" },
    landmark: {
      uz: "To'raqo'rg'on shahri, markaziy ko'chada",
      ru: "г. Туракурган, на центральной улице",
    },
    phones: sharedPhones,
    hours: standardHours,
    geo: { lat: 41.0049, lng: 71.5173 },
    categorySlugs: ["b", "bc", "c"],
    hasAutodrome: false,
  },
];
