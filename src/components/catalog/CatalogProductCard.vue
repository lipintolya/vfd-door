<script setup lang="ts">
import type { CatalogCardItem } from './types'

defineProps<{
  card: CatalogCardItem
}>()

const formatPrice = (price: number | null) =>
  price ? `${Number(price).toLocaleString('ru-RU')} ₽` : 'По запросу'
</script>

<template>
  <a
    :href="`/models/${card.slug}`"
    class="group @container flex min-h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white no-underline transition hover:border-teal-200 hover:shadow-lg hover:-translate-y-0.5"
    :aria-label="`${card.name} — подробнее`"
  >
    <div class="relative m-3.5 mb-0 flex aspect-2/3 items-center justify-center overflow-hidden rounded-xl bg-slate-50 sm:m-5 sm:mb-0">
      <img
        v-if="card.photo"
        :src="card.photo"
        :alt="card.name"
        class="h-full w-full object-contain p-4 transition-transform duration-300 group-hover:scale-105"
        loading="lazy"
        decoding="async"
        width="320"
        height="420"
      />
      <div v-else class="flex h-full w-full items-center justify-center text-slate-300" aria-hidden="true">
        <svg class="h-13 w-13" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
          <rect x="5" y="3" width="14" height="18" rx="1.5" />
          <path d="M15 12h.01" stroke-linecap="round" />
        </svg>
      </div>

      <div class="absolute left-0 top-3 flex flex-wrap gap-1">
        <span class="rounded-r-full bg-teal-600 px-3 py-1 text-xs font-extrabold uppercase tracking-wide text-white">{{ card.series }}</span>
      </div>
    </div>

    <div class="flex flex-1 flex-col gap-2.5 p-3.5 sm:gap-3 sm:p-5">
      <div>
        <h2 class="m-0 min-h-12 text-[1.0625rem] font-extrabold leading-snug text-ink line-clamp-2">{{ card.name }}</h2>
        <p class="m-0 mt-1 text-sm font-semibold text-slate-500">{{ card.coating }}</p>
      </div>

      <div class="flex min-w-0 items-center gap-2">
        <span
          class="h-4 w-4 shrink-0 rounded-full border border-black/10 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.55)]"
          :style="{ backgroundColor: card.colorHex }"
          :title="`Цвет: ${card.colorName}`"
        />
        <span class="truncate text-sm text-slate-500">{{ card.colorName }}</span>
      </div>

      <div class="mt-auto flex flex-col items-stretch gap-2.5 pt-1 @[17rem]:flex-row @[17rem]:items-end @[17rem]:justify-between @[17rem]:gap-3">
        <p class="m-0 flex flex-col leading-none">
          <span class="whitespace-nowrap text-xl font-black text-ink">{{ formatPrice(card.price) }}</span>
          <span class="mt-1 text-xs font-bold text-slate-500">за полотно</span>
        </p>
        <span class="btn btn-outline shrink-0 justify-center px-4 py-2 text-sm">Подробнее</span>
      </div>
    </div>
  </a>
</template>
