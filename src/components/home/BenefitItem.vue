<script setup lang="ts">
/**
 * src/components/home/BenefitItem.vue
 * Один пункт списка преимуществ с "scroll highlight" — вся строка (иконка +
 * текст) подсвечивается плашкой, когда проходит через центр вьюпорта.
 *
 * Идея с motion.dev/examples/vue-scroll-highlight, но без JS-анимационной
 * библиотеки: для 4 статичных буллетов это лишний вес. Сам расчёт "какая
 * строка сейчас ближе всего к центру экрана" всё равно требует JS (точное
 * пиксельное расстояние — rAF-throttled scroll listener, см. комментарий
 * ниже), а вот саму анимацию делает обычный CSS transition через :class,
 * с уважением prefers-reduced-motion (motion-reduce: — как и остальные
 * анимации на сайте, см. useScrollReveal/Features.vue/Reviews.vue).
 *
 * Почему не через useInView(margin: '-45% ...') из motion-v "в лоб", как в
 * референсе: та демка рассчитана на длинный список, растянутый на много
 * экранов — там тонкая процентная полоса в центре вьюпорта естественным
 * образом задевает один пункт за раз. У нас компактный список из 4 строк,
 * все внутри одного экрана — та же процентная полоса (десятки % высоты
 * вьюпорта) перекрывала сразу несколько пунктов одновременно. Считаем
 * точное расстояние центра строки до центра вьюпорта в пикселях — тогда
 * активна строго одна строка, ближайшая к центру, независимо от высоты
 * экрана.
 */
import { ref, onMounted, onUnmounted } from 'vue'

defineProps<{ text: string }>()

const itemRef = ref<HTMLElement | null>(null)
const isActive = ref(false)

let rafId: number | null = null

const check = () => {
  rafId = null
  const el = itemRef.value
  if (!el) return

  const rect = el.getBoundingClientRect()
  const itemCenter = rect.top + rect.height / 2
  const viewportCenter = window.innerHeight / 2
  isActive.value = Math.abs(itemCenter - viewportCenter) < rect.height / 2 + 6
}

const onScroll = () => {
  if (rafId != null) return
  rafId = requestAnimationFrame(check)
}

onMounted(() => {
  // При prefers-reduced-motion эффект чисто декоративный — не подписываемся
  // на scroll вообще, а не просто гасим CSS-переход.
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
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
    <span
      class="-mx-3 -my-1.5 flex items-center gap-3 rounded-xl px-3 py-1.5 transition-[background-color,box-shadow] duration-400 ease-out motion-reduce:transition-none"
      :class="isActive
        ? 'bg-teal-100 shadow-[inset_0_0_0_1.5px_rgb(94,234,212)]'
        : 'bg-transparent shadow-[inset_0_0_0_0px_rgba(94,234,212,0)]'"
    >
      <span
        class="flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition-transform duration-400 ease-out motion-reduce:transition-none"
        :class="isActive ? 'scale-[1.22]' : 'scale-100'"
      >
        <slot />
      </span>
      <span
        class="transition-colors duration-300 motion-reduce:transition-none"
        :class="isActive ? 'font-semibold text-slate-900' : ''"
      >{{ text }}</span>
    </span>
  </li>
</template>
