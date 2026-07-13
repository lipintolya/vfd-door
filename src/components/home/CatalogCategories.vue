<script setup lang="ts">
import { ref } from 'vue'
import { useScrollReveal } from '../../composables/useScrollReveal'

interface Category {
  title:    string
  subtitle: string
  image:    string
  /** Доп. фото для тайла — если есть, показывается мини-переключатель (как в CoverSwitcher) */
  images?:  string[]
  href:     string
  cta:      string
}

const URBAN_CDN = 'https://storage.yandexcloud.net/vfd74ru/Main_page/left_bento/'
const URBAN_IMAGES = [
  `${URBAN_CDN}render_urban2.webp`,
  `${URBAN_CDN}urban2_1.webp`,
  `${URBAN_CDN}detail_urban2.webp`,
]

const CATEGORIES: Category[] = [
  {
    title:    'Урбан — городской стиль для вашего интерьера',
    subtitle: 'Двери от 18 000 ₽ за комплект',
    image:    URBAN_IMAGES[0]!,
    images:   URBAN_IMAGES,
    href:     '/models/urban-2gr-urban-a2d505/',
    cta:      'Смотреть модель',
  },
  {
    title:    'Входные двери',
    subtitle: 'Уличные и подъездные модели для частных домов и квартир',
    image:    'https://storage.yandexcloud.net/catalog-vfd/catalog_preview/catalog-preview2.webp',
    href:     '/catalog?series=innova',
    cta:      'Смотреть входные',
  },
  {
    title:    'Алюминиевые перегородки',
    subtitle: 'Стеклянные перегородки с алюминиевым профилем для квартир, домов, офисов — под ключ в течение 45 дней. Нестандартные решения по вашим чертежам и эскизам',
    image:    'https://storage.yandexcloud.net/catalog-vfd/catalog_preview/catalog-preview3.webp',
    href:     '/partitions',
    cta:      'Смотреть перегородки',
  },
]

const { sectionRef, visible } = useScrollReveal(0.15)

/* Мини-переключатель фото у героя-тайла (Урбан) */
const heroImageIdx = ref(0)
</script>

<template>
  <section
    ref="sectionEl"
    class="section bg-white"
    aria-labelledby="cat-heading"
  >
    <div class="container">

      <!-- ── Header ── -->
      <header
        class="mb-10 max-w-3xl transition-[opacity,transform] duration-700 ease-out motion-reduce:transition-none md:mb-16"
        :class="visible ? 'translate-y-0 opacity-100' : 'translate-y-5 opacity-0'"
      >
        <p class="mb-3 text-xs font-extrabold uppercase tracking-widest text-teal-600">
          Что мы предлагаем
        </p>
        <h2 id="cat-heading" class="text-3xl font-extrabold leading-tight tracking-tight text-slate-900 md:text-5xl">
          Каталог
        </h2>
        <p class="mt-4 text-base leading-relaxed text-slate-600 md:text-lg">
          Межкомнатные и входные двери, алюминиевые перегородки
          от официального дилера Владимирской фабрики дверей
        </p>
      </header>

      <!-- ── Bento grid ── -->
      <div
        class="grid grid-cols-1 items-stretch gap-4 md:grid-cols-2 lg:grid-cols-[1fr_2fr] lg:gap-5"
        role="list"
      >

        <!-- Hero card — Урбан -->
        <article
          class="relative overflow-hidden rounded-3xl transition-[opacity,transform] duration-[600ms] ease-out motion-reduce:transition-none"
          :class="visible ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'"
          :style="{ transitionDelay: visible ? '0ms' : '0ms' }"
          role="listitem"
        >
          <a
            :href="CATEGORIES[0]!.href"
            class="group relative flex h-full min-h-80 flex-col overflow-hidden rounded-3xl no-underline md:min-h-[420px] lg:min-h-[540px] focus-visible:outline-2 focus-visible:outline-teal-500 focus-visible:outline-offset-3"
            :aria-label="CATEGORIES[0]!.title"
          >
            <!-- Background — кроссфейд между рендерами -->
            <div class="absolute inset-0" aria-hidden="true">
              <img
                v-for="(img, i) in CATEGORIES[0]!.images ?? [CATEGORIES[0]!.image]"
                :key="img"
                :src="img"
                alt=""
                class="absolute inset-0 h-full w-full object-cover opacity-0 transition-[opacity,transform] duration-[600ms] ease-out group-hover:scale-[1.04] motion-reduce:transition-none"
                :class="{ 'opacity-100': i === heroImageIdx }"
                loading="eager"
                decoding="async"
              />
            </div>
            <!-- Overlay -->
            <div
              class="absolute inset-0 bg-gradient-to-t from-black/75 via-slate-900/25 to-transparent"
              aria-hidden="true"
            />
            <!-- Content -->
            <div class="relative z-10 mt-auto flex flex-col gap-4 p-5 sm:p-8">
              <div class="flex flex-col gap-2">
                <h3 class="text-xl font-extrabold leading-snug text-white">{{ CATEGORIES[0]!.title }}</h3>
                <p class="max-w-md text-sm leading-relaxed text-white/80">{{ CATEGORIES[0]!.subtitle }}</p>
              </div>
              <span
                class="inline-flex items-center gap-1.5 self-start whitespace-nowrap rounded-full border border-white/50 px-4 py-2 text-[0.8125rem] font-bold text-white transition-[background-color,border-color,transform] duration-200 ease-out group-hover:-translate-y-px group-hover:border-white group-hover:bg-white/15"
                aria-hidden="true"
              >
                {{ CATEGORIES[0]!.cta }}
                <svg class="h-3.5 w-3.5 shrink-0 transition-transform duration-200 ease-out group-hover:translate-x-0.5" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                  <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </span>
            </div>
          </a>

          <!-- Мини-переключатель рендеров — вне <a>, чтобы не вкладывать button в ссылку -->
          <div
            v-if="(CATEGORIES[0]!.images?.length ?? 0) > 1"
            class="pointer-events-none absolute right-5 top-5 z-20 flex gap-1.5 sm:right-8 sm:top-8"
            role="group"
            aria-label="Выбрать фото модели Урбан"
          >
            <button
              v-for="(img, i) in CATEGORIES[0]!.images"
              :key="img"
              type="button"
              class="pointer-events-auto h-2 w-2 rounded-full border border-white/70 transition-colors duration-200"
              :class="i === heroImageIdx ? 'bg-white' : 'bg-white/25 hover:bg-white/60'"
              :aria-label="`Фото ${i + 1}`"
              :aria-pressed="i === heroImageIdx"
              @click.stop.prevent="heroImageIdx = i"
            />
          </div>
        </article>

        <!-- Right column — 2 cards -->
        <div class="grid gap-4 md:grid-rows-2 lg:gap-5" role="list">
          <article
            v-for="(cat, idx) in CATEGORIES.slice(1)"
            :key="cat.href"
            class="overflow-hidden rounded-3xl transition-[opacity,transform] duration-[600ms] ease-out motion-reduce:transition-none"
            :class="visible ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'"
            :style="{ transitionDelay: visible ? `${(idx + 1) * 130}ms` : '0ms' }"
            role="listitem"
          >
            <a
              :href="cat.href"
              class="group relative flex h-full min-h-56 flex-col overflow-hidden rounded-3xl no-underline md:min-h-[200px] lg:min-h-[255px] focus-visible:outline-2 focus-visible:outline-teal-500 focus-visible:outline-offset-3"
              :aria-label="cat.title"
            >
              <!-- Background -->
              <div
                class="absolute inset-0 bg-cover bg-center transition-transform duration-[600ms] ease-out group-hover:scale-[1.04] motion-reduce:transition-none"
                :style="{ backgroundImage: `url(${cat.image})` }"
                aria-hidden="true"
              />
              <!-- Overlay -->
              <div
                class="absolute inset-0 bg-gradient-to-t from-black/75 via-slate-900/25 to-transparent"
                aria-hidden="true"
              />
              <!-- Content -->
              <div class="relative z-10 mt-auto flex flex-col gap-3 p-5 sm:p-6">
                <div class="flex flex-col gap-1.5">
                  <h3 class="text-lg font-extrabold leading-snug text-white">{{ cat.title }}</h3>
                  <p class="max-w-md text-sm leading-relaxed text-white/80">{{ cat.subtitle }}</p>
                </div>
                <span
                  class="inline-flex items-center gap-1.5 self-start whitespace-nowrap rounded-full border border-white/50 px-4 py-2 text-[0.8125rem] font-bold text-white transition-[background-color,border-color,transform] duration-200 ease-out group-hover:-translate-y-px group-hover:border-white group-hover:bg-white/15"
                  aria-hidden="true"
                >
                  {{ cat.cta }}
                  <svg class="h-3.5 w-3.5 shrink-0 transition-transform duration-200 ease-out group-hover:translate-x-0.5" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                    <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </span>
              </div>
            </a>
          </article>
        </div>

      </div>
    </div>
  </section>
</template>
