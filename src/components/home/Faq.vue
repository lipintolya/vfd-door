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
  <section class="faq-section" aria-labelledby="faq-title">
    <div class="container">

      <!-- Header -->
      <header class="faq-header">
        <h2 id="faq-title" class="faq-title">
          Ответы на вопросы
        </h2>

        <p class="faq-lead">
          Короткие ответы на частые вопросы о заказе, доставке и монтаже дверей.
        </p>
      </header>

      <!-- FAQ -->
      <div class="faq-list">
        <div
          v-for="item in faqs"
          :key="item.id"
          class="faq-item"
        >
          <button
            class="faq-button"
            :aria-expanded="openFaqIds.includes(item.id)"
            :aria-controls="`faq-${item.id}`"
            @click="toggleFaq(item.id)"
          >
            <span class="faq-question">
              {{ item.question }}
            </span>

            <span
              class="faq-icon"
              :class="{ open: openFaqIds.includes(item.id) }"
              aria-hidden="true"
            >
              <svg
                class="faq-icon-svg"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </span>
          </button>

          <div
            :id="`faq-${item.id}`"
            v-show="openFaqIds.includes(item.id)"
            class="faq-answer"
          >
            <p>{{ item.answer }}</p>
          </div>
        </div>
      </div>

      <!-- CTA -->
      <div class="faq-cta">
        <h3 class="faq-cta-title">
          Остались вопросы?
        </h3>

        <p class="faq-cta-text">
          Свяжитесь с нами — поможем с выбором и проконсультируем.
        </p>

        <a href="tel:+79000297888" class="btn btn-primary inline-flex items-center gap-2">
          <img src="/svg/w_phone.svg" alt="" class="w-4 h-4 shrink-0" />
          Позвонить
        </a>
      </div>

    </div>
  </section>
</template>

<style scoped>
.faq-section {
  background: #fff;
  padding-block: 4rem;
}

.faq-header {
  margin-bottom: 2.5rem;
  max-width: 52rem;
}

.faq-title {
  font-size: clamp(2rem, 4vw, 3rem);
  font-weight: 800;
  color: #0f172a;
}

.faq-lead {
  margin-top: 0.75rem;
  color: #64748b;
  line-height: 1.6;
}

/* list */
.faq-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

/* item */
.faq-item {
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  overflow: hidden;
}

/* button */
.faq-button {
  width: 100%;
  padding: 1rem 1.25rem;

  display: flex;
  justify-content: space-between;
  align-items: center;

  background: #fff;
  border: none;
  cursor: pointer;

  text-align: left;
  font-weight: 600;
  color: #0f172a;
}

.faq-button:hover {
  background: #f8fafc;
}

/* answer */
.faq-answer {
  padding: 0 1.25rem 1rem;
  color: #475569;
  line-height: 1.6;
}

/* icon */
.faq-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 2.25rem;
  height: 2.25rem;
  border-radius: 0.5rem;
  background: #f0fdfa;
  color: #0d9488;
  transition: background 200ms ease, transform 300ms ease;
}

.faq-icon.open {
  transform: rotate(180deg);
  background: #ccfbf1;
  color: #0d9488;
}

.faq-icon-svg {
  width: 1.25rem;
  height: 1.25rem;
  transition: transform 300ms ease;
}

/* CTA */
.faq-cta {
  margin-top: 3rem;
  padding: 2rem;
  border-radius: 16px;
  background: #f0fdf9;
  border: 1px solid #14b8a6;
  text-align: center;
}

.faq-cta-title {
  font-size: 1.25rem;
  font-weight: 700;
}

.faq-cta-text {
  margin-top: 0.5rem;
  color: #475569;
}

.faq-cta-button {
  margin-top: 1rem;
  display: inline-block;

  padding: 0.75rem 1.25rem;
  border-radius: 10px;

  background: #14b8a6;
  color: white;
  text-decoration: none;

  font-weight: 600;
}

.faq-cta-button:hover {
  background: #0d9488;
}
</style>