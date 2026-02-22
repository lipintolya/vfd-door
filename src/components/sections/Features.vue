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
  '→ салон Кашириных',
  '→ двери VFD',
  '→ перегородки VFD',
  '→ входные двери',
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
  iconUrl: string
}

const features: Feature[] = [
  {
    id: 1,
    title: 'Двери в наличии',
    text: 'Популярные модели всегда есть на складе в Челябинске.',
    iconUrl: 'https://storage.yandexcloud.net/catalog-vfd/icons/icons-first.svg',
  },
  {
    id: 2,
    title: 'Замер и монтаж',
    text: 'Специалисты с опытом более 20 лет. Аккуратно и без переделок.',
    iconUrl: 'https://storage.yandexcloud.net/catalog-vfd/icons/size%3D24px.svg',
  },
  {
    id: 3,
    title: 'Экспозиция VFD',
    text: 'Крупнейшая экспозиция дверей VFD в Челябинске.',
    iconUrl: 'https://storage.yandexcloud.net/catalog-vfd/icons/icons-third.svg',
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
  <AppSection id="features-section" size="lg" class="bg-zinc-900">
    <AppContainer>
      <div class="space-y-12 sm:space-y-16">

        <!-- Header -->
        <header class="max-w-4xl space-y-4">
          <h2 class="text-3xl sm:text-4xl lg:text-5xl font-semibold text-white leading-tight">
            Почему выбирают
            <span
              :key="currentWord"
              class="inline-block ml-2 text-teal-400 animate-word"
            >
              {{ currentWord }}
            </span>
          </h2>

          <p class="text-base sm:text-lg text-zinc-400 leading-relaxed">
            Помогаем выбрать и установить двери без лишних затрат, ошибок и затянутых сроков.
          </p>
        </header>

        <!-- Features Grid -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          <article
            v-for="(feature, idx) in features"
            :key="feature.id"
            class="group relative"
            :class="visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'"
            :style="visible ? { transitionDelay: `${idx * 120}ms`, transition: 'opacity 600ms ease-out, transform 600ms ease-out' } : {}"
          >
            <div class="relative h-full rounded-2xl sm:rounded-3xl overflow-hidden bg-zinc-700 border border-teal-700/50 md:border-zinc-800 shadow-2xl shadow-teal-900/30 transition-all duration-500">

              <!-- Teal glow on top - always visible on mobile -->
              <div class="absolute top-0 left-0 right-0 h-1 bg-linear-to-r from-transparent via-teal-500 to-transparent opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-500" />

              <!-- Subtle teal corner accent - always visible on mobile -->
              <div class="absolute top-0 right-0 w-20 h-20 bg-linear-to-bl from-teal-500/10 to-transparent rounded-bl-full opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-700" />

              <div class="relative h-full p-6 sm:p-8">
                <!-- Icon Container -->
                <div
                  class="mb-5 sm:mb-6 w-14 h-14 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl flex items-center justify-center transition-all duration-500 relative overflow-hidden bg-teal-700 md:bg-teal-950/80 md:group-hover:bg-teal-700 shadow-lg shadow-teal-500/40 md:shadow-none md:group-hover:shadow-lg md:group-hover:shadow-teal-500/40"
                >
                  <!-- Teal glow overlay - always visible on mobile -->
                  <div
                    class="absolute inset-0 bg-linear-to-br from-teal-400/20 to-transparent md:from-teal-500/10 md:group-hover:from-teal-400/20 transition-all duration-500"
                  />
                  <img
                    v-if="feature.iconUrl"
                    :src="feature.iconUrl"
                    :alt="feature.title"
                    class="w-7 h-7 sm:w-8 sm:h-8 object-contain relative z-10"
                    loading="lazy"
                    decoding="async"
                  />
                </div>

                <!-- Content -->
                <div class="space-y-2.5 sm:space-y-3">
                  <h3 class="text-lg sm:text-xl font-semibold text-white">
                    {{ feature.title }}
                  </h3>

                  <p class="text-sm sm:text-base text-zinc-200 md:text-zinc-300 leading-relaxed">
                    {{ feature.text }}
                  </p>
                </div>

                <!-- Teal underline accent - always visible on mobile -->
                <div class="mt-5 sm:mt-6 h-0.5 w-16 md:w-0 md:group-hover:w-16 rounded-full transition-all duration-700 ease-out bg-linear-to-r from-teal-500 to-teal-400" />
              </div>
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
