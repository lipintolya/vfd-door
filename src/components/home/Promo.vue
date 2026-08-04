<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useScrollReveal } from '../../composables/useScrollReveal'

/* ============================================================
   Types
   ============================================================ */
interface Promo {
  id: number
  title: string
  subtitle: string
  description: string
  image: string
  ctaText?: string
  ctaLink?: string
  discount?: string
  validUntil: string
}

/* ============================================================
   Props — данные передаются из Astro (серверный рендер = SEO)
   ============================================================ */
const props = withDefaults(defineProps<{
  promos?: Promo[]
}>(), {
  promos: () => [
    {
      id: 1,
      title: 'Бесплатный замер',
      subtitle: 'По Челябинску, при оформлении заказа',
      description:
        'Выезд замерщика по Челябинску — бесплатно при заказе межкомнатных дверей в нашем салоне на Братьев Кашириных. Гарантируем точность замеров и расчёт без лишних позиций.',
      image: 'https://storage.yandexcloud.net/vfd74ru/sale/zamer_render.webp',
      ctaText: 'Подробнее',
      ctaLink: '/contacts',
      discount: 'Бесплатно',
      validUntil: '2026-12-31',
    },
  ]
})

/* ============================================================
   Date helpers
   ============================================================ */
const parseLocalDate = (dateStr: string): Date => {
  const [year, month, day] = dateStr.split('-').map(Number)
  return new Date(year, (month || 1) - 1, day || 1)
}

const isPromoActive = (validUntil: string): boolean => {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const deadline = parseLocalDate(validUntil)
  deadline.setHours(23, 59, 59, 999)
  return today <= deadline
}

const getDaysLeft = (validUntil: string): number => {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const deadline = parseLocalDate(validUntil)
  deadline.setHours(0, 0, 0, 0)
  const diffDays = Math.ceil((deadline.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
  return Math.max(0, diffDays)
}

const formatDate = (dateStr: string): string => {
  return parseLocalDate(dateStr).toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

/* ============================================================
   Computed & State
   ============================================================ */
const activePromos = computed(() => props.promos.filter(p => isPromoActive(p.validUntil)))

/* Число дней "осталось" зависит от new Date() — на сервере это момент сборки,
   у клиента момент захода на сайт, обычно разные дни. Если считать прямо в
   шаблоне, первый клиентский рендер (хайдрейшн) не совпадёт с серверным —
   Vue ругается "Hydration completed but contains mismatches". Показываем
   плейсхолдер, пока не смонтировались, тогда серверный и первый клиентский
   рендер идентичны — а разница появляется уже после хайдрейшна, как обычное
   реактивное обновление, а не расхождение. */
const clientReady = ref(false)
onMounted(() => { clientReady.value = true })

const { sectionRef, visible } = useScrollReveal(0.1)
</script>

<template>
  <section
    ref="sectionEl"
    class="section bg-white"
    aria-labelledby="promo-heading"
  >
    <div class="container">

      <!-- ── Header ── -->
      <header
        class="mx-auto mb-10 max-w-3xl text-center transition-[opacity,transform] duration-700 ease-out motion-reduce:transition-none md:mb-16"
        :class="visible ? 'translate-y-0 opacity-100' : 'translate-y-5 opacity-0'"
      >
        <p class="t-eyebrow mb-3">
          Специальные предложения
        </p>
        <h2 id="promo-heading" class="text-3xl font-medium leading-tight tracking-tight text-slate-900 md:text-5xl">
          Акции и специальные предложения
        </h2>
        <p class="mt-3 text-sm font-semibold uppercase tracking-wide text-teal-600">
          Только в салоне ВФД на Кашириных
        </p>
        <p class="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-slate-600 md:text-lg">
          Получите лучшие условия для вашего заказа — следите за нашими акциями
          и не упустите возможность сэкономить
        </p>
      </header>

      <!-- ── Empty state ── -->
      <div v-if="activePromos.length === 0" class="py-20 text-center bg-gray-50 rounded-3xl">
        <p class="text-lg text-gray-500">Нет активных акций. Следите за обновлениями 👀</p>
      </div>

      <!-- ── Promos grid — карточка целиком кликабельна и сразу показывает
           всё описание (без аккордеона): раньше нужно было сначала раскрыть
           карточку кликом, потом ещё раз кликнуть по кнопке внутри — два
           клика до сути и до CTA. Теперь как остальные карточки на сайте
           (SeriesCard/Reviews/CatalogProductCard) — обычная ссылка. ── -->
      <ul
        v-else
        class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 list-none p-0 m-0"
        role="list"
      >
        <li
          v-for="(promo, index) in activePromos"
          :key="promo.id"
        >
          <a
            :href="promo.ctaLink || '#'"
            class="group flex h-full flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white no-underline transition-[opacity,transform,border-color,box-shadow] duration-600 ease-out hover:border-teal-400 hover:shadow-lg focus-visible:outline-2 focus-visible:outline-teal-500 focus-visible:outline-offset-2 motion-reduce:transition-none"
            :class="visible ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'"
            :style="{ transitionDelay: visible ? `${index * 100}ms` : '0ms' }"
          >
            <!-- Image -->
            <div class="relative h-72 w-full overflow-hidden bg-gray-100">
              <img
                :src="promo.image"
                :alt="promo.title"
                loading="lazy"
                decoding="async"
                width="600"
                height="288"
                class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />

              <!-- Discount badge -->
              <span
                v-if="promo.discount"
                class="absolute top-3 right-3 bg-teal-600 text-white px-3 py-1.5 rounded-lg text-sm font-semibold shadow-sm"
                :aria-label="`Скидка: ${promo.discount}`"
              >
                {{ promo.discount }}
              </span>

              <!-- Days left badge — считается от new Date(), см. clientReady выше -->
              <span
                v-if="clientReady"
                class="absolute bottom-3 left-3 bg-white/95 text-gray-900 px-3 py-1.5 rounded-lg text-xs font-semibold shadow-sm"
                :aria-label="`Осталось ${getDaysLeft(promo.validUntil)} дней`"
              >
                {{ getDaysLeft(promo.validUntil) }} дн.
              </span>
            </div>

            <!-- Content -->
            <div class="p-5 sm:p-6 flex flex-col flex-1">
              <h3 class="text-lg font-semibold text-gray-900 line-clamp-2">{{ promo.title }}</h3>
              <p class="text-sm text-teal-600 font-medium mt-1 mb-3">{{ promo.subtitle }}</p>
              <p class="text-sm text-gray-600 leading-relaxed">{{ promo.description }}</p>

              <!-- Footer -->
              <div class="flex justify-between items-center mt-auto pt-4 border-t border-gray-100">
                <time
                  :datetime="promo.validUntil"
                  class="text-xs text-gray-500"
                >
                  До {{ formatDate(promo.validUntil) }}
                </time>

                <span
                  v-if="promo.ctaText"
                  class="inline-flex items-center gap-1 text-sm font-semibold text-teal-600 transition-transform group-hover:translate-x-0.5"
                >
                  {{ promo.ctaText }}
                  <svg class="h-3.5 w-3.5 shrink-0" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                    <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" />
                  </svg>
                </span>
              </div>
            </div>
          </a>
        </li>
      </ul>

    </div>
  </section>
</template>
