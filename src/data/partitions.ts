/* ============================================================
   Данные страницы «Перегородки»
   Контент отделён от вёрстки — добавление кейсов/блоков
   не требует правки разметки.
   ============================================================ */

const STORAGE = 'https://storage.yandexcloud.net/catalog-vfd'
const BASE    = `${STORAGE}/alum`
const INFO    = `${STORAGE}/alum_info`
const SEC     = `${STORAGE}/alum_section`
const OVERLAY = `${SEC}/type2`

/* ── Типы ───────────────────────────────────────────────── */
export interface DoorModel {
  id:       string
  schemaId: string
  photo:    string
  svg:      string
}
export interface DecorType {
  image:       string
  title:       string
  description: string
}
export interface SlideImage { src: string; alt: string }

export interface ProjectCase {
  id:         string
  side:       'left' | 'right'          // сторона слайдера
  sliderTone: 'dark' | 'light'
  bg?:        'white' | 'slate'         // фон секции (по умолчанию white)
  eyebrow:    { kind: 'plain'; text: string }
            | { kind: 'badge'; text: string; tone: 'amber' | 'teal' }
  titleHtml:  string                    // допускает <br>
  paragraphs: string[]
  features?:  string[]
  featureSize?: 'md' | 'sm'             // плотность буллетов (по умолчанию sm)
  noteHtml?:  string                    // допускает <strong>
  attribution?: { href: string; label: string }
  social?:    boolean                   // блок соцсетей (VK/TG/Max)
  images:     SlideImage[]
}

/* ── SEO / hero ─────────────────────────────────────────── */
export const imgs = {
  hero:      `${BASE}/alum-1.webp`,
  about:     `${BASE}/alum-2.webp`,
  sectional: `${BASE}/alum-3.webp`,
}

export const heroStats = [
  { val: '45',  lbl: 'дней изготовление', desc: 'С момента согласования до монтажа' },
  { val: '3',   lbl: 'типа направляющих', desc: '1, 2 или 3 трека на выбор' },
  { val: '13+', lbl: 'цветов профиля',    desc: 'Порошковые и анодированные', cta: 'Рассчитать', href: 'https://t.me/vfddoors74' },
]

/* ── Раздвижные системы — типы направляющих ─────────────── */
export const tracks = [
  {
    num: '1 трек', title: 'Одна направляющая',
    desc: 'Для небольших проёмов с 1–2 полотнами. Монтаж к стене или потолку.',
    stat: '1–2', statLbl: 'полотна',
    items: ['Одно полотно — уходит вдоль стены', 'Два полотна — расходятся от центра'],
    imgs: [
      { src: `${INFO}/alum-first.webp`, alt: '1 трек — пример интерьера' },
      { src: `${INFO}/1_scheme.webp`,   alt: 'Схема 1 трека' },
      { src: `${INFO}/one_track.webp`,  alt: 'Направляющая 1 трека' },
    ],
  },
  {
    num: '2 трека', title: 'Двойная направляющая',
    desc: 'Небольшие и средние проёмы. До четырёх полотен. Крепление к стене или потолку.',
    stat: '2–4', statLbl: 'полотна',
    items: ['Каскад в одну сторону', 'Крайние стационарны — движутся центральные', 'Открывание от центра в обе стороны'],
    imgs: [
      { src: `${INFO}/alum-second.webp`, alt: '2 трека — пример интерьера' },
      { src: `${INFO}/2_scheme.webp`,    alt: 'Схема 2 треков' },
      { src: `${INFO}/two_track.webp`,   alt: 'Направляющая 2 треков' },
    ],
  },
  {
    num: '3 трека', title: 'Тройная направляющая',
    desc: 'Средние и большие проёмы. До шести полотен. Крепление только к потолку.',
    stat: '3–6', statLbl: 'полотен',
    items: ['3 полотна — каскад, проём на ширину двух', '6 полотен — две группы от центра'],
    imgs: [
      { src: `${INFO}/alum-third.webp`,  alt: '3 трека — пример интерьера' },
      { src: `${INFO}/3_scheme.webp`,    alt: 'Схема 3 треков' },
      { src: `${INFO}/three_track.webp`, alt: 'Направляющая 3 треков' },
    ],
  },
]

/* ── Типы крепления ─────────────────────────────────────── */
export const mountings = [
  { n: '01', title: 'Скрытое к потолку',  desc: 'Направляющая утапливается в нишу — профиль не виден. Минималистичный вид без видимых деталей крепления.', img: `${INFO}/typeofwork/type1.webp` },
  { n: '02', title: 'Открытое к потолку', desc: 'Направляющая крепится к поверхности потолка. Быстрый монтаж без штробления.', img: `${INFO}/typeofwork/type2.webp` },
  { n: '03', title: 'К стене',            desc: 'Для 1 и 2-трековых систем. Простая установка, не требует работ с потолком.', img: `${INFO}/typeofwork/type3.webp` },
]

/* ── Цвета профиля (порядок = colors-profile/1.jpg … 13.jpg) ─ */
export const colors = [
  { name: 'Black Sand',      hex: '#1c1a18' },
  { name: 'Black Matt',      hex: '#111111' },
  { name: 'Dark Brown Matt', hex: '#3d2b1f' },
  { name: 'Grafit Matt',     hex: '#3a3c40' },
  { name: 'Champagne Matt',  hex: '#e8dfc4' },
  { name: 'Bronze',          hex: '#7c5c35' },
  { name: 'Bronze Light',    hex: '#a07848' },
  { name: 'Old Gold Matt',   hex: '#c9a040' },
  { name: 'Gold Matt',       hex: '#d4b04a' },
  { name: 'Chrome',          hex: '#c0c4cc' },
  { name: 'White 9003 Matt', hex: '#f2f2f2' },
  { name: 'White 9010 Matt', hex: '#f5f4ef' },
  { name: 'White 9003 Sand', hex: '#e8e4d8' },
]

export const colorSwatches = colors.map((c, i) => ({
  src: `${INFO}/colors-profile/${i + 1}.jpg`,
  alt: `Алюминиевый профиль GRAFIA в цвете ${c.name}`,
  name: c.name,
  hex: c.hex,
}))

/* ── Остекление (порядок = glass_type/1.webp … 14.webp) ──── */
export const glasses = [
  'Line 01', 'Mirror Grey', 'Mirror Bronze', 'Mirror',
  'Satinato Bianco', 'Satinato Bronza', 'Satinato Grafite',
  'STOPSOL Bronzo', 'STOPSOL Grafite', 'STOPSOL Transporente',
  'Transporente Bronzo', 'Transporente Clearvision', 'Transporente Grafite', 'Transporente',
]

export const glassSwatches = glasses.map((name, i) => ({
  src: `${INFO}/glass_type/${i + 1}.webp`,
  alt: `Стекло для перегородки — ${name}`,
  name,
}))

/* ── Преимущества алюминиевых перегородок ───────────────── */
export interface Benefit {
  /** ключ иконки (см. карту в BenefitsShowcase) */
  icon:   'shield' | 'design' | 'uv' | 'durability' | 'wear' | 'light' | 'eco'
  title:  string
  text:   string
  /** место под изображение — заполните src, иначе показывается плейсхолдер */
  image?: string
  alt?:   string
}

export const partitionBenefits: Benefit[] = [
  {
    icon: 'shield',
    title: 'Высокая коррозионная стойкость',
    text: 'Алюминиевый профиль не подвержен коррозии и сохраняет свои эксплуатационные характеристики даже в условиях повышенной влажности. Это делает алюминиевые перегородки надёжным решением для офисов, торговых помещений и общественных пространств.',
    image: 'https://storage.yandexcloud.net/catalog-vfd/alum/antikor.webp',
    alt: 'Высокая коррозионная стойкость алюминия',
  },
  {
    icon: 'design',
    title: 'Современный внешний вид и широкие дизайнерские возможности',
    text: 'Алюминиевые конструкции отличаются элегантным и презентабельным внешним видом. Разнообразие вариантов отделки и цветовых решений позволяет гармонично интегрировать перегородки в любой интерьер — от классического до современного минимализма.',
    image: 'https://storage.yandexcloud.net/catalog-vfd/alum/reference-1.webp',
    alt: 'Алюминиевые перегородки в современном интерьере — дизайнерское решение',
  },
  {
    icon: 'uv',
    title: 'Устойчивость к воздействию ультрафиолета',
    text: 'Покрытие алюминиевого профиля не выгорает под воздействием солнечных лучей, сохраняя насыщенность цвета и привлекательный внешний вид на протяжении всего срока службы.',
    image: 'https://storage.yandexcloud.net/catalog-vfd/alum/sun_alum.webp',
    alt: 'Защита от ультрафиолета',
  },
  {
    icon: 'durability',
    title: 'Долговечность без потери эстетики',
    text: 'Алюминиевые перегородки сохраняют первоначальный внешний вид в течение многих лет. Поверхность не темнеет, не растрескивается и не покрывается пятнами, что снижает затраты на обслуживание и обновление интерьера.',
    image: 'https://storage.yandexcloud.net/catalog-vfd/alum/render-4.webp',
    alt: 'Сохранение внешнего вида на долгие годы',
  },
  {
    icon: 'wear',
    title: 'Повышенная износостойкость и защита от повреждений',
    text: 'Специальная обработка поверхности увеличивает твёрдость алюминиевого профиля, благодаря чему он устойчив к царапинам, потёртостям и другим механическим воздействиям, возникающим в процессе ежедневной эксплуатации.',
    image: 'https://storage.yandexcloud.net/catalog-vfd/alum/keytest_alum.webp',
    alt: 'Защита от повреждений',
  },
  {
    icon: 'light',
    title: 'Лёгкость конструкции и высокая прочность',
    text: 'Несмотря на небольшой вес, алюминиевые перегородки обладают высокой прочностью и надёжностью. Это позволяет создавать долговечные конструкции без излишней нагрузки на несущие элементы здания.',
    image: 'https://storage.yandexcloud.net/catalog-vfd/alum/light.webp',
    alt: 'Легкость и прочность конструкции',
  },
  {
    icon: 'eco',
    title: 'Экологичность и безопасность',
    text: 'Алюминий является экологически безопасным материалом, не выделяет вредных веществ и полностью пригоден для вторичной переработки, что соответствует современным требованиям к экологичному строительству.',
    image: 'https://storage.yandexcloud.net/catalog-vfd/alum/aluminium.webp',
    alt: 'Экологичные материалы',
  },
]

export const steps = [
  { num: '01', title: 'Заявка', text: 'Позвоните или напишите — описание, фото, чертёж.' },
  { num: '02', title: 'Замер',  text: 'Бесплатный выезд специалиста на объект.' },
  { num: '03', title: 'Проект', text: 'Чертёж, спецификация и КП за 1 рабочий день.' },
  { num: '04', title: 'Монтаж', text: 'Производство 45 дней, доставка и установка.' },
]

/* ── Модельный ряд створок ──────────────────────────────── */
export const sectionalModels: DoorModel[] = [
  { id: 'V01', schemaId: 'R01', photo: `${SEC}/V01.webp`, svg: `${SEC}/v01.svg` },
  { id: 'V02', schemaId: 'R02', photo: `${SEC}/V02.webp`, svg: `${SEC}/v02.svg` },
  { id: 'V03', schemaId: 'R03', photo: `${SEC}/V03.webp`, svg: `${SEC}/v03.svg` },
]
export const sectionalDecor: DecorType = {
  image:       `${SEC}/decor_type1.webp`,
  title:       'Секционный декор',
  description: 'Секционный декор разделяет стекло на несколько частей и позволяет производить полотна высотой до 5 м. Придаёт дополнительное усиление конструкции.',
}

const overlayNums = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 21, 22, 23, 24, 25, 26]
export const overlayModels: DoorModel[] = overlayNums.map(n => {
  const code = `R${String(n).padStart(2, '0')}`
  return { id: code, schemaId: code, photo: `${OVERLAY}/${code}.webp`, svg: `${OVERLAY}/svg/${code.toLowerCase()}.svg` }
})
export const overlayDecor: DecorType = {
  image:       `${SEC}/decor_type2.webp`,
  title:       'Накладной декор',
  description: 'Накладной декор крепится поверх стекла и формирует рисунок раскладки без фактического разделения полотна. Более 20 вариантов конфигурации — от лаконичных линий до геометрических узоров.',
}

/* ── Реализованные проекты (кейсы) ──────────────────────── */
const range = (prefix: string, n: number, altFn: (i: number) => string): SlideImage[] =>
  Array.from({ length: n }, (_, i) => ({ src: `${prefix}${i + 1}.webp`, alt: altFn(i + 1) }))

export const cases: ProjectCase[] = [
  {
    id: 'stationar',
    side: 'right',
    sliderTone: 'light',
    eyebrow: { kind: 'plain', text: 'Стильное зонирование пространства' },
    featureSize: 'md',
    titleHtml: 'Стационарные стеклянные перегородки',
    paragraphs: [
      'Стационарные перегородки из алюминиевого профиля и стекла — современное решение для зонирования квартир, частных домов и коммерческих помещений. В данном проекте конструкции были изготовлены для гардеробной и душевой, обеспечив удобное разделение пространства без утяжеления интерьера.',
      'Мы производим алюминиевые перегородки для любых задач: от жилых интерьеров до офисных пространств. Выполняем полный цикл работ — от замера и проектирования до изготовления и монтажа.',
    ],
    features: [
      'Идеально подходят для гардеробных и душевых зон',
      'Сохраняют естественное освещение помещений',
      'Изготавливаются по индивидуальным размерам',
      'Широкий выбор профилей, стекла и вариантов отделки',
    ],
    social: true,
    images: [
      { src: `${STORAGE}/stationar_alum/stationar_1.webp`, alt: 'Стационарные алюминиевые перегородки — проект для гардеробной' },
      { src: `${STORAGE}/stationar_alum/stationar_2.webp`, alt: 'Стеклянная перегородка для душевой зоны' },
      { src: `${STORAGE}/stationar_alum/stationar_3.webp`, alt: 'Готовый интерьер со стационарными алюминиевыми перегородками' },
    ],
  },
  {
    id: 'waldorf',
    side: 'left',
    sliderTone: 'dark',
    eyebrow: { kind: 'badge', text: 'Специальный проект', tone: 'amber' },
    titleHtml: 'Перегородки для отеля<br/>Waldorf Astoria Minsk',
    paragraphs: [
      'В рамках реализации интерьера премиального отеля Waldorf Astoria Minsk были изготовлены стеклянные перегородки для душевых кабин и санузлов. Проект выполнен нашими партнёрами — компанией ВФД Дизайн (Беларусь), специализирующейся на производстве современных алюминиевых и стеклянных конструкций.',
      'Для данного объекта были разработаны индивидуальные инженерные и дизайнерские решения с учётом высоких требований гостиничной индустрии к безопасности, долговечности и комфорту эксплуатации.',
      'Каждый элемент конструкции был адаптирован под особенности объекта и требования заказчика. Такой подход позволяет создавать долговечные перегородки для отелей, жилых комплексов, коммерческих и частных интерьеров, сохраняя высокий уровень эстетики и функциональности.',
      'Реализуем проекты любой сложности — от индивидуальных интерьерных решений до масштабных коммерческих объектов.',
    ],
    features: [
      'Усиленные алюминиевые каркасы для максимальной жёсткости конструкции',
      'Закалённое стекло повышенной прочности и безопасности',
      'Герметичные соединения и надёжная система уплотнителей',
      'Износостойкие покрытия для интенсивной ежедневной эксплуатации',
      'Продуманные решения по вентиляции и обслуживанию',
    ],
    attribution: { href: 'https://t.me/VFD_Design', label: 'ВФД Дизайн' },
    images: range(`${STORAGE}/stationar_alum/hotel`, 10, i => `Перегородки для отеля Waldorf Astoria Minsk — фото ${i}`),
  },
  {
    id: 'lahta',
    side: 'right',
    sliderTone: 'dark',
    bg: 'slate',
    eyebrow: { kind: 'badge', text: 'Реализованный проект', tone: 'teal' },
    titleHtml: 'ЖК Лахта парк,<br/>Санкт-Петербург',
    paragraphs: [
      'Раздвижные алюминиевые перегородки для квартиры в ЖК Лахта парк — проект выполнен по авторскому дизайну Веры Никитиной. Лаконичная минималистичная концепция: тонкий профиль, максимум стекла и воздуха, чёткие линии без лишних деталей.',
      'Алюминиевые системы позволили зонировать пространство без потери естественного освещения. Стеклянные заполнения в тонком профиле сохраняют ощущение открытости и визуальную связь между зонами — квартира остаётся единым пространством с гибким делением.',
    ],
    features: [
      'Тонкий алюминиевый профиль — минимум металла, максимум стекла',
      'Раздвижная система с плавным ходом и мягкими доводчиками',
      'Прозрачное или матовое стекло — под концепцию дизайнера',
      'Индивидуальные размеры под нестандартные проёмы',
      'Порошковое покрытие профиля в любом цвете RAL',
    ],
    noteHtml: 'Дизайнер интерьера: <strong class="text-ink">Вера Никитина</strong>',
    attribution: { href: 'https://t.me/VFD_Design/167', label: 'ВФД Дизайн' },
    images: range(`${STORAGE}/alum/saint_p_alum/tg`, 10, i => `ЖК Лахта парк — алюминиевые перегородки, фото ${i}`),
  },
]
