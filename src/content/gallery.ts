import type { GalleryAlbum } from "./types";

/**
 * Curated school media (docs/OPEN_ITEMS.md #8). The lightbox grid ships
 * with the media milestone; this data backs the Home preview count and the
 * Gallery page's item total in the meantime, and feeds the grid directly
 * once it lands.
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
        src: "/assets/photos/autodrome/image.png",
        alt: { uz: "Avtodrom mashqlar zonasi", ru: "Зона упражнений автодрома" },
        width: 1024,
        height: 1024,
      },
      {
        src: "/assets/videos/autodrome/vd03.mp4",
        alt: { uz: "Avtodromda haydash mashqi", ru: "Практика вождения на автодроме" },
        width: 720,
        height: 1280,
      },
      {
        src: "/assets/videos/autodrome/vd4.mp4",
        alt: { uz: "Avtodrom mashg'uloti", ru: "Занятие на автодроме" },
        width: 720,
        height: 1280,
      },
      {
        src: "/assets/videos/autodrome/vd5.mp4",
        alt: { uz: "Avtodromda mashq", ru: "Упражнение на автодроме" },
        width: 720,
        height: 1280,
      },
      {
        src: "/assets/videos/autodrome/vd6.mp4",
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
        alt: { uz: "Bitiruv marosimi", ru: "Выпускной вечер" },
        width: 1440,
        height: 2560,
      },
      {
        src: "/assets/videos/graduation/vdgr.mp4",
        alt: { uz: "Bitiruvchilar tabrigi", ru: "Поздравление выпускников" },
        width: 720,
        height: 1280,
      },
      {
        src: "/assets/videos/graduation/vdgr2.mp4",
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
];
