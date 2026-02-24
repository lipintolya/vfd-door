/**
 * Тип работы портфолио
 */
export interface PortfolioWork {
  id: string
  title: string
  description: string
  location: string
  date: string
  images: string[] 
  productType: 'door' | 'partition' | 'entrance'
  series?: string
  budget?: string
  area?: number
}


export const portfolioWorks: PortfolioWork[] = [
  {
    id: '1',
    title: 'Двери Innova в посёлке Петровский',
    description: 'Установили межкомнатные дверии серии Innova в уютном доме',
    location: 'Челябинская область, п.Петровский',
    date: '2026-02-20',
    images: [
      'https://storage.yandexcloud.net/catalog-vfd/portfolio/20.02.26/1.webp',
      'https://storage.yandexcloud.net/catalog-vfd/portfolio/20.02.26/2.webp',
      'https://storage.yandexcloud.net/catalog-vfd/portfolio/20.02.26/3.webp',
      'https://storage.yandexcloud.net/catalog-vfd/portfolio/20.02.26/4.webp',
      'https://storage.yandexcloud.net/catalog-vfd/portfolio/20.02.26/5.webp',
      'https://storage.yandexcloud.net/catalog-vfd/portfolio/20.02.26/6.webp',
      'https://storage.yandexcloud.net/catalog-vfd/portfolio/20.02.26/7.webp',
      'https://storage.yandexcloud.net/catalog-vfd/portfolio/20.02.26/8.webp',
      'https://storage.yandexcloud.net/catalog-vfd/portfolio/20.02.26/9.webp',
    ],
    productType: 'door',
    series: 'Innova',
  },
  {
    id: '2',
    title: 'Серия Atum в покрытии Экошпон',
    description: 'Монтаж дверей серии Atum с декоротивными вставками тонированного стекла',
    location: 'Челябинск, Калининский район',
    date: '2026-02-09',
    images: [
      'https://storage.yandexcloud.net/catalog-vfd/portfolio/9.02.26/photo_2026-02-09_11-22-11.webp',
      'https://storage.yandexcloud.net/catalog-vfd/portfolio/9.02.26/photo_2026-02-09_11-22-13%20(2).webp',
      'https://storage.yandexcloud.net/catalog-vfd/portfolio/9.02.26/photo_2026-02-09_11-22-13.webp',
      'https://storage.yandexcloud.net/catalog-vfd/portfolio/9.02.26/photo_2026-02-09_11-22-15.webp',
      'https://storage.yandexcloud.net/catalog-vfd/portfolio/9.02.26/photo_2026-02-09_11-22-17.webp',
    ],
    productType: 'door',
    series: 'Atum',
  },
  {
    id: '3',
    title: 'Двери серии Emalex C2 в цвете Steel',
    description: 'Серый оттенок Steel подчёркивает геометрию полотна и отлично сочетается с современными пространствами: минимализм, лофт, неоклассика.',
    location: 'Челябинск',
    date: '2026-01-29',
    images: [
      'https://storage.yandexcloud.net/catalog-vfd/portfolio/29.01.26/photo_2026-01-29_10-38-25.webp',
      'https://storage.yandexcloud.net/catalog-vfd/portfolio/29.01.26/photo_2026-01-29_10-38-26%20(2).webp',
      'https://storage.yandexcloud.net/catalog-vfd/portfolio/29.01.26/photo_2026-01-29_10-38-26.webp',
    ],
    productType: 'door',
    series: 'Emalex',
  },
  {
    id: '4',
    title: 'Современный стиль и чистота форм: Urban 1V Emalex Ice',
    description: 'Если вы ищете идеальный баланс минимализма и выразительного акцента в интерьере, тогда белые прямые двери с вертикальным молдингом Urban - ваш выбор',
    location: 'Челябинск',
    date: '2026-02-28',
    images: [
      'https://storage.yandexcloud.net/catalog-vfd/portfolio/28.01.26/photo_2026-01-28_16-33-23.webp',
      'https://storage.yandexcloud.net/catalog-vfd/portfolio/28.01.26/photo_2026-01-28_16-33-24.webp',
      'https://storage.yandexcloud.net/catalog-vfd/portfolio/28.01.26/photo_2026-01-28_16-33-25.webp',
      'https://storage.yandexcloud.net/catalog-vfd/portfolio/28.01.26/photo_2026-01-28_16-33-26.webp',

    ],
    productType: 'door',
    series: 'Urban',
  },
   {
    id: '5',
    title: 'Нестандартные двери высотой 2300',
    description: 'Фото с монтажа, объект партнёров - строительной компании в Челябинске',
    location: 'Челябинск',
    date: '2026-01-16',
    images: [
      'https://storage.yandexcloud.net/catalog-vfd/portfolio/16.01.26/photo_2026-01-16_15-15-44.webp',
      'https://storage.yandexcloud.net/catalog-vfd/portfolio/16.01.26/photo_2026-01-16_15-22-50.webp',
   
    ],
    productType: 'door',
    series: 'Urban',
  },
     {
    id: '6',
    title: 'Коммерческий объект VFD Design в Минске, Беларусь',
    description: 'Минск, коллеги Vfd Design и их участие в реализации интерьера роскошного отеля Waldorf Astoria Minsk сети Hilton',
    location: 'Минск, Беларусь',
    date: '2026-01-14',
    images: [
      'https://storage.yandexcloud.net/catalog-vfd/portfolio/hilton/myimage.webp',
      'https://storage.yandexcloud.net/catalog-vfd/portfolio/hilton/myimage%20(1).webp',
      'https://storage.yandexcloud.net/catalog-vfd/portfolio/hilton/myimage%20(2).webp',
      'https://storage.yandexcloud.net/catalog-vfd/portfolio/hilton/myimage%20(3).webp',
      'https://storage.yandexcloud.net/catalog-vfd/portfolio/hilton/myimage%20(4).webp',
      'https://storage.yandexcloud.net/catalog-vfd/portfolio/hilton/myimage%20(5).webp',
      'https://storage.yandexcloud.net/catalog-vfd/portfolio/hilton/myimage%20(6).webp',
      'https://storage.yandexcloud.net/catalog-vfd/portfolio/hilton/myimage%20(7).webp',
      'https://storage.yandexcloud.net/catalog-vfd/portfolio/hilton/myimage%20(8).webp',
      'https://storage.yandexcloud.net/catalog-vfd/portfolio/hilton/myimage%20(9).webp',
  
    ],
    productType: 'partition',
    series: 'Alum',
  },
    {
    id: '7',
    title: 'Установка скрытых дверей в коттеджном посёлке "Привилегия"',
    description: 'Устанавливаются на скрытый короб в одной плоскости со стеной для создания «невидимой» конструкции. Универсальный короб Invisible подходит для монтажа дверей как прямого, так и обратного открывания. Монтируется на этапе черновых работ.                                   ',
    location: 'Челябинск, "Привелегия"',
    date: '2026-01-5',
    images: [
      'https://storage.yandexcloud.net/catalog-vfd/portfolio/5.01.26/myimage%20(10).webp',
      'https://storage.yandexcloud.net/catalog-vfd/portfolio/5.01.26/myimage%20(11).webp', 
    ],
    productType: 'door',
    series: 'Invisible',
  }
]
