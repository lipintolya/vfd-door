<script setup lang="ts">
defineEmits<{
  reset: []
}>()
</script>

<template>
  <div class="catalog-empty" role="status">
    <div class="catalog-empty__icon" aria-hidden="true">
      <svg fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" d="M4 7h16M6 7v13h12V7M9 7V5a3 3 0 0 1 6 0v2" />
      </svg>
    </div>
    <h2>Ничего не найдено</h2>
    <p>Попробуйте изменить поисковый запрос или убрать часть фильтров.</p>
    <button type="button" class="btn btn-primary" @click="$emit('reset')">
      Сбросить фильтры
    </button>
  </div>
</template>
