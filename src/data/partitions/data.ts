// @/data/partitions.ts
// Данные для страницы алюминиевых перегородок

export interface HeroSlide {
  id: number
  image: string
  title: string
  subtitle: string
  description: string
}

export interface Feature {
  id: string
  icon: string
  title: string
  description: string
}

export interface Specification {
  id: string
  title: string
  items: string[]
}

export interface SlidingTypeDetail {
  id: string
  name: string
  description: string
  image: string
  detailImages: string[]
  mountingInfo: string[]
  systemInfo: string[]
  advantages: string[]
}

export interface MountingType {
  id: string
  name: string
  image: string
  description: string
}

export interface ProfileOption {
  id: string
  code: string
  name: string
  description: string
  image: string
}

export interface PartitionType {
  id: string
  code: string
  name: string
  description: string
  image: string
  fullDescription?: string
}

export interface ColorOption {
  id: string
  name: string
  image: string
}

export interface PortfolioProject {
  id: string
  title: string
  description: string
  fullDescription: string
  specifications: string
  images: string[]
  category: string
  date: string
  clientName?: string
  challenge?: string
  solution?: string
  results?: string[]
}

export interface ProcessStep {
  number: number
  title: string
  description: string
  image: string
}

export interface FaqItem {
  id: number
  question: string
  answer: string
}

/* ============================================
   HERO SLIDES
   ============================================ */
export const heroSlides: HeroSlide[] = [
  {
    id: 1,
    image: 'https://storage.yandexcloud.net/catalog-vfd/alum/alum-1.webp',
    title: 'Алюминиевые перегородки',
    subtitle: 'Современные интерьерные решения',
    description:
      'Минималистический дизайн и визуальная легкость конструкции позволяют органично вписать её в любой интерьерный стиль',
  },
  {
    id: 2,
    image: 'https://storage.yandexcloud.net/catalog-vfd/alum/alum-2.webp',
    title: 'Современные решения',
    subtitle: 'Дизайн и функциональность',
    description:
      'Раздвижные и распашные системы из алюминиевого профиля GRAFIA с повышенной прочностью',
  },
  {
    id: 3,
    image: 'https://storage.yandexcloud.net/catalog-vfd/alum/alum-3.webp',
    title: 'Качество и стиль',
    subtitle: 'Стационарные решения',
    description: 'Интересная идея для зонирования пространства — использование раздвижной перегородки между спальней и залом',
  },
]

export const introText =
  'Алюминиевые перегородки с остеклением – это современный подход к зонированию помещений. Фабрика VFD предлагает раздвижные и распашные системы из алюминиевого профиля отечественного производства.'

/* ============================================
   DESCRIPTION BLOCKS
   ============================================ */
export const descriptionBlocks = {
  partitionTypes: 'Опишите модельный ряд створок и их особенности здесь.',
  decorativeProfiles: 'Расскажите о декоративных профилях и их применении здесь.',
  colorSolutions: 'Опишите цветовые решения профиля и особенности окраски здесь.',
  fillingOptions: 'Расскажите о вариантах заполнения перегородок здесь.',
}

/* ============================================
   DECORATIVE PROFILES
   ============================================ */
export const decorativeProfiles: ProfileOption[] = [
  {
    id: 'graf101',
    code: 'ГРАФ101',
    name: 'ГРАФ101',
    description: 'Базовый профиль для раздвижных систем. Оптимальное соотношение цены и качества.',
    image: 'https://storage.yandexcloud.net/catalog-vfd/alum_info/profiles/graf101.webp',
  },
  {
    id: 'graf102',
    code: 'ГРАФ102',
    name: 'ГРАФ102',
    description: 'Усиленный профиль для тяжелых конструкций. Повышенная прочность.',
    image: 'https://storage.yandexcloud.net/catalog-vfd/alum_info/profiles/graf102.webp',
  },
  {
    id: 'graf103',
    code: 'ГРАФ103',
    name: 'ГРАФ103',
    description: 'Профиль для распашных систем. Классическое решение.',
    image: 'https://storage.yandexcloud.net/catalog-vfd/alum_info/profiles/graf103.webp',
  },
]

/* ============================================
   FILLING OPTIONS
   ============================================ */
export interface FillingOption {
  id: string
  name: string
  description: string
  image: string
}

export const fillingOptions: FillingOption[] = [
  {
    id: 'glass',
    name: 'Стекло',
    description: 'Закаленное стекло толщиной 4-8 мм',
    image: 'https://storage.yandexcloud.net/catalog-vfd/alum_info/fillings/glass.webp',
  },
  {
    id: 'panel',
    name: 'Панель',
    description: 'Декоративные панели МДФ, пластик, зеркало',
    image: 'https://storage.yandexcloud.net/catalog-vfd/alum_info/fillings/panel.webp',
  },
]

/* ============================================
   FEATURES
   ============================================ */
export const features: Feature[] = [
  {
    id: 'durability',
    icon: 'https://storage.yandexcloud.net/catalog-vfd/alum_info/sections_alum/r01.webp',
    title: 'Прочность GRAFIA',
    description: 'Алюминиевые профили GRAFIA отечественного производства с повышенной прочностью. Гарантированная надёжность конструкции на годы.',
  },
  {
    id: 'turnkey',
    icon: 'https://storage.yandexcloud.net/catalog-vfd/icons/turnkey.svg',
    title: 'Под ключ',
    description: 'Полная готовность к монтажу с качественной фурнитурой в комплекте. Широкий выбор стекол: прозрачные, матовые, тонированные.',
  },
  {
    id: 'flexibility',
    icon: 'https://storage.yandexcloud.net/catalog-vfd/icons/flexibility.svg',
    title: 'Адаптивность',
    description: 'Сборно-разборная конструкция: быстрый монтаж и демонтаж. Замена стекла при повреждении. Индивидуальный подход.',
  },
]

/* ============================================
   SPECIFICATIONS
   ============================================ */
export const specifications: Specification[] = [
  {
    id: 'specs1',
    title: 'Технические параметры',
    items: [
      'Алюминиевый профиль GRAFIA российской сборки',
      'Закалённое стекло 4, 6 или 8 мм по ГОСТ Р',
      'Можно выбрать индивидуальную покраску, подходящую под ваш интерьер, по RAL/NCS.',
      'Система скрытых креплений',
      'Готовность к монтажу с полной фурнитурой',
    ],
  },
  {
    id: 'specs2',
    title: 'Эксплуатационные преимущества',
    items: [
      'Повышенная прочность профиля — 170 МПа',
      'Анодированная поверхность, стойкая к коррозии',
      'Сборно-разборная конструкция для мобильности',
      'Срок службы — от 15 лет при интенсивной эксплуатации',
      'Гарантия 3 года на механизмы и профиль',
    ],
  },
]

/* ============================================
   SLIDING TYPES
   ============================================ */
export const slidingTypesDetails: SlidingTypeDetail[] = [
  {
    id: '1-track',
    name: '1 трек',
    description: 'Система с одной направляющей. Вариант для небольших проёмов. Компактно и лаконично.',
    image: 'https://storage.yandexcloud.net/catalog-vfd/alum_info/alum-first.webp',
    detailImages: [
      'https://storage.yandexcloud.net/catalog-vfd/alum_info/1_scheme.webp',
      'https://storage.yandexcloud.net/catalog-vfd/alum_info/one_track.webp',
    ],
    mountingInfo: [
      'При монтаже раздвижных перегородок на одну направляющую устанавливается система с одним треком или полотном.',
      'Одно полотно последовательно сдвигается в одну сторону параллельно стене, полностью открывая проём.',
    ],
    systemInfo: [
      'Система из одного полотна устанавливается в проёме',
      'Полотно располагается на одной направляющей',
      'Является стационарным, то есть неподвижным',
    ],
    advantages: [
      'Компактное решение для небольших проемов',
      'Экономия пространства',
      'Простота в эксплуатации',
      'Минималистичный дизайн',
    ],
  },
  {
    id: '2-track',
    name: '2 трека',
    description: 'Система с двумя направляющими. Вариант для небольших и средних проёмов.',
    image: 'https://storage.yandexcloud.net/catalog-vfd/alum_info/alum-second.webp',
    detailImages: [
      'https://storage.yandexcloud.net/catalog-vfd/alum_info/2_scheme.webp',
      'https://storage.yandexcloud.net/catalog-vfd/alum_info/two_track.webp',
    ],
    mountingInfo: [
      'В системе из двух полотен возможно открывание каскадом, когда оба полотна последовательно сдвигаются в одну сторону параллельно стене, полностью открывая проём.',
      'Такая система устанавливается перед проёмом.',
      'Либо возможен вариант с установкой в проёме, когда два полотна находятся на разных направляющих.',
    ],
    systemInfo: [
      'Центральные полотна закреплены на разных направляющих, они примыкают к стене',
      'Крайние полотна трёх направляющих примыкают друг к другу',
      'Крепление системы с двумя треками может осуществляться и к стене, и к потолку',
    ],
    advantages: [
      'Возможность каскадного открывания',
      'Два варианта монтажа (в проеме/перед проемом)',
      'Оптимально для средних проемов',
      'Гибкие варианты использования',
    ],
  },
  {
    id: '3-track',
    name: '3 трека',
    description: 'Система с тремя направляющими. Вариант для средних и больших проёмов.',
    image: 'https://storage.yandexcloud.net/catalog-vfd/alum_info/alum-third.webp',
    detailImages: [
      'https://storage.yandexcloud.net/catalog-vfd/alum_info/3_scheme.webp',
      'https://storage.yandexcloud.net/catalog-vfd/alum_info/three_track.webp',
    ],
    mountingInfo: [
      'Система из трёх или четырёх полотен устанавливается в проёме.',
      'Два крайних полотна расположены на одной направляющей, они примыкают к стене и являются стационарными.',
      'Центральные полотна трёх направляющих примыкают друг к другу. Проём при этом открывается наполовину, то есть на ширину одного полотна.',
    ],
    systemInfo: [
      'Два крайних полотна на одной направляющей (стационарные)',
      'Центральные полотна на разных направляющих',
      'Проём открывается на ширину одного полотна',
      'Установка производится в проёме',
    ],
    advantages: [
      'Идеально для больших проемов',
      'Стационарные боковые полотна обеспечивают стабильность',
      'Эффективное использование пространства',
      'Надежная конструкция для интенсивного использования',
    ],
  },
]

/* ============================================
   MOUNTING TYPES
   ============================================ */
export const mountingTypes = [
  {
    id: 'ceiling',
    name: 'К потолку (скрытое)',
    image: 'https://storage.yandexcloud.net/catalog-vfd/alum_info/type-hidden.webp',
    description: 'Скрытое крепление к потолку. Эстетичное решение без видимых элементов крепления.',
  },
  {
    id: 'ceilingwall',
    name: 'К потолку',
    image: 'https://storage.yandexcloud.net/catalog-vfd/alum_info/type-vsbl.webp',
    description: 'Крепление к потолку. Надёжное и практичное решение для различных типов помещений.',
  },
  {
    id: 'wall',
    name: 'К стене',
    image: 'https://storage.yandexcloud.net/catalog-vfd/alum_info/type-wall.webp',
    description: 'Крепление к стене. Универсальный вариант для любых интерьеров.',
  },
  {
    id: 'opening',
    name: 'В проём',
    image: 'https://storage.yandexcloud.net/catalog-vfd/alum_info/type-opening.webp',
    description: 'Монтаж в дверной проём. Оптимально для стандартных решений.',
  },
]

/* ============================================
   PROFILE OPTIONS
   ============================================ */
export const profileOptions: ProfileOption[] = [
  {
    id: 'graf101',
    code: 'ГРАФ101',
    name: 'ГРАФ101',
    description: 'Базовый профиль для раздвижных систем. Оптимальное соотношение цены и качества.',
    image: 'https://storage.yandexcloud.net/catalog-vfd/alum_info/profiles/graf101.webp',
  },
  {
    id: 'graf102',
    code: 'ГРАФ102',
    name: 'ГРАФ102',
    description: 'Усиленный профиль для тяжелых конструкций. Повышенная прочность.',
    image: 'https://storage.yandexcloud.net/catalog-vfd/alum_info/profiles/graf102.webp',
  },
  {
    id: 'graf103',
    code: 'ГРАФ103',
    name: 'ГРАФ103',
    description: 'Профиль для распашных систем. Классическое решение.',
    image: 'https://storage.yandexcloud.net/catalog-vfd/alum_info/profiles/graf103.webp',
  },
]

/* ============================================
   PARTITION TYPES
   ============================================ */
export const partitionTypes: PartitionType[] = [
  {
    id: 'sliding',
    code: 'SLIDING',
    name: 'Раздвижные перегородки',
    description: 'Экономия пространства и современный дизайн. Плавное и бесшумное движение полотен.',
    image: 'https://storage.yandexcloud.net/catalog-vfd/alum_info/types/sliding.webp',
    fullDescription: 'Раздвижные перегородки — это современное решение для зонирования пространства. Они позволяют легко трансформировать интерьер, экономят место и выглядят эстетично.',
  },
  {
    id: 'swing',
    code: 'SWING',
    name: 'Распашные перегородки',
    description: 'Классическое решение с надежной фурнитурой. Привычный механизм открывания.',
    image: 'https://storage.yandexcloud.net/catalog-vfd/alum_info/types/swing.webp',
    fullDescription: 'Распашные перегородки представляют собой классическое решение с использованием надежной фурнитуры. Они обеспечивают хорошую звукоизоляцию и привычны в использовании.',
  },
  {
    id: 'fixed',
    code: 'FIXED',
    name: 'Стационарные перегородки',
    description: 'Монолитное зонирование без подвижных элементов. Максимальная надежность.',
    image: 'https://storage.yandexcloud.net/catalog-vfd/alum_info/types/fixed.webp',
    fullDescription: 'Стационарные перегородки — это монолитное решение для постоянного зонирования. Они не имеют подвижных элементов и обеспечивают максимальную надежность.',
  },
]

/* ============================================
   COLOR OPTIONS
   ============================================ */
export const colorOptions: ColorOption[] = [
  {
    id: 'white',
    name: 'Белый',
    image: 'https://storage.yandexcloud.net/catalog-vfd/alum_info/colors/white.webp',
  },
  {
    id: 'black',
    name: 'Черный',
    image: 'https://storage.yandexcloud.net/catalog-vfd/alum_info/colors/black.webp',
  },
  {
    id: 'bronze',
    name: 'Бронза',
    image: 'https://storage.yandexcloud.net/catalog-vfd/alum_info/colors/bronze.webp',
  },
  {
    id: 'silver',
    name: 'Серебро',
    image: 'https://storage.yandexcloud.net/catalog-vfd/alum_info/colors/silver.webp',
  },
  {
    id: 'graphite',
    name: 'Графит',
    image: 'https://storage.yandexcloud.net/catalog-vfd/alum_info/colors/graphite.webp',
  },
]

/* ============================================
   PORTFOLIO PROJECTS
   ============================================ */
export const portfolioProjects: PortfolioProject[] = [
  {
    id: 'proj1',
    title: 'Перегородка в офисе на Кашириных',
    description: 'Зонирование офисного пространства с помощью алюминиевых перегородок',
    fullDescription: 'Реализован проект по зонированию офисного пространства с использованием раздвижных алюминиевых перегородок GRAF101.',
    specifications: 'Профиль: ГРАФ101, Стекло: прозрачное 6мм, Цвет: белый RAL9016',
    images: [
      'https://storage.yandexcloud.net/catalog-vfd/portfolio/office1.webp',
      'https://storage.yandexcloud.net/catalog-vfd/portfolio/office2.webp',
    ],
    category: 'Офис',
    date: '2024-01',
    clientName: 'Технопарк',
    challenge: 'Необходимо было разделить открытое офисное пространство на отдельные кабинеты без потери естественного освещения.',
    solution: 'Установлены раздвижные перегородки с прозрачным стеклом и белым профилем.',
    results: [
      'Создано 5 отдельных кабинетов',
      'Сохранено естественное освещение',
      'Обеспечена звукоизоляция 35 дБ',
    ],
  },
  {
    id: 'proj2',
    title: 'Перегородка в квартире ЖК "Александровский"',
    description: 'Зонирование гостиной-кухни с помощью раздвижной перегородки',
    fullDescription: 'Установлена раздвижная перегородка между гостиной и кухней для возможности быстрого зонирования пространства.',
    specifications: 'Профиль: ГРАФ102, Стекло: матовое 8мм, Цвет: графит RAL7024',
    images: [
      'https://storage.yandexcloud.net/catalog-vfd/portfolio/apt1.webp',
      'https://storage.yandexcloud.net/catalog-vfd/portfolio/apt2.webp',
    ],
    category: 'Квартира',
    date: '2024-03',
    clientName: 'Частный заказчик',
    challenge: 'Клиент хотел иметь возможность объединять кухню с гостиной при необходимости.',
    solution: 'Установлена двухтрековая раздвижная система с матовым стеклом.',
    results: [
      'Возможность быстрого зонирования',
      'Звукоизоляция кухни от гостиной',
      'Современный дизайн интерьера',
    ],
  },
]

/* ============================================
   PROCESS STEPS
   ============================================ */
export const processSteps: ProcessStep[] = [
  {
    number: 1,
    title: 'Замер и консультация',
    description: 'Выезд специалиста на объект, точные замеры, подбор оптимального решения.',
    image: 'https://storage.yandexcloud.net/catalog-vfd/alum_info/steps/step1.webp',
  },
  {
    number: 2,
    title: 'Проектирование',
    description: 'Разработка индивидуального проекта с учетом всех пожеланий клиента.',
    image: 'https://storage.yandexcloud.net/catalog-vfd/alum_info/steps/step2.webp',
  },
  {
    number: 3,
    title: 'Производство',
    description: 'Изготовление перегородок на собственном производстве в Челябинске.',
    image: 'https://storage.yandexcloud.net/catalog-vfd/alum_info/steps/step3.webp',
  },
  {
    number: 4,
    title: 'Монтаж',
    description: 'Профессиональная установка с гарантией качества.',
    image: 'https://storage.yandexcloud.net/catalog-vfd/alum_info/steps/step4.webp',
  },
]

/* ============================================
   FAQ
   ============================================ */
export const faqItems: FaqItem[] = [
  {
    id: 1,
    question: 'Какой срок изготовления перегородок?',
    answer: 'Срок изготовления составляет от 14 до 30 рабочих дней в зависимости от сложности конструкции и выбранного профиля.',
  },
  {
    id: 2,
    question: 'Можно ли установить перегородку самостоятельно?',
    answer: 'Рекомендуем доверить монтаж нашим специалистам. Неправильная установка может привести к нарушению работы механизмов и потере гарантии.',
  },
  {
    id: 3,
    question: 'Какая гарантия на продукцию?',
    answer: 'Гарантия на профиль и механизмы составляет 3 года, на монтажные работы — 1 год.',
  },
  {
    id: 4,
    question: 'Можно ли изменить цвет профиля?',
    answer: 'Да, мы предлагаем окраску профиля по каталогам RAL и NCS. Срок изготовления цветных профилей увеличивается на 5-7 рабочих дней.',
  },
  {
    id: 5,
    question: 'Какая максимальная высота перегородки?',
    answer: 'Максимальная высота одной секции — 3 метра. При необходимости установки более высоких конструкций используются специальные усиленные профили.',
  },
]
