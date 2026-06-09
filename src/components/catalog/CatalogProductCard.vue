<script setup lang="ts">
import type { CatalogCardItem } from './types'

defineProps<{
  card: CatalogCardItem
}>()

const formatPrice = (price: number | null) =>
  price ? `от ${Number(price).toLocaleString('ru-RU')} ₽` : 'По запросу'
</script>

<template>
  <a
    :href="`/models/${card.id}`"
    class="catalog-card product-card"
    :aria-label="`${card.name} — подробнее`"
  >
    <div class="catalog-card__media">
      <img
        v-if="card.photo"
        :src="card.photo"
        :alt="card.name"
        class="catalog-card__image"
        loading="lazy"
        decoding="async"
        width="320"
        height="420"
      />
      <div v-else class="catalog-card__placeholder" aria-hidden="true">
        <svg fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
          <rect x="5" y="3" width="14" height="18" rx="1.5" />
          <path d="M15 12h.01" stroke-linecap="round" />
        </svg>
      </div>

      <div class="catalog-card__badges">
        <span>{{ card.series }}</span>
      </div>
    </div>

    <div class="catalog-card__body">
      <div>
        <h2 class="catalog-card__title">{{ card.name }}</h2>
        <p class="catalog-card__coating">{{ card.coating }}</p>
      </div>

      <div class="catalog-card__meta">
        <span
          class="catalog-card__swatch"
          :style="{ backgroundColor: card.colorHex }"
          :title="`Цвет: ${card.colorName}`"
        />
        <span class="catalog-card__color">{{ card.colorName }}</span>
      </div>

      <div class="catalog-card__footer">
        <p class="catalog-card__price">{{ formatPrice(card.price) }}</p>
        <span>за полотно</span>
      </div>
    </div>
  </a>
</template>
