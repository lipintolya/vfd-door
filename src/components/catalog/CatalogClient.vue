<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import CatalogEmptyState from './CatalogEmptyState.vue'
import CatalogFilters from './CatalogFilters.vue'
import CatalogGrid from './CatalogGrid.vue'
import CatalogPagination from './CatalogPagination.vue'
import type { CatalogCardItem, CatalogFilterOption, CatalogSort } from './types'

/* ============================================================
   Props
   ============================================================ */
const props = defineProps<{
  cards: CatalogCardItem[]
  series: CatalogFilterOption[]
  coatings: CatalogFilterOption[]
  colors: CatalogFilterOption[]
  initialSeries: string
  initialCoating: string
  initialColor: string
}>()

const allCards    = props.cards
const allSeries   = props.series
const allCoatings = props.coatings
const allColors   = props.colors

/* ============================================================
   Filter state
   ============================================================ */
const activeSeries  = ref(props.initialSeries)
const activeCoating = ref(props.initialCoating)
const activeColor   = ref(props.initialColor)
const glassOnly     = ref(false)
const searchQuery   = ref('')
const sortBy        = ref<CatalogSort>('price_asc')
const currentPage   = ref(1)
const itemsPerPage  = 21

/* ============================================================
   Filtered & sorted cards
   ============================================================ */
const filteredCards = computed(() => {
  let result = allCards

  if (activeSeries.value)
    result = result.filter(c => c.seriesSlug === activeSeries.value)

  if (activeCoating.value)
    result = result.filter(c => c.coatingSlug === activeCoating.value)

  if (activeColor.value)
    result = result.filter(c => c.colorName === activeColor.value)

  if (glassOnly.value)
    result = result.filter(c => c.hasGlass)

  const query = searchQuery.value.trim().toLowerCase()
  if (query)
    result = result.filter(c =>
      c.name.toLowerCase().includes(query) ||
      c.series.toLowerCase().includes(query) ||
      c.coating.toLowerCase().includes(query) ||
      c.colorName.toLowerCase().includes(query)
    )

  if (sortBy.value === 'price_asc')
    result = [...result].sort((a, b) => (a.price ?? 999999) - (b.price ?? 999999))
  else if (sortBy.value === 'price_desc')
    result = [...result].sort((a, b) => (b.price ?? 0) - (a.price ?? 0))
  else
    result = [...result].sort((a, b) => a.name.localeCompare(b.name, 'ru'))

  return result
})

/* ============================================================
   Helpers
   ============================================================ */
const resetFilters = () => {
  activeSeries.value  = ''
  activeCoating.value = ''
  activeColor.value   = ''
  glassOnly.value     = false
  searchQuery.value   = ''
  sortBy.value        = 'price_asc'
}

const hasActiveFilters = computed(() =>
  Boolean(activeSeries.value || activeCoating.value || activeColor.value || glassOnly.value || searchQuery.value)
)

const activeSeriesLabel = computed(() =>
  allSeries.find(item => item.value === activeSeries.value)?.label
)

const activeCoatingLabel = computed(() =>
  allCoatings.find(item => item.value === activeCoating.value)?.label
)

const totalPages = computed(() =>
  Math.max(1, Math.ceil(filteredCards.value.length / itemsPerPage))
)

const paginatedCards = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  return filteredCards.value.slice(start, start + itemsPerPage)
})

const visiblePages = computed<Array<number | string>>(() => {
  const total = totalPages.value
  const current = currentPage.value
  if (total <= 7) return Array.from({ length: total }, (_, index) => index + 1)

  if (current <= 4) return [1, 2, 3, 4, 5, '...', total]
  if (current >= total - 3) return [1, '...', total - 4, total - 3, total - 2, total - 1, total]
  return [1, '...', current - 1, current, current + 1, '...', total]
})

const goToPage = (page: number) => {
  currentPage.value = Math.max(1, Math.min(page, totalPages.value))
}

watch(
  [activeSeries, activeCoating, activeColor],
  ([series, coating, color]) => {
    if (typeof window === 'undefined') return

    const url = new URL(window.location.href)
    series ? url.searchParams.set('series', series) : url.searchParams.delete('series')
    coating ? url.searchParams.set('coating', coating) : url.searchParams.delete('coating')
    color ? url.searchParams.set('color', color) : url.searchParams.delete('color')
    window.history.replaceState({}, '', `${url.pathname}${url.search}${url.hash}`)
  }
)

watch(
  [activeSeries, activeCoating, activeColor, glassOnly, searchQuery, sortBy],
  () => {
    currentPage.value = 1
  }
)
</script>

<template>
  <section class="catalog-app" aria-labelledby="catalog-title">
    <div class="catalog-head">
      <div>
        <h1 id="catalog-title">Межкомнатные двери</h1>
        <p>
          Найдено: <strong>{{ filteredCards.length }}</strong>
          {{ filteredCards.length === 1 ? 'товар' : 'товаров' }}
        </p>
      </div>

      <label class="catalog-sort">
        <span class="catalog-sort__label">Сортировка:</span>
        <select v-model="sortBy" class="catalog-sort__select">
          <option value="price_asc">Цена: по возрастанию</option>
          <option value="price_desc">Цена: по убыванию</option>
          <option value="name">По названию</option>
        </select>
      </label>
    </div>

    <div class="catalog-layout">
      <CatalogFilters
        v-model:active-series="activeSeries"
        v-model:active-coating="activeCoating"
        v-model:active-color="activeColor"
        v-model:glass-only="glassOnly"
        v-model:search-query="searchQuery"
        :series="allSeries"
        :coatings="allCoatings"
        :colors="allColors"
        :total-count="allCards.length"
        :filtered-count="filteredCards.length"
        :has-active-filters="hasActiveFilters"
        @reset="resetFilters"
      />

      <CatalogEmptyState
        v-if="filteredCards.length === 0"
        @reset="resetFilters"
      />
      <CatalogGrid
        v-else
        :cards="paginatedCards"
      />

      <CatalogPagination
        :current-page="currentPage"
        :total-pages="totalPages"
        :visible-pages="visiblePages"
        @change="goToPage"
      />
    </div>
  </section>
</template>
