<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import AppSection from '@/components/layout/AppSection.vue'
import AppContainer from '@/components/layout/AppContainer.vue'

/* ----------------------------
   Visibility
----------------------------- */
const visible = ref(false)
let observer: IntersectionObserver | null = null

/* ----------------------------
   Rotating text (SEO + UX)
----------------------------- */
const words = [
  '→ салон дверей на Кашириных?',
  '→ межкомнатные двери VFD?',
  '→ входные двери VFD?',
  '→ перегородки VFD?',
]

const currentWord = ref(words[0])
let wordIndex = 0
let wordInterval: number | null = null

const startWordAnimation = () => {
  if (wordInterval !== null) return
  wordInterval = window.setInterval(() => {
    wordIndex = (wordIndex + 1) % words.length
    currentWord.value = words[wordIndex]
  }, 2800)
}

const stopWordAnimation = () => {
  if (wordInterval === null) return
  clearInterval(wordInterval)
  wordInterval = null
}

/* ----------------------------
   Features data
----------------------------- */
interface Feature {
  id: number
  title: string
  text: string
  iconUrl: string // URL to SVG icon (Yandex CDN)
  accentColor: string // teal, slate, etc
}

const features: Feature[] = [
  {
    id: 1,
    title: 'Двери в наличии',
    text: 'Популярные модели всегда есть на складе в Челябинске. Заказ и получение без долгого ожидания.',
    iconUrl: 'https://storage.yandexcloud.net/catalog-vfd/icons/verified.svg', 
    accentColor: 'teal',
  },
  {
    id: 2,
    title: 'Точный замер и монтаж',
    text: 'Замер и установка выполняются специалистами с опытом более 20 лет. Аккуратно и без переделок.',
    iconUrl: 'https://storage.yandexcloud.net/catalog-vfd/icons/handyman.svg', 
    accentColor: 'slate',
  },
  {
    id: 3,
    title: 'Экспозиция VFD',
    text: 'Одна из крупнейших экспозиций дверей VFD в Челябинске. Можно выбрать модель вживую.',
    iconUrl: 'https://storage.yandexcloud.net/catalog-vfd/icons/store_mall_directory.svg', 
    accentColor: 'teal',
  },
]

/* ----------------------------
   Intersection Observer
   ----------------------------- */
onMounted(() => {
  const el = document.getElementById('features-section')
  if (!el) return

  observer = new IntersectionObserver(
    ([entry]) => {
      if (entry?.isIntersecting) {
        visible.value = true
        startWordAnimation()
      } else {
        stopWordAnimation()
      }
    },
    { threshold: 0.25 }
  )

  observer.observe(el)
})

onBeforeUnmount(() => {
  stopWordAnimation()
  observer?.disconnect()
})
</script>

<template>
  <AppSection id="features-section" size="lg" class="bg-white">
    <AppContainer>
      <div class="space-y-16">

        <!-- Header -->
        <header class="max-w-4xl space-y-4">
          <h2 class="text-3xl sm:text-4xl lg:text-5xl font-semibold text-gray-900 leading-tight">
            Почему выбирают
            <span
              :key="currentWord"
              class="inline-block ml-2 text-teal-600 animate-word"
            >
              {{ currentWord }}
            </span>
          </h2>

          <p class="text-base sm:text-lg text-gray-600 leading-relaxed">
            Помогаем выбрать и установить двери без лишних затрат, ошибок и затянутых сроков.
          </p>
        </header>

        <!-- Features Grid -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <article
            v-for="(feature, idx) in features"
            :key="feature.id"
            class="group relative"
            :class="visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'"
            :style="visible ? { transitionDelay: `${idx * 120}ms`, transition: 'opacity 600ms ease-out, transform 600ms ease-out' } : {}"
          >
            <!-- Card Background with gradient border effect -->
            <div class="relative h-full rounded-3xl border border-gray-200 bg-white/50 backdrop-blur-sm p-8 transition-all duration-500 ease-out hover:border-gray-300 hover:bg-white hover:shadow-lg">

              <!-- Icon Container with animated glow -->
              <div
                class="mb-6 w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-500 relative overflow-hidden"
                :class="feature.accentColor === 'teal' 
                  ? 'bg-teal-100 group-hover:bg-teal-500 group-hover:shadow-lg group-hover:shadow-teal-200' 
                  : 'bg-slate-100 group-hover:bg-slate-500 group-hover:shadow-lg group-hover:shadow-slate-200'"
              >
                <img 
                  v-if="feature.iconUrl" 
                  :src="feature.iconUrl" 
                  :alt="feature.title"
                  class="w-8 h-8 object-contain"
                  loading="lazy"
                  decoding="async"
                />
              </div>

              <!-- Content -->
              <div class="space-y-3">
                <h3 class="text-xl font-semibold text-gray-900 transition-colors duration-300">
                  {{ feature.title }}
                </h3>

                <p class="text-sm sm:text-base text-gray-600 leading-relaxed">
                  {{ feature.text }}
                </p>
              </div>

              <!-- Animated underline accent -->
              <div class="mt-6 h-1 w-0 rounded-full transition-all duration-700 ease-out group-hover:w-8"
                :class="feature.accentColor === 'teal' ? 'bg-linear-to-r from-teal-500 to-teal-300' : 'bg-linear-to-r from-slate-500 to-slate-300'"
              />
            </div>
          </article>
        </div>

      </div>
    </AppContainer>
  </AppSection>
</template>

<style scoped>
@keyframes wordFade {
  0% { opacity: 0; transform: translateY(6px); }
  100% { opacity: 1; transform: translateY(0); }
}

.animate-word {
  animation: wordFade 0.45s ease-out;
}

@media (prefers-reduced-motion: reduce) {
  .animate-word { animation: none; }
}
</style>