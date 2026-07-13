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
  <aside class="sticky top-[calc(var(--header-height,88px)+1.25rem)] rounded-2xl bg-slate-50 p-5" aria-label="Фильтры каталога">
    <div class="flex items-center justify-between gap-4 border-b border-slate-200 pb-4">
      <div>
        <h2 class="m-0 text-lg font-extrabold text-ink">Фильтры</h2>
        <p v-if="draftFilterCount" class="m-0 mt-1 text-xs font-bold text-slate-500">Выбрано: {{ draftFilterCount }}</p>
      </div>
      <button v-if="hasActiveFilters || draftFilterCount" type="button" class="text-xs font-bold text-teal-600 hover:text-teal-700" @click="resetAll">Сбросить</button>
    </div>

    <label class="mt-4 mb-2.5 block">
      <span class="sr-only">Поиск по каталогу</span>
      <input
        v-model="draftSearchQuery"
        type="search"
        inputmode="search"
        autocomplete="off"
        placeholder="Поиск"
        class="min-h-11 w-full rounded-lg border border-slate-200 bg-white px-3.5 text-[0.8125rem] text-ink placeholder:text-slate-400 focus:border-teal-500 focus:outline-none focus:ring-4 focus:ring-teal-500/15"
        @keydown.enter.prevent="applyFilters"
      />
    </label>

    <div class="border-b border-slate-200">
      <button type="button" class="flex w-full items-center justify-between py-3.5 text-[0.9375rem] font-extrabold text-ink" @click="toggleSection('series')">
        <span>Серия</span>
        <svg class="h-4 w-4 text-slate-400 transition-transform" :class="{ 'rotate-180': openSections.series }" aria-hidden="true" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m6 9 6 6 6-6" />
        </svg>
      </button>
      <div v-if="openSections.series" class="mb-3.5 grid max-h-56 gap-1 overflow-y-auto">
        <button
          type="button"
          class="rounded-lg px-2.5 py-2 text-left text-[0.8125rem] text-slate-600 transition hover:bg-slate-100"
          :class="draftSeries === '' ? 'bg-teal-50 text-teal-700' : ''"
          @click="draftSeries = ''"
        >
          Все серии
        </button>
        <button
          v-for="item in series"
          :key="item.value"
          type="button"
          class="rounded-lg px-2.5 py-2 text-left text-[0.8125rem] text-slate-600 transition hover:bg-slate-100"
          :class="draftSeries === item.value ? 'bg-teal-50 text-teal-700' : ''"
          @click="draftSeries = draftSeries === item.value ? '' : item.value"
        >
          {{ item.label }}
        </button>
      </div>
    </div>

    <div class="border-b border-slate-200">
      <button type="button" class="flex w-full items-center justify-between py-3.5 text-[0.9375rem] font-extrabold text-ink" @click="toggleSection('coating')">
        <span>Покрытие</span>
        <svg class="h-4 w-4 text-slate-400 transition-transform" :class="{ 'rotate-180': openSections.coating }" aria-hidden="true" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m6 9 6 6 6-6" />
        </svg>
      </button>
      <div v-if="openSections.coating" class="mb-3.5 grid max-h-56 gap-1 overflow-y-auto">
        <button
          v-for="item in coatings"
          :key="item.value"
          type="button"
          class="rounded-lg px-2.5 py-2 text-left text-[0.8125rem] text-slate-600 transition hover:bg-slate-100"
          :class="draftCoating === item.value ? 'bg-teal-50 text-teal-700' : ''"
          @click="draftCoating = draftCoating === item.value ? '' : item.value"
        >
          {{ item.label }}
        </button>
      </div>
    </div>

    <div class="border-b border-slate-200">
      <button type="button" class="flex w-full items-center justify-between py-3.5 text-[0.9375rem] font-extrabold text-ink" @click="toggleSection('color')">
        <span>Цвет</span>
        <svg class="h-4 w-4 text-slate-400 transition-transform" :class="{ 'rotate-180': openSections.color }" aria-hidden="true" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m6 9 6 6 6-6" />
        </svg>
      </button>
      <div v-if="openSections.color" class="mb-3.5 grid max-h-56 gap-1 overflow-y-auto">
        <button
          v-for="item in colors"
          :key="item.value"
          type="button"
          class="flex items-center gap-2 rounded-lg px-2.5 py-2 text-left text-[0.8125rem] text-slate-600 transition hover:bg-slate-100"
          :class="draftColor === item.value ? 'bg-teal-50 text-teal-700' : ''"
          @click="draftColor = draftColor === item.value ? '' : item.value"
        >
          <span class="h-3.5 w-3.5 shrink-0 rounded-full border border-black/10" :style="{ backgroundColor: item.color }"></span>
          {{ item.label }}
        </button>
      </div>
    </div>

    <div class="border-b border-slate-200">
      <button type="button" class="flex w-full items-center justify-between py-3.5 text-[0.9375rem] font-extrabold text-ink" @click="toggleSection('tags')">
        <span>Теги</span>
        <svg class="h-4 w-4 text-slate-400 transition-transform" :class="{ 'rotate-180': openSections.tags }" aria-hidden="true" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m6 9 6 6 6-6" />
        </svg>
      </button>
      <div v-if="openSections.tags" class="mb-3.5">
        <label class="flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm font-semibold text-slate-600">
          <input v-model="draftGlassOnly" type="checkbox" class="h-4 w-4 accent-teal-600" />
          <span>Со стеклом</span>
        </label>
      </div>
    </div>

    <div class="flex items-center justify-between gap-3 pt-3.5 text-[0.8125rem] text-slate-500">
      <div class="inline-flex items-center gap-1">
        <strong class="font-extrabold text-ink">{{ filteredCount }}</strong>
        <span>из {{ totalCount }}</span>
      </div>
      <span v-if="hasDraftChanges" class="font-extrabold text-teal-600">Есть изменения</span>
    </div>

    <div class="mt-3.5 grid grid-cols-[1fr_auto] gap-2.5 border-t border-slate-200 pt-3.5">
      <button
        type="button"
        class="btn btn-primary justify-center disabled:cursor-default disabled:opacity-45"
        :disabled="!hasDraftChanges"
        @click="applyFilters"
      >
        Применить
      </button>
      <button
        type="button"
        class="btn btn-outline px-3.5 disabled:cursor-default disabled:opacity-45"
        :disabled="!hasActiveFilters && !draftFilterCount"
        @click="resetAll"
      >
        Очистить
      </button>
    </div>
  </aside>
</template>
