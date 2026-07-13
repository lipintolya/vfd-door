<script setup lang="ts">
import { ref, computed } from 'vue'

export interface ColorVariant {
  id:          string
  name:        string
  hex:         string
  photo:       string
  price:       number | null
  coatingSlug: string
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

const kitTotal = computed(() => {
  if (!selected.value.price) return null
  return selected.value.price + calcKitPrice(selected.value.coatingSlug, selected.value.name)
})

const formatPrice = (price: number | null) =>
  price ? `${price.toLocaleString('ru-RU')} ₽` : 'По запросу'

const normalizeHex = (hex: string) => {
  const v = (hex ?? '').trim().replaceAll('С', 'C').replaceAll('с', 'c')
  return /^#[0-9a-fA-F]{3,6}$/.test(v) ? v : '#cccccc'
}
</script>

<template>
  <div class="color-picker">
    <!-- Фото -->
    <div class="color-picker__photo-wrap">
      <img
        v-if="selected.photo"
        :key="selected.id"
        :src="selected.photo"
        :alt="`${modelName} — ${selected.name}`"
        class="color-picker__photo"
        width="600"
        height="780"
        loading="eager"
        decoding="async"
      />
      <div v-else class="color-picker__placeholder" aria-hidden="true">
        <svg fill="none" stroke="currentColor" stroke-width="1.2" viewBox="0 0 24 24" width="48" height="48">
          <rect x="5" y="3" width="14" height="18" rx="1.5" />
          <path d="M15 12h.01" stroke-linecap="round" />
        </svg>
      </div>
    </div>

    <!-- Цена -->
    <div class="color-picker__price-row">
      <span class="color-picker__price">{{ formatPrice(selected.price) }}</span>
      <span class="color-picker__price-note">за полотно</span>
    </div>
    <div v-if="kitTotal" class="color-picker__kit-row">
      <span class="color-picker__kit-price">{{ kitTotal.toLocaleString('ru-RU') }} ₽</span>
      <p class="color-picker__kit-note">за комплект — полотно, {{ BASE_KIT_DESCRIPTION }}</p>
    </div>

    <!-- Выбранный цвет -->
    <p class="color-picker__color-name">
      Цвет:&nbsp;<strong>{{ selected.name }}</strong>
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
        :class="{ 'is-active': i === selectedIdx }"
        :style="{ backgroundColor: normalizeHex(color.hex) }"
        :title="color.name"
        :aria-label="color.name"
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

.color-picker__photo {
  width: 100%;
  height: 100%;
  object-fit: contain;
  padding: 1.5rem;
  display: block;
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
  font-weight: 800;
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
  font-weight: 800;
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
</style>
