<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'

export interface ColorVariant {
  id:          string
  name:        string
  hex:         string
  photo:       string
  price:       number | null
  coatingSlug: string
  /** false — цвет заведён у покрытия серии, но фото под эту модель фабрика
      ещё не прислала. Свотч всё равно показываем (см. .astro, который его
      добавляет), просто без фото/цены — иначе выглядит так, будто модель
      в этом цвете не выпускается вовсе. */
  available?:  boolean
}

import { calcKitPrice, BASE_KIT_DESCRIPTION } from '../../data/accessories'
import { companyLegalInfo } from '../../lib/contacts-data'

const props = defineProps<{
  colors:    ColorVariant[]
  modelName: string
}>()

const phone = companyLegalInfo.contacts.phone[0]!

const selectedIdx = ref(0)

const selected = computed(() => props.colors[selectedIdx.value] ?? props.colors[0])

/* Фото не пропадает при выборе цвета без снимка — остаётся фото первого
   сфотканного цвета вместо пустого плейсхолдера. */
const displayPhoto = computed(() =>
  selected.value.photo || props.colors.find(c => c.photo)?.photo || ''
)

const kitTotal = computed(() => {
  if (selected.value.available === false || !selected.value.price) return null
  return selected.value.price + calcKitPrice(selected.value.coatingSlug, selected.value.name)
})

const formatPrice = (price: number | null) =>
  price ? `${price.toLocaleString('ru-RU')} ₽` : 'По запросу'

const normalizeHex = (hex: string) => {
  const v = (hex ?? '').trim().replaceAll('С', 'C').replaceAll('с', 'c')
  return /^#[0-9a-fA-F]{3,6}$/.test(v) ? v : '#cccccc'
}

/* ── Зум фото на весь экран — Teleport один на компонент (ProductColorPicker
   монтируется 1 раз на страницу товара), поэтому даже на client:load
   безопасно: проблема Teleport+SSR-хайдрейшн проявляется только когда
   несколько экземпляров делят один Teleport-таргет (см. фикс WorksGallery
   на /catalog/skrytye-dveri — там их было 4). ── */
const zoomOpen = ref(false)
const openZoom = () => {
  if (!displayPhoto.value) return
  zoomOpen.value = true
  document.body.style.overflow = 'hidden'
}
const closeZoom = () => {
  zoomOpen.value = false
  document.body.style.overflow = ''
}
const onZoomKeydown = (e: KeyboardEvent) => { if (e.key === 'Escape') closeZoom() }

onMounted(() => window.addEventListener('keydown', onZoomKeydown))
onUnmounted(() => {
  window.removeEventListener('keydown', onZoomKeydown)
  document.body.style.overflow = ''
})
</script>

<template>
  <div class="color-picker">
    <!-- Фото -->
    <div class="color-picker__photo-wrap">
      <button
        v-if="displayPhoto"
        type="button"
        class="color-picker__photo-btn"
        :aria-label="`Увеличить фото: ${modelName} — ${selected.name}`"
        @click="openZoom"
      >
        <img
          :key="displayPhoto"
          :src="displayPhoto"
          :alt="`${modelName} — ${selected.name}`"
          class="color-picker__photo"
          width="600"
          height="780"
          loading="eager"
          decoding="async"
        />
        <span class="color-picker__zoom-hint" aria-hidden="true">
          <svg viewBox="0 0 20 20" fill="none">
            <circle cx="9" cy="9" r="5.5" stroke="currentColor" stroke-width="1.75"/>
            <path d="M13.5 13.5l3 3" stroke="currentColor" stroke-width="1.75" stroke-linecap="round"/>
            <path d="M9 6.5v5M6.5 9h5" stroke="currentColor" stroke-width="1.75" stroke-linecap="round"/>
          </svg>
          Увеличить
        </span>
      </button>
      <div v-else class="color-picker__placeholder" aria-hidden="true">
        <svg fill="none" stroke="currentColor" stroke-width="1.2" viewBox="0 0 24 24" width="48" height="48">
          <rect x="5" y="3" width="14" height="18" rx="1.5" />
          <path d="M15 12h.01" stroke-linecap="round" />
        </svg>
      </div>
    </div>

    <!-- Зум-модалка -->
    <Teleport to="body">
      <Transition name="zoom-fade">
        <div
          v-if="zoomOpen"
          class="color-picker__zoom-overlay"
          role="dialog"
          aria-modal="true"
          :aria-label="`${modelName} — ${selected.name}`"
          @click.self="closeZoom"
        >
          <button class="color-picker__zoom-close" type="button" aria-label="Закрыть" @click="closeZoom">
            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/>
            </svg>
          </button>
          <figure class="color-picker__zoom-figure" @click.self="closeZoom">
            <img :src="displayPhoto" :alt="`${modelName} — ${selected.name}`" class="color-picker__zoom-img" decoding="async" />
            <figcaption class="color-picker__zoom-caption">{{ modelName }} — {{ selected.name }}</figcaption>
          </figure>
        </div>
      </Transition>
    </Teleport>

    <!-- Цена -->
    <div class="color-picker__price-row">
      <span class="color-picker__price">{{ selected.available === false ? 'По запросу' : formatPrice(selected.price) }}</span>
      <span class="color-picker__price-note">за полотно</span>
    </div>
    <div v-if="kitTotal" class="color-picker__kit-row">
      <span class="color-picker__kit-price">{{ kitTotal.toLocaleString('ru-RU') }} ₽</span>
      <p class="color-picker__kit-note">за комплект — полотно, {{ BASE_KIT_DESCRIPTION }}</p>
    </div>

    <!-- Выбранный цвет -->
    <p class="color-picker__color-name">
      Цвет:&nbsp;<strong>{{ selected.name }}</strong>
      <span v-if="selected.available === false" class="color-picker__color-note"> — фото уточняется</span>
    </p>

    <!-- Свотчи -->
    <div
      v-if="colors.length > 1"
      class="color-picker__swatches"
      role="radiogroup"
      :aria-label="`Цвет: ${modelName}`"
    >
      <button
        v-for="(color, i) in colors"
        :key="color.id"
        type="button"
        class="color-picker__swatch"
        :class="{ 'is-active': i === selectedIdx, 'is-unavailable': color.available === false }"
        :style="{ backgroundColor: normalizeHex(color.hex) }"
        :title="color.available === false ? `${color.name} — фото уточняется` : color.name"
        :aria-label="color.available === false ? `${color.name}, фото уточняется` : color.name"
        :aria-pressed="String(i === selectedIdx)"
        @click="selectedIdx = i"
      />
    </div>

    <!-- CTA -->
    <div class="color-picker__cta">
      <a href="https://t.me/vfddoors74" target="_blank" rel="noopener" class="btn btn-primary">Написать в Telegram</a>
      <a :href="`tel:${phone.raw}`" class="btn btn-outline">
        <svg class="color-picker__phone-icon" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" aria-hidden="true">
          <path stroke-linecap="round" stroke-linejoin="round" d="M3 5a2 2 0 0 1 2-2h2.28a1 1 0 0 1 .95.68l1.1 3.3a1 1 0 0 1-.44 1.18l-1.7 1a11.05 11.05 0 0 0 5.6 5.6l1-1.7a1 1 0 0 1 1.18-.44l3.3 1.1a1 1 0 0 1 .68.95V19a2 2 0 0 1-2 2h-1C9.72 21 3 14.28 3 6V5Z" />
        </svg>
        {{ phone.label }}
      </a>
    </div>
  </div>
</template>

<style scoped>
.color-picker {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

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

.color-picker__photo-btn {
  position: relative;
  width: 100%;
  height: 100%;
  padding: 0;
  border: none;
  background: none;
  cursor: zoom-in;
}

.color-picker__photo {
  width: 100%;
  height: 100%;
  object-fit: contain;
  padding: 1.5rem;
  display: block;
  transition: transform 300ms ease;
}
.color-picker__photo-btn:hover .color-picker__photo {
  transform: scale(1.02);
}

.color-picker__zoom-hint {
  position: absolute;
  right: 0.875rem;
  bottom: 0.875rem;
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.375rem 0.75rem;
  border-radius: 9999px;
  background: rgba(255, 255, 255, 0.92);
  border: 1px solid #e2e8f0;
  font-size: 0.75rem;
  font-weight: 600;
  color: #475569;
  opacity: 0;
  transform: translateY(4px);
  transition: opacity 150ms ease, transform 150ms ease;
}
.color-picker__zoom-hint svg { width: 0.875rem; height: 0.875rem; flex-shrink: 0; }
.color-picker__photo-btn:hover .color-picker__zoom-hint,
.color-picker__photo-btn:focus-visible .color-picker__zoom-hint {
  opacity: 1;
  transform: translateY(0);
}
@media (hover: none) {
  /* На тач-устройствах ховера нет — подсказка видна всегда, иначе о зуме
     нечем догадаться. */
  .color-picker__zoom-hint { opacity: 1; transform: none; }
}

.color-picker__placeholder {
  color: #d1d5db;
}

.color-picker__price-row {
  display: flex;
  align-items: baseline;
  gap: 0.5rem;
}

.color-picker__price {
  font-size: 1.875rem;
  font-weight: 500;
  color: #0f172a;
  line-height: 1;
}

.color-picker__price-note {
  font-size: 0.875rem;
  color: #64748b;
}

.color-picker__kit-row {
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
}

.color-picker__kit-price {
  font-size: 1.875rem;
  font-weight: 500;
  color: #0f172a;
  line-height: 1;
  white-space: nowrap;
}

.color-picker__kit-note {
  font-size: 0.875rem;
  color: #64748b;
  margin: 0;
}

.color-picker__color-name {
  font-size: 0.875rem;
  color: #475569;
  margin: 0;
}
.color-picker__color-note {
  color: #94a3b8;
  font-weight: 400;
}

.color-picker__swatches {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.color-picker__swatch {
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  border: 2px solid transparent;
  cursor: pointer;
  transition: transform 150ms ease, box-shadow 150ms ease;
  outline: none;
  flex-shrink: 0;
}

.color-picker__swatch:hover {
  transform: scale(1.15);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.18);
}

.color-picker__swatch.is-active {
  box-shadow: 0 0 0 2px #fff, 0 0 0 4px #14b8a6;
}
.color-picker__swatch.is-unavailable {
  border: 2px dashed rgba(0, 0, 0, 0.32);
}

.color-picker__swatch:focus-visible {
  outline: 2px solid #14b8a6;
  outline-offset: 3px;
}

.color-picker__cta {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
  padding-top: 0.25rem;
}

.color-picker__phone-icon {
  width: 1.1rem;
  height: 1.1rem;
  margin-right: 0.5rem;
}

/* ── Зум-модалка ── */
.color-picker__zoom-overlay {
  position: fixed;
  inset: 0;
  z-index: 9999;
  background: rgba(0, 0, 0, 0.90);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.5rem;
}
.color-picker__zoom-close {
  position: absolute;
  top: 1rem;
  right: 1rem;
  width: 2.75rem;
  height: 2.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.10);
  border: 1px solid rgba(255, 255, 255, 0.18);
  border-radius: 50%;
  color: #fff;
  cursor: pointer;
  transition: background 150ms ease;
}
.color-picker__zoom-close:hover { background: rgba(255, 255, 255, 0.22); }
.color-picker__zoom-close svg { width: 1.375rem; height: 1.375rem; }

.color-picker__zoom-figure {
  margin: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.875rem;
}
.color-picker__zoom-img {
  max-width: min(95vw, 1100px);
  max-height: 85vh;
  object-fit: contain;
  border-radius: 0.5rem;
  background: #fff;
  box-shadow: 0 24px 80px rgba(0, 0, 0, 0.5);
}
.color-picker__zoom-caption {
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.72);
}

.zoom-fade-enter-active,
.zoom-fade-leave-active { transition: opacity 180ms ease; }
.zoom-fade-enter-from,
.zoom-fade-leave-to { opacity: 0; }

@media (prefers-reduced-motion: reduce) {
  .color-picker__photo,
  .color-picker__zoom-hint,
  .zoom-fade-enter-active,
  .zoom-fade-leave-active { transition: none; }
}
</style>
