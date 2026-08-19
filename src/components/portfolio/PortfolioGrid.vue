<script setup lang="ts">
import { ref, computed, nextTick } from 'vue'
import type { PortfolioWork, WorkCategory } from '../../data/portfolio-works'
import { CATEGORY_LABELS } from '../../data/portfolio-works'

const props = defineProps<{ works: PortfolioWork[] }>()

type FilterKey = WorkCategory | 'all'

const FILTERS: { key: FilterKey; label: string }[] = [
  { key: 'all',        label: 'Все работы' },
  { key: 'interior',   label: CATEGORY_LABELS.interior },
  { key: 'hidden',     label: CATEGORY_LABELS.hidden },
  { key: 'partitions', label: CATEGORY_LABELS.partitions },
  { key: 'entrance',   label: CATEGORY_LABELS.entrance },
]

const active = ref<FilterKey>('all')

const filtered = computed(() =>
  active.value === 'all'
    ? props.works
    : props.works.filter(w => w.category === active.value)
)

const interiorCount = computed(() => props.works.filter(w => w.category === 'interior').length)
const hiddenCount = computed(() => props.works.filter(w => w.category === 'hidden').length)

const gridEl = ref<HTMLElement | null>(null)
function selectAndScroll(key: FilterKey) {
  active.value = key
  nextTick(() => gridEl.value?.scrollIntoView({ behavior: 'smooth', block: 'start' }))
}

/* Обложки для бенто-блока категорий — рендеры реальных работ (интерьер,
   скрытые двери) и, там где готовых фотоотчётов ещё нет (перегородки,
   входные), рендер модели из каталога — честнее пустого состояния фильтра. */
const BENTO_ALL_IMG        = '/renders/portfolio/2026-08-13-feniks-2-magnoliya.webp'
const BENTO_INTERIOR_IMG   = '/renders/portfolio/2026-03-12-urban-1-beton-antik-loft.webp'
const BENTO_HIDDEN_IMG     = '/renders/portfolio/2026-01-05-sekret-chernaya-kromka.webp'
const BENTO_PARTITIONS_IMG = '/renders/alum-covers/3.webp'
const BENTO_ENTRANCE_IMG   = 'https://storage.yandexcloud.net/vfd74ru/metal_doors/Termo/ComfortTermo/render_confort_termo.webp'
</script>

<template>
  <div>
    <!-- Filter pills -->
    <div class="flex flex-wrap gap-2 mb-6">
      <button
        v-for="f in FILTERS"
        :key="f.key"
        @click="active = f.key"
        :class="[
          'px-4 py-2 rounded-full text-sm font-semibold border-[1.5px] transition-colors duration-150',
          active === f.key
            ? 'bg-slate-900 text-white border-slate-900'
            : 'bg-white text-slate-600 border-slate-200 hover:border-slate-400'
        ]"
      >
        {{ f.label }}
      </button>
    </div>

    <!-- Count -->
    <p class="text-sm text-slate-500 mb-8">
      Показано {{ filtered.length }} из {{ works.length }} работ
    </p>

    <!-- Бенто-витрина категорий: крупная карточка "Все работы" + 4 поменьше.
         Межкомнатные/скрытые двери фильтруют сетку ниже (в портфолио уже
         есть работы), перегородки/входные ведут в каталог — фотоотчётов по
         ним пока нет, вести на пустой фильтр было бы тупиком. -->
    <div class="mb-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:auto-rows-[220px] lg:grid-flow-dense">
      <button
        type="button"
        @click="selectAndScroll('all')"
        class="group relative block h-64 w-full overflow-hidden rounded-3xl text-left sm:col-span-2 sm:h-72 lg:col-span-2 lg:row-span-2 lg:h-auto"
      >
        <img :src="BENTO_ALL_IMG" alt="Все работы" loading="lazy" decoding="async"
          class="absolute inset-0 h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105" />
        <div class="absolute inset-0 bg-linear-to-t from-black/80 via-black/25 to-black/5" />
        <div class="relative flex h-full flex-col justify-between p-6">
          <span class="text-xs font-semibold uppercase tracking-wider text-white/80">Портфолио</span>
          <div>
            <h3 class="text-2xl font-semibold text-white">Все работы</h3>
            <p class="mt-1.5 max-w-xs text-sm text-white/70">Реальные объекты — двери и перегородки по Челябинску и области</p>
            <div class="mt-5 flex items-center justify-between">
              <div class="flex items-center gap-2.5">
                <span class="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/10 ring-1 ring-white/15">
                  <svg viewBox="0 0 24 24" fill="none" class="h-4 w-4 text-white" aria-hidden="true">
                    <rect x="3" y="3" width="7" height="7" rx="1.5" stroke="currentColor" stroke-width="1.8"/>
                    <rect x="14" y="3" width="7" height="7" rx="1.5" stroke="currentColor" stroke-width="1.8"/>
                    <rect x="3" y="14" width="7" height="7" rx="1.5" stroke="currentColor" stroke-width="1.8"/>
                    <rect x="14" y="14" width="7" height="7" rx="1.5" stroke="currentColor" stroke-width="1.8"/>
                  </svg>
                </span>
                <div class="leading-tight">
                  <p class="text-sm font-semibold text-white">{{ works.length }} работ</p>
                  <p class="text-xs text-white/50">в портфолио</p>
                </div>
              </div>
              <span class="inline-flex items-center gap-1 text-sm font-semibold text-white">
                Смотреть все
                <svg viewBox="0 0 16 16" fill="none" class="h-3.5 w-3.5" aria-hidden="true">
                  <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </span>
            </div>
          </div>
        </div>
      </button>

      <button
        type="button"
        @click="selectAndScroll('interior')"
        class="group relative block h-56 w-full overflow-hidden rounded-3xl text-left lg:h-auto"
      >
        <img :src="BENTO_INTERIOR_IMG" alt="Межкомнатные двери" loading="lazy" decoding="async"
          class="absolute inset-0 h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105" />
        <div class="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent" />
        <div class="relative flex h-full flex-col justify-between p-5">
          <span class="text-xs font-semibold uppercase tracking-wider text-white/80">Межкомнатные</span>
          <div>
            <h3 class="text-lg font-semibold text-white">Межкомнатные двери</h3>
            <p class="mt-1 text-xs text-white/70">Классика, эмаль, шпон</p>
            <div class="mt-3 flex items-center justify-between">
              <span class="text-xs font-medium text-white/60">{{ interiorCount }} работ</span>
              <span class="inline-flex items-center gap-1 text-xs font-semibold text-white">
                Смотреть
                <svg viewBox="0 0 16 16" fill="none" class="h-3 w-3" aria-hidden="true">
                  <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </span>
            </div>
          </div>
        </div>
      </button>

      <button
        type="button"
        @click="selectAndScroll('hidden')"
        class="group relative block h-56 w-full overflow-hidden rounded-3xl text-left lg:h-auto"
      >
        <img :src="BENTO_HIDDEN_IMG" alt="Скрытые двери" loading="lazy" decoding="async"
          class="absolute inset-0 h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105" />
        <div class="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent" />
        <div class="relative flex h-full flex-col justify-between p-5">
          <span class="text-xs font-semibold uppercase tracking-wider text-white/80">Скрытые двери</span>
          <div>
            <h3 class="text-lg font-semibold text-white">Скрытые двери</h3>
            <p class="mt-1 text-xs text-white/70">Вровень со стеной, без наличников</p>
            <div class="mt-3 flex items-center justify-between">
              <span class="text-xs font-medium text-white/60">{{ hiddenCount }} работ</span>
              <span class="inline-flex items-center gap-1 text-xs font-semibold text-white">
                Смотреть
                <svg viewBox="0 0 16 16" fill="none" class="h-3 w-3" aria-hidden="true">
                  <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </span>
            </div>
          </div>
        </div>
      </button>

      <a
        href="/partitions/"
        class="group relative block h-56 w-full overflow-hidden rounded-3xl text-left lg:h-auto"
      >
        <img :src="BENTO_PARTITIONS_IMG" alt="Алюминиевые перегородки" loading="lazy" decoding="async"
          class="absolute inset-0 h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105" />
        <div class="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent" />
        <div class="relative flex h-full flex-col justify-between p-5">
          <span class="text-xs font-semibold uppercase tracking-wider text-white/80">Перегородки</span>
          <div>
            <h3 class="text-lg font-semibold text-white">Алюминиевые перегородки</h3>
            <p class="mt-1 text-xs text-white/70">Зонирование стеклом и профилем</p>
            <div class="mt-3 flex items-center justify-between">
              <span class="text-xs font-medium text-white/60">Каталог</span>
              <span class="inline-flex items-center gap-1 text-xs font-semibold text-white">
                Смотреть
                <svg viewBox="0 0 16 16" fill="none" class="h-3 w-3" aria-hidden="true">
                  <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </span>
            </div>
          </div>
        </div>
      </a>

      <a
        href="/vhodnye-dveri/"
        class="group relative block h-56 w-full overflow-hidden rounded-3xl text-left lg:h-auto"
      >
        <img :src="BENTO_ENTRANCE_IMG" alt="Входные двери" loading="lazy" decoding="async"
          class="absolute inset-0 h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105" />
        <div class="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent" />
        <div class="relative flex h-full flex-col justify-between p-5">
          <span class="text-xs font-semibold uppercase tracking-wider text-white/80">Входные</span>
          <div>
            <h3 class="text-lg font-semibold text-white">Входные двери</h3>
            <p class="mt-1 text-xs text-white/70">С терморазрывом, для дома и улицы</p>
            <div class="mt-3 flex items-center justify-between">
              <span class="text-xs font-medium text-white/60">Каталог</span>
              <span class="inline-flex items-center gap-1 text-xs font-semibold text-white">
                Смотреть
                <svg viewBox="0 0 16 16" fill="none" class="h-3 w-3" aria-hidden="true">
                  <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </span>
            </div>
          </div>
        </div>
      </a>
    </div>

    <!-- Ровная сетка, не масонри/пинтерест — одинаковая высота карточек,
         крупные плитки удобнее сканировать глазами, чем "плавающие" колонки.
         Портретные пропорции + уже колонок на широких экранах — плитки
         выглядят стройнее, ближе к формату дверного полотна на фото.

         Бейдж категории и дата раньше были двумя отдельными плашками (яркий
         сплошной цвет сверху справа + чёрная плашка с датой) — при том что
         почти все работы одной категории («межкомнатные», красный), сетка
         из 20 карточек превращалась в стену красных ярлыков. Теперь один
         спокойный стеклянный бейдж (цветная точка + подпись) и дата убрана
         в строку с локацией — меньше слоёв поверх фото. -->
    <div ref="gridEl" class="grid scroll-mt-24 grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      <a
        v-for="work in filtered"
        :key="work.id"
        :href="`/portfolio/${work.id}/`"
        class="group relative block overflow-hidden rounded-3xl bg-slate-100 shadow-sm ring-1 ring-slate-900/5 transition-shadow duration-300 hover:shadow-lg"
      >
        <div class="relative aspect-4/3 w-full overflow-hidden sm:aspect-3/4">
          <img
            :src="`/renders/portfolio/${work.id}.webp`"
            :alt="work.title"
            loading="lazy"
            decoding="async"
            class="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
          />
          <div class="absolute inset-0 bg-linear-to-t from-black/75 via-black/10 to-transparent" />

          <span class="absolute left-3 top-3 inline-flex items-center rounded-full bg-black/30 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-white ring-1 ring-white/15 backdrop-blur-md">
            {{ CATEGORY_LABELS[work.category] }}
          </span>

          <div class="absolute inset-x-0 bottom-0 p-4 sm:p-5">
            <h3 class="text-sm font-semibold text-white leading-snug line-clamp-2">{{ work.title }}</h3>
            <p class="mt-2 flex items-center gap-1.5 text-xs text-white/80">
              <svg viewBox="0 0 24 24" fill="none" class="h-3.5 w-3.5 shrink-0" aria-hidden="true">
                <path d="M12 21s7-6.5 7-12a7 7 0 1 0-14 0c0 5.5 7 12 7 12Z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/>
                <circle cx="12" cy="9" r="2.5" stroke="currentColor" stroke-width="1.8"/>
              </svg>
              <span class="truncate">{{ work.location }}</span>
              <span class="text-white/40" aria-hidden="true">·</span>
              <span class="shrink-0 tabular-nums">{{ work.label }}</span>
            </p>
          </div>
        </div>
      </a>
    </div>

    <!-- Empty state -->
    <p v-if="filtered.length === 0" class="text-slate-500 text-base py-12 text-center">
      Работ по этой категории пока нет.
    </p>
  </div>
</template>
