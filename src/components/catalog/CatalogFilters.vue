<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import type { CatalogFilterOption } from './types'

defineProps<{
  series: CatalogFilterOption[]
  coatings: CatalogFilterOption[]
  colors: CatalogFilterOption[]
  totalCount: number
  filteredCount: number
  hasActiveFilters: boolean
}>()

const activeSeries = defineModel<string>('activeSeries', { required: true })
const activeCoating = defineModel<string>('activeCoating', { required: true })
const activeColor = defineModel<string>('activeColor', { required: true })
const glassOnly = defineModel<boolean>('glassOnly', { required: true })
const searchQuery = defineModel<string>('searchQuery', { required: true })

defineEmits<{
  reset: []
}>()

const draftSeries = ref(activeSeries.value)
const draftCoating = ref(activeCoating.value)
const draftColor = ref(activeColor.value)
const draftGlassOnly = ref(glassOnly.value)
const draftSearchQuery = ref(searchQuery.value)

const openSections = ref({
  series: true,
  coating: false,
  material: false,
  color: false,
  tags: true,
})

type SectionName = keyof typeof openSections.value

const toggleSection = (name: SectionName) => {
  openSections.value[name] = !openSections.value[name]
}

const draftFilterCount = computed(() => {
  let count = 0
  if (draftSeries.value) count++
  if (draftCoating.value) count++
  if (draftColor.value) count++
  if (draftGlassOnly.value) count++
  if (draftSearchQuery.value.trim()) count++
  return count
})

const hasDraftChanges = computed(() =>
  draftSeries.value !== activeSeries.value ||
  draftCoating.value !== activeCoating.value ||
  draftColor.value !== activeColor.value ||
  draftGlassOnly.value !== glassOnly.value ||
  draftSearchQuery.value !== searchQuery.value
)

const applyFilters = () => {
  activeSeries.value = draftSeries.value
  activeCoating.value = draftCoating.value
  activeColor.value = draftColor.value
  glassOnly.value = draftGlassOnly.value
  searchQuery.value = draftSearchQuery.value.trim()
}

const resetDraft = () => {
  draftSeries.value = ''
  draftCoating.value = ''
  draftColor.value = ''
  draftGlassOnly.value = false
  draftSearchQuery.value = ''
}

const resetAll = () => {
  resetDraft()
  activeSeries.value = ''
  activeCoating.value = ''
  activeColor.value = ''
  glassOnly.value = false
  searchQuery.value = ''
}

watch(
  [activeSeries, activeCoating, activeColor, glassOnly, searchQuery],
  ([series, coating, color, glass, query]) => {
    draftSeries.value = series
    draftCoating.value = coating
    draftColor.value = color
    draftGlassOnly.value = glass
    draftSearchQuery.value = query
  }
)
</script>

<template>
  <aside class="catalog-filters" aria-label="Фильтры каталога">
    <div class="catalog-filters__header">
      <div>
        <h2>Фильтры</h2>
        <p v-if="draftFilterCount">Выбрано: {{ draftFilterCount }}</p>
      </div>
      <button v-if="hasActiveFilters || draftFilterCount" type="button" @click="resetAll">Сбросить</button>
    </div>

    <label class="catalog-search">
      <span class="sr-only">Поиск по каталогу</span>
      <input
        v-model="draftSearchQuery"
        type="search"
        inputmode="search"
        autocomplete="off"
        placeholder="Поиск"
        class="catalog-search__input"
        @keydown.enter.prevent="applyFilters"
      />
    </label>

    <div class="catalog-filter-section">
      <button type="button" class="catalog-filter-section__toggle" @click="toggleSection('series')">
        <span>Серия</span>
        <svg :class="{ 'is-open': openSections.series }" aria-hidden="true" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m6 9 6 6 6-6" />
        </svg>
      </button>
      <div v-if="openSections.series" class="catalog-filter-section__body">
        <button type="button" class="catalog-filter-option" :class="{ 'is-active': draftSeries === '' }" @click="draftSeries = ''">
          Все серии
        </button>
        <button
          v-for="item in series"
          :key="item.value"
          type="button"
          class="catalog-filter-option"
          :class="{ 'is-active': draftSeries === item.value }"
          @click="draftSeries = draftSeries === item.value ? '' : item.value"
        >
          {{ item.label }}
        </button>
      </div>
    </div>

    <div class="catalog-filter-section">
      <button type="button" class="catalog-filter-section__toggle" @click="toggleSection('coating')">
        <span>Покрытие</span>
        <svg :class="{ 'is-open': openSections.coating }" aria-hidden="true" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m6 9 6 6 6-6" />
        </svg>
      </button>
      <div v-if="openSections.coating" class="catalog-filter-section__body">
        <button
          v-for="item in coatings"
          :key="item.value"
          type="button"
          class="catalog-filter-option"
          :class="{ 'is-active': draftCoating === item.value }"
          @click="draftCoating = draftCoating === item.value ? '' : item.value"
        >
          {{ item.label }}
        </button>
      </div>
    </div>

    <div class="catalog-filter-section">
      <button type="button" class="catalog-filter-section__toggle" @click="toggleSection('material')">
        <span>Материал</span>
        <svg :class="{ 'is-open': openSections.material }" aria-hidden="true" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m6 9 6 6 6-6" />
        </svg>
      </button>
      <div v-if="openSections.material" class="catalog-filter-section__body">
        <button type="button" class="catalog-filter-option" :class="{ 'is-active': draftCoating === 'pet' }" @click="draftCoating = draftCoating === 'pet' ? '' : 'pet'">
          ПЭТ
        </button>
        <button type="button" class="catalog-filter-option" :class="{ 'is-active': draftCoating === 'emalex' }" @click="draftCoating = draftCoating === 'emalex' ? '' : 'emalex'">
          Полипропилен
        </button>
        <button type="button" class="catalog-filter-option" :class="{ 'is-active': draftCoating === 'emal' }" @click="draftCoating = draftCoating === 'emal' ? '' : 'emal'">
          Эмаль
        </button>
      </div>
    </div>

    <div class="catalog-filter-section">
      <button type="button" class="catalog-filter-section__toggle" @click="toggleSection('color')">
        <span>Цвет</span>
        <svg :class="{ 'is-open': openSections.color }" aria-hidden="true" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m6 9 6 6 6-6" />
        </svg>
      </button>
      <div v-if="openSections.color" class="catalog-filter-section__body catalog-filter-section__body--colors">
        <button
          v-for="item in colors"
          :key="item.value"
          type="button"
          class="catalog-color-option"
          :class="{ 'is-active': draftColor === item.value }"
          @click="draftColor = draftColor === item.value ? '' : item.value"
        >
          <span :style="{ backgroundColor: item.color }"></span>
          {{ item.label }}
        </button>
      </div>
    </div>

    <div class="catalog-filter-section">
      <button type="button" class="catalog-filter-section__toggle" @click="toggleSection('tags')">
        <span>Теги</span>
        <svg :class="{ 'is-open': openSections.tags }" aria-hidden="true" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m6 9 6 6 6-6" />
        </svg>
      </button>
      <div v-if="openSections.tags" class="catalog-filter-section__body">
        <label class="catalog-checkbox">
          <input v-model="draftGlassOnly" type="checkbox" />
          <span>Со стеклом</span>
        </label>
      </div>
    </div>

    <div class="catalog-filters__summary">
      <div>
        <strong>{{ filteredCount }}</strong>
        <span>из {{ totalCount }}</span>
      </div>
      <span v-if="hasDraftChanges" class="catalog-filters__dirty">Есть изменения</span>
    </div>

    <div class="catalog-filter-actions">
      <button
        type="button"
        class="catalog-filter-actions__apply"
        :disabled="!hasDraftChanges"
        @click="applyFilters"
      >
        Применить
      </button>
      <button
        type="button"
        class="catalog-filter-actions__clear"
        :disabled="!hasActiveFilters && !draftFilterCount"
        @click="resetAll"
      >
        Очистить
      </button>
    </div>
  </aside>
</template>
