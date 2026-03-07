<script setup lang="ts">
import { computed } from 'vue'

type SectionSize = 'sm' | 'md' | 'lg'
type SectionHeight = 'auto' | 'hero' | 'screen'

const props = withDefaults(
  defineProps<{
    size?: SectionSize
    height?: SectionHeight
    as?: 'section' | 'div' | 'main'
  }>(),
  {
    size: 'md',
    height: 'auto',
    as: 'section',
  }
)

/**
 * Единая система отступков для секций
 * Mobile → Tablet → Desktop (4px baseline grid)
 */
const sizeClassMap: Record<SectionSize, string> = {
  // Small: компактные секции (Features, Testimonials)
  sm: 'py-10 sm:py-16 lg:py-20',
  // Medium: стандартные секции (Catalog, About)
  md: 'py-14 sm:py-20 lg:py-24',
  // Large:_hero и ключевые секции (Hero, Portfolio)
  lg: 'py-20 sm:py-24 lg:py-32',
}

/**
 * Контроль высоты секции
 * ❗ Используется ТОЛЬКО на уровне Section
 */
const heightClassMap: Record<SectionHeight, string> = {
  auto: '',
  hero: 'min-h-[70svh] lg:min-h-[85svh]',
  screen: 'min-h-[100svh]',
}

const sectionClass = computed(() => [
  'w-full',
  sizeClassMap[props.size],
  heightClassMap[props.height],
])
</script>

<template>
  <component
    :is="as"
    :class="sectionClass"
  >
    <slot />
  </component>
</template>
