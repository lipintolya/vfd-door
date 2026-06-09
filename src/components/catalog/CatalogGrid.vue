<script setup lang="ts">
import CatalogProductCard from './CatalogProductCard.vue'
import type { CatalogCardItem } from './types'

defineProps<{
  cards: CatalogCardItem[]
}>()
</script>

<template>
  <div class="catalog-grid" aria-live="polite">
    <CatalogProductCard
      v-for="card in cards"
      :key="card.id"
      :card="card"
    />
  </div>
</template>

