<script setup lang="ts">
import { computed } from 'vue'
import { calcKitPrice, BASE_KIT_DESCRIPTION } from '../../data/accessories'
import type { CatalogCardItem } from './types'

const props = defineProps<{
  card: CatalogCardItem
}>()

const formatPrice = (price: number | null) =>
  price ? `${Number(price).toLocaleString('ru-RU')} ₽` : 'По запросу'

/* Цена за комплект (полотно + короб + наличники) — тот же расчёт, что и на странице модели */
const kitPrice = computed(() =>
  props.card.price ? props.card.price + calcKitPrice(props.card.coatingSlug, props.card.colorName) : null
)
</script>

<template>
  <article
    class="group @container relative flex min-h-full flex-col rounded-2xl border border-slate-200 bg-white transition hover:border-teal-200 hover:shadow-lg hover:-translate-y-0.5"
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
        <span class="rounded-r-full bg-teal-600 px-3 py-1 text-xs font-medium uppercase tracking-wide text-white">{{ card.series }}</span>
      </div>
    </div>

    <div class="flex flex-1 flex-col gap-2.5 p-3.5 sm:gap-3 sm:p-5">
      <div>
        <h2 class="m-0 min-h-12 text-[1.0625rem] font-medium leading-snug text-ink line-clamp-2">{{ card.name }}</h2>
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

      <div class="mt-auto flex flex-col gap-2 pt-1">
        <div class="flex flex-col items-stretch gap-2.5 @[17rem]:flex-row @[17rem]:items-end @[17rem]:justify-between @[17rem]:gap-3">
          <p class="m-0 flex flex-col leading-none">
            <span class="whitespace-nowrap text-xl font-medium text-ink">{{ formatPrice(card.price) }}</span>
            <span class="mt-1 text-xs font-semibold text-slate-500">за полотно</span>
            <span v-if="kitPrice" class="mt-1.5 whitespace-nowrap text-xs font-semibold text-slate-500">
              {{ Number(kitPrice).toLocaleString('ru-RU') }} ₽ за комплект
            </span>
          </p>
          <a
            :href="`/models/${card.slug}`"
            class="btn btn-outline shrink-0 justify-center px-4 py-2 text-sm after:absolute after:inset-0 after:content-['']"
            :aria-label="`${card.name} — подробнее`"
          >
            Подробнее
          </a>
        </div>

        <details v-if="kitPrice" class="kit-info relative z-10">
          <summary class="flex w-fit cursor-pointer list-none items-center gap-1 text-[0.6875rem] font-semibold text-teal-700 transition hover:text-teal-800">
            <svg class="h-3.5 w-3.5 shrink-0" fill="none" stroke="currentColor" stroke-width="1.6" viewBox="0 0 20 20" aria-hidden="true">
              <circle cx="10" cy="10" r="8" />
              <path d="M10 9.25v4.25" stroke-linecap="round" />
              <circle cx="10" cy="6.75" r="0.9" fill="currentColor" stroke="none" />
            </svg>
            Что входит в комплект
          </summary>
          <p class="m-0 mt-1.5 rounded-lg bg-slate-50 px-2.5 py-2 text-[0.6875rem] leading-snug text-slate-600">
            Полотно, {{ BASE_KIT_DESCRIPTION }}
          </p>
        </details>
      </div>
    </div>
  </article>
</template>

<style scoped>
/* Скрываем нативный маркер-треугольник <details> — иконка-инфо в summary уже даёт понятный триггер */
.kit-info > summary {
  list-style: none;
}
.kit-info > summary::-webkit-details-marker {
  display: none;
}
</style>
