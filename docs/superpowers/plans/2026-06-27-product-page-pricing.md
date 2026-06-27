# Product Page: Photo, Эмалекс Copy, Погонаж Pricing — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fix the oversized product photo, correct the эмалекс material description, and surface accurate "под ключ" pricing (полотно + базовый комплект погонажа, with per-color surcharge) on `/models/[slug]` pages.

**Architecture:** Three independent, additive changes to existing files — no new pages, no schema changes. Pricing data and the surcharge calculation live in `src/data/accessories.ts` (single source of truth); the Vue island (`ProductColorPicker.vue`) and the static Astro page (`models/[id].astro`) both import from it so the headline "комплект" number and the full price table can never drift apart.

**Tech Stack:** Astro 6, Vue 3 (`<script setup>`), Tailwind v4 utilities + a few existing scoped `<style>` blocks (this page predates the Tailwind conversion done elsewhere in the app — match its existing CSS-variable style, don't introduce Tailwind classes here).

## Global Constraints

- No test runner or linter is configured in this repo (see `CLAUDE.md`) — verification is `npm run build` (hits live Supabase, the project's stated correctness gate) plus manual checks against the running dev server. Do not add a test framework as part of this work.
- Do not run `npm run deploy` or push to the `production` remote at any point.
- Prices are RRP, in whole rubles, no kopecks — round with `Math.ceil` when a surcharge produces a fraction (consistent with `calcCustomPrice` in `src/data/skrytye-dveri-products.ts`, the existing precedent for this kind of calculation in this repo).
- `COLOR_SURCHARGE` keys must match `colors.name` exactly as stored in Supabase — confirmed values: ПЭТ `Шёлковый бежевый | Шёлковый белый | Шёлковый графит | Шёлковый индиго | Шёлковый муссон`; Эмаль `Эмаль белая | Эмаль графит | Эмаль магнолия | Эмаль мокко | Эмаль серая | Эмаль серебро | Эмаль слоновая кость`; Эмалекс `Эмалекс бежевый | Эмалекс белый | Эмалекс графит | Эмалекс молочный | Эмалекс серый`.
- Surcharge rule (confirmed by user): ПЭТ — «Шёлковый белый» = base (0%), all other ПЭТ colors = +20%. Эмаль — «Эмаль белая» = base (0%), «Эмаль графит» = +10%, all other эмаль colors = +5%. Эмалекс — no surcharge, all 0%.

---

### Task 1: Price data + surcharge calculation in `accessories.ts`

**Files:**
- Modify: `src/data/accessories.ts` (full rewrite — current file is 83 lines, names-only, with `pet`/`emalex` empty)

**Interfaces:**
- Produces: `AccessoryCategory` (adds `'kit'` and `'plinth'` to the existing union), `Accessory` (adds `unit: 'шт' | 'комплект'`, `price: number | null`), `CoatingSlug = 'pet' | 'emal' | 'emalex'`, `BASE_KIT_PRICE: Record<CoatingSlug, number>`, `BASE_KIT_DESCRIPTION: string`, `COLOR_SURCHARGE: Record<string, number>`, `calcKitPrice(coatingSlug: string, colorName: string): number`, `getColorSurchargesForCoating(coatingSlug: CoatingSlug, colorNames: string[]): { name: string; pct: number }[]`, `accessoriesByCoating: Record<CoatingSlug, Accessory[]>` (unchanged export name, new shape per item), `CATEGORY_LABELS` (unchanged export name, two new keys).
- Consumes: nothing (leaf data module).

- [ ] **Step 1: Replace the full contents of `src/data/accessories.ts`**

```ts
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

/** Цвета модели (из её реального набора), у которых есть надбавка — для сноски в таблице цен. */
export function getColorSurchargesForCoating(
  coatingSlug: CoatingSlug,
  colorNames: string[],
): { name: string; pct: number }[] {
  return [...new Set(colorNames)]
    .map(name => ({ name, pct: COLOR_SURCHARGE[name] ?? 0 }))
    .filter(c => c.pct > 0)
    .sort((a, b) => a.pct - b.pct)
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
```

- [ ] **Step 2: Verify the file compiles standalone**

Run: `npx tsc --noEmit src/data/accessories.ts --module esnext --moduleResolution bundler --target es2022 --strict`
Expected: no output (no errors). If it complains about missing Astro/Vue globals unrelated to this file, ignore — only fix errors that point at lines inside `accessories.ts` itself.

- [ ] **Step 3: Sanity-check the pricing math in a throwaway script**

Run:
```bash
node -e "
const { calcKitPrice } = require('./src/data/accessories.ts');
" 2>&1 | head -1
```
This will fail (Node can't `require` a `.ts` file directly) — that's expected and fine, this step only exists to confirm Step 2 already caught real type errors. Skip straight to Step 4; the real verification happens in Task 3/4 once this module is imported from `.vue`/`.astro` files that Astro's toolchain compiles.

- [ ] **Step 4: Commit**

```bash
git add src/data/accessories.ts
git commit -m "Add full погонаж pricing data with per-color surcharge calculation"
```

---

### Task 2: Fix эмалекс material description

**Files:**
- Modify: `src/data/series-descriptions.ts:159-177` (the `emalex` and `'emalex-modern'` entries), `src/data/series-descriptions.ts:218-223` (the `coatingFallbacks.emalex` entry)

**Interfaces:**
- Consumes: nothing new.
- Produces: no signature changes — only string literal content changes inside `SeriesSpec` objects already consumed by `getSeriesSpec()` in `src/pages/models/[id].astro`.

- [ ] **Step 1: Update the `emalex` and `'emalex-modern'` entries**

In `src/data/series-descriptions.ts`, replace:

```ts
  emalex: {
    tagline:     'Эмалекс — двойная защита',
    description: 'Серия Эмалекс — двери с двухслойным покрытием: базовая эмаль плюс защитный лак. Повышенная стойкость к царапинам и истиранию.',
    features:    ['Двухслойное покрытие', 'Высокая стойкость к истиранию', 'Матовый финиш'],
    coating:     'Эмалекс: двойное покрытие — эмаль + лак. Высокая износостойкость',
    material:    'Тамбурат с особым, малым размером сот. В основе прочная плита ХДФ и инженерный массив',
    edge:        'Эко-материал в цвет полотна',
    thickness:   '37',
  },

  'emalex-modern': {
    tagline:     'Эмалекс Модерн',
    description: 'Серия Эмалекс Модерн — современный дизайн с двухслойным покрытием эмалекс. Стойкость к повреждениям в сочетании с актуальными формами.',
    features:    ['Двухслойное покрытие', 'Современные линии', 'Износостойкость'],
    coating:     'Эмалекс: двойное покрытие — эмаль + лак. Высокая износостойкость',
    material:    'Тамбурат с особым, малым размером сот. В основе прочная плита ХДФ и инженерный массив',
    edge:        'Эко-материал в цвет полотна',
    thickness:   '37',
  },
```

with:

```ts
  emalex: {
    tagline:     'Эмалекс — двойная защита',
    description: 'Серия Эмалекс — двери в полипропиленовом покрытии с эффектом эмали. Повышенная стойкость к царапинам и истиранию, не выгорает на солнце.',
    features:    ['Двухслойное покрытие', 'Высокая стойкость к истиранию', 'Матовый финиш'],
    coating:     'Эмалекс: полипропиленовое покрытие с эффектом эмали — устойчиво к сколам, царапинам и выгоранию',
    material:    'Тамбурат с особым, малым размером сот. В основе прочная плита ХДФ и инженерный массив',
    edge:        'Эко-материал в цвет полотна',
    thickness:   '37',
  },

  'emalex-modern': {
    tagline:     'Эмалекс Модерн',
    description: 'Серия Эмалекс Модерн — современный дизайн в полипропиленовом покрытии с эффектом эмали. Стойкость к повреждениям в сочетании с актуальными формами.',
    features:    ['Двухслойное покрытие', 'Современные линии', 'Износостойкость'],
    coating:     'Эмалекс: полипропиленовое покрытие с эффектом эмали — устойчиво к сколам, царапинам и выгоранию',
    material:    'Тамбурат с особым, малым размером сот. В основе прочная плита ХДФ и инженерный массив',
    edge:        'Эко-материал в цвет полотна',
    thickness:   '37',
  },
```

- [ ] **Step 2: Update the `coatingFallbacks.emalex` entry**

Replace:

```ts
  emalex: {
    coating:   'Эмалекс: двойное покрытие — эмаль + лак. Высокая износостойкость',
    material:  'Тамбурат с особым, малым размером сот. В основе прочная плита ХДФ и инженерный массив',
    edge:      'Эко-материал в цвет полотна',
    thickness: '37',
  },
```

with:

```ts
  emalex: {
    coating:   'Эмалекс: полипропиленовое покрытие с эффектом эмали — устойчиво к сколам, царапинам и выгоранию',
    material:  'Тамбурат с особым, малым размером сот. В основе прочная плита ХДФ и инженерный массив',
    edge:      'Эко-материал в цвет полотна',
    thickness: '37',
  },
```

- [ ] **Step 3: Verify on the dev server**

Run (assumes dev server already running on :4321 — if not: `lsof -ti:4321 | xargs -r kill -9 && nohup npm run dev > /tmp/astro-dev.log 2>&1 & disown && sleep 2`):

```bash
curl -s http://localhost:4321/models/$(curl -s http://localhost:4321/catalog | grep -o 'href="/models/[^"]*emalex[^"]*"' | head -1 | sed 's/href="\/models\///;s/"//') | grep -o 'полипропилен[^<]*'
```

Expected: prints a snippet containing «полипропиленовое покрытие с эффектом эмали» — confirms the new copy renders and the old «эмаль + лак» wording is gone.

- [ ] **Step 4: Commit**

```bash
git add src/data/series-descriptions.ts
git commit -m "Correct эмалекс material description: polypropylene, not enamel+lacquer"
```

---

### Task 3: Square photo crop + kit price in `ProductColorPicker.vue`

**Files:**
- Modify: `src/components/catalog/ProductColorPicker.vue`

**Interfaces:**
- Consumes: `calcKitPrice(coatingSlug: string, colorName: string): number` from `../../data/accessories` (produced in Task 1).
- Produces: no new exports — `ColorVariant` interface is unchanged (`coatingSlug` and `name` fields already exist and are what `calcKitPrice` needs).

- [ ] **Step 1: Import `calcKitPrice` and add a `kitTotal` computed**

In the `<script setup>` block, after the existing `normalizeHex` function, add:

```ts
import { calcKitPrice } from '../../data/accessories'

const kitTotal = computed(() => {
  if (!selected.value.price) return null
  return selected.value.price + calcKitPrice(selected.value.coatingSlug, selected.value.name)
})
```

(`computed` is already imported at the top of the file from `'vue'` — no new import needed there.)

- [ ] **Step 2: Add the kit-price line to the template**

In the `<!-- Цена -->` block, change:

```html
    <!-- Цена -->
    <div class="color-picker__price-row">
      <span class="color-picker__price">{{ formatPrice(selected.price) }}</span>
      <span class="color-picker__price-note">за полотно</span>
    </div>
```

to:

```html
    <!-- Цена -->
    <div class="color-picker__price-row">
      <span class="color-picker__price">{{ formatPrice(selected.price) }}</span>
      <span class="color-picker__price-note">за полотно</span>
    </div>
    <p v-if="kitTotal" class="color-picker__kit-price">
      Комплект под ключ (с коробкой и наличниками): <strong>от {{ kitTotal.toLocaleString('ru-RU') }} ₽</strong>
    </p>
```

- [ ] **Step 3: Add the new style rule**

In the `<style scoped>` block, after `.color-picker__price-note`, add:

```css
.color-picker__kit-price {
  font-size: 0.8125rem;
  color: #64748b;
  margin: 0;
}

.color-picker__kit-price strong {
  color: #334155;
  font-weight: 700;
}
```

- [ ] **Step 4: Fix the photo aspect ratio**

In the same `<style scoped>` block, change:

```css
.color-picker__photo-wrap {
  border-radius: 1.5rem;
  overflow: hidden;
  background: #f8fafc;
  aspect-ratio: 3 / 4;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.color-picker__photo {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}
```

to:

```css
.color-picker__photo-wrap {
  border-radius: 1.5rem;
  overflow: hidden;
  background: #f8fafc;
  aspect-ratio: 1 / 1;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.color-picker__photo {
  width: 100%;
  height: 100%;
  object-fit: contain;
  padding: 1.5rem;
  display: block;
}
```

- [ ] **Step 5: Verify on the dev server**

Run:
```bash
curl -s http://localhost:4321/models/emaleks-27-satin-belyi-steklo-emalex-modern | grep -o 'Комплект под ключ[^<]*<strong>[^<]*</strong>'
```
Expected: a line like `Комплект под ключ (с коробкой и наличниками): <strong>от 11 430 ₽</strong>` (exact number depends on live Supabase price for this model + its color's surcharge — what matters is the line is present and the number is greater than the polotno-only price).

Then open `http://localhost:4321/models/emaleks-27-satin-belyi-steklo-emalex-modern` in a browser (or via Playwright screenshot) and confirm: the photo shows the full door without being cropped, and the price + CTA buttons are visible without scrolling on a standard 1440×900 viewport.

- [ ] **Step 6: Commit**

```bash
git add src/components/catalog/ProductColorPicker.vue
git commit -m "Show full door photo (1:1 contain) and komplekt price under polotno price"
```

---

### Task 4: Priced погонаж table on `models/[id].astro`

**Files:**
- Modify: `src/pages/models/[id].astro` (frontmatter around the `accessories`/`accessoryGroups` computation, and the `.accessories-section` template block + its `<style>` rules)

**Interfaces:**
- Consumes: `CATEGORY_LABELS`, `AccessoryCategory`, `Accessory`, `accessoriesByCoating`, `getColorSurchargesForCoating(coatingSlug: CoatingSlug, colorNames: string[])` from `../../data/accessories` (produced in Task 1). `colors: ColorVariant[]` and `coatingSlug: string` are already in scope in this file (existing props).
- Produces: no new exports — this is a leaf page.

- [ ] **Step 1: Sort `kit` category first and compute the surcharge footnote**

First, update the existing import lines near the top of the file:

```ts
import { accessoriesByCoating, CATEGORY_LABELS } from '../../data/accessories'
import type { AccessoryCategory } from '../../data/accessories'
```

to:

```ts
import { accessoriesByCoating, CATEGORY_LABELS, getColorSurchargesForCoating } from '../../data/accessories'
import type { AccessoryCategory, CoatingSlug } from '../../data/accessories'
```

Then find this existing block further down:

```ts
const accessories = accessoriesByCoating[coatingSlug] ?? []

const accessoryGroups: [string, typeof accessories][] = Object.entries(
  accessories.reduce<Record<string, typeof accessories>>((acc, item) => {
    ;(acc[item.category] ??= []).push(item)
    return acc
  }, {})
)
```

Replace it with:

```ts
const accessories = accessoriesByCoating[coatingSlug as CoatingSlug] ?? []

const CATEGORY_ORDER: AccessoryCategory[] = ['kit', 'box', 'nalichnik', 'kapitel', 'dobor', 'plinth', 'decorative']

const accessoryGroups: [AccessoryCategory, typeof accessories][] = Object.entries(
  accessories.reduce<Record<string, typeof accessories>>((acc, item) => {
    ;(acc[item.category] ??= []).push(item)
    return acc
  }, {})
)
  .sort(([a], [b]) => CATEGORY_ORDER.indexOf(a as AccessoryCategory) - CATEGORY_ORDER.indexOf(b as AccessoryCategory))
  .map(([category, items]) => [category as AccessoryCategory, items])

const colorSurcharges = getColorSurchargesForCoating(coatingSlug as CoatingSlug, colors.map(c => c.name))
```

- [ ] **Step 2: Render price + unit per item, highlight the `kit` group, show the surcharge footnote**

Find this existing block:

```astro
  <!-- ── Погонажные изделия ── -->
  {accessories.length > 0 && (
    <section class="accessories-section">
      <div class="container">
        <div class="accessories-header">
          <h2 class="accessories-title">Погонажные изделия</h2>
          <p class="accessories-note">
            Цены уточняйте у менеджера в салоне или по телефону
          </p>
        </div>
        <div class="accessories-groups">
          {accessoryGroups.map(([category, items]) => (
            <div class="accessories-group">
              <p class="accessories-group__label">
                {CATEGORY_LABELS[category as AccessoryCategory] ?? category}
              </p>
              <ul class="accessories-list">
                {items.map(item => (
                  <li class="accessories-item">{item.name}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  )}
```

Replace it with:

```astro
  <!-- ── Погонажные изделия ── -->
  {accessories.length > 0 && (
    <section class="accessories-section">
      <div class="container">
        <div class="accessories-header">
          <h2 class="accessories-title">Погонажные изделия</h2>
          <p class="accessories-note">
            Цены РРЦ, актуальны на момент публикации — уточняйте у менеджера в салоне
            {colorSurcharges.length > 0 && (
              <>. Для цвета {colors[0]?.name ? <strong>{colors[0].name}</strong> : 'этой модели'}{' '}
                {colorSurcharges.map((s, i) => (
                  <>{i > 0 ? ', ' : ''}{s.name} +{Math.round(s.pct * 100)}%</>
                ))}
              </>
            )}
          </p>
        </div>
        <div class="accessories-groups">
          {accessoryGroups.map(([category, items]) => (
            <div class:list={['accessories-group', category === 'kit' && 'accessories-group--kit']}>
              <p class="accessories-group__label">
                {CATEGORY_LABELS[category] ?? category}
              </p>
              <ul class="accessories-list">
                {items.map(item => (
                  <li class="accessories-item">
                    <span class="accessories-item__name">{item.name}</span>
                    <span class="accessories-item__price">
                      {item.price ? `${item.price.toLocaleString('ru-RU')} ₽ / ${item.unit}` : 'Цена уточняется'}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  )}
```

- [ ] **Step 3: Update the accessories CSS**

Find the existing `.accessories-item` rule:

```css
.accessories-item {
  font-size: 0.875rem;
  color: #cbd5e1;
  line-height: 1.45;
  padding: 0.4rem 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.accessories-item:last-child {
  border-bottom: none;
  padding-bottom: 0;
}
```

Replace it with:

```css
.accessories-item {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 0.75rem;
  font-size: 0.875rem;
  color: #cbd5e1;
  line-height: 1.45;
  padding: 0.4rem 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.accessories-item:last-child {
  border-bottom: none;
  padding-bottom: 0;
}

.accessories-item__name {
  flex: 1;
}

.accessories-item__price {
  flex-shrink: 0;
  font-weight: 700;
  color: #f1f5f9;
  white-space: nowrap;
}

.accessories-group--kit {
  background: rgba(20, 184, 166, 0.08);
  border-color: rgba(20, 184, 166, 0.25);
}
```

- [ ] **Step 4: Verify on the dev server**

Run:
```bash
curl -s http://localhost:4321/models/emaleks-27-satin-belyi-steklo-emalex-modern | grep -o 'Базовый комплект погонажа'
curl -s http://localhost:4321/models/emaleks-27-satin-belyi-steklo-emalex-modern | grep -o '4[ ,]900 ₽ / комплект'
```
Expected: first command prints `Базовый комплект погонажа` (the kit group label is rendered), second prints `4 900 ₽ / комплект` (the эмалекс base kit price from Task 1 is rendered with its unit).

Then run a build to make sure nothing regressed for ПЭТ/Эмаль models too:
```bash
npm run build 2>&1 | tail -15
```
Expected: `XXX page(s) built` with no errors (same count as before this task — no routes were added or removed).

- [ ] **Step 5: Commit**

```bash
git add src/pages/models/[id].astro
git commit -m "Show priced погонаж table with kit highlight and per-color surcharge note"
```

---

## Self-Review Notes

- **Spec coverage:** Section 1 (photo) → Task 3 Steps 4–5. Section 2 (эмалекс copy) → Task 2. Section 3 (pricing data + kit price + table) → Tasks 1, 3 (headline number), 4 (table). All three spec sections have a task.
- **Type consistency:** `CoatingSlug`, `Accessory`, `AccessoryCategory`, `calcKitPrice`, `getColorSurchargesForCoating`, `BASE_KIT_PRICE`, `COLOR_SURCHARGE` are defined once in Task 1 and consumed with matching names/signatures in Tasks 3 and 4 — no renaming across tasks.
- **No placeholders:** all accessory line items use real prices transcribed from the user-provided price sheet; the one genuinely unknown price (ПЭТ «Притворная планка», marked «скоро» in the source) is modeled as `price: null`, which is a real, handled state (renders «Цена уточняется»), not a TODO.
