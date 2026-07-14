<script setup lang="ts">
import { ref, computed } from 'vue'
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
          'px-4 py-2 rounded-full text-sm font-bold border-[1.5px] transition-colors duration-150',
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

    <!-- Masonry grid -->
    <div class="columns-1 sm:columns-2 lg:columns-3 gap-x-4">
      <a
        v-for="work in filtered"
        :key="work.id"
        :href="`/portfolio/${work.id}`"
        class="mb-4 block break-inside-avoid rounded-2xl overflow-hidden relative group"
      >
        <img
          :src="work.images[0]"
          :alt="work.title"
          loading="lazy"
          decoding="async"
          class="w-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        <div class="absolute bottom-0 left-0 right-0 p-4">
          <span class="inline-block text-xs font-medium uppercase tracking-wider bg-teal-500 text-white px-2 py-0.5 rounded mb-1.5">
            {{ CATEGORY_LABELS[work.category] }}
          </span>
          <h3 class="text-sm font-bold text-white leading-snug">{{ work.title }}</h3>
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
