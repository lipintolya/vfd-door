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


const sizeClassMap: Record<SectionSize, string> = {
  sm: 'py-4 sm:py-8 lg:py-12',
  md: 'py-8 sm:py-12 lg:py-16',
  lg: 'py-12 sm:py-16 lg:py-20',
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
