<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, useTemplateRef } from 'vue'

interface Review {
  id: number
  name: string
  date: string
  text: string
  rating: number
}

const REVIEWS: Review[] = [
  {
    id: 1,
    name: 'Ирина К.',
    date: '2025-11-15',
    text: 'Купили двери Иннова, очень довольны качеством. Замерщик приехал быстро, монтаж сделали аккуратно. Рекомендую!',
    rating: 5,
  },
  {
    id: 2,
    name: 'Алексей П.',
    date: '2025-10-08',
    text: 'Большой выбор, есть что посмотреть вживую. Помогли подобрать под интерьер. Поставили 3 двери — всё отлично.',
    rating: 5,
  },
  {
    id: 3,
    name: 'Наталья С.',
    date: '2026-02-20',
    text: 'Заказывали алюминиевые перегородки для квартиры. Сделали за 40 дней как и обещали. Качество отличное.',
    rating: 5,
  },
  {
    id: 4,
    name: 'Дмитрий В.',
    date: '2026-04-12',
    text: 'Работаем с ВФД по проектам уже 2 года. Надёжные партнёры, всегда держат слово.',
    rating: 5,
  },
]

const formatDate = (dateStr: string): string =>
  new Date(dateStr).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })

const sectionRef = useTemplateRef<HTMLElement>('sectionEl')
const visible = ref(false)
let observer: IntersectionObserver | null = null

onMounted(() => {
  const el = sectionRef.value
  if (!el) return
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    visible.value = true
    return
  }
  observer = new IntersectionObserver(
    ([entry]) => {
      if (entry?.isIntersecting) { visible.value = true; observer?.disconnect() }
    },
    { threshold: 0.15 }
  )
  observer.observe(el)
})

onBeforeUnmount(() => observer?.disconnect())
</script>

<template>
  <section
    ref="sectionEl"
    class="section bg-white"
    aria-labelledby="reviews-heading"
  >
    <div class="container">

      <!-- Header -->
      <header
        class="max-w-3xl mb-10 md:mb-16 transition-[opacity,transform] duration-700 ease-out motion-reduce:transition-none"
        :class="visible ? 'translate-y-0 opacity-100' : 'translate-y-5 opacity-0'"
      >
        <p class="mb-3 text-xs font-extrabold uppercase tracking-widest text-teal-600">
          Отзывы клиентов
        </p>
        <h2 id="reviews-heading" class="text-3xl font-extrabold leading-tight tracking-tight text-slate-900 md:text-5xl">
          Нам доверяют
        </h2>
        <p class="mt-4 text-base leading-relaxed text-slate-600 md:text-lg">
          Более 5 000 довольных клиентов в Челябинске за 10 лет работы
        </p>
      </header>

      <!-- Grid -->
      <ul
        class="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6"
        role="list"
        itemscope
        itemtype="https://schema.org/ItemList"
      >
        <li
          v-for="(review, idx) in REVIEWS"
          :key="review.id"
          class="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-6 transition-[opacity,transform] duration-700 ease-out motion-reduce:transition-none"
          :class="visible ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'"
          :style="{ transitionDelay: visible ? `${idx * 100}ms` : '0ms' }"
          itemprop="itemListElement"
          itemscope
          itemtype="https://schema.org/Review"
        >
          <!-- Stars -->
          <div class="flex gap-0.5" :aria-label="`Оценка: ${review.rating} из 5`">
            <svg
              v-for="i in review.rating"
              :key="i"
              class="h-4 w-4 fill-amber-400"
              viewBox="0 0 20 20"
              aria-hidden="true"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
            </svg>
          </div>

          <!-- Text -->
          <p
            class="flex-1 text-sm leading-relaxed text-slate-700"
            itemprop="reviewBody"
          >{{ review.text }}</p>

          <!-- Author + date -->
          <div class="flex items-center justify-between border-t border-slate-200 pt-4">
            <span
              class="text-sm font-semibold text-slate-900"
              itemprop="author"
              itemscope
              itemtype="https://schema.org/Person"
            >
              <span itemprop="name">{{ review.name }}</span>
            </span>
            <time
              :datetime="review.date"
              class="text-xs text-slate-500"
              itemprop="datePublished"
            >{{ formatDate(review.date) }}</time>
          </div>
        </li>
      </ul>

    </div>
  </section>
</template>
