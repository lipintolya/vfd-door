<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import AppSection from '@/components/layout/AppSection.vue'
import AppContainer from '@/components/layout/AppContainer.vue'

const router = useRouter()

/* =========================
   Constants
========================= */
const TELEGRAM_URL = 'https://t.me/vfddoors174'
const SLIDER_INTERVAL_MS = 9000 // Интервал авто-переключения слайдов
const HERO_HEIGHT_PX = 520 // Высота hero-секции в пикселях (min-height для grid)

/* =========================
   Types
========================= */
interface Slide {
  id: number
  image: string
  title: string
  subtitle: string
  description: string
  primaryCta?: string
  secondaryCta?: string
}

/* =========================
   Data
   (в prod можно вынести в API)
========================= */
const slides: Slide[] = [
  {
    id: 1,
    image: 'https://storage.yandexcloud.net/catalog-vfd/renders/vfdsalon-1.webp',
    title: 'Двери прямо с фабрики',
    subtitle: 'шоурум с новинками',
    description:
      'Фирменный салон дверей и интерьерных решений на Братьев Кашириных 131Б в Челябинске',
    primaryCta: 'Консультация',
    secondaryCta: 'Каталог',
  },
  {
    id: 2,
    image: 'https://storage.yandexcloud.net/catalog-vfd/renders/innova-1.webp',
    title: 'Серия Innova уже в салоне',
    subtitle: 'не оставляет отпечатков пальцев',
    description: 'Новинка в инновационном покрытии STRONG FLEX',
    primaryCta: 'Узнать больше',
  },
  {
    id: 3,
    image: 'https://storage.yandexcloud.net/catalog-vfd/renders/linea-1.webp',
    title: 'Серия Linea уже в салоне',
    subtitle: 'Современный дизайн по доступной цене',
    description:
      'Светостойкая эмаль с фрезерованными элементами и алюминиевым декором',
    primaryCta: 'Рассчитать стоимость',
  },
]

/* =========================
   Default (TS safety)
========================= */
const defaultSlide: Slide = {
  id: 0,
  image: '',
  title: '',
  subtitle: '',
  description: '',
}

/* =========================
   Slider logic
========================= */
const activeIndex = ref<number>(0)

/* computed гарантированно возвращает Slide (не undefined) */
const currentSlide = computed<Slide>(() => {
  const s = slides[activeIndex.value]
  return s !== undefined ? s : defaultSlide
})

let timer: number | null = null

const next = (): void => {
  activeIndex.value = (activeIndex.value + 1) % slides.length
}

const goTo = (index: number): void => {
  if (index < 0 || index >= slides.length) return
  activeIndex.value = index
  restart()
}

const start = (): void => {
  stop()
  timer = window.setInterval(next, SLIDER_INTERVAL_MS)
}

const stop = (): void => {
  if (timer !== null) {
    clearInterval(timer)
    timer = null
  }
}

const restart = (): void => {
  start()
}

/* =========================
   Navigation handlers
========================= */
const handlePrimaryCta = (): void => {
  const ctaText = currentSlide.value.primaryCta

  if (ctaText === 'Консультация' || ctaText === 'Получить скидку' || ctaText === 'Рассчитать стоимость') {
    window.open(TELEGRAM_URL, '_blank')
  }
}

const handleSecondaryCta = (): void => {
  router.push('/catalog')
}

const navigateAbout = (): void => {
  router.push('/about')
}

const navigatePortfolio = (): void => {
  router.push('/portfolio')
}

const navigatePartitions = (): void => {
  router.push('/partitions')
}


/* lifecycle */
onMounted(() => start())
onUnmounted(() => stop())
</script>

<template>
  <AppSection size="lg">
    <AppContainer>
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8" :style="{ minHeight: HERO_HEIGHT_PX + 'px' }">

        <!-- HERO SLIDER -->
        <div
          class="lg:col-span-7 relative overflow-hidden rounded-3xl min-h-96 sm:min-h-112 lg:h-auto"
          :style="{
            paddingBottom: 'var(--dot-offset)', 
            '--dot-offset': 'clamp(1rem, 5vh, 1.5rem)'
          }"
        >
          <!-- backgrounds -->
          <div class="absolute inset-0">
            <div
              v-for="(slide, i) in slides"
              :key="slide.id"
              class="absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ease-in-out"
              :style="{ backgroundImage: `url(${slide.image})` }"
              :class="i === activeIndex ? 'opacity-100' : 'opacity-0 pointer-events-none'"
              aria-hidden="true"
            />
          </div>

          <!-- overlay for contrast -->
          <div class="absolute inset-0 bg-linear-to-t from-black/70 via-black/40 to-black/16" aria-hidden="true" />

          <!-- content -->
          <div class="relative z-10 flex h-full items-end">
            <div class="p-4 sm:p-6 lg:p-8 max-w-2xl text-white">
              <p class="text-xs uppercase tracking-wider text-white/70 mb-2">
                {{ currentSlide.subtitle }}
              </p>

              <h1 class="text-2xl sm:text-3xl lg:text-4xl font-semibold mb-3 leading-tight">
                {{ currentSlide.title }}
              </h1>

              <p class="text-sm sm:text-base text-white/90 mb-6 max-w-xl">
                {{ currentSlide.description }}
              </p>

              <div class="flex flex-wrap gap-3 mb-8">
                <button
                  v-if="currentSlide.primaryCta"
                  class="ui-button ui-button--primary"
                  type="button"
                  @click="handlePrimaryCta"
                >
                  {{ currentSlide.primaryCta }}
                </button>

                <button
                  v-if="currentSlide.secondaryCta"
                  class="ui-button ui-button--ghost"
                  type="button"
                  @click="handleSecondaryCta"
                >
                  {{ currentSlide.secondaryCta }}
                </button>
              </div>
            </div>
          </div>

          <!-- dots -->
          <div
            class="absolute left-1/2 -translate-x-1/2 z-20 flex gap-2"
            :style="{ bottom: `calc(var(--dot-offset) + env(safe-area-inset-bottom))` }"
            role="tablist"
            aria-label="Навигация слайдера"
          >
            <button
              v-for="(_, i) in slides"
              :key="i"
              @click="goTo(i)"
              :aria-label="`Слайд ${i + 1}`"
              :aria-selected="i === activeIndex"
              class="slider-dot"
              :class="i === activeIndex ? 'slider-dot--active' : 'slider-dot--idle'"
              type="button"
            />
          </div>
        </div>

        <!-- RIGHT BENTO -->
        <div class="lg:col-span-5 grid grid-rows-2 gap-6">
          <!-- Top: Перегородки за 48 часов -->
          <div class="relative overflow-hidden rounded-3xl">
            <div class="absolute inset-0 bg-cover bg-center" style="background-image:url('https://storage.yandexcloud.net/catalog-vfd/slider/slide5.jpg')" />
            <div class="absolute inset-0 bg-linear-to-t from-black/70 via-black/40 to-transparent" />
            <div class="relative z-10 h-full p-6 flex flex-col justify-end text-white">
              <p class="text-xs uppercase tracking-wider text-white/70 mb-1">Дизайнерские решения для вашего интерьера</p>
              <h3 class="text-xl font-semibold mb-2">Алюминиевые перегородки и системы открывания</h3>
              <p class="text-sm text-white/90 mb-4">Изготовление в течение 45 дней после оформления заказа</p>
              <button
                class="ui-button ui-button--primary w-fit"
                type="button"
                @click="navigatePartitions"
              >
                Узнать больше
              </button>
            </div>
          </div>

          <!-- Bottom -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <!-- О компании → /about -->
            <div class="rounded-2xl bg-linear-to-t from-teal-600 to-gray-800 p-6 text-white flex flex-col justify-between">
              <div>
                <p class="text-xs uppercase text-white/60 mb-1">Салон дверей VFD на Кашириных</p>
                <h4 class="font-semibold mb-2">Работаем с 2014 года</h4>
                <p class="text-sm text-white/80">Берём на себя весь процесс — от замера до монтажа.
                Без посредников, ошибок и переделок</p>
              </div>
              <button
                class="ui-button ui-button--primary mt-4"
                type="button"
                @click="navigateAbout"
              >
                Подробнее
              </button>
            </div>

            <!-- Портфолио → /portfolio -->
            <div class="relative overflow-hidden rounded-2xl min-h-48 sm:min-h-56">
              <div class="absolute inset-0 bg-cover bg-center" style="background-image:url('https://storage.yandexcloud.net/catalog-vfd/ourworks/cover-works.webp')" />
              <div class="absolute inset-0 bg-black/50" />
              <div class="relative z-10 h-full p-6 flex flex-col justify-between text-white">
                <div>
                  <p class="text-xs uppercase text-white/70 mb-1">Портфолио</p>
                  <h4 class="font-semibold">Фотоотчёты с объектов</h4>
                  <p class="text-sm text-white/80">Живые фотографии с монтажей, которые помогут определиться с выбором</p>
                </div>
                <button
                  class="ui-button ui-button--primary"
                  type="button"
                  @click="navigatePortfolio"
                >
                  Смотреть
                </button>
              </div>
            </div>
          </div>
        </div>

      </div>
    </AppContainer>
  </AppSection>
</template>

<style scoped>
/* slider dots — аккуратно и без px hacks; размеры адаптивны */
.slider-dot {
  appearance: none;
  border: none;
  padding: 0;
  background: transparent;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
  transition: all 180ms cubic-bezier(0.4,0,0.2,1);
  display: inline-block;
  /* не используем px: используем rem / vw via clamp */
  width: clamp(0.5rem, 2.8vw, 0.6rem);
  height: clamp(0.5rem, 2.8vw, 0.6rem);
  border-radius: 9999px;
  background-color: rgba(255,255,255,0.5);
  box-shadow: 0 1px 2px rgba(0,0,0,0.25);
}

/* active becomes pill on wider screens */
.slider-dot--active {
  background-color: white;
  width: clamp(1.25rem, 6.5vw, 2.5rem); /* pill-like on larger */
  height: clamp(0.4rem, 1.2vw, 0.55rem);
  border-radius: 9999px;
}

/* focus accessibility */
.slider-dot:focus {
  outline: none;
  box-shadow: 0 0 0 3px rgba(255,255,255,0.12), 0 2px 6px rgba(0,0,0,0.35);
}

/* ensure dots are above content but below other fixed UI */
.slider-dot,
.slider-dot--active {
  z-index: 30;
  position: relative;
}
</style>