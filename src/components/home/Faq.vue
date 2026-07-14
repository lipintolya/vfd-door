<script setup lang="ts">
import { ref } from 'vue'
import { faqs } from './faq-data'

const openFaqIds = ref<number[]>([])

const toggleFaq = (id: number) => {
  openFaqIds.value = openFaqIds.value.includes(id)
    ? openFaqIds.value.filter(i => i !== id)
    : [...openFaqIds.value, id]
}
</script>

<template>
  <section class="section bg-white" aria-labelledby="faq-title">
    <div class="container">

      <!-- Header -->
      <header class="mb-10 max-w-3xl">
        <h2 id="faq-title" class="text-3xl font-medium leading-tight tracking-tight text-slate-900 md:text-5xl">
          Ответы на вопросы
        </h2>
        <p class="mt-4 text-base leading-relaxed text-slate-600 md:text-lg">
          Короткие ответы на частые вопросы о заказе, доставке и монтаже дверей.
        </p>
      </header>

      <!-- FAQ list -->
      <div class="flex flex-col gap-3">
        <div
          v-for="item in faqs"
          :key="item.id"
          class="overflow-hidden rounded-xl border border-slate-200"
        >
          <button
            class="flex w-full cursor-pointer items-center justify-between bg-white p-4 text-left font-semibold text-slate-900 hover:bg-slate-50 sm:p-5"
            :aria-expanded="openFaqIds.includes(item.id)"
            :aria-controls="`faq-${item.id}`"
            @click="toggleFaq(item.id)"
          >
            <span class="text-base font-semibold leading-snug">{{ item.question }}</span>
            <span
              class="ml-4 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-teal-50 text-teal-600 transition-[background-color,transform] duration-200"
              :class="openFaqIds.includes(item.id) ? 'rotate-180 bg-teal-100' : ''"
              aria-hidden="true"
            >
              <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </span>
          </button>

          <div
            :id="`faq-${item.id}`"
            v-show="openFaqIds.includes(item.id)"
            class="px-4 pb-4 text-sm leading-relaxed text-slate-600 sm:px-5"
          >
            <p>{{ item.answer }}</p>
          </div>
        </div>
      </div>

      <!-- CTA -->
      <div class="mt-12 rounded-2xl border border-teal-500 bg-teal-50 p-6 text-center sm:p-8">
        <h3 class="text-xl font-bold text-slate-900">
          Остались вопросы?
        </h3>
        <p class="mt-2 text-slate-600">
          Свяжитесь с нами — поможем с выбором и проконсультируем.
        </p>
        <a
          href="https://t.me/vfddoors74"
          target="_blank"
          rel="noopener"
          class="btn btn-primary mt-5 inline-flex"
        >
          Написать в Telegram
        </a>
      </div>

    </div>
  </section>
</template>
