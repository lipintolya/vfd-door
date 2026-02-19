<script setup lang="ts">
import { ref } from 'vue'
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

const activeFaqIds = ref<Set<number>>(new Set([1]))

const toggleFaq = (id: number) => {
  const set = activeFaqIds.value
  set.has(id) ? set.delete(id) : set.add(id)
}
</script>

<template>
  <AppSection size="lg" class="bg-zinc-900">
    <AppContainer>
      <div class="mb-16 text-center">
        <h2 class="text-3xl sm:text-4xl lg:text-5xl font-semibold text-white mb-4">
          Ответы на вопросы
        </h2>
        <p class="text-base sm:text-lg text-zinc-400 max-w-2xl mx-auto">
          Найдите ответ на ваш вопрос или свяжитесь с нами в Telegram
        </p>
      </div>

      <!-- FAQ BLOCK -->
      <div class="max-w-3xl mx-auto space-y-4 mb-12">
        <div
          v-for="item in faqs"
          :key="item.id"
          class="group rounded-2xl border-2 border-zinc-700 bg-zinc-900 hover:border-teal-500 hover:shadow-lg hover:shadow-teal-500/20 overflow-hidden transition-all duration-300"
        >
          <button
            class="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-zinc-800/50 transition-colors"
            @click="toggleFaq(item.id)"
          >
            <span class="text-base sm:text-lg font-semibold text-white pr-4">
              {{ item.question }}
            </span>
            <span
              class="shrink-0 flex items-center justify-center w-6 h-6 rounded-full border-2 border-zinc-600 text-zinc-400 transition-all duration-300 group-hover:border-teal-500 group-hover:text-teal-400"
              :class="activeFaqIds.has(item.id) ? 'rotate-45 border-teal-500 text-teal-400 bg-teal-500/10' : ''"
            >
              <svg
                class="w-4 h-4"
                fill="none"
                stroke="currentColor"
                stroke-width="2.5"
                viewBox="0 0 24 24"
              >
                <path
                  v-if="activeFaqIds.has(item.id)"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
                <path
                  v-else
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M12 4v16m8-8H4"
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
            <div v-if="activeFaqIds.has(item.id)" class="px-6 pb-4">
              <div class="pt-3 border-t border-zinc-700">
                <p class="text-sm sm:text-base text-zinc-300 leading-relaxed">
                  {{ item.answer }}
                </p>
              </div>
            </div>
          </transition>
        </div>
      </div>

      <!-- CONTACT CTA BLOCK -->
      <div class="max-w-3xl mx-auto p-8 rounded-3xl border-2 border-teal-600 bg-teal-50 text-center">
        <h3 class="text-2xl font-semibold text-zinc-900 mb-2">
          Не нашли ответ?
        </h3>
        <p class="text-zinc-700 mb-6">
          Свяжитесь с нашими менеджерами — мы ответим на ваш вопрос в течение 15 минут
        </p>
        
        <a
          href="https://t.me/vfddoors74"
          target="_blank"
          rel="noopener noreferrer"
          class="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-teal-600 hover:bg-teal-700 text-white text-base font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-teal-500/30"
        >
          <img :src="TgIcon" alt="Telegram" class="w-5 h-5" />
          Написать в Telegram
        </a>
      </div>
    </AppContainer>
  </AppSection>
</template>

<style scoped>
/* Плавная анимация для раскрытия/закрытия */
.transition-all {
  transition-property: all;
}
</style>