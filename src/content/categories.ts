import type { Category } from "./types";

/**
 * PROVISIONAL CONTENT — prices, promo deadlines, durations and age/stage
 * requirements are seed values pending the authoritative price list and the
 * client's confirmation (docs/OPEN_ITEMS.md #1, #2). Structure per TZ doc 04
 * §3.2 (7 categories; the E namespace stays reserved until confirmed).
 */
export const categories: Category[] = [
  {
    slug: "b",
    code: "B",
    name: { uz: "B toifa", ru: "Категория B" },
    tagline: {
      uz: "Yengil avtomobillar",
      ru: "Легковые автомобили",
    },
    audience: {
      uz: "Birinchi marta haydovchilik guvohnomasi olayotganlar uchun eng ommabop yo'nalish.",
      ru: "Самое популярное направление для тех, кто получает водительские права впервые.",
    },
    durationMonths: 2,
    minAge: 18,
    basePrice: 2_600_000,
    promo: { price: 2_100_000, endsOn: "2026-08-31" },
    included: {
      uz: [
        "To'liq nazariy kurs — yo'l harakati qoidalari va xavfsizlik asoslari",
        "Avtodromda amaliy mashg'ulotlar",
        "Shahar sharoitida haydash amaliyoti",
        "Imtihonga tayyorlov mashg'ulotlari",
      ],
      ru: [
        "Полный теоретический курс — ПДД и основы безопасности",
        "Практические занятия на автодроме",
        "Вождение в городских условиях",
        "Подготовка к экзамену",
      ],
    },
    curriculum: {
      uz: [
        "Yo'l harakati qoidalari va yo'l belgilari",
        "Haydovchilik psixologiyasi va xavfsiz boshqaruv",
        "Avtomobil tuzilishi asoslari",
        "Avtodromdagi amaliy elementlar",
        "Shahar bo'ylab haydash",
        "Yakuniy sinov imtihoni",
      ],
      ru: [
        "Правила дорожного движения и дорожные знаки",
        "Психология вождения и безопасное управление",
        "Основы устройства автомобиля",
        "Практические элементы на автодроме",
        "Вождение по городу",
        "Итоговый пробный экзамен",
      ],
    },
    requirements: {
      uz: [
        "Yosh: 18 dan boshlab (o'qishni 17 yoshda boshlash mumkin)",
        "Pasport yoki ID karta",
        "Tibbiy ma'lumotnoma (083-shakl)",
        "3.5×4.5 sm o'lchamdagi 4 ta foto",
      ],
      ru: [
        "Возраст: с 18 лет (обучение можно начать с 17)",
        "Паспорт или ID-карта",
        "Медицинская справка (форма 083)",
        "4 фото размером 3.5×4.5 см",
      ],
    },
    vehicles: {
      uz: ["Chevrolet Cobalt", "Chevrolet Nexia 3", "Chevrolet Spark"],
      ru: ["Chevrolet Cobalt", "Chevrolet Nexia 3", "Chevrolet Spark"],
    },
    branchSlugs: [
      "kosonsoy",
      "tergachi",
      "buloq-avtodrom",
      "kamuna",
      "bogishamol",
      "namangan-shahar",
      "toraqorgon",
    ],
    faq: [
      {
        question: {
          uz: "B toifa kursi qancha davom etadi?",
          ru: "Сколько длится курс категории B?",
        },
        answer: {
          uz: "O'rtacha 2 oy: nazariy kurs, avtodrom mashg'ulotlari va shahar amaliyoti bosqichma-bosqich o'tiladi.",
          ru: "В среднем 2 месяца: теория, занятия на автодроме и городская практика проходят поэтапно.",
        },
      },
      {
        question: {
          uz: "17 yoshda o'qishni boshlasam bo'ladimi?",
          ru: "Можно ли начать обучение в 17 лет?",
        },
        answer: {
          uz: "Ha, o'qishni 17 yoshda boshlash mumkin — guvohnoma imtihonini 18 yoshga to'lganda topshirasiz.",
          ru: "Да, начать обучение можно в 17 лет — экзамен на права вы сдаёте по достижении 18.",
        },
      },
    ],
    relatedSlugs: ["bc", "a"],
  },
  {
    slug: "bc",
    code: "BC",
    name: { uz: "BC toifa", ru: "Категория BC" },
    tagline: {
      uz: "Yengil va yuk avtomobillari birga",
      ru: "Легковые и грузовые вместе",
    },
    audience: {
      uz: "Bitta kursda ham yengil, ham yuk avtomobilini boshqarishni o'rganmoqchi bo'lganlar uchun.",
      ru: "Для тех, кто хочет в одном курсе освоить и легковой, и грузовой автомобиль.",
    },
    durationMonths: 3,
    minAge: 18,
    basePrice: 4_200_000,
    promo: { price: 3_500_000, endsOn: "2026-08-31" },
    included: {
      uz: [
        "B va C toifalari uchun to'liq nazariy kurs",
        "Yengil va yuk avtomobilida amaliy mashg'ulotlar",
        "Avtodrom va shahar amaliyoti",
        "Imtihonga tayyorlov",
      ],
      ru: [
        "Полная теория для категорий B и C",
        "Практика на легковом и грузовом автомобилях",
        "Автодром и городская практика",
        "Подготовка к экзамену",
      ],
    },
    curriculum: {
      uz: [
        "Yo'l harakati qoidalari (kengaytirilgan dastur)",
        "Yengil avtomobilda amaliyot",
        "Yuk avtomobilida amaliyot",
        "Yuk tashish xavfsizligi asoslari",
        "Shahar va trassa sharoitida haydash",
      ],
      ru: [
        "ПДД (расширенная программа)",
        "Практика на легковом автомобиле",
        "Практика на грузовом автомобиле",
        "Основы безопасной перевозки грузов",
        "Вождение в городе и на трассе",
      ],
    },
    requirements: {
      uz: [
        "Yosh: 18 dan boshlab",
        "Pasport yoki ID karta",
        "Tibbiy ma'lumotnoma (083-shakl)",
        "3.5×4.5 sm o'lchamdagi 4 ta foto",
      ],
      ru: [
        "Возраст: с 18 лет",
        "Паспорт или ID-карта",
        "Медицинская справка (форма 083)",
        "4 фото размером 3.5×4.5 см",
      ],
    },
    vehicles: {
      uz: ["Chevrolet Cobalt", "Isuzu yuk avtomobili"],
      ru: ["Chevrolet Cobalt", "Грузовик Isuzu"],
    },
    branchSlugs: [
      "kosonsoy",
      "tergachi",
      "buloq-avtodrom",
      "kamuna",
      "bogishamol",
      "namangan-shahar",
      "toraqorgon",
    ],
    faq: [
      {
        question: {
          uz: "Nega alohida B va C emas, BC toifasini tanlash kerak?",
          ru: "Почему стоит выбрать BC, а не отдельные B и C?",
        },
        answer: {
          uz: "BC kursi ikki toifani bir vaqtda beradi: vaqt va xarajat alohida o'qiganga nisbatan sezilarli tejaladi.",
          ru: "Курс BC даёт две категории сразу: время и расходы заметно меньше, чем при раздельном обучении.",
        },
      },
    ],
    relatedSlugs: ["b", "c"],
  },
  {
    slug: "c",
    code: "C",
    name: { uz: "C toifa", ru: "Категория C" },
    tagline: {
      uz: "Yuk avtomobillari",
      ru: "Грузовые автомобили",
    },
    audience: {
      uz: "Yuk tashish sohasida ishlamoqchi bo'lgan haydovchilar uchun kasbiy yo'nalish.",
      ru: "Профессиональное направление для водителей, планирующих работать в грузоперевозках.",
    },
    durationMonths: 2.5,
    minAge: 18,
    basePrice: 3_400_000,
    promo: { price: 2_900_000, endsOn: "2026-08-31" },
    included: {
      uz: [
        "To'liq nazariy kurs",
        "Yuk avtomobilida amaliy mashg'ulotlar",
        "Avtodrom va trassa amaliyoti",
        "Imtihonga tayyorlov",
      ],
      ru: [
        "Полный теоретический курс",
        "Практика на грузовом автомобиле",
        "Автодром и трасса",
        "Подготовка к экзамену",
      ],
    },
    curriculum: {
      uz: [
        "Yo'l harakati qoidalari",
        "Yuk avtomobili tuzilishi va texnik xizmat",
        "Yuk ortish va mahkamlash qoidalari",
        "Avtodromdagi maxsus elementlar",
        "Trassa va shahar amaliyoti",
      ],
      ru: [
        "Правила дорожного движения",
        "Устройство грузовика и техобслуживание",
        "Правила погрузки и крепления груза",
        "Специальные элементы на автодроме",
        "Практика на трассе и в городе",
      ],
    },
    requirements: {
      uz: [
        "Yosh: 18 dan boshlab",
        "Pasport yoki ID karta",
        "Tibbiy ma'lumotnoma (083-shakl)",
        "3.5×4.5 sm o'lchamdagi 4 ta foto",
      ],
      ru: [
        "Возраст: с 18 лет",
        "Паспорт или ID-карта",
        "Медицинская справка (форма 083)",
        "4 фото размером 3.5×4.5 см",
      ],
    },
    vehicles: {
      uz: ["Isuzu yuk avtomobili"],
      ru: ["Грузовик Isuzu"],
    },
    branchSlugs: ["tergachi", "buloq-avtodrom", "namangan-shahar", "toraqorgon"],
    faq: [
      {
        question: {
          uz: "C toifa bilan qanday ishlarda ishlash mumkin?",
          ru: "Кем можно работать с категорией C?",
        },
        answer: {
          uz: "C toifa yuk tashish, qurilish va logistika sohalarida haydovchi bo'lib ishlash imkonini beradi.",
          ru: "Категория C открывает работу водителем в грузоперевозках, строительстве и логистике.",
        },
      },
    ],
    relatedSlugs: ["ce", "bc"],
  },
  {
    slug: "ce",
    code: "CE",
    name: { uz: "CE toifa", ru: "Категория CE" },
    tagline: {
      uz: "Tirkamali yuk avtomobillari",
      ru: "Грузовики с прицепом",
    },
    audience: {
      uz: "C toifadagi tajribali haydovchilar uchun — tirkamali tarkiblar va xalqaro qatnovlarga yo'l.",
      ru: "Для опытных водителей категории C — путь к автопоездам и международным рейсам.",
    },
    durationMonths: 1.5,
    minAge: 19,
    basePrice: 2_900_000,
    promo: { price: 2_500_000, endsOn: "2026-08-31" },
    included: {
      uz: [
        "Tirkamali tarkib bilan ishlash nazariyasi",
        "Avtodromda tirkama bilan manyovr amaliyoti",
        "Trassa amaliyoti",
        "Imtihonga tayyorlov",
      ],
      ru: [
        "Теория работы с прицепным составом",
        "Практика манёвров с прицепом на автодроме",
        "Практика на трассе",
        "Подготовка к экзамену",
      ],
    },
    curriculum: {
      uz: [
        "Tirkama ulash va texnik tekshiruv",
        "Orqaga yurish va tor joyda manyovr",
        "Yuk taqsimoti va tormozlanish xususiyatlari",
        "Trassada xavfsiz harakatlanish",
      ],
      ru: [
        "Сцепка прицепа и технический осмотр",
        "Движение задним ходом и манёвры в узких местах",
        "Распределение груза и особенности торможения",
        "Безопасное движение по трассе",
      ],
    },
    requirements: {
      uz: [
        "C toifadagi guvohnoma va kamida 1 yil staj",
        "Pasport yoki ID karta",
        "Tibbiy ma'lumotnoma (083-shakl)",
        "3.5×4.5 sm o'lchamdagi 4 ta foto",
      ],
      ru: [
        "Права категории C и стаж от 1 года",
        "Паспорт или ID-карта",
        "Медицинская справка (форма 083)",
        "4 фото размером 3.5×4.5 см",
      ],
    },
    vehicles: {
      uz: ["Tirkamali Isuzu tarkibi"],
      ru: ["Автопоезд Isuzu с прицепом"],
    },
    branchSlugs: ["buloq-avtodrom"],
    faq: [
      {
        question: {
          uz: "CE uchun qanday staj talab qilinadi?",
          ru: "Какой стаж нужен для CE?",
        },
        answer: {
          uz: "CE kursiga yozilish uchun C toifadagi guvohnoma bilan kamida 1 yillik haydovchilik staji talab qilinadi.",
          ru: "Для записи на курс CE требуются права категории C и водительский стаж не менее 1 года.",
        },
      },
    ],
    relatedSlugs: ["c", "be"],
  },
  {
    slug: "be",
    code: "BE",
    name: { uz: "BE toifa", ru: "Категория BE" },
    tagline: {
      uz: "Tirkamali yengil avtomobillar",
      ru: "Легковые с прицепом",
    },
    audience: {
      uz: "Og'ir tirkama bilan yurishi kerak bo'lgan B toifa haydovchilari uchun.",
      ru: "Для водителей категории B, которым нужен тяжёлый прицеп.",
    },
    durationMonths: 1,
    minAge: 19,
    basePrice: 2_400_000,
    promo: { price: 2_000_000, endsOn: "2026-08-31" },
    included: {
      uz: [
        "Tirkama bilan ishlash nazariyasi",
        "Avtodromda amaliy mashg'ulotlar",
        "Yo'l amaliyoti",
        "Imtihonga tayyorlov",
      ],
      ru: [
        "Теория работы с прицепом",
        "Практика на автодроме",
        "Практика на дороге",
        "Подготовка к экзамену",
      ],
    },
    curriculum: {
      uz: [
        "Tirkama ulash va yuk joylash",
        "Orqaga yurish va burilishlar",
        "Tormozlanish masofasi va tezlik rejimi",
        "Yo'lda xavfsiz harakatlanish",
      ],
      ru: [
        "Сцепка прицепа и размещение груза",
        "Движение задним ходом и повороты",
        "Тормозной путь и скоростной режим",
        "Безопасное движение по дороге",
      ],
    },
    requirements: {
      uz: [
        "B toifadagi guvohnoma va kamida 1 yil staj",
        "Pasport yoki ID karta",
        "Tibbiy ma'lumotnoma (083-shakl)",
        "3.5×4.5 sm o'lchamdagi 4 ta foto",
      ],
      ru: [
        "Права категории B и стаж от 1 года",
        "Паспорт или ID-карта",
        "Медицинская справка (форма 083)",
        "4 фото размером 3.5×4.5 см",
      ],
    },
    vehicles: {
      uz: ["Tirkamali Chevrolet Cobalt"],
      ru: ["Chevrolet Cobalt с прицепом"],
    },
    branchSlugs: ["buloq-avtodrom", "namangan-shahar"],
    faq: [
      {
        question: {
          uz: "BE toifa kimlarga kerak bo'ladi?",
          ru: "Кому нужна категория BE?",
        },
        answer: {
          uz: "Umumiy massasi 750 kg dan ortiq tirkamani B toifadagi avtomobil bilan tortish uchun BE toifasi talab qilinadi.",
          ru: "Категория BE требуется, чтобы буксировать легковым автомобилем прицеп массой свыше 750 кг.",
        },
      },
    ],
    relatedSlugs: ["b", "ce"],
  },
  {
    slug: "a",
    code: "A",
    name: { uz: "A toifa", ru: "Категория A" },
    tagline: {
      uz: "Mototsikllar",
      ru: "Мотоциклы",
    },
    audience: {
      uz: "Mototsikl haydashni xavfsiz va professional o'rganmoqchi bo'lganlar uchun.",
      ru: "Для тех, кто хочет безопасно и профессионально освоить мотоцикл.",
    },
    durationMonths: 1.5,
    minAge: 18,
    basePrice: 1_800_000,
    promo: { price: 1_500_000, endsOn: "2026-08-31" },
    included: {
      uz: [
        "To'liq nazariy kurs",
        "Himoya jihozlari bilan amaliy mashg'ulotlar",
        "Avtodromda manyovr elementlari",
        "Imtihonga tayyorlov",
      ],
      ru: [
        "Полный теоретический курс",
        "Практика в защитной экипировке",
        "Элементы манёвров на автодроме",
        "Подготовка к экзамену",
      ],
    },
    curriculum: {
      uz: [
        "Yo'l harakati qoidalari",
        "Mototsikl boshqaruvi asoslari",
        "Muvozanat va past tezlikdagi manyovrlar",
        "Avtodromdagi imtihon elementlari",
      ],
      ru: [
        "Правила дорожного движения",
        "Основы управления мотоциклом",
        "Баланс и манёвры на малой скорости",
        "Экзаменационные элементы на автодроме",
      ],
    },
    requirements: {
      uz: [
        "Yosh: 18 dan boshlab",
        "Pasport yoki ID karta",
        "Tibbiy ma'lumotnoma (083-shakl)",
        "3.5×4.5 sm o'lchamdagi 4 ta foto",
      ],
      ru: [
        "Возраст: с 18 лет",
        "Паспорт или ID-карта",
        "Медицинская справка (форма 083)",
        "4 фото размером 3.5×4.5 см",
      ],
    },
    vehicles: {
      uz: ["O'quv mototsikllari"],
      ru: ["Учебные мотоциклы"],
    },
    branchSlugs: ["kosonsoy", "bogishamol"],
    faq: [
      {
        question: {
          uz: "Himoya jihozlari beriladimi?",
          ru: "Выдаётся ли защитная экипировка?",
        },
        answer: {
          uz: "Ha, amaliy mashg'ulotlarda dubulg'a va himoya jihozlari avtomaktab tomonidan beriladi.",
          ru: "Да, на практических занятиях шлем и защитную экипировку предоставляет автошкола.",
        },
      },
    ],
    relatedSlugs: ["b"],
  },
  {
    slug: "d",
    code: "D",
    name: { uz: "D toifa", ru: "Категория D" },
    tagline: {
      uz: "Avtobuslar",
      ru: "Автобусы",
    },
    audience: {
      uz: "Yo'lovchi tashish sohasida ishlamoqchi bo'lgan tajribali haydovchilar uchun.",
      ru: "Для опытных водителей, планирующих работать в пассажирских перевозках.",
    },
    durationMonths: 2,
    minAge: 21,
    basePrice: 4_800_000,
    included: {
      uz: [
        "Yo'lovchi tashish nazariyasi",
        "Avtobusda amaliy mashg'ulotlar",
        "Avtodrom va shahar amaliyoti",
        "Imtihonga tayyorlov",
      ],
      ru: [
        "Теория пассажирских перевозок",
        "Практика на автобусе",
        "Автодром и городская практика",
        "Подготовка к экзамену",
      ],
    },
    curriculum: {
      uz: [
        "Yo'lovchi tashish qoidalari va mas'uliyat",
        "Avtobus tuzilishi va texnik tekshiruv",
        "Bekatlarda to'xtash va yo'lovchi xavfsizligi",
        "Shahar marshrutlarida amaliyot",
      ],
      ru: [
        "Правила пассажирских перевозок и ответственность",
        "Устройство автобуса и технический осмотр",
        "Остановки и безопасность пассажиров",
        "Практика на городских маршрутах",
      ],
    },
    requirements: {
      uz: [
        "Yosh: 21 dan boshlab",
        "C toifadagi guvohnoma va haydovchilik staji",
        "Tibbiy ma'lumotnoma (083-shakl)",
        "3.5×4.5 sm o'lchamdagi 4 ta foto",
      ],
      ru: [
        "Возраст: с 21 года",
        "Права категории C и водительский стаж",
        "Медицинская справка (форма 083)",
        "4 фото размером 3.5×4.5 см",
      ],
    },
    vehicles: {
      uz: ["O'quv avtobusi"],
      ru: ["Учебный автобус"],
    },
    branchSlugs: ["buloq-avtodrom"],
    faq: [
      {
        question: {
          uz: "D toifaga yozilish uchun qanday shartlar bor?",
          ru: "Какие условия для записи на категорию D?",
        },
        answer: {
          uz: "D toifa uchun 21 yoshga to'lgan bo'lish va C toifadagi guvohnoma bilan haydovchilik staji talab qilinadi. Aniq shartlarni qabul bo'limi bilan aniqlashtiring.",
          ru: "Для категории D требуется возраст от 21 года, права категории C и водительский стаж. Точные условия уточните в приёмной.",
        },
      },
    ],
    relatedSlugs: ["c", "ce"],
  },
];
