import type { NewsPost } from "./types";

/**
 * Yangiliklar / News. Newest first — the page renders this order as-is.
 *
 * Deliberately conservative: every entry links to real, verified media
 * already on the platform (event and graduation footage reused from the
 * Gallery), and every caption is a plain, factual description of what the
 * media shows — no invented dates, attendance figures, or claims. Real
 * article text (what actually happened, when) is pending from the school;
 * see docs/OPEN_ITEMS.md.
 */
export const newsPosts: NewsPost[] = [
  {
    id: "bitiruv-marosimi",
    title: {
      uz: "Bitiruvchilarimiz tabriklandi",
      ru: "Поздравляем наших выпускников",
    },
    body: {
      uz: "Navbatdagi guruh o'quvchilarimiz imtihonlardan muvaffaqiyatli o'tib, haydovchilik guvohnomasiga ega bo'lishdi. Marosimdan lavha.",
      ru: "Очередная группа наших учеников успешно сдала экзамены и получила водительские удостоверения. Момент с церемонии.",
    },
    media: {
      src: "/assets/videos/graduation/vdgr.mp4",
      poster: "/assets/videos/posters/vdgr.jpg",
      video: true,
      alt: {
        uz: "Bitiruv marosimi lavhasi",
        ru: "Момент выпускной церемонии",
      },
      width: 720,
      height: 1280,
    },
  },
  {
    id: "yangi-guruh-bitirdi",
    title: {
      uz: "Yana bir guruh o'qishni yakunladi",
      ru: "Ещё одна группа завершила обучение",
    },
    body: {
      uz: "Nazariy va amaliy kursni to'liq yakunlagan o'quvchilarimizni tabriklaymiz. Ularga yo'lda omad tilaymiz.",
      ru: "Поздравляем наших учеников, полностью завершивших теоретический и практический курс. Желаем удачи на дороге.",
    },
    media: {
      src: "/assets/videos/graduation/vdgr2.mp4",
      poster: "/assets/videos/posters/vdgr2.jpg",
      video: true,
      alt: {
        uz: "Bitiruvchilar tabrigi",
        ru: "Поздравление выпускников",
      },
      width: 720,
      height: 1280,
    },
  },
  {
    id: "turon-tadbiri",
    title: {
      uz: "Turon Avtomaktab tadbiridan lavhalar",
      ru: "Кадры с мероприятия Turon Avtomaktab",
    },
    body: {
      uz: "Jamoamiz va o'quvchilarimiz ishtirokida o'tkazilgan tadbirdan qisqa video.",
      ru: "Короткое видео с мероприятия, в котором приняли участие наша команда и ученики.",
    },
    media: {
      src: "/assets/photos/events/evnt.mp4",
      poster: "/assets/videos/posters/evnt.jpg",
      video: true,
      alt: {
        uz: "Turon Avtomaktab tadbiri",
        ru: "Мероприятие Turon Avtomaktab",
      },
      width: 464,
      height: 848,
    },
  },
  {
    id: "narxlar-tadbiri",
    title: {
      uz: "Avtodromda bo'lib o'tgan tadbir",
      ru: "Мероприятие, прошедшее на автодроме",
    },
    body: {
      uz: "Avtodromimizda o'tkazilgan tadbirdan video lavha.",
      ru: "Видео с мероприятия, прошедшего на нашем автодроме.",
    },
    media: {
      src: "/assets/photos/events/event-main.mp4",
      poster: "/assets/videos/posters/event-main.jpg",
      video: true,
      alt: {
        uz: "Avtodromda tadbir",
        ru: "Мероприятие на автодроме",
      },
      width: 1072,
      height: 1904,
    },
  },
];
