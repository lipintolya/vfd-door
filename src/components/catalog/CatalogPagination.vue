<script setup lang="ts">
defineProps<{
  currentPage: number
  totalPages: number
  visiblePages: Array<number | string>
}>()

defineEmits<{
  change: [page: number]
}>()
</script>

<template>
  <nav v-if="totalPages > 1" class="catalog-pagination" aria-label="Навигация по каталогу">
    <button
      type="button"
      class="catalog-pagination__control"
      :disabled="currentPage <= 1"
      @click="$emit('change', currentPage - 1)"
    >
      Назад
    </button>

    <button
      v-for="page in visiblePages"
      :key="page"
      type="button"
      class="catalog-pagination__page"
      :class="{ 'is-active': page === currentPage, 'is-gap': page === '...' }"
      :disabled="page === '...'"
      @click="typeof page === 'number' && $emit('change', page)"
    >
      {{ page }}
    </button>

    <button
      type="button"
      class="catalog-pagination__control"
      :disabled="currentPage >= totalPages"
      @click="$emit('change', currentPage + 1)"
    >
      Далее
    </button>
  </nav>
</template>
