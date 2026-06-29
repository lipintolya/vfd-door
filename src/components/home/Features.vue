<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, useTemplateRef } from 'vue'

/* ============================================================
   Types
   ============================================================ */
interface Feature {
  id:     number
  title:  string
  text:   string
  /** 1–3 фото для слайдера карточки. Можно добавить ссылки с Yandex Cloud — стрелки и точки появятся автоматически, когда их больше одной. */
  images: string[]
  cta:    { label: string; href: string; external?: boolean }
}

/* ============================================================
   Data — вынесено за пределы setup, не пересоздаётся
   ============================================================ */
const WORDS: string[] = [
  'фирменный салон VFD',
  'дилера с дверями в наличии',
  'салон с крупнейшей выставкой',
  'установку дверей «под ключ»',
]

const FEATURES: Feature[] = [
  {
    id: 1,
    title: 'Официальные двери напрямую с фабрики',
    text: 'Мы — официальный дилер Владимирской фабрики дверей в Челябинске. Более 80 моделей в наличии на складе, оригинальная продукция и гарантия производителя — без посредников и переплат.',
    images: ['https://storage.yandexcloud.net/catalog-vfd/features_block/card-1.webp'],
    cta: { label: 'Выбрать двери', href: '/catalog' },
  },
  {
    id: 2,
    title: 'Всё в одном месте — от выбора до установки',
    text: 'Берём на себя весь процесс: бесплатная консультация, точный замер, расчёт стоимости, доставка и профессиональный монтаж под ключ. Работаем больше 15 лет — вам не нужно искать разных специалистов и контролировать каждый этап самостоятельно.',
    images: ['https://storage.yandexcloud.net/catalog-vfd/features_block/card-2.webp'],
    cta: { label: 'Посмотреть монтажи', href: '/portfolio' },
  },
  {
    id: 3,
    title: 'Большая выставка, где легко выбрать',
    text: 'Более 70 дверей представлены в салоне на Кашириных, 131Б — самая большая экспозиция ВФД в Челябинске. Сравните покрытия, цвета, фактуры и фурнитуру вживую, прежде чем сделать выбор.',
    images: ['https://storage.yandexcloud.net/catalog-vfd/features_block/card-3.webp'],
    cta: { label: 'Построить маршрут', href: 'https://yandex.ru/maps/-/CPTwZPi-', external: true },
  },
]

/* ============================================================
   State
   ============================================================ */
const sectionRef  = useTemplateRef<HTMLElement>('sectionEl')
const visible     = ref(false)
const currentWord = ref(WORDS[0])
const wordVisible = ref(true)
const activeImage = ref<number[]>(FEATURES.map(() => 0))

let wordIndex   = 0
let wordTimer:  ReturnType<typeof setTimeout>  | null = null
let cycleTimer: ReturnType<typeof setInterval> | null = null
let observer:   IntersectionObserver | null = null

/* ============================================================
   Card image slider
   ============================================================ */
const prevImage = (cardIdx: number) => {
  const total = FEATURES[cardIdx]!.images.length
  activeImage.value[cardIdx] = (activeImage.value[cardIdx]! - 1 + total) % total
}
const nextImage = (cardIdx: number) => {
  const total = FEATURES[cardIdx]!.images.length
  activeImage.value[cardIdx] = (activeImage.value[cardIdx]! + 1) % total
}
const setImage = (cardIdx: number, imgIdx: number) => {
  activeImage.value[cardIdx] = imgIdx
}

/* ============================================================
   Word animation
   ============================================================ */
const advanceWord = () => {
  wordVisible.value = false
  wordTimer = setTimeout(() => {
    wordIndex = (wordIndex + 1) % WORDS.length
    currentWord.value = WORDS[wordIndex]!
    wordVisible.value = true
  }, 300)
}

const startCycle = () => {
  if (cycleTimer !== null) return
  cycleTimer = setInterval(advanceWord, 2800)
}

const stopCycle = () => {
  if (cycleTimer !== null) { clearInterval(cycleTimer); cycleTimer = null }
  if (wordTimer  !== null) { clearTimeout(wordTimer);  wordTimer  = null }
}

/* ============================================================
   Intersection Observer
   ============================================================ */
onMounted(() => {
  const el = sectionRef.value
  if (!el) return

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  observer = new IntersectionObserver(
    ([entry]) => {
      if (!entry) return
      if (entry.isIntersecting) {
        visible.value = true
        if (!prefersReduced) startCycle()
        observer?.unobserve(el)
      }
    },
    { threshold: 0.2 }
  )

  observer.observe(el)
})

onBeforeUnmount(() => {
  stopCycle()
  observer?.disconnect()
})
</script>

<template>
  <section
    ref="sectionEl"
    class="section"
    aria-labelledby="features-heading"
    itemscope
    itemtype="https://schema.org/ItemList"
  >
    <div class="container">

      <!-- ── Header ── -->
      <div class="mb-10 md:mb-16">
        <header class="max-w-3xl">
          <p class="mb-3 text-xs font-extrabold uppercase tracking-widest text-teal-600" aria-hidden="true">
            Почему выбирают нас
          </p>

          <h2 id="features-heading" class="mb-4 text-3xl font-extrabold leading-tight tracking-tight text-slate-900 md:text-5xl">
            Вы нашли
            <span class="sr-only">официальный салон ВФД</span>
            <span
              class="inline-block text-teal-600 transition-all duration-300 ease-out"
              :class="wordVisible ? 'translate-y-0 opacity-100' : 'translate-y-1.5 opacity-0'"
              aria-hidden="true"
            >{{ currentWord }}</span>
          </h2>
        </header>

        <p class="mt-4 text-base leading-relaxed text-slate-600 md:text-lg">
          Более 80 моделей дверей в выставочном зале — выбирайте не по картинке, а вживую.
          Поможем подобрать идеальный вариант под ваш интерьер, сделаем замер и выполним качественную установку.
        </p>
      </div>

      <!-- ── Cards ── -->
      <ul
        class="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 lg:grid-cols-3"
        role="list"
        itemprop="itemListElement"
      >
        <li
          v-for="(feature, idx) in FEATURES"
          :key="feature.id"
          class="group flex flex-col rounded-3xl border border-slate-200 bg-slate-50 p-3 transition-[opacity,transform,border-color] duration-700 ease-out motion-reduce:transition-none"
          :class="visible ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'"
          :style="{ transitionDelay: visible ? `${idx * 130}ms` : '0ms' }"
          itemprop="item"
          itemscope
          itemtype="https://schema.org/Thing"
        >
          <div class="relative aspect-4/3 w-full shrink-0 overflow-hidden rounded-2xl bg-linear-to-br from-teal-50 to-teal-100">
            <img
              :src="feature.images[activeImage[idx]]"
              alt=""
              class="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105 motion-reduce:transition-none"
              loading="lazy"
              decoding="async"
              width="400"
              height="300"
            />

            <template v-if="feature.images.length > 1">
              <button
                type="button"
                class="absolute left-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-white/85 text-slate-700 shadow transition-colors hover:bg-white"
                aria-label="Предыдущее фото"
                @click.stop="prevImage(idx)"
              >
                <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4">
                  <path d="M12.5 15 7.5 10l5-5" />
                </svg>
              </button>
              <button
                type="button"
                class="absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-white/85 text-slate-700 shadow transition-colors hover:bg-white"
                aria-label="Следующее фото"
                @click.stop="nextImage(idx)"
              >
                <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4">
                  <path d="M7.5 5 12.5 10l-5 5" />
                </svg>
              </button>

              <div class="absolute inset-x-0 bottom-2 flex justify-center gap-1.5">
                <button
                  v-for="(img, imgIdx) in feature.images"
                  :key="img"
                  type="button"
                  class="h-1.5 w-1.5 rounded-full transition-colors"
                  :class="imgIdx === activeImage[idx] ? 'bg-white' : 'bg-white/50'"
                  :aria-label="`Фото ${imgIdx + 1}`"
                  @click.stop="setImage(idx, imgIdx)"
                />
              </div>
            </template>
          </div>

          <div class="flex flex-1 flex-col gap-2.5 px-2 pb-3 pt-4">
            <h3 class="text-lg font-extrabold leading-snug text-slate-900" itemprop="name">{{ feature.title }}</h3>
            <p class="text-sm leading-relaxed text-slate-600" itemprop="description">{{ feature.text }}</p>

            <a
              :href="feature.cta.href"
              class="mt-auto inline-flex w-fit items-center self-start whitespace-nowrap rounded-full border-[1.5px] border-slate-200 bg-white px-5 py-2.5 text-[0.8125rem] font-bold text-slate-900 transition-colors duration-200 ease-out hover:border-teal-500 hover:bg-teal-500 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-500"
              :target="feature.cta.external ? '_blank' : undefined"
              :rel="feature.cta.external ? 'noopener noreferrer' : undefined"
              :aria-label="feature.cta.external
                ? `${feature.cta.label} (открывается в новой вкладке)`
                : undefined"
            >
              {{ feature.cta.label }}
            </a>
          </div>
        </li>
      </ul>

    </div>
  </section>
</template>
