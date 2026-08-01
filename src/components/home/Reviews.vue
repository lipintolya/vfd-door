<script setup lang="ts">
import { ref } from 'vue'
import { useScrollReveal } from '../../composables/useScrollReveal'
import { reviews, type ReviewPlatform } from '../../data/reviews'

const PLATFORM_META: Record<ReviewPlatform, { label: string; badge: string }> = {
  yandex: { label: 'Яндекс Карты', badge: 'bg-red-50 text-red-600' },
  '2gis':  { label: '2ГИС',        badge: 'bg-emerald-50 text-emerald-600' },
}

const formatDate = (dateStr?: string): string =>
  dateStr
    ? new Date(dateStr).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })
    : ''

const { sectionRef, visible } = useScrollReveal(0.1)

/* Горизонтальная карусель-«стена отзывов»: карточек много (15+) и их число
   будет расти — вертикальная сетка на все отзывы сделала бы блок на главной
   огромным. Скролл нативный (свайп/трекпад), стрелки — для мыши/доступности. */
const trackRef = ref<HTMLElement | null>(null)
const scrollByCards = (dir: 1 | -1) => {
  const el = trackRef.value
  if (!el) return
  const card = el.querySelector<HTMLElement>('[data-review-card]')
  const step = (card?.offsetWidth ?? 320) + 16
  el.scrollBy({ left: dir * step, behavior: 'smooth' })
}
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
        class="mb-10 flex flex-wrap items-end justify-between gap-6 transition-[opacity,transform] duration-700 ease-out motion-reduce:transition-none md:mb-12"
        :class="visible ? 'translate-y-0 opacity-100' : 'translate-y-5 opacity-0'"
      >
        <div class="max-w-2xl">
          <p class="t-eyebrow mb-3">
            Отзывы клиентов
          </p>
          <h2 id="reviews-heading" class="text-3xl font-medium leading-tight tracking-tight text-slate-900 md:text-5xl">
            Нам доверяют
          </h2>
          <p class="mt-4 text-base leading-relaxed text-slate-600 md:text-lg">
            Реальные отзывы с Яндекс Карт и 2ГИС — без купюр, с фото от клиентов
          </p>
        </div>

        <!-- Стрелки карусели — скрыты на мобильном, там свайп -->
        <div class="hidden shrink-0 items-center gap-2 sm:flex">
          <button
            type="button"
            class="flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 text-slate-500 transition-colors hover:border-slate-300 hover:text-ink"
            aria-label="Предыдущие отзывы"
            @click="scrollByCards(-1)"
          >
            <svg class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" d="M15 6l-6 6 6 6"/>
            </svg>
          </button>
          <button
            type="button"
            class="flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 text-slate-500 transition-colors hover:border-slate-300 hover:text-ink"
            aria-label="Следующие отзывы"
            @click="scrollByCards(1)"
          >
            <svg class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9 6l6 6-6 6"/>
            </svg>
          </button>
        </div>
      </header>

      <!-- Carousel -->
      <ul
        ref="trackRef"
        class="scrollbar-none [&::-webkit-scrollbar]:hidden flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth pb-3 transition-[opacity,transform] duration-700 ease-out motion-reduce:transition-none md:gap-5"
        :class="visible ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'"
        role="list"
        itemscope
        itemtype="https://schema.org/ItemList"
      >
        <li
          v-for="review in reviews"
          :key="review.id"
          data-review-card
          class="flex w-70 shrink-0 snap-start flex-col gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-6 sm:w-80"
          itemprop="itemListElement"
          itemscope
          itemtype="https://schema.org/Review"
        >
          <!-- Платформа + дата -->
          <div class="flex items-center justify-between gap-2">
            <span
              class="rounded-full px-2.5 py-1 text-xs font-semibold"
              :class="PLATFORM_META[review.platform].badge"
            >{{ PLATFORM_META[review.platform].label }}</span>
            <time
              v-if="review.date"
              :datetime="review.date"
              class="shrink-0 text-xs text-slate-400"
              itemprop="datePublished"
            >{{ formatDate(review.date) }}</time>
          </div>

          <!-- Stars -->
          <div class="flex gap-0.5" aria-label="Оценка: 5 из 5" itemprop="reviewRating" itemscope itemtype="https://schema.org/Rating">
            <meta itemprop="ratingValue" content="5" />
            <meta itemprop="bestRating" content="5" />
            <svg
              v-for="i in 5"
              :key="i"
              class="h-4 w-4 fill-amber-400"
              viewBox="0 0 20 20"
              aria-hidden="true"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
            </svg>
          </div>

          <!-- Author -->
          <span
            class="text-sm font-semibold text-slate-900"
            itemprop="author"
            itemscope
            itemtype="https://schema.org/Person"
          >
            <span itemprop="name">{{ review.name }}</span>
          </span>

          <!-- Text -->
          <p
            class="line-clamp-6 flex-1 text-sm leading-relaxed text-slate-700"
            itemprop="reviewBody"
          >{{ review.text }}</p>

          <!-- Фото от клиента — единый кроп независимо от исходных пропорций -->
          <div
            v-if="review.photos?.length"
            class="grid gap-1.5"
            :style="{ gridTemplateColumns: `repeat(${Math.min(review.photos.length, 3)}, minmax(0, 1fr))` }"
          >
            <div
              v-for="photo in review.photos"
              :key="photo"
              class="aspect-square overflow-hidden rounded-lg bg-slate-200"
            >
              <img
                :src="photo"
                :alt="`Фото от клиента ${review.name} — отзыв о ВФД`"
                loading="lazy"
                decoding="async"
                width="200"
                height="200"
                class="h-full w-full object-cover"
              />
            </div>
          </div>
        </li>
      </ul>

      <!-- Ссылки на внешние платформы отзывов -->
      <div
        class="mt-8 flex flex-wrap items-center gap-3 transition-[opacity,transform] duration-700 ease-out motion-reduce:transition-none md:mt-10"
        :class="visible ? 'translate-y-0 opacity-100' : 'translate-y-5 opacity-0'"
      >
        <span class="text-sm font-medium text-slate-500">Читайте больше отзывов и оставляйте свои:</span>
        <a
          href="https://2gis.ru/chelyabinsk/search/ВФД%20Владимирская%20фабрика%20дверей%20Братьев%20Кашириных%20131Б"
          target="_blank"
          rel="noopener"
          class="btn btn-outline"
        >
          2ГИС
        </a>
        <a
          href="https://yandex.ru/maps/?text=ВФД%20Владимирская%20фабрика%20дверей%20Челябинск%20Братьев%20Кашириных%20131Б"
          target="_blank"
          rel="noopener"
          class="btn btn-outline"
        >
          Яндекс Карты
        </a>
      </div>

    </div>
  </section>
</template>
