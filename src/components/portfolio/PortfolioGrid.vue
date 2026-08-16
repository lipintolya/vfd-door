<script setup lang="ts">
import { ref, computed } from 'vue'
import type { PortfolioWork, WorkCategory } from '../../data/portfolio-works'
import { CATEGORY_LABELS, CATEGORY_BADGE_COLORS } from '../../data/portfolio-works'

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

    <!-- Ровная сетка, не масонри/пинтерест — одинаковая высота карточек,
         крупные плитки удобнее сканировать глазами, чем "плавающие" колонки.
         Портретные пропорции + уже колонок на широких экранах — плитки
         выглядят стройнее, ближе к формату дверного полотна на фото. -->
    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      <a
        v-for="work in filtered"
        :key="work.id"
        :href="`/portfolio/${work.id}/`"
        class="group relative block overflow-hidden rounded-2xl"
      >
        <div class="relative aspect-4/3 w-full overflow-hidden bg-slate-100 sm:aspect-3/4">
          <img
            :src="`/renders/portfolio/${work.id}.webp`"
            :alt="work.title"
            loading="lazy"
            decoding="async"
            class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <span class="absolute top-3 right-3 rounded-full bg-black/55 backdrop-blur-sm px-2.5 py-1 text-xs font-semibold text-white shadow-sm">
            {{ work.label }}
          </span>
        </div>
        <div class="absolute inset-0 bg-linear-to-t from-black/80 via-black/25 to-transparent" />
        <div class="absolute bottom-0 left-0 right-0 p-4 sm:p-5">
          <span :class="['inline-block text-[11px] font-semibold uppercase tracking-wider text-white px-2.5 py-1 rounded-full mb-2 shadow-sm', CATEGORY_BADGE_COLORS[work.category]]">
            {{ CATEGORY_LABELS[work.category] }}
          </span>
          <h3 class="text-sm font-semibold text-white leading-snug line-clamp-2">{{ work.title }}</h3>
          <p class="flex items-center gap-1.5 text-sm font-medium text-white mt-2">
            <svg viewBox="0 0 24 24" fill="none" class="h-4 w-4 shrink-0" aria-hidden="true">
              <path d="M12 21s7-6.5 7-12a7 7 0 1 0-14 0c0 5.5 7 12 7 12Z" stroke="white" stroke-width="1.8" stroke-linejoin="round"/>
              <circle cx="12" cy="9" r="2.5" stroke="white" stroke-width="1.8"/>
            </svg>
            {{ work.location }}
          </p>
        </div>
      </a>
    </div>

    <!-- Empty state -->
    <p v-if="filtered.length === 0" class="text-slate-500 text-base py-12 text-center">
      Работ по этой категории пока нет.
    </p>
  </div>
</template>
