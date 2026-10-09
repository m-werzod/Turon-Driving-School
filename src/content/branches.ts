import type { Branch } from "./types";
import { settings } from "./settings";

const sharedPhones = settings.phones.map((phone) => phone.number);

const standardHours = {
  uz: "Dush – Shan, 09:00 – 18:00",
  ru: "Пн – Сб, 09:00 – 18:00",
};

/**
 * Branch directory (TZ doc 04 §3.1).
 *
 * Location policy (docs/DECISIONS.md D-09) — locations are never
 * approximated. A branch is locatable only from a source the school itself
 * supplied: `googleMapsUrl` (the official share link, used verbatim, so the
 * pin is exactly where staff dropped it) or `geo` (coordinates the school
 * confirmed). Branches with neither show their landmark and phone but no
 * directions buttons — a confidently wrong direction is worse than none.
 * Four locations are school-confirmed; the rest are tracked in
 * docs/OPEN_ITEMS.md #11.
 */
export const branches: Branch[] = [
  {
    slug: "kosonsoy",
    name: { uz: "Kosonsoy markazi filiali", ru: "Филиал «Центр Касансая»" },
    district: { uz: "Kosonsoy tumani", ru: "Касансайский район" },
    landmark: {
      uz: "Katta charxpalak oldida",
      ru: "рядом с большим колесом обозрения",
    },
    phones: sharedPhones,
    hours: standardHours,
    googleMapsUrl: "https://maps.app.goo.gl/sR7ztHrt53abtcZY7",
    geo: null,
    categorySlugs: ["b", "bc", "a"],
    hasAutodrome: false,
  },
  {
    slug: "tergachi",
    name: { uz: "Tergachi filiali", ru: "Филиал Тергачи" },
    district: { uz: "Namangan tumani", ru: "Наманганский район" },
    landmark: {
      uz: "28-maktab oldida",
      ru: "рядом со школой №28",
    },
    phones: sharedPhones,
    hours: standardHours,
    googleMapsUrl: "https://maps.app.goo.gl/jZbFGpfQeGyVf9AJA",
    geo: null,
    categorySlugs: ["b", "bc", "c"],
    hasAutodrome: false,
  },
  {
    slug: "buloq-avtodrom",
    name: { uz: "Buloq Post Smart avtodrom filiali", ru: "Филиал «Булак Post Smart автодром»" },
    district: { uz: "Namangan tumani", ru: "Наманганский район" },
    landmark: {
      uz: "Buloq Post, Smart avtodrom hududida",
      ru: "Булак Пост, на территории автодрома Smart",
    },
    phones: sharedPhones,
    hours: standardHours,
    googleMapsUrl: "https://maps.app.goo.gl/bWWXtugT6yzsbi2L6",
    geo: null,
    categorySlugs: ["b", "bc", "c", "ce", "be", "d"],
    hasAutodrome: true,
  },
  {
    slug: "kamuna",
    name: { uz: "Kamuna filiali", ru: "Филиал Камуна" },
    district: { uz: "Namangan tumani", ru: "Наманганский район" },
    landmark: {
      uz: "Kamuna mahallasi",
      ru: "махалля Камуна",
    },
    phones: sharedPhones,
    hours: standardHours,
    googleMapsUrl: null,
    geo: null,
    categorySlugs: ["b", "bc"],
    hasAutodrome: false,
  },
  {
    slug: "bogishamol",
    name: { uz: "Bog'ishamol filiali", ru: "Филиал Богишамол" },
    district: { uz: "Namangan shahri", ru: "г. Наманган" },
    landmark: {
      uz: "Bog'ishamol dahasi",
      ru: "массив Богишамол",
    },
    phones: sharedPhones,
    hours: standardHours,
    googleMapsUrl: null,
    geo: null,
    categorySlugs: ["b", "bc", "a"],
    hasAutodrome: false,
  },
  {
    slug: "namangan-shahar",
    name: { uz: "Namangan shahar filiali", ru: "Филиал в г. Наманган" },
    district: { uz: "Namangan shahri, markaz", ru: "г. Наманган, центр" },
    landmark: {
      uz: "1-Mikrorayon, Texnika universitetidan 150 m pastda",
      ru: "1-й микрорайон, 150 м ниже Технического университета",
    },
    phones: sharedPhones,
    hours: standardHours,
    googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=41.009022,71.591299",
    geo: { lat: 41.009022, lng: 71.591299 },
    categorySlugs: ["b", "bc", "c", "be"],
    hasAutodrome: false,
  },
  {
    slug: "toraqorgon",
    name: { uz: "To'raqo'rg'on filiali", ru: "Филиал Туракурган" },
    district: { uz: "To'raqo'rg'on tumani", ru: "Туракурганский район" },
    landmark: {
      uz: "To'raqo'rg'on shahri",
      ru: "г. Туракурган",
    },
    phones: sharedPhones,
    hours: standardHours,
    googleMapsUrl: null,
    geo: null,
    categorySlugs: ["b", "bc", "c"],
    hasAutodrome: false,
  },
];
