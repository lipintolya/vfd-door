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
        :href="`/portfolio/${work.id}`"
        class="group relative block overflow-hidden rounded-2xl"
      >
        <div class="relative aspect-4/3 w-full overflow-hidden bg-slate-100 sm:aspect-3/4">
          <img
            :src="work.images[0]"
            :alt="work.title"
            loading="lazy"
            decoding="async"
            class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>
        <div class="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent" />
        <div class="absolute bottom-0 left-0 right-0 p-4">
          <span :class="['inline-block text-xs font-medium uppercase tracking-wider text-white px-2 py-0.5 rounded mb-1.5', CATEGORY_BADGE_COLORS[work.category]]">
            {{ CATEGORY_LABELS[work.category] }}
          </span>
          <h3 class="text-sm font-medium text-white leading-snug line-clamp-2">{{ work.title }}</h3>
          <p class="text-xs text-white/65 mt-1">📍 {{ work.location }}</p>
        </div>
      </a>
    </div>

    <!-- Empty state -->
    <p v-if="filtered.length === 0" class="text-slate-500 text-base py-12 text-center">
      Работ по этой категории пока нет.
    </p>
  </div>
</template>
