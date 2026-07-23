import type { FaqItem } from "./types";

/** Site-wide FAQ, categorized per TZ template T-11. Featured = Home top-5. */
export const faqItems: FaqItem[] = [
  {
    id: "enroll-how",
    topic: "enrollment",
    featured: true,
    question: {
      uz: "Qanday ro'yxatdan o'taman?",
      ru: "Как записаться на обучение?",
    },
    answer: {
      uz: "Saytdagi formani to'ldiring yoki qo'ng'iroq qiling — menejerimiz ish vaqtida siz bilan bog'lanadi, toifa va filialni tanlashda yordam beradi. O'rin oldindan to'lov bilan band qilinadi.",
      ru: "Заполните форму на сайте или позвоните — наш менеджер свяжется с вами в рабочее время и поможет выбрать категорию и филиал. Место бронируется предоплатой.",
    },
  },
  {
    id: "enroll-docs",
    topic: "documents",
    featured: true,
    question: {
      uz: "Qanday hujjatlar kerak?",
      ru: "Какие документы нужны?",
    },
    answer: {
      uz: "Pasport yoki ID karta, tibbiy ma'lumotnoma (083-shakl) va 3.5×4.5 sm o'lchamdagi 4 ta foto. Ba'zi toifalar uchun mavjud guvohnoma ham talab qilinadi.",
      ru: "Паспорт или ID-карта, медицинская справка (форма 083) и 4 фото 3.5×4.5 см. Для некоторых категорий также требуются уже имеющиеся права.",
    },
  },
  {
    id: "payment-installment",
    topic: "payment",
    featured: true,
    question: {
      uz: "To'lovni bo'lib to'lash mumkinmi?",
      ru: "Можно ли оплатить в рассрочку?",
    },
    answer: {
      uz: "Ha. O'rinni band qilish uchun oldindan to'lov kifoya, qolgan summani o'qish davomida bo'lib to'lashingiz mumkin.",
      ru: "Да. Для брони места достаточно предоплаты, остаток можно вносить частями в течение обучения.",
    },
  },
  {
    id: "payment-methods",
    topic: "payment",
    featured: false,
    question: {
      uz: "Qanday to'lov usullari bor?",
      ru: "Какие способы оплаты есть?",
    },
    answer: {
      uz: "To'lov filialda naqd yoki karta orqali qabul qilinadi. Onlayn to'lov hozircha mavjud emas.",
      ru: "Оплата принимается в филиале наличными или картой. Онлайн-оплаты пока нет.",
    },
  },
  {
    id: "process-duration",
    topic: "process",
    featured: true,
    question: {
      uz: "O'qish qancha davom etadi?",
      ru: "Сколько длится обучение?",
    },
    answer: {
      uz: "Toifaga qarab 1 oydan 3 oygacha. Har bir toifa sahifasida aniq muddat ko'rsatilgan.",
      ru: "В зависимости от категории — от 1 до 3 месяцев. Точный срок указан на странице каждой категории.",
    },
  },
  {
    id: "process-schedule",
    topic: "process",
    featured: false,
    question: {
      uz: "Mashg'ulotlar qachon o'tkaziladi?",
      ru: "Когда проходят занятия?",
    },
    answer: {
      uz: "Guruhlar ertalabki va kechki vaqtlarga bo'lingan — ish yoki o'qish bilan birga olib borish qulay. Aniq jadvalni filial bilan kelishasiz.",
      ru: "Группы делятся на утренние и вечерние — удобно совмещать с работой или учёбой. Точное расписание согласуете с филиалом.",
    },
  },
  {
    id: "exams-where",
    topic: "exams",
    featured: true,
    question: {
      uz: "Imtihonlar qayerda topshiriladi?",
      ru: "Где сдаются экзамены?",
    },
    answer: {
      uz: "Ichki imtihonlar o'z avtodromimizda o'tkaziladi, davlat imtihoni esa belgilangan imtihon markazida topshiriladi. Bosqichlarga to'liq tayyorlab boramiz.",
      ru: "Внутренние экзамены проходят на нашем автодроме, государственный экзамен сдаётся в экзаменационном центре. Мы готовим ко всем этапам.",
    },
  },
  {
    id: "exams-fail",
    topic: "exams",
    featured: false,
    question: {
      uz: "Imtihondan o'ta olmasam nima bo'ladi?",
      ru: "Что делать, если не сдал экзамен?",
    },
    answer: {
      uz: "Qayta topshirishga tayyorlanish uchun maxsus ekspress kurslarimiz bor: nazariya bo'yicha 10 kunlik jadal kurs va instruktor bilan yakkama-yakka amaliy mashg'ulotlar.",
      ru: "Для пересдачи есть специальные экспресс-курсы: интенсив по теории на 10 дней и индивидуальные практические занятия с инструктором.",
    },
  },
  {
    id: "documents-age",
    topic: "documents",
    featured: false,
    question: {
      uz: "Necha yoshdan o'qishga yozilsa bo'ladi?",
      ru: "С какого возраста можно записаться?",
    },
    answer: {
      uz: "B toifa uchun o'qishni 17 yoshdan boshlash mumkin, imtihon 18 yoshda topshiriladi. Boshqa toifalar uchun yosh talablari toifa sahifalarida ko'rsatilgan.",
      ru: "Для категории B обучение можно начать с 17 лет, экзамен сдаётся в 18. Возрастные требования других категорий указаны на их страницах.",
    },
  },
];
