<script setup lang="ts">
/**
 * src/components/home/BenefitItem.vue
 * Один пункт списка преимуществ с "scroll highlight" — вся строка (иконка +
 * текст) подсвечивается плашкой, когда проходит через центр вьюпорта.
 *
 * Почему не через useInView(margin: '-45% ...') из motion-v "в лоб", как в
 * референсе (motion.dev/examples/vue-scroll-highlight): та демка рассчитана
 * на длинный список, растянутый на много экранов — там тонкая процентная
 * полоса в центре вьюпорта естественным образом задевает один пункт за раз.
 * У нас компактный список из 4 строк, все внутри одного экрана — та же
 * процентная полоса (десятки % высоты вьюпорта) перекрывала сразу
 * несколько пунктов одновременно. Считаем точное расстояние центра
 * конкретной строки до центра вьюпорта в пикселях — тогда активна строго
 * одна строка, ближайшая к центру, независимо от высоты экрана.
 */
import { ref, onMounted, onUnmounted } from 'vue'
import { animate } from 'motion'

defineProps<{ text: string }>()

const itemRef = ref<HTMLElement | null>(null)
const pillRef = ref<HTMLElement | null>(null)
const iconRef = ref<HTMLElement | null>(null)

let active = false
let rafId: number | null = null

const check = () => {
  rafId = null
  const el = itemRef.value
  const pill = pillRef.value
  const icon = iconRef.value
  if (!el || !pill || !icon) return

  const rect = el.getBoundingClientRect()
  const itemCenter = rect.top + rect.height / 2
  const viewportCenter = window.innerHeight / 2
  const nowActive = Math.abs(itemCenter - viewportCenter) < rect.height / 2 + 6

  if (nowActive === active) return
  active = nowActive

  animate(
    pill,
    { backgroundColor: active ? 'rgb(240 253 250)' : 'rgba(240, 253, 250, 0)' },
    { duration: 0.45, ease: 'easeOut' }
  )
  animate(
    icon,
    { scale: active ? 1.12 : 1 },
    { duration: 0.45, ease: 'easeOut' }
  )
}

const onScroll = () => {
  if (rafId != null) return
  rafId = requestAnimationFrame(check)
}

onMounted(() => {
  window.addEventListener('scroll', onScroll, { passive: true })
  window.addEventListener('resize', onScroll)
  check()
})
onUnmounted(() => {
  window.removeEventListener('scroll', onScroll)
  window.removeEventListener('resize', onScroll)
  if (rafId != null) cancelAnimationFrame(rafId)
})
</script>

<template>
  <li ref="itemRef" class="text-base text-slate-700">
    <span ref="pillRef" class="-mx-3 -my-1.5 flex items-center gap-3 rounded-xl px-3 py-1.5">
      <span ref="iconRef" class="flex h-9 w-9 shrink-0 items-center justify-center rounded-full">
        <slot />
      </span>
      <span>{{ text }}</span>
    </span>
  </li>
</template>
