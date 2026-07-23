import type { ExpressCourse } from "./types";

/**
 * Prices and format are the real, client-provided figures (Telegram
 * announcement, 2026-07-22). Two packages per TZ doc 04 F-06 / T-04: theory
 * prep and 1-on-1 practical autodrome sessions, targeted at the
 * failed-exam segment and deliberately isolated from the category funnel.
 */
export const expressCourses: ExpressCourse[] = [
  {
    slug: "theory",
    name: {
      uz: "Nazariy imtihonga ekspress tayyorlov",
      ru: "Экспресс-подготовка к теории",
    },
    audience: {
      uz: "Nazariy imtihondan o'ta olmaganlar uchun",
      ru: "Для тех, кто не сдал теоретический экзамен",
    },
    description: {
      uz: "10 kunlik jadal kurs: qiyin mavzular, imtihon savollari tahlili va sinov testlari bilan qayta topshirishga ishonchli tayyorgarlik.",
      ru: "Интенсивный 10-дневный курс: сложные темы, разбор экзаменационных вопросов и пробные тесты для уверенной пересдачи.",
    },
    features: {
      uz: [
        "10 kunlik jadal dastur",
        "Imtihon savollarining to'liq tahlili",
        "Har kuni sinov testlari",
        "Tajribali o'qituvchi bilan kichik guruh",
      ],
      ru: [
        "Интенсивная программа на 10 дней",
        "Полный разбор экзаменационных вопросов",
        "Пробные тесты каждый день",
        "Малая группа с опытным преподавателем",
      ],
    },
    duration: { uz: "10 kun", ru: "10 дней" },
    price: 450_000,
  },
  {
    slug: "practice",
    name: {
      uz: "Amaliy haydashga ekspress tayyorlov",
      ru: "Экспресс-подготовка к вождению",
    },
    audience: {
      uz: "Amaliy imtihondan o'ta olmaganlar uchun",
      ru: "Для тех, кто не сдал практический экзамен",
    },
    description: {
      uz: "Instruktor bilan yakkama-yakka (1/1) avtodrom mashg'ulotlari: aynan sizga qiyin bo'lgan elementlar ustida ishlaymiz — 100% kafolat bilan.",
      ru: "Индивидуальные занятия 1/1 с инструктором на автодроме: отрабатываем именно те элементы, которые даются вам сложнее всего — с гарантией 100%.",
    },
    features: {
      uz: [
        "3 ta yakkama-yakka (1/1) mashg'ulot",
        "O'z avtodromimizda amaliyot",
        "Imtihon elementlarini maqsadli mashq qilish",
        "100% kafolat bilan",
      ],
      ru: [
        "3 индивидуальных занятия 1/1",
        "Практика на собственном автодроме",
        "Целевая отработка экзаменационных элементов",
        "Гарантия 100%",
      ],
    },
    duration: { uz: "3 mashg'ulot", ru: "3 занятия" },
    price: 170_000,
  },
];
