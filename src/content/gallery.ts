import type { GalleryAlbum } from "./types";

/**
 * Curated school media (docs/OPEN_ITEMS.md #8). Every photo/video album on
 * the redesigned Gallery page (masonry grid + lightbox) is sourced from
 * this list. Videos carry a pre-extracted `poster` frame so the grid never
 * autoplays media inline — only the lightbox loads the actual file.
 */
export const galleryAlbums: GalleryAlbum[] = [
  {
    id: "avtodrom",
    title: { uz: "Avtodrom", ru: "Автодром" },
    kind: "autodrome",
    items: [
      {
        src: "/assets/photos/autodrome/fullshown.png",
        alt: { uz: "Avtodrom mashqlar maydonchasi", ru: "Учебная площадка автодрома" },
        width: 1024,
        height: 1024,
      },
      {
        src: "/assets/videos/autodrome/vd5.mp4",
        poster: "/assets/videos/hero/hero-poster.jpg",
        video: true,
        alt: { uz: "O'quv avtomobili avtodromda", ru: "Учебный автомобиль на автодроме" },
        width: 720,
        height: 1280,
      },
      {
        src: "/assets/photos/autodrome/image%202.png",
        alt: { uz: "Avtodromda mashg'ulot", ru: "Занятие на автодроме" },
        width: 1024,
        height: 1024,
      },
      {
        src: "/assets/photos/autodrome/image%20copy%202.png",
        alt: { uz: "Avtodrom mashqlari", ru: "Упражнения на автодроме" },
        width: 960,
        height: 1280,
      },
      {
        src: "/assets/videos/autodrome/vd03.mp4",
        poster: "/assets/videos/posters/vd03.jpg",
        video: true,
        alt: { uz: "Avtodromda haydash mashqi", ru: "Практика вождения на автодроме" },
        width: 720,
        height: 1280,
      },
      {
        src: "/assets/photos/autodrome/image%20copy%203.png",
        alt: { uz: "Avtodrom maydonchasi", ru: "Площадка автодрома" },
        width: 1280,
        height: 960,
      },
      {
        src: "/assets/photos/autodrome/image%20copy.png",
        alt: { uz: "Avtodrom ko'rinishi", ru: "Вид автодрома" },
        width: 1024,
        height: 576,
      },
      {
        src: "/assets/videos/autodrome/vd4.mp4",
        poster: "/assets/videos/posters/vd4.jpg",
        video: true,
        alt: { uz: "Avtodrom mashg'uloti", ru: "Занятие на автодроме" },
        width: 720,
        height: 1280,
      },
      {
        src: "/assets/photos/autodrome/image.png",
        alt: { uz: "Avtodrom mashqlar zonasi", ru: "Зона упражнений автодрома" },
        width: 1024,
        height: 1024,
      },
      {
        src: "/assets/videos/autodrome/vd6.mp4",
        poster: "/assets/videos/posters/vd6.jpg",
        video: true,
        alt: { uz: "Avtodrom videosi", ru: "Видео с автодрома" },
        width: 720,
        height: 1280,
      },
    ],
  },
  {
    id: "nazariy-darslar",
    title: { uz: "Nazariy darslar", ru: "Теоретические занятия" },
    kind: "classroom",
    items: [
      {
        src: "/assets/photos/classrooms/2.png",
        alt: { uz: "Nazariy dars xonasi", ru: "Класс теоретических занятий" },
        width: 1280,
        height: 960,
      },
      {
        src: "/assets/photos/classrooms/5.png",
        alt: { uz: "O'quv sinfida dars", ru: "Урок в учебном классе" },
        width: 1280,
        height: 960,
      },
      {
        src: "/assets/photos/classrooms/image%20copy.png",
        alt: { uz: "Talabalar nazariy darsda", ru: "Курсанты на теоретическом занятии" },
        width: 1280,
        height: 960,
      },
      {
        src: "/assets/photos/classrooms/image.png",
        alt: { uz: "Sinf xonasi", ru: "Учебный класс" },
        width: 1280,
        height: 720,
      },
      {
        src: "/assets/photos/classrooms/image3.png",
        alt: { uz: "Nazariy mashg'ulot", ru: "Теоретическое занятие" },
        width: 1280,
        height: 960,
      },
      {
        src: "/assets/photos/classrooms/image4.png",
        alt: { uz: "O'quv sinfi", ru: "Учебный класс" },
        width: 1280,
        height: 960,
      },
    ],
  },
  {
    id: "bitiruv-marosimlari",
    title: { uz: "Bitiruv marosimlari", ru: "Выпускные мероприятия" },
    kind: "graduation",
    items: [
      {
        src: "/assets/videos/graduation/vd2.mp4",
        poster: "/assets/videos/posters/vd2.jpg",
        video: true,
        alt: { uz: "Bitiruv marosimi", ru: "Выпускной вечер" },
        width: 1440,
        height: 2560,
      },
      {
        src: "/assets/videos/graduation/vdgr.mp4",
        poster: "/assets/videos/posters/vdgr.jpg",
        video: true,
        alt: { uz: "Bitiruvchilar tabrigi", ru: "Поздравление выпускников" },
        width: 720,
        height: 1280,
      },
      {
        src: "/assets/videos/graduation/vdgr2.mp4",
        poster: "/assets/videos/posters/vdgr2.jpg",
        video: true,
        alt: { uz: "Bitiruv kuni lavhasi", ru: "Момент выпускного дня" },
        width: 720,
        height: 1280,
      },
    ],
  },
  {
    id: "oquv-avtomobillari",
    title: { uz: "O'quv avtomobillari", ru: "Учебные автомобили" },
    kind: "vehicles",
    items: [
      {
        src: "/assets/photos/vehicles/image%20copy%202.png",
        alt: { uz: "O'quv avtomobili", ru: "Учебный автомобиль" },
        width: 640,
        height: 640,
      },
      {
        src: "/assets/photos/vehicles/image%20copy%203.png",
        alt: { uz: "Amaliy mashg'ulot avtomobili", ru: "Автомобиль для практики" },
        width: 960,
        height: 1280,
      },
      {
        src: "/assets/photos/vehicles/image%20copy%204.png",
        alt: { uz: "Turon Avtomaktab avtomobili", ru: "Автомобиль Turon Avtomaktab" },
        width: 749,
        height: 1280,
      },
      {
        src: "/assets/photos/vehicles/image%20copy%205.png",
        alt: { uz: "O'quv mashinasi", ru: "Учебная машина" },
        width: 960,
        height: 1280,
      },
      {
        src: "/assets/photos/vehicles/image%20copy.png",
        alt: { uz: "Avtomaktab o'quv avtomobili", ru: "Учебный автомобиль автошколы" },
        width: 1280,
        height: 960,
      },
      {
        src: "/assets/photos/vehicles/image.png",
        alt: { uz: "Amaliyot avtomobili", ru: "Автомобиль для практических занятий" },
        width: 1280,
        height: 960,
      },
    ],
  },
  {
    id: "sertifikatlar",
    title: { uz: "Sertifikatlar", ru: "Сертификаты" },
    kind: "certificates",
    items: [
      {
        src: "/assets/photos/certificates/image.png",
        alt: { uz: "Guvohnoma topshirish marosimi", ru: "Церемония вручения удостоверений" },
        width: 1280,
        height: 960,
      },
      {
        src: "/assets/photos/certificates/image%20copy.png",
        alt: { uz: "Bitiruvchilar guvohnoma bilan", ru: "Выпускники с удостоверениями" },
        width: 1280,
        height: 960,
      },
      {
        src: "/assets/photos/certificates/image%20copy%202.png",
        alt: { uz: "Guvohnoma topshirish", ru: "Вручение удостоверения" },
        width: 2560,
        height: 1920,
      },
      {
        src: "/assets/photos/certificates/image%20copy%203.png",
        alt: { uz: "Bitiruvchi guvohnoma bilan", ru: "Выпускник с удостоверением" },
        width: 1724,
        height: 2560,
      },
      {
        src: "/assets/photos/certificates/image%20copy%204.png",
        alt: { uz: "Guvohnoma sohibi", ru: "Обладатель удостоверения" },
        width: 1440,
        height: 2560,
      },
      {
        src: "/assets/photos/certificates/image%20copy%205.png",
        alt: { uz: "Muvaffaqiyatli bitiruvchi", ru: "Успешный выпускник" },
        width: 1440,
        height: 2560,
      },
      {
        src: "/assets/photos/certificates/image%20copy%206.png",
        alt: { uz: "Guvohnoma topshirish lavhasi", ru: "Момент вручения удостоверения" },
        width: 1280,
        height: 964,
      },
      {
        src: "/assets/photos/certificates/image%20copy%207.png",
        alt: { uz: "Guvohnoma bilan surat", ru: "Фото с удостоверением" },
        width: 1280,
        height: 960,
      },
    ],
  },
  {
    id: "oquvchilar",
    title: { uz: "O'quvchilarimiz", ru: "Наши ученики" },
    kind: "students",
    items: [
      {
        src: "/assets/photos/students/image.png",
        alt: { uz: "Amaliy darsda o'quvchi", ru: "Ученик на практическом занятии" },
        width: 1280,
        height: 720,
      },
      {
        src: "/assets/photos/students/image%20copy.png",
        alt: { uz: "O'quvchi mashg'ulotda", ru: "Ученик на занятии" },
        width: 625,
        height: 1280,
      },
      {
        src: "/assets/photos/students/image%20copy%202.png",
        alt: { uz: "O'quvchilar guruhi", ru: "Группа учеников" },
        width: 1280,
        height: 960,
      },
      {
        src: "/assets/photos/students/image%20copy%203.png",
        alt: { uz: "Nazariy darsda o'quvchilar", ru: "Ученики на теоретическом занятии" },
        width: 1280,
        height: 960,
      },
      {
        src: "/assets/photos/students/image%20copy%204.png",
        alt: { uz: "O'quvchilar jamoasi", ru: "Группа учеников" },
        width: 1280,
        height: 960,
      },
      {
        src: "/assets/photos/students/image%20copy%205.png",
        alt: { uz: "O'quvchi amaliyotda", ru: "Ученик на практике" },
        width: 1280,
        height: 576,
      },
    ],
  },
  {
    id: "instruktorlar",
    title: { uz: "Instruktorlar jamoasi", ru: "Команда инструкторов" },
    kind: "instructors",
    items: [
      {
        src: "/assets/photos/instructors/image.png",
        alt: { uz: "Instruktorlar va jamoa a'zolari", ru: "Инструкторы и сотрудники" },
        width: 1440,
        height: 2560,
      },
    ],
  },
  {
    id: "tadbirlar",
    title: { uz: "Tadbirlar", ru: "Мероприятия" },
    kind: "events",
    items: [
      {
        src: "/assets/photos/events/vd1.mp4",
        poster: "/assets/videos/posters/vd1.jpg",
        video: true,
        alt: { uz: "Jamoa tadbiri", ru: "Корпоративное мероприятие" },
        width: 720,
        height: 1280,
      },
      {
        src: "/assets/photos/events/evnt.mp4",
        poster: "/assets/videos/posters/evnt.jpg",
        video: true,
        alt: { uz: "Turon Avtomaktab tadbiri", ru: "Мероприятие Turon Avtomaktab" },
        width: 464,
        height: 848,
      },
      {
        src: "/assets/photos/events/event-main.mp4",
        poster: "/assets/videos/posters/event-main.jpg",
        video: true,
        alt: { uz: "Avtodromda narxlar haqida video", ru: "Видео о ценах на автодроме" },
        width: 1072,
        height: 1904,
      },
    ],
  },
];
