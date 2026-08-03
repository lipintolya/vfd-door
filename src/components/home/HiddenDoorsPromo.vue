<script setup lang="ts">
import { useScrollReveal } from '../../composables/useScrollReveal'
import { POLOTNO_PRICE_SECRET, TOTAL_SECRET, FRAME_KIT } from '../../data/skrytye-dveri-products'

const COVER_IMAGE = 'https://storage.yandexcloud.net/vfd74ru/Main_page/left_bento/secret_render_cover.webp'

const BENEFITS = [
  'Полностью алюминиевый короб',
  `Алюминиевая кромка в ${FRAME_KIT.colors.length} цветах — чёрный, серебро, золото`,
  'Реверсивный монтаж — направление открывания на выбор',
  'Полотна нестандартной высоты',
  'Грунтованная поверхность — готова под покраску или декоративную отделку',
]

const fmt = (n: number) => `${n.toLocaleString('ru-RU')} ₽`

const { sectionRef, visible } = useScrollReveal(0.15)
</script>

<template>
  <section
    ref="sectionEl"
    class="section bg-white"
    aria-labelledby="hidden-doors-heading"
  >
    <div class="container">
      <div
        class="grid grid-cols-1 overflow-hidden rounded-3xl border border-slate-200 transition-[opacity,transform] duration-700 ease-out motion-reduce:transition-none lg:grid-cols-2"
        :class="visible ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'"
      >
        <!-- Фото — без текста поверх, сама суть продукта в том, что дверь
             сливается со стеной, оверлей только испортил бы впечатление -->
        <div class="relative aspect-4/3 lg:aspect-auto">
          <img
            :src="COVER_IMAGE"
            alt="Скрытая дверь серии «Секрет» — полотно заподлицо со стеной"
            loading="lazy"
            decoding="async"
            width="1672"
            height="941"
            class="absolute inset-0 h-full w-full object-cover"
          />
        </div>

        <!-- Контент -->
        <div class="flex flex-col justify-center gap-5 p-6 sm:p-10">
          <p class="t-eyebrow" aria-hidden="true">Новинка · Скрытый монтаж</p>

          <div>
            <h2 id="hidden-doors-heading" class="text-2xl font-medium leading-tight tracking-tight text-slate-900 md:text-3xl">
              Двери серии «Секрет» — сливаются со стеной
            </h2>
            <p class="mt-3 text-base leading-relaxed text-slate-600">
              Алюминиевый короб заподлицо, без наличников и видимых петель. Полотно в грунте — под покраску, штукатурку или обои в цвет стены.
            </p>
          </div>

          <ul class="flex flex-col gap-2.5" role="list">
            <li v-for="b in BENEFITS" :key="b" class="flex items-start gap-2.5 text-sm leading-snug text-slate-700">
              <svg class="mt-0.5 h-4.5 w-4.5 shrink-0 text-teal-600" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                <circle cx="10" cy="10" r="9" stroke="currentColor" stroke-width="1.5"/>
                <path d="M6.5 10.5l2.2 2.2 4.8-4.8" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              {{ b }}
            </li>
          </ul>

          <div class="flex flex-wrap items-end justify-between gap-4 rounded-2xl bg-slate-50 p-4 sm:p-5">
            <div class="flex flex-col gap-3">
              <div>
                <p class="m-0 text-xs font-semibold uppercase tracking-wide text-slate-400">Полотно</p>
                <p class="m-0 text-xl font-semibold text-ink">{{ fmt(POLOTNO_PRICE_SECRET) }}</p>
              </div>
              <div>
                <p class="m-0 text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Комплект с коробом, скрытыми петлями и магнитным замком Morelli
                </p>
                <p class="m-0 text-xl font-semibold text-ink">от {{ fmt(TOTAL_SECRET) }}</p>
              </div>
            </div>
            <span class="flex items-center gap-1.5 whitespace-nowrap text-xs font-semibold text-emerald-700">
              <span class="h-1.5 w-1.5 rounded-full bg-emerald-500" aria-hidden="true" />
              В наличии в Челябинске
            </span>
          </div>

          <a href="/catalog/skrytye-dveri/" class="btn btn-primary w-fit">
            Смотреть скрытые двери
            <svg class="btn-arrow-icon" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </a>
        </div>
      </div>
    </div>
  </section>
</template>
