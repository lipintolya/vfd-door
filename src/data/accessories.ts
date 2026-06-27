/**
 * src/data/accessories.ts
 *
 * Погонажные изделия по типу покрытия — с ценами (РРЦ) для расчёта
 * стоимости комплекта (коробка + наличники) поверх цены полотна.
 *
 * КАК ДОБАВИТЬ ИЗДЕЛИЕ:
 *   Найди нужный ключ покрытия (pet | emal | emalex) в accessoriesByCoating
 *   и добавь объект: { name: 'Название 0000×00×0', category: 'box', unit: 'шт', price: 0 }
 *   Если цена ещё не известна — price: null (на странице покажется «Цена уточняется»).
 *
 * Категории:
 *   kit        — Базовый комплект погонажа (2,5 коробки + 5 наличников; используется
 *                для расчёта итоговой цены «под ключ» на странице товара — см. calcKitPrice)
 *   box        — Коробки
 *   nalichnik  — Наличники
 *   kapitel    — Капители
 *   dobor      — Доборы
 *   plinth     — Плинтус
 *   decorative — Декоративные элементы
 *
 * НАДБАВКА ЗА ЦВЕТ (COLOR_SURCHARGE):
 *   Ключ — colors.name из Supabase, значение — доля надбавки (0.05 = +5%).
 *   Цвета, не упомянутые в COLOR_SURCHARGE, считаются базовыми (0%).
 *   Действует ТОЛЬКО на цену комплекта (коробка+наличники), не на цену полотна —
 *   цена полотна приходит из model_colors.price_rrp и уже учитывает цвет.
 */

export type AccessoryCategory = 'kit' | 'box' | 'nalichnik' | 'kapitel' | 'dobor' | 'plinth' | 'decorative'

export const CATEGORY_LABELS: Record<AccessoryCategory, string> = {
  kit:        'Базовый комплект погонажа',
  box:        'Коробки',
  nalichnik:  'Наличники',
  kapitel:    'Капители',
  dobor:      'Доборы',
  plinth:     'Плинтус',
  decorative: 'Декоративные элементы',
}

export interface Accessory {
  name:     string
  category: AccessoryCategory
  unit:     'шт' | 'комплект'
  price:    number | null
}

export type CoatingSlug = 'pet' | 'emal' | 'emalex'

// ─────────────────────────────────────────────────────────────────────────────
// Базовый комплект погонажа (2,5 коробки + 5 наличников) — цена для базового
// цвета покрытия. Используется и как отдельная позиция в таблице ниже,
// и в расчёте calcKitPrice().
// ─────────────────────────────────────────────────────────────────────────────
export const BASE_KIT_PRICE: Record<CoatingSlug, number> = {
  pet:    5_130,
  emal:   6_080,
  emalex: 4_900,
}
export const BASE_KIT_DESCRIPTION = '2,5 коробки, 5 наличников'

// Дата последней проверки/правки цен на этой странице — обновляй вручную при правке прайса
export const PRICE_LIST_UPDATED = '27.06.2026'

// ─────────────────────────────────────────────────────────────────────────────
// Надбавка к цене комплекта за цвет (ключ — colors.name из Supabase)
// ─────────────────────────────────────────────────────────────────────────────
export const COLOR_SURCHARGE: Record<string, number> = {
  // ПЭТ — база: «Шёлковый белый»
  'Шёлковый бежевый': 0.20,
  'Шёлковый графит':  0.20,
  'Шёлковый индиго':  0.20,
  'Шёлковый муссон':  0.20,
  // Эмаль — база: «Эмаль белая»
  'Эмаль магнолия':       0.05,
  'Эмаль мокко':          0.05,
  'Эмаль слоновая кость': 0.05,
  'Эмаль серебро':        0.05,
  'Эмаль серая':          0.05,
  'Эмаль графит':         0.10,
  // Эмалекс — без надбавок (ключи не указываются, fallback = 0)
}

/** Цена комплекта (коробка + наличники) для конкретного цвета двери. */
export function calcKitPrice(coatingSlug: string, colorName: string): number {
  const base = BASE_KIT_PRICE[coatingSlug as CoatingSlug] ?? 0
  const surcharge = COLOR_SURCHARGE[colorName] ?? 0
  return Math.ceil(base * (1 + surcharge))
}

// ─────────────────────────────────────────────────────────────────────────────
// Погонажные изделия — ключ = coating slug из Supabase
// ─────────────────────────────────────────────────────────────────────────────
export const accessoriesByCoating: Record<CoatingSlug, Accessory[]> = {

  // ── ПЭТ (Иннова) ─────────────────────────────────────────────────────────
  pet: [
    { name: 'Комплект погонажа (2,5 коробки, 5 наличников)',     category: 'kit',        unit: 'комплект', price: BASE_KIT_PRICE.pet },

    { name: 'Коробка КБТ№43П 80х32х2100',                        category: 'box',        unit: 'шт',       price: 910 },
    { name: 'Коробка КБТ№46П 80х38х2100',                        category: 'box',        unit: 'шт',       price: 1_080 },
    { name: 'К-т коробки КБКМ№43П 80х32х2100 компланар',         category: 'box',        unit: 'комплект', price: 2_270 },

    { name: 'Наличник НТ№22 70х8х2140',                          category: 'nalichnik',  unit: 'шт',       price: 570 },
    { name: 'Наличник НТ№35 85х16х2140 «Каскад»',                category: 'nalichnik',  unit: 'шт',       price: 790 },
    { name: 'Наличник НТ№36 80х22х2140 «Нео1»',                  category: 'nalichnik',  unit: 'шт',       price: 910 },
    { name: 'Наличник НТ№37 80х22х2140 «Нео2»',                  category: 'nalichnik',  unit: 'шт',       price: 910 },
    { name: 'К-т наличника КН№01 90х10х2140 компланарный',       category: 'nalichnik',  unit: 'комплект', price: 1_660 },

    { name: 'Добор ДПТ№2 100х10х2070',                           category: 'dobor',      unit: 'шт',       price: 710 },
    { name: 'Добор ДПТ№2 150х10х2070',                           category: 'dobor',      unit: 'шт',       price: 940 },
    { name: 'Добор ДПТ№2 200х10х2070',                           category: 'dobor',      unit: 'шт',       price: 1_120 },
    { name: 'Соединитель для доборов 35х4х2100',                 category: 'dobor',      unit: 'шт',       price: 50 },

    { name: 'Притворная планка 30х10х2100',                      category: 'decorative', unit: 'шт',       price: null },
  ],

  // ── Эмаль ────────────────────────────────────────────────────────────────
  emal: [
    { name: 'Комплект погонажа (2,5 коробки, 5 наличников)',             category: 'kit',        unit: 'комплект', price: BASE_KIT_PRICE.emal },

    { name: 'Коробка КБТ№43П 80х32х2100',                                category: 'box',        unit: 'шт',       price: 1_150 },
    { name: 'Коробка КБТ№43П 80х32х2100 + запил под скрытые петли HH24 Morelli', category: 'box', unit: 'шт',      price: 1_300 },
    { name: 'Комплект коробки КБТ№46П 80×38×2100 (с запилом под скрытые петли HH24 Morelli, 2,5 шт)', category: 'box', unit: 'комплект', price: 3_025 },
    { name: 'Комплект коробки КБКМ№02/39 75×38×2100 компланарный (2,5 шт)', category: 'box',      unit: 'комплект', price: 3_450 },

    { name: 'Наличник НТ№22 70х8х2140',                                  category: 'nalichnik',  unit: 'шт',       price: 640 },
    { name: 'Наличник НТ№25 100х8х2200',                                 category: 'nalichnik',  unit: 'шт',       price: 890 },
    { name: 'Наличник НТ№13 80х8х2140, 3 ручья',                        category: 'nalichnik',  unit: 'шт',       price: 930 },
    { name: 'Наличник НТ№34 80х12х2140 «Антик»',                        category: 'nalichnik',  unit: 'шт',       price: 890 },
    { name: 'Наличник НТ№35 85х16х2140 «Каскад»',                       category: 'nalichnik',  unit: 'шт',       price: 890 },
    { name: 'Наличник НТ№36 80х22х2140 «Нео 1»',                        category: 'nalichnik',  unit: 'шт',       price: 1_030 },
    { name: 'Наличник НТ№37 80х22х2140 «Нео 2»',                        category: 'nalichnik',  unit: 'шт',       price: 1_030 },
    { name: 'Комплект наличника КН№01 90×10×2140 компланарный (5 шт)',  category: 'nalichnik',  unit: 'комплект', price: 3_750 },

    { name: 'Добор ДПТ100№2 100х10х2070',                                category: 'dobor',      unit: 'шт',       price: 1_030 },
    { name: 'Добор ДПТ150№2 150х10х2070',                                category: 'dobor',      unit: 'шт',       price: 1_290 },
    { name: 'Добор ДПТ200№2 200х10х2070',                                category: 'dobor',      unit: 'шт',       price: 1_540 },
    { name: 'Соединитель для доборов 35х4х2100',                        category: 'dobor',      unit: 'шт',       price: 50 },

    { name: 'Капитель 0,6 / 0,7 / 0,8 / 0,9',                            category: 'kapitel',    unit: 'шт',       price: 2_880 },
    { name: 'Капитель 1,2',                                              category: 'kapitel',    unit: 'шт',       price: 4_330 },

    { name: 'Квадрат d35 85×22×85',                                      category: 'decorative', unit: 'шт',       price: 330 },
    { name: 'Банкетка d35 85×22×160',                                    category: 'decorative', unit: 'шт',       price: 460 },
    { name: 'Притворная планка 30х10х2100',                              category: 'decorative', unit: 'шт',       price: 570 },
  ],

  // ── Эмалекс ──────────────────────────────────────────────────────────────
  emalex: [
    { name: 'Комплект погонажа (2,5 коробки, 5 наличников)',             category: 'kit',        unit: 'комплект', price: BASE_KIT_PRICE.emalex },

    { name: 'Коробка КБТ№43П 80х32х2100',                                category: 'box',        unit: 'шт',       price: 880 },
    { name: 'Коробка КБТ№43П 80х32х2100 с запилом под скрытые петли (2 шт, HH24 Morelli)', category: 'box', unit: 'шт', price: 1_030 },
    { name: 'Комплект коробки КБТ№43П 80×32×2100 под скрытые петли (2 шт, HH24 Morelli, 2,5 шт)', category: 'box', unit: 'комплект', price: 2_350 },
    { name: 'Комплект коробки КБТ№46П 80×38×2100 под скрытые петли (2 шт, HH24 Morelli, 2,5 шт)', category: 'box', unit: 'комплект', price: 3_300 },
    { name: 'Комплект коробки КБКМ№02/41 75×38×2100 компланарный (2,5 шт)', category: 'box',      unit: 'комплект', price: 2_760 },

    { name: 'Наличник НТ№22 70х8х2140',                                  category: 'nalichnik',  unit: 'шт',       price: 540 },
    { name: 'Наличник НТ№25 100х8х2200',                                 category: 'nalichnik',  unit: 'шт',       price: 750 },
    { name: 'Наличник НТ№24 80х16х2140 «Фигурный»',                     category: 'nalichnik',  unit: 'шт',       price: 795 },
    { name: 'Наличник НТ№34 80х12х2140 «Антик»',                        category: 'nalichnik',  unit: 'шт',       price: 730 },
    { name: 'Наличник НТ№35 85х16х2140 «Каскад»',                       category: 'nalichnik',  unit: 'шт',       price: 750 },
    { name: 'Наличник НТ№36 80х22х2140 «Нео 1»',                        category: 'nalichnik',  unit: 'шт',       price: 840 },
    { name: 'Наличник НТ№37 80х22х2140 «Нео 2»',                        category: 'nalichnik',  unit: 'шт',       price: 840 },
    { name: 'Комплект наличника КН№01 90×10×2140 компланарный (2,5 шт)', category: 'nalichnik', unit: 'комплект', price: 1_750 },

    { name: 'Добор ДПТ100№2 100х10х2070',                                category: 'dobor',      unit: 'шт',       price: 640 },
    { name: 'Добор ДПТ150№2 150х10х2070',                                category: 'dobor',      unit: 'шт',       price: 840 },
    { name: 'Добор ДПТ200№2 200х10х2070',                                category: 'dobor',      unit: 'шт',       price: 1_030 },
    { name: 'Добор ДПТ300№2 300х10х2070',                                category: 'dobor',      unit: 'шт',       price: 2_130 },
    { name: 'Добор ДПТ390№2 390х10х2070',                                category: 'dobor',      unit: 'шт',       price: 2_400 },
    { name: 'Соединитель для доборов 35х4х2100',                        category: 'dobor',      unit: 'шт',       price: 50 },

    { name: 'Плинтус 70х16х2140',                                        category: 'plinth',     unit: 'шт',       price: 810 },
    { name: 'Клипсы для плинтуса',                                       category: 'plinth',     unit: 'шт',       price: 50 },
  ],
}
