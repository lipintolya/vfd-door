/**
 * src/data/accessories.ts
 *
 * Погонажные изделия по типу покрытия.
 * Цены НЕ указываем — только наименования.
 *
 * КАК ДОБАВИТЬ ИЗДЕЛИЕ:
 *   Найди нужный ключ покрытия (emal | pet | emalex) и добавь объект:
 *   { name: 'Название 0000×00×0', category: 'box' }
 *
 * Категории:
 *   box        — Коробки
 *   nalichnik  — Наличники
 *   kapitel    — Капители
 *   dobor      — Доборы
 *   decorative — Декоративные элементы
 *
 * КАК ДОБАВИТЬ ИЗДЕЛИЯ ДЛЯ НОВОГО ПОКРЫТИЯ:
 *   Добавь ключ в accessoriesByCoating, аналогично 'emal' ниже.
 */

export type AccessoryCategory = 'box' | 'nalichnik' | 'kapitel' | 'dobor' | 'decorative'

export const CATEGORY_LABELS: Record<AccessoryCategory, string> = {
  box:        'Коробки',
  nalichnik:  'Наличники',
  kapitel:    'Капители',
  dobor:      'Доборы',
  decorative: 'Декоративные элементы',
}

export interface Accessory {
  name:     string
  category: AccessoryCategory
}

// ─────────────────────────────────────────────────────────────────────────────
// Погонажные изделия — ключ = coating slug из Supabase
// ─────────────────────────────────────────────────────────────────────────────
export const accessoriesByCoating: Record<string, Accessory[]> = {

  // ── ЭМАЛЬ ────────────────────────────────────────────────────────────────
  emal: [
    // Коробки
    { name: 'Коробка с упл. Эмаль белая (телескоп.) 2100×80×32',     category: 'box' },
    { name: 'Коробка (МДФ) с упл. Эмаль белая 2100×70×26',           category: 'box' },

    // Наличники
    { name: 'Наличник Эмаль белая (телескоп) 2140×70×8',             category: 'nalichnik' },
    { name: 'Наличник Эмаль белая (телескоп) 2200×100×8',            category: 'nalichnik' },
    { name: 'Наличник Эмаль белая 2140×70×8',                        category: 'nalichnik' },
    { name: 'Наличник «Каннелюр» Эмаль белая 2140×80×10',            category: 'nalichnik' },
    { name: 'Наличник «Каннелюр» Эмаль белая (телескоп) 2140×80×10', category: 'nalichnik' },

    // Капители
    { name: 'Капитель Эмаль белая 90', category: 'kapitel' },
    { name: 'Капитель Эмаль белая 80', category: 'kapitel' },
    { name: 'Капитель Эмаль белая 70', category: 'kapitel' },
    { name: 'Капитель Эмаль белая 60', category: 'kapitel' },

    // Доборы
    { name: 'Добор Эмаль белая 2100×400×8',             category: 'dobor' },
    { name: 'Добор Эмаль белая 2100×200×8',             category: 'dobor' },
    { name: 'Добор Эмаль белая 2100×150×8',             category: 'dobor' },
    { name: 'Добор Эмаль белая 2100×100×8',             category: 'dobor' },
    { name: 'Добор Эмаль белая (телескоп) 2130×200×10', category: 'dobor' },
    { name: 'Добор Эмаль белая (телескоп) 2130×150×10', category: 'dobor' },
    { name: 'Добор Эмаль белая (телескоп) 2130×100×10', category: 'dobor' },

    // Декоративные
    { name: 'Банкетка Эмаль белая 160×85×22', category: 'decorative' },
    { name: 'Квадрат Эмаль белая 85×85×22',   category: 'decorative' },
  ],

  // ── ПЭТ ──────────────────────────────────────────────────────────────────
  // TODO: добавить изделия для ПЭТ-покрытия
  pet: [],

  // ── ЭМАЛЕКС ──────────────────────────────────────────────────────────────
  // TODO: добавить изделия для Эмалекс
  emalex: [],
}
