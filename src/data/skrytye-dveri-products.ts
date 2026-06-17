/* ============================================================
   Данные скрытых дверей «Секрет» / «Секрет Реверс»
   Только РРЦ — закупочные цены на сайте не публикуются
   ============================================================ */

const CDN      = 'https://storage.yandexcloud.net/catalog-vfd/invisible/'
const INFO_CDN  = `${CDN}invisible_info/`

// ── Информационные изображения ─────────────────────────────────
export const INFO_IMAGES = {
  kompl:  `${INFO_CDN}invisible_kompl.webp`,
  lr:     `${INFO_CDN}invisible_lr.webp`,
  constr: `${INFO_CDN}invisible_constr.webp`,
} as const

// ── Изображения ───────────────────────────────────────────────
export const IMAGES = {
  // Серия «Секрет» (прямой монтаж)
  invisible:    `${CDN}invisible.webp`,
  // Серия «Секрет Реверс» (реверсивный монтаж)
  invisibleRev: `${CDN}invisible_reverse.webp`,
  // Обложки для свитчера (3 стиля интерьера)
  covers: [
    { id: 'modern',  label: 'Современный', src: `${CDN}cover.webp`        },
    { id: 'loft',    label: 'Лофт',        src: `${CDN}cover_black.webp`   },
    { id: 'artdeco', label: 'Арт-деко',    src: `${CDN}cover_artdeco.webp` },
  ],
  // Портфолио — заменить src когда будут готовы
  portfolio: [
    { src: '', alt: 'Скрытая дверь в гостиной — Челябинск',           caption: 'Гостиная, кромка чёрная'     },
    { src: '', alt: 'Скрытая дверь в спальне — Челябинск',            caption: 'Спальня, под покраску'       },
    { src: '', alt: 'Скрытая дверь в коридоре — Челябинск',           caption: 'Коридор, реверсивный монтаж' },
    { src: '', alt: 'Скрытые двери в студии — Челябинск',             caption: 'Студия, кромка серебро'      },
    { src: '', alt: 'Скрытая дверь в санузел с завёрткой WC',         caption: 'Санузел, завёртка WC'        },
    { src: '', alt: 'Скрытая дверь под декоративную штукатурку',      caption: 'Прихожая, под штукатурку'    },
  ],
} as const

// ── Размеры в наличии ────────────────────────────────────────
export const DOOR_HEIGHT         = 2000
export const SECRET_SIZES        = [600, 700, 800, 900] as const
export const SECRET_REVERS_SIZES = [600, 700, 800]      as const

// ── Цены РРЦ ─────────────────────────────────────────────────
export const POLOTNO_PRICE_SECRET        = 11_360   // РРЦ полотна «Секрет»
export const POLOTNO_PRICE_SECRET_REVERS = 15_910   // РРЦ полотна «Секрет Реверс»
export const FRAME_KIT_PRICE             = 19_820   // РРЦ комплекта короба (2 цвета — одна цена)

// Итоговая стоимость комплекта (полотно + короб)
export const TOTAL_SECRET        = POLOTNO_PRICE_SECRET + FRAME_KIT_PRICE         // 31 180
export const TOTAL_SECRET_REVERS = POLOTNO_PRICE_SECRET_REVERS + FRAME_KIT_PRICE  // 35 730

// ── Комплект скрытого короба ─────────────────────────────────
export const FRAME_KIT = {
  article:  'К-т скрытого короба 54×43×2200',
  size:     '54×43 мм, длина 2200 мм (2,5 пог. м)',
  priceRrp: FRAME_KIT_PRICE,
  includes: [
    'Алюминиевый профиль 54×43 мм',
    'Запил под ответную планку',
    'Ответная планка',
    'Две скрытые петли №1',
  ],
  colors: [
    { label: 'Чёрный',  inStock: 22 },
    { label: 'Серебро', inStock: 12 },
    { label: 'Золото',  inStock: 5  },
  ],
} as const

// ── Нестандартные высоты (изготовление под заказ) ────────────
// Надбавка к цене полотна; короб и фурнитура — по стандартной цене
export const CUSTOM_HEIGHT_TIERS = [
  { range: '2050–2250', from: 2050, to: 2250, surcharge: 0.20, pct: '+20%' },
  { range: '2300–2350', from: 2300, to: 2350, surcharge: 0.30, pct: '+30%' },
  { range: '2400–2550', from: 2400, to: 2550, surcharge: 0.40, pct: '+40%' },
  { range: '2600–2700', from: 2600, to: 2700, surcharge: 0.50, pct: '+50%' },
] as const

export const CUSTOM_LEAD_TIME = '6–8 недель'

// Рассчитать цену комплекта с надбавкой за нестандартную высоту (округление вверх)
export function calcCustomPrice(basePrice: number, surcharge: number): number {
  return Math.ceil(basePrice * (1 + surcharge) / 10) * 10
}

// Количество комплектов короба на одну дверь
// Один к-т: 2,5 шт × 2200 мм = 5500 мм покрытия; +200 мм на запилы
export function calcFrameKits(heightMm: number, widthMm: number): number {
  return Math.ceil((2 * heightMm + widthMm + 200) / 5500)
}

// ── Дополнительная фурнитура (опционально к основному заказу) ─
export const OPTIONAL_HARDWARE = [
  {
    name: 'Ручка скрытого монтажа',
    desc: 'Утапливается в торец полотна — не выступает за плоскость стены',
    icon: 'handle',
  },
  {
    name: 'Стопор скрытого монтажа',
    desc: 'Удерживает дверь в открытом положении без видимых деталей',
    icon: 'stop',
  },
  {
    name: 'Завёртка WC',
    desc: 'Для санузлов: блокировка изнутри, индикатор занятости снаружи',
    icon: 'wc',
  },
] as const

// ── Цифры и факты ────────────────────────────────────────────
export const FACTS = [
  { value: '1–2 мм',    label: 'зазор между полотном и стеной'     },
  { value: 'от 90 мм',  label: 'минимальная толщина стены'         },
  { value: 'до 70 кг',  label: 'нагрузка на скрытые петли'         },
  { value: '3 слоя',    label: 'краски принимает грунтованная поверхность' },
  { value: '1–2 дня',   label: 'срок монтажа нашей бригадой'       },
  { value: '2,5 пог. м','label': 'алюминиевого профиля в коробе'   },
] as const
