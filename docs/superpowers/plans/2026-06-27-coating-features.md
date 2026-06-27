# «Особенности коллекции» Block Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a per-coating (ПЭТ/Эмаль/Эмалекс) "collection features" block to the product page — a clickable list of advantages on the left, two photos + caption for the active item on the right.

**Architecture:** One new data file (`coating-features.ts`, keyed by the existing `CoatingSlug` type), one new Vue island (`CoatingFeatures.vue`) that mirrors the click-to-switch interaction already used by `ProductColorPicker.vue`, and one integration point in `models/[id].astro` between the existing price/CTA block and the «Погонажные изделия» section.

**Tech Stack:** Astro 6, Vue 3 (`<script setup>`), scoped `<style>` (matches the existing non-Tailwind CSS-variable style of this page — do not introduce Tailwind utility classes here, this page predates that conversion).

## Global Constraints

- No test runner or linter is configured in this repo — verification is `npm run build` (hits live Supabase, the project's correctness gate per `CLAUDE.md`) plus manual checks against the running dev server (`npm run dev`, port 4321).
- Do not run `npm run deploy` or push to the `production` remote.
- Reuse `CoatingSlug` from `src/data/accessories.ts` — do not redeclare it.
- Empty `images` entries (`''`) must render the existing grey placeholder SVG pattern already used in `ProductColorPicker.vue`, never a broken `<img>` tag.
- Accent colour for the active item is teal (`#14b8a6` / `--color-accent`), not the reference site's red — this project keeps its own design tokens (established precedent from earlier work this session).

---

### Task 1: Data file `coating-features.ts`

**Files:**
- Create: `src/data/coating-features.ts`

**Interfaces:**
- Consumes: `CoatingSlug` from `src/data/accessories.ts` (already exported: `'pet' | 'emal' | 'emalex'`).
- Produces: `CoatingFeature` interface (`title: string`, `description: string`, `images: [string, string]`), `coatingFeatures: Record<CoatingSlug, CoatingFeature[]>` — consumed by Task 3.

- [ ] **Step 1: Create the file with full starter content**

```ts
/**
 * src/data/coating-features.ts
 *
 * «Особенности коллекции» — блок преимуществ на странице товара,
 * один набор пунктов на тип покрытия (не на серию — серий слишком
 * много, преимущества покрытия общие для всех серий одного типа).
 *
 * КАК ОТРЕДАКТИРОВАТЬ:
 *   Меняй title/description/images прямо здесь. images — всегда
 *   ровно 2 URL (или 2 пустые строки, если фото ещё нет — компонент
 *   покажет плейсхолдер вместо них).
 */

import type { CoatingSlug } from './accessories'

export interface CoatingFeature {
  title:       string
  description: string
  images:      [string, string]
}

export const coatingFeatures: Record<CoatingSlug, CoatingFeature[]> = {
  pet: [
    {
      title:       'Устойчивость к влаге и царапинам',
      description: 'ПЭТ-плёнка — экологически чистое покрытие, которое не боится влажной уборки, бытовых царапин и выгорания на солнце.',
      images:      ['', ''],
    },
    {
      title:       'Широкая палитра цветов',
      description: 'ПЭТ-плёнка точно повторяет текстуру дерева и держит насыщенный цвет дольше, чем плёнки на масляной основе.',
      images:      ['', ''],
    },
    {
      title:       'ПВХ-кромка в цвет полотна',
      description: 'Кромка из ПВХ защищает торец двери от влаги и сколов, подобрана в цвет полотна без видимого стыка.',
      images:      ['', ''],
    },
  ],
  emal: [
    {
      title:       'Итальянская эмаль',
      description: 'Светостойкая эмаль с высоким укрывным эффектом — не желтеет и не тускнеет со временем.',
      images:      ['', ''],
    },
    {
      title:       'Глубокая фрезеровка',
      description: 'Рельефные линии полотна сохраняют чёткость многие годы благодаря плотному слою эмали.',
      images:      ['', ''],
    },
    {
      title:       'Эко-кромка в цвет полотна',
      description: 'Кромка из экологичного материала подобрана в цвет покрытия — стык практически не виден.',
      images:      ['', ''],
    },
  ],
  emalex: [
    {
      title:       'Полипропилен с эффектом эмали',
      description: 'Эмалекс выглядит как глянцевая эмаль, но это более стойкое к сколам и царапинам полипропиленовое покрытие.',
      images:      ['', ''],
    },
    {
      title:       'Не выгорает на солнце',
      description: 'Покрытие сохраняет исходный цвет даже на дверях, которые большую часть дня находятся на солнечной стороне.',
      images:      ['', ''],
    },
    {
      title:       'Матовый финиш',
      description: 'Лёгкая матовость покрытия скрывает отпечатки пальцев и бытовые загрязнения лучше глянцевых аналогов.',
      images:      ['', ''],
    },
  ],
}
```

- [ ] **Step 2: Verify the import resolves**

Run:
```bash
grep -n "export type CoatingSlug" src/data/accessories.ts
```
Expected: `export type CoatingSlug = 'pet' | 'emal' | 'emalex'` — confirms the type this new file imports actually exists with that exact name (it was added in the earlier погонаж-pricing work this session).

- [ ] **Step 3: Commit**

```bash
git add src/data/coating-features.ts
git commit -m "Add per-coating «особенности коллекции» content data"
```

---

### Task 2: `CoatingFeatures.vue` component

**Files:**
- Create: `src/components/catalog/CoatingFeatures.vue`

**Interfaces:**
- Consumes: `CoatingFeature` type from `../../data/coating-features` (produced in Task 1).
- Produces: default-exported Vue component accepting prop `features: CoatingFeature[]` — consumed by Task 3 as `<CoatingFeatures features={...} />`.

- [ ] **Step 1: Create the component**

```vue
<script setup lang="ts">
import { ref, computed } from 'vue'
import type { CoatingFeature } from '../../data/coating-features'

const props = defineProps<{
  features: CoatingFeature[]
}>()

const activeIdx = ref(0)

const active = computed(() => props.features[activeIdx.value] ?? props.features[0])
</script>

<template>
  <div class="coating-features">
    <ul class="coating-features__list" role="tablist">
      <li v-for="(feature, i) in features" :key="feature.title">
        <button
          type="button"
          role="tab"
          class="coating-features__item"
          :class="{ 'is-active': i === activeIdx }"
          :aria-selected="String(i === activeIdx)"
          @click="activeIdx = i"
        >
          <span class="coating-features__num">{{ i + 1 }}</span>
          <span class="coating-features__item-body">
            <span class="coating-features__item-title">{{ feature.title }}</span>
            <span v-if="i === activeIdx" class="coating-features__item-desc">{{ feature.description }}</span>
          </span>
        </button>
      </li>
    </ul>

    <div class="coating-features__media">
      <div class="coating-features__photos">
        <div v-for="(photo, i) in active.images" :key="i" class="coating-features__photo-wrap">
          <img
            v-if="photo"
            :src="photo"
            :alt="active.title"
            class="coating-features__photo"
            loading="lazy"
            decoding="async"
          />
          <div v-else class="coating-features__placeholder" aria-hidden="true">
            <svg fill="none" stroke="currentColor" stroke-width="1.2" viewBox="0 0 24 24" width="40" height="40">
              <rect x="5" y="3" width="14" height="18" rx="1.5" />
              <path d="M15 12h.01" stroke-linecap="round" />
            </svg>
          </div>
        </div>
      </div>
      <p class="coating-features__caption">{{ active.title }}</p>
    </div>
  </div>
</template>

<style scoped>
.coating-features {
  display: grid;
  grid-template-columns: 360px 1fr;
  gap: 2rem;
  align-items: start;
}

@media (max-width: 900px) {
  .coating-features {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
}

.coating-features__list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.coating-features__item {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  width: 100%;
  text-align: left;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 1rem;
  padding: 0.875rem 1.125rem;
  cursor: pointer;
  font-family: inherit;
  transition: background-color 150ms ease, border-color 150ms ease;
}

.coating-features__item:hover {
  border-color: #99f6e4;
}

.coating-features__item.is-active {
  background: #f0fdfa;
  border-color: #14b8a6;
}

.coating-features__item:focus-visible {
  outline: 2px solid #14b8a6;
  outline-offset: 2px;
}

.coating-features__num {
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 1.5rem;
  height: 1.5rem;
  border-radius: 50%;
  background: #e2e8f0;
  color: #64748b;
  font-size: 0.75rem;
  font-weight: 700;
}

.coating-features__item.is-active .coating-features__num {
  background: #14b8a6;
  color: #fff;
}

.coating-features__item-body {
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
  min-width: 0;
}

.coating-features__item-title {
  font-size: 0.9375rem;
  font-weight: 700;
  color: #0f172a;
  line-height: 1.4;
}

.coating-features__item-desc {
  font-size: 0.8125rem;
  color: #64748b;
  line-height: 1.5;
}

.coating-features__media {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.coating-features__photos {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.5rem;
}

.coating-features__photo-wrap {
  aspect-ratio: 4 / 3;
  border-radius: 1.25rem;
  overflow: hidden;
  background: #f8fafc;
  display: flex;
  align-items: center;
  justify-content: center;
}

.coating-features__photo {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.coating-features__placeholder {
  color: #d1d5db;
}

.coating-features__caption {
  margin: 0;
  font-size: 1rem;
  font-weight: 800;
  color: #0f172a;
}
</style>
```

- [ ] **Step 2: Commit**

```bash
git add src/components/catalog/CoatingFeatures.vue
git commit -m "Add CoatingFeatures.vue: click-to-switch features list + photo pair"
```

---

### Task 3: Integrate into `models/[id].astro`

**Files:**
- Modify: `src/pages/models/[id].astro:1-10` (imports), `src/pages/models/[id].astro:273-275` (insertion point between `.product-page` and `accessories-section`), end of `<style>` block (new section CSS)

**Interfaces:**
- Consumes: `coatingFeatures` from `../../data/coating-features` (Task 1), `CoatingFeatures` Vue component from `../../components/catalog/CoatingFeatures.vue` (Task 2), `coatingSlug`/`seriesName`/`coatingName` already destructured from `Astro.props` in this file.
- Produces: nothing — leaf page.

- [ ] **Step 1: Add imports**

Find:
```ts
import { accessoriesByCoating, CATEGORY_LABELS, PRICE_LIST_UPDATED } from '../../data/accessories'
import type { AccessoryCategory, CoatingSlug } from '../../data/accessories'
```

Add directly below it:
```ts
import { coatingFeatures } from '../../data/coating-features'
import CoatingFeatures from '../../components/catalog/CoatingFeatures.vue'
```

- [ ] **Step 2: Insert the section between `.product-page` and «Погонажные изделия»**

Find this exact boundary (end of the product-page section, start of the accessories section):

```astro
      </div>
    </div>
  </div>

  <!-- ── Погонажные изделия ── -->
  {accessories.length > 0 && (
```

Replace it with:

```astro
      </div>
    </div>
  </div>

  <!-- ── Особенности коллекции ── -->
  {coatingFeatures[coatingSlug as CoatingSlug]?.length > 0 && (
    <section class="coating-features-section">
      <div class="container">
        <h2 class="coating-features-section__title">
          Особенности коллекции {seriesName || coatingName}
        </h2>
        <CoatingFeatures client:visible features={coatingFeatures[coatingSlug as CoatingSlug]} />
      </div>
    </section>
  )}

  <!-- ── Погонажные изделия ── -->
  {accessories.length > 0 && (
```

- [ ] **Step 3: Add the section title CSS**

Find the `/* ── Accessories ── */` comment near the end of the `<style>` block and insert directly above it:

```css
/* ── Coating features ── */
.coating-features-section {
  background: #fff;
  padding: clamp(2.5rem, 4vw, 4rem) 0;
}

.coating-features-section__title {
  font-size: clamp(1.5rem, 3vw, 2rem);
  font-weight: 800;
  color: #0f172a;
  margin: 0 0 1.75rem;
}

/* ── Accessories ── */
```

- [ ] **Step 4: Verify on the dev server**

Run (assumes dev server running on :4321 — if not: `lsof -ti:4321 | xargs -r kill -9 && nohup npm run dev > /tmp/astro-dev.log 2>&1 & disown && sleep 3`):

```bash
curl -s http://localhost:4321/models/sektor-sektor | grep -o 'Особенности коллекции[^<]*'
curl -s http://localhost:4321/models/sektor-sektor | grep -o 'Итальянская эмаль'
```
Expected: first line prints `Особенности коллекции Сектор` (or similar — `seriesName` for this model), second prints `Итальянская эмаль` (confirms the `emal` feature list rendered, since «Сектор» is an эмаль-coated series).

Then check a ПЭТ model too:
```bash
curl -s http://localhost:4321/catalog | grep -o 'href="/models/[^"]*"' | head -1
```
Take that URL and curl it, confirming it shows either ПЭТ or Эмаль/Эмалекс features depending on which model came up first — the point is confirming the block renders without errors on at least two different coatings.

- [ ] **Step 5: Run the full production build**

```bash
npm run build 2>&1 | tail -10
```
Expected: `273 page(s) built` (same count as before this task — no routes added or removed) with no errors.

- [ ] **Step 6: Commit**

```bash
git add "src/pages/models/[id].astro"
git commit -m "Render «Особенности коллекции» block on the product page"
```

---

## Self-Review Notes

- **Spec coverage:** Data model (spec section 1) → Task 1. Component + interaction (section 2) → Task 2. Responsive layout + page placement (section 3) → Task 3.
- **Type consistency:** `CoatingFeature`, `coatingFeatures`, and the `CoatingFeatures.vue` `features` prop name match exactly between Task 1, Task 2, and Task 3's usage.
- **No placeholders:** all three coatings ship with 3 real-content feature entries (titles/descriptions are concrete copy, not TODOs) — only the `images` tuples are intentionally empty per the spec's explicit design decision (user fills photos in later), which is a real handled state (placeholder SVG), not an unfinished step.
