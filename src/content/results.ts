import type { ResultPost } from "./types";

/**
 * PROVISIONAL CONTENT — figures are structural samples and MUST be replaced
 * with the school's real monthly exam results before launch
 * (docs/OPEN_ITEMS.md #9). Structure per TZ template T-08.
 */
export const resultPosts: ResultPost[] = [
  {
    id: "2026-06-buloq",
    month: "2026-06",
    branchSlug: "buloq-avtodrom",
    passedCount: 48,
    note: {
      uz: "Iyun oyi yakunlari — bitiruvchilarimizni tabriklaymiz!",
      ru: "Итоги июня — поздравляем наших выпускников!",
    },
  },
  {
    id: "2026-06-namangan",
    month: "2026-06",
    branchSlug: "namangan-shahar",
    passedCount: 36,
  },
  {
    id: "2026-05-kosonsoy",
    month: "2026-05",
    branchSlug: "kosonsoy",
    passedCount: 29,
  },
  {
    id: "2026-05-toraqorgon",
    month: "2026-05",
    branchSlug: "toraqorgon",
    passedCount: 31,
  },
];
