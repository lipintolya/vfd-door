<script setup lang="ts">
import CatalogProductCard from './CatalogProductCard.vue'
import type { CatalogCardItem } from './types'

defineProps<{
  cards: CatalogCardItem[]
}>()
</script>

<template>
  <div class="grid grid-cols-2 gap-5 lg:grid-cols-3 lg:gap-6 xl:grid-cols-4" aria-live="polite">
    <CatalogProductCard
      v-for="card in cards"
      :key="card.id"
      :card="card"
    />
  </div>
</template>

