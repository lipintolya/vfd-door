<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import AppSection from '@/components/layout/AppSection.vue'
import AppContainer from '@/components/layout/AppContainer.vue'
import TgIcon from '@/assets/icons/tg-icon.svg'

interface FaqItem {
  id: number
  question: string
  answer: string
}

const faqs: FaqItem[] = [
  { id: 1, question: 'Сколько занимает изготовление?', answer: 'Сроки зависят от проекта и выбранных материалов. Стандартное изготовление занимает от 20 до 45 дней. Для срочных заказов есть возможность сократить срок до 10–15 дней.' },
  { id: 2, question: 'Работаете ли вы с дизайн-проектами?', answer: 'Да, мы работаем с готовыми дизайн-проектами. Подберём решения под ТЗ и предоставим 3D-визуализацию.' },
  { id: 3, question: 'Можно ли заказать замер?', answer: 'Да! Замерщик выезжает по договорённости. Замер бесплатный при дальнейшем заказе.' },
  { id: 4, question: 'Есть ли гарантия на продукцию?', answer: 'Да, гарантия 2 года на продукцию и 1 год на монтаж.' },
  { id: 5, question: 'Можно ли изменить цвет после заказа?', answer: 'Да, до начала производства. После запуска — только за доплату.' },
  { id: 6, question: 'Как происходит монтаж?', answer: 'Монтаж выполняют наши специалисты с опытом. Чисто, аккуратно, по технологии.' },
]

const activeFaqIds = ref<Set<number>>(new Set())

const toggleFaq = (id: number) => {
  const set = activeFaqIds.value
  set.has(id) ? set.delete(id) : set.add(id)
}

/* ============================================
   SCHEMA.ORG JSON-LD
============================================ */
const faqSchema = computed(() => ({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.map(faq => ({
    '@type': 'Question',
    name: faq.question,
    acceptedAnswer: {
      '@type': 'Answer',
      text: faq.answer,
    },
  })),
}))

let scriptElement: HTMLScriptElement | null = null

onMounted(() => {
  scriptElement = document.createElement('script')
  scriptElement.type = 'application/ld+json'
  scriptElement.textContent = JSON.stringify(faqSchema.value)
  document.head.appendChild(scriptElement)
})

onBeforeUnmount(() => {
  if (scriptElement) {
    scriptElement.remove()
  }
})

/* ============================================
   SWIPE HANDLERS
============================================ */
const touchStartY = ref(0)

const handleTouchStart = (e: TouchEvent) => {
  if (!e.touches?.[0]) return
  touchStartY.value = e.touches[0].clientY
}

const handleTouchEnd = (e: TouchEvent, id: number) => {
  if (!e.changedTouches?.[0]) return
  const dy = touchStartY.value - e.changedTouches[0].clientY
  if (Math.abs(dy) > 50) {
    toggleFaq(id)
  }
}
</script>

<template>
  <AppSection size="lg" class="bg-zinc-900">
    <AppContainer>
      <div class="mb-16 text-center">
        <h2 class="text-3xl sm:text-4xl lg:text-5xl font-semibold text-white mb-4 prose-subtitle mx-auto">
          Ответы на вопросы
        </h2>
        <p class="text-base sm:text-lg text-zinc-400 prose-subtitle mx-auto">
          Найдите ответ на ваш вопрос или свяжитесь с нами в Telegram
        </p>
      </div>

      <!-- 8 MARCH GREETING CARD -->
      <div class="w-full max-w-4xl mx-auto mb-16">
        <div class="relative rounded-3xl overflow-hidden border-2 border-pink-300 bg-gradient-to-br from-pink-50 via-rose-50 to-pink-100 shadow-xl">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-0">
            <!-- Image Column -->
            <div class="relative h-64 md:h-auto overflow-hidden">
              <img
                src="https://storage.yandexcloud.net/catalog-vfd/8march/Frame%2021.jpg"
                alt="Поздравление с 8 марта"
                class="w-full h-full object-cover"
                loading="lazy"
              />
              <div class="absolute inset-0 bg-gradient-to-t from-pink-200/30 to-transparent md:hidden" />
            </div>

            <!-- Text Column -->
            <div class="p-6 sm:p-8 lg:p-10 flex flex-col justify-center">
              <h3 class="text-2xl sm:text-3xl font-bold text-pink-700 mb-4">
                Дорогие дамы!
              </h3>
              <p class="text-base sm:text-lg text-pink-900 leading-relaxed mb-4">
                От всей души поздравляем вас с праздником весны — 8 Марта!
              </p>
              <p class="text-sm sm:text-base text-pink-800 leading-relaxed mb-4">
                Желаем вам счастья, здоровья, любви и прекрасного настроения.
                Пусть каждый день приносит радость, улыбки и вдохновение,
                а рядом всегда будут забота, тепло и внимание близких.
              </p>
              <p class="text-lg font-semibold text-pink-700">
                С праздником! 🌷
              </p>
              <p class="text-sm text-pink-600 mt-2">
                Ваш ВФД на Кашириных
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- FAQ BLOCK -->
      <div class="w-full max-w-none sm:max-w-3xl mx-auto space-y-4 mb-12">
        <div
          v-for="item in faqs"
          :key="item.id"
          class="group rounded-2xl border-2 border-zinc-700 bg-zinc-900 hover:border-teal-500 hover:shadow-lg hover:shadow-teal-500/20 overflow-hidden transition-all duration-300"
          @touchstart.passive="handleTouchStart"
          @touchend="handleTouchEnd($event, item.id)"
        >
          <button
            class="w-full flex items-center justify-between px-4 sm:px-6 py-4 text-left hover:bg-zinc-800/50 transition-colors"
            @click="toggleFaq(item.id)"
          >
            <span class="text-base sm:text-lg font-semibold text-white pr-4 wrap-break-word">
              {{ item.question }}
            </span>

            <!-- Стрелка: вниз — закрыто, вверх — открыто -->
            <span
              class="shrink-0 flex items-center justify-center w-6 h-6 text-zinc-400 transition-all duration-300 group-hover:text-teal-400"
              :class="activeFaqIds.has(item.id) ? 'text-teal-400' : ''"
            >
              <svg
                class="w-5 h-5 transition-transform duration-300"
                :class="activeFaqIds.has(item.id) ? '-rotate-180' : 'rotate-0'"
                fill="none"
                stroke="currentColor"
                stroke-width="2.5"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </span>
          </button>

          <transition
            enter-active-class="transition-all duration-300 ease-out"
            leave-active-class="transition-all duration-300 ease-in"
            enter-from-class="opacity-0 -translate-y-2"
            enter-to-class="opacity-100 translate-y-0"
            leave-from-class="opacity-100 translate-y-0"
            leave-to-class="opacity-0 -translate-y-2"
          >
            <div v-if="activeFaqIds.has(item.id)" class="px-4 sm:px-6 pb-4">
              <div class="pt-3 border-t border-zinc-700">
                <p class="text-sm sm:text-base text-zinc-300 leading-relaxed wrap-break-word">
                  {{ item.answer }}
                </p>
              </div>
            </div>
          </transition>
        </div>
      </div>

      <!-- CONTACT CTA BLOCK -->
      <div class="w-full max-w-none sm:max-w-3xl mx-auto p-6 sm:p-8 rounded-3xl border-2 border-teal-600 bg-teal-50 text-center">
        <h3 class="text-xl sm:text-2xl font-semibold text-zinc-900 mb-2">
          Не нашли ответ?
        </h3>
        <p class="text-sm sm:text-base text-zinc-700 mb-6">
          Свяжитесь с нашими менеджерами — мы ответим на ваш вопрос в течение 15 минут
        </p>

        <a
          href="https://t.me/vfddoors74"
          target="_blank"
          rel="noopener noreferrer"
          class="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-teal-600 hover:bg-teal-700 text-white text-sm sm:text-base font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-teal-500/30"
        >
          <img :src="TgIcon" alt="Telegram" class="w-5 h-5" />
          Написать в Telegram
        </a>
      </div>
    </AppContainer>
  </AppSection>
</template>