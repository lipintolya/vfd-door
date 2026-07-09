<script setup lang="ts">
import CatalogProductCard from './CatalogProductCard.vue'
import type { CatalogCardItem } from './types'

defineProps<{
  cards: CatalogCardItem[]
}>()
</script>

<template>
  <div class="grid grid-cols-1 sm:grid-cols-2 gap-6" aria-live="polite">
    <CatalogProductCard
      v-for="card in cards"
      :key="card.id"
      :card="card"
    />
  </div>
</template>

