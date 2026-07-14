<script setup lang="ts">
import { ref, computed, nextTick, onMounted, onUnmounted, useTemplateRef } from 'vue'
import { getSkin, type EntranceDoorModel } from '../../data/entrance-doors'
import { companyLegalInfo } from '../../lib/contacts-data'

const props = defineProps<{
  model: EntranceDoorModel
}>()

const phone = companyLegalInfo.contacts.phone[0]!

/* Мессенджеры — те же иконки/ссылки, что в шапке сайта (Header.vue SOCIAL_NETWORKS) */
const SOCIAL_NETWORKS = [
  { name: 'VK',       label: 'ВКонтакте', url: 'https://vk.com/vfddoors74',              icon: '/svg/b_vk_logo.svg' },
  { name: 'Telegram', label: 'Telegram',   url: 'https://t.me/vfddoors74',                icon: '/svg/b_tg_logo.svg' },
  { name: 'MAX',      label: 'Max',        url: 'https://max.ru/id452402308842_biz',      icon: '/svg/b_max_logo.svg' },
] as const

const view = ref<'outside' | 'inside'>('outside')
const selectedIdx = ref(0)

const selectedOption = computed(() => props.model.skinOptions[selectedIdx.value]!)
const selectedSkin   = computed(() => getSkin(selectedOption.value.skinId))
const currentPrice   = computed(() => selectedOption.value.price)

const formatPrice = (price: number) => `${price.toLocaleString('ru-RU')} ₽`

/* Готовое сообщение в Telegram — модель, накладка и цена уже в тексте,
   не нужно печатать это самому при переходе */
const telegramHref = computed(() => {
  const skinPart = selectedSkin.value ? `, накладка ${selectedSkin.value.name} ${selectedSkin.value.color}` : ''
  const text = `Здравствуйте! Хочу узнать про дверь «${props.model.name}»${skinPart} — ${formatPrice(currentPrice.value)}`
  return `https://t.me/vfddoors74?text=${encodeURIComponent(text)}`
})

/* Накладки — двухшаговый выбор (сначала модель — Niuta, ER 1, Atum Pro 28…,
   потом цвет внутри модели). 37 вариантов плоским списком — стена на весь
   экран. Ряды переносятся (flex-wrap), а не скроллятся — скрытый
   overflow-x без видимого скролл-бара недостижим мышью/тачем. */
interface SkinItem { idx: number; skin: NonNullable<ReturnType<typeof getSkin>>; price: number }
interface SkinGroup { name: string; items: SkinItem[] }

const groupedSkins = computed<SkinGroup[]>(() => {
  const groups = new Map<string, SkinGroup>()
  props.model.skinOptions.forEach((opt, idx) => {
    const skin = getSkin(opt.skinId)
    if (!skin) return
    const group = groups.get(skin.name) ?? { name: skin.name, items: [] }
    group.items.push({ idx, skin, price: opt.price })
    groups.set(skin.name, group)
  })
  return [...groups.values()]
})

const activeGroup = computed(() =>
  groupedSkins.value.find(g => g.name === selectedSkin.value?.name) ?? groupedSkins.value[0]
)

/* View Transitions API — плавная смена фото/цены при выборе накладки,
   вместо резкого скачка. Не поддерживается — просто применяем состояние
   как раньше, ничего не ломается (progressive enhancement). */
const withViewTransition = (apply: () => void) => {
  const doc = document as Document & { startViewTransition?: (cb: () => void | Promise<void>) => void }
  if (typeof doc.startViewTransition === 'function') {
    doc.startViewTransition(async () => {
      apply()
      await nextTick()
    })
  } else {
    apply()
  }
}

const selectSeries = (group: SkinGroup) => {
  withViewTransition(() => {
    selectedIdx.value = group.items[0]!.idx
    view.value = 'inside'
  })
}
const selectColor = (idx: number) => {
  withViewTransition(() => {
    selectedIdx.value = idx
    view.value = 'inside'
  })
}
const selectView = (v: 'outside' | 'inside') => {
  withViewTransition(() => { view.value = v })
}

/* Свайп по фото переключает "Снаружи"/"Изнутри" — на мобиле от фото
   ожидают жест пальцем, не только тап по табам */
const SWIPE_THRESHOLD = 40
let touchStartX = 0
let touchStartY = 0

const onPhotoTouchStart = (e: TouchEvent) => {
  if (!e.touches[0]) return
  touchStartX = e.touches[0].clientX
  touchStartY = e.touches[0].clientY
}
const onPhotoTouchEnd = (e: TouchEvent) => {
  if (!e.changedTouches[0]) return
  const dx = touchStartX - e.changedTouches[0].clientX
  const dy = touchStartY - e.changedTouches[0].clientY
  if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > SWIPE_THRESHOLD) {
    selectView(dx > 0 ? 'inside' : 'outside')
  }
}

/* Характеристики и фурнитура — за аккордеоном, свёрнуты по умолчанию.
   Вынесены ЗА ПРЕДЕЛЫ грида фото+инфо (см. ниже) — иначе раскрытие
   аккордеона растягивает grid-row и тянет фото-карточку вниз/вширь. */
type InfoTab = 'specs' | 'hardware'
const infoTab = ref<InfoTab | null>(null)
const toggleTab = (tab: InfoTab) => { infoTab.value = infoTab.value === tab ? null : tab }

/* Sticky CTA на мобиле — как только основной блок CTA уходит за пределы
   экрана (пользователь читает характеристики ниже), внизу появляется
   компактная панель с ценой и кнопкой, чтобы не скроллить обратно вверх */
const ctaRef = useTemplateRef<HTMLDivElement>('ctaRef')
const ctaInView = ref(true)
let ctaObserver: IntersectionObserver | null = null

onMounted(() => {
  if (!ctaRef.value || typeof IntersectionObserver === 'undefined') return
  ctaObserver = new IntersectionObserver(
    ([entry]) => {
      if (!entry) return
      // isIntersecting=false бывает в двух случаях: CTA ещё не долистали
      // (внизу экрана) или уже проскроллили мимо (выше экрана) — sticky-бар
      // нужен только во втором случае, иначе он всплывает на входе в карточку.
      ctaInView.value = entry.isIntersecting || entry.boundingClientRect.top > 0
    },
    { threshold: 0 }
  )
  ctaObserver.observe(ctaRef.value)
})
onUnmounted(() => ctaObserver?.disconnect())
</script>

<template>
  <div class="flex flex-col gap-5">

    <!-- ── Фото+инфо. Колонки выравниваются по верху: высоту фото задаёт
         его собственная пропорция, а не длина текста в соседней колонке. ── -->
    <div class="flex flex-col gap-5 md:grid md:grid-cols-[340px_1fr] md:items-start md:gap-10">

      <!-- Фото. Бокс держит пропорцию накладок (699×1500 = 7:15) — их 37 из 39,
           они заполняют его пиксель в пиксель. Два фото самих дверей чуть шире
           (0.49 и 0.525), поэтому object-contain, а не cover: cover срезал бы у
           них ~9% ширины, а у этих кадров петли и кромка короба стоят вплотную
           к краю — срезается именно они. Contain просто центрирует их чуть
           меньшего размера. Подложки у бокса нет: при contain она вылезла бы
           серыми полосками по краям — фон остаётся только под заглушкой.
           На мобиле бокс сужен: 7:15 во всю ширину экрана — это ~750px высоты,
           цена и CTA уехали бы за первый экран. -->
      <div
        class="relative mx-auto aspect-7/15 w-[62%] max-w-70 overflow-hidden rounded-2xl md:mx-0 md:w-full md:max-w-none"
        @touchstart.passive="onPhotoTouchStart"
        @touchend="onPhotoTouchEnd"
      >
        <img
          v-if="view === 'outside'"
          :key="model.doorImage"
          :src="model.doorImage"
          :alt="`${model.name} — вид снаружи`"
          :style="{ viewTransitionName: `door-photo-${model.id}` }"
          class="absolute inset-0 h-full w-full object-contain"
          loading="lazy"
          decoding="async"
        />
        <img
          v-else-if="selectedSkin?.photo"
          :key="selectedSkin.photo"
          :src="selectedSkin.photo"
          :alt="`${model.name} — накладка ${selectedSkin.name} ${selectedSkin.color}`"
          :style="{ viewTransitionName: `door-photo-${model.id}` }"
          class="absolute inset-0 h-full w-full object-contain"
          loading="lazy"
          decoding="async"
        />
        <div v-else :style="{ viewTransitionName: `door-photo-${model.id}` }" class="absolute inset-0 flex flex-col items-center justify-center gap-2 rounded-2xl bg-slate-50 p-6 text-center">
          <span v-if="selectedSkin" class="text-[1.0625rem] font-medium text-slate-600">{{ selectedSkin.name }}, {{ selectedSkin.color }}</span>
          <span class="t-meta">Фото скоро появится — образец можно посмотреть в салоне</span>
        </div>

        <div class="absolute left-3 top-3 inline-flex gap-1 rounded-full bg-white/90 p-1 backdrop-blur-sm" role="tablist" aria-label="Вид двери">
          <button
            type="button" role="tab"
            class="rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors active:scale-95"
            :class="view === 'outside' ? 'bg-ink text-white' : 'text-slate-500'"
            :aria-selected="view === 'outside'"
            @click="selectView('outside')"
          >Снаружи</button>
          <button
            type="button" role="tab"
            class="rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors active:scale-95"
            :class="view === 'inside' ? 'bg-ink text-white' : 'text-slate-500'"
            :aria-selected="view === 'inside'"
            @click="selectView('inside')"
          >Изнутри</button>
        </div>
      </div>

      <!-- Инфо-карточка: название, цена, выбор накладки, CTA -->
      <div class="flex flex-col gap-5 rounded-2xl border border-slate-200 bg-white p-4.5 sm:p-6">
        <div class="flex flex-col gap-3.5 border-b border-slate-200 pb-4.5 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
          <div>
            <h3 class="t-h3 m-0 mb-1.5">{{ model.name }}</h3>
            <p class="t-body m-0">{{ model.tagline }}</p>
          </div>
          <div class="flex flex-col gap-1 sm:items-end sm:text-right" :style="{ viewTransitionName: `door-price-${model.id}` }">
            <span class="t-price">{{ formatPrice(currentPrice) }}</span>
            <span class="t-meta">{{ selectedSkin?.name }}, {{ selectedSkin?.color }}</span>
          </div>
        </div>

        <!-- Шаг 1: модель накладки. На мобиле — горизонтальный свайп (нативный
             тач-скролл, не wrap): 13 моделей в wrap-сетке — 5-6 строк на узком
             экране, неудобно сканировать. На sm+ — обычный wrap кликом. -->
        <div>
          <p class="t-label m-0 mb-2.5">Накладка изнутри — модель</p>
          <div class="-mx-4.5 flex snap-x snap-mandatory gap-2 overflow-x-auto px-4.5 pb-1 scrollbar-none sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0 sm:pb-0">
            <button
              v-for="group in groupedSkins"
              :key="group.name"
              type="button"
              class="shrink-0 snap-start rounded-full border-[1.5px] px-4 py-2 text-[0.8125rem] font-medium transition-colors active:scale-95"
              :class="group.name === activeGroup?.name
                ? 'border-teal-600 bg-teal-700 text-white'
                : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'"
              :aria-pressed="group.name === activeGroup?.name"
              @click="selectSeries(group)"
            >
              {{ group.name }}
            </button>
          </div>
        </div>

        <!-- Шаг 2: цвет внутри модели — тот же приём: свайп на мобиле, wrap на sm+ -->
        <div>
          <p class="t-label m-0 mb-2.5">Цвет</p>
          <div class="-mx-4.5 flex snap-x snap-mandatory gap-2 overflow-x-auto px-4.5 pb-1 scrollbar-none sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0 sm:pb-0">
            <button
              v-for="item in activeGroup?.items ?? []"
              :key="item.idx"
              type="button"
              class="flex w-20 shrink-0 snap-start flex-col items-center gap-2 rounded-xl border-[1.5px] p-2 transition-colors active:scale-95"
              :class="item.idx === selectedIdx ? 'border-teal-600 shadow-[0_0_0_3px_rgba(20,184,166,0.14)]' : 'border-slate-200 hover:border-slate-300'"
              :aria-pressed="item.idx === selectedIdx"
              @click="selectColor(item.idx)"
            >
              <!-- Фото накладки — целая дверь изнутри, снята край-в-край. Пропорция
                   превью = пропорция ассета (699×1500 = 7:15), поэтому cover заполняет
                   точно. При квадратном боксе кроп срезал бы дверь до середины полотна. -->
              <span class="flex aspect-7/15 w-full items-center justify-center overflow-hidden rounded-lg bg-slate-50">
                <img
                  v-if="item.skin.photo"
                  :src="item.skin.photo"
                  :alt="item.skin.color"
                  class="h-full w-full object-cover"
                  loading="lazy"
                  decoding="async"
                />
                <svg v-else class="h-5 w-5 text-slate-300" fill="none" stroke="currentColor" stroke-width="1.3" viewBox="0 0 24 24" aria-hidden="true">
                  <rect x="5" y="3" width="14" height="18" rx="1.5" />
                  <path d="M15 12h.01" stroke-linecap="round" />
                </svg>
              </span>
              <span class="text-center text-[0.6875rem] font-medium leading-tight" :class="item.idx === selectedIdx ? 'text-ink' : 'text-slate-500'">
                {{ item.skin.color }}
              </span>
            </button>
          </div>
        </div>

        <!-- CTA: на мобиле — компактный ряд иконок (мессенджеры из шапки + телефон
             иконкой), текстовые кнопки там не адаптируются под узкий экран.
             На sm+ — обычные кнопки с текстом, места достаточно.
             ctaRef — граница видимости для sticky-панели на мобиле ниже. -->
        <div ref="ctaRef">
          <div class="flex items-center gap-3 sm:hidden">
            <a
              v-for="s in SOCIAL_NETWORKS"
              :key="s.name"
              :href="s.url"
              target="_blank"
              rel="noopener noreferrer"
              :aria-label="`${s.label} (открывается в новой вкладке)`"
              class="shrink-0 active:scale-90"
            >
              <img :src="s.icon" :alt="s.label" class="h-10 w-10" width="40" height="40" />
            </a>
            <a
              :href="`tel:${phone.raw}`"
              :aria-label="`Позвонить: ${phone.label}`"
              :title="phone.label"
              class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-teal-500 active:scale-90"
            >
              <img src="/svg/w_phone.svg" alt="" class="h-4 w-4" />
            </a>
          </div>
          <div class="hidden flex-wrap gap-2.5 sm:flex">
            <a :href="telegramHref" target="_blank" rel="noopener" class="btn btn-primary active:scale-95">Написать в Telegram</a>
            <a :href="`tel:${phone.raw}`" class="btn btn-outline active:scale-95">{{ phone.label }}</a>
          </div>
        </div>
      </div>

    </div>

    <!-- ── Характеристики / комплектация — свёрнуты по умолчанию, вне грида
         фото+инфо, чтобы раскрытие не тянуло фото-карточку за собой ── -->
    <div class="flex flex-col rounded-2xl border border-slate-200 bg-white p-4.5 sm:p-6">
      <div class="border-b border-slate-200">
        <button
          type="button"
          class="flex w-full items-center justify-between gap-3 py-3.5 text-left text-[0.9375rem] font-medium text-ink active:opacity-60"
          :aria-expanded="infoTab === 'specs'"
          @click="toggleTab('specs')"
        >
          Характеристики
          <svg
            class="h-4 w-4 shrink-0 text-slate-400 transition-transform"
            :class="{ 'rotate-180': infoTab === 'specs' }"
            viewBox="0 0 16 16" fill="none" aria-hidden="true"
          >
            <path d="M4 6l4 4 4-4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
        <dl v-if="infoTab === 'specs'" class="mb-4 overflow-hidden rounded-xl border border-slate-200">
          <div
            v-for="s in model.specs"
            :key="s.label"
            class="grid grid-cols-1 gap-0.5 px-3.5 py-2.5 odd:bg-slate-50 sm:grid-cols-[190px_1fr] sm:gap-0"
          >
            <dt class="text-xs font-medium text-slate-500">{{ s.label }}</dt>
            <dd class="m-0 text-[0.8125rem] leading-relaxed text-ink">{{ s.value }}</dd>
          </div>
        </dl>
      </div>

      <div>
        <button
          type="button"
          class="flex w-full items-center justify-between gap-3 py-3.5 text-left text-[0.9375rem] font-medium text-ink active:opacity-60"
          :aria-expanded="infoTab === 'hardware'"
          @click="toggleTab('hardware')"
        >
          Комплектация и фурнитура
          <svg
            class="h-4 w-4 shrink-0 text-slate-400 transition-transform"
            :class="{ 'rotate-180': infoTab === 'hardware' }"
            viewBox="0 0 16 16" fill="none" aria-hidden="true"
          >
            <path d="M4 6l4 4 4-4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
        <ul v-if="infoTab === 'hardware'" class="m-0 mb-4 grid list-none grid-cols-1 gap-2 p-0 sm:grid-cols-2">
          <li v-for="h in model.hardware" :key="h" class="relative pl-5 text-[0.8125rem] leading-relaxed text-slate-700">
            <span class="absolute left-0 top-2 h-1.5 w-1.5 rounded-full bg-slate-300" aria-hidden="true" />
            {{ h }}
          </li>
        </ul>
      </div>
    </div>

    <!-- ── Sticky CTA на мобиле — виден, только когда основной CTA прокручен
         за пределы экрана (характеристики читают долго, кнопка не должна
         теряться) ── -->
    <Transition
      enter-active-class="transition-transform duration-300 ease-out"
      enter-from-class="translate-y-full"
      enter-to-class="translate-y-0"
      leave-active-class="transition-transform duration-200 ease-in"
      leave-from-class="translate-y-0"
      leave-to-class="translate-y-full"
    >
      <div
        v-if="!ctaInView"
        class="fixed inset-x-0 bottom-0 z-40 flex items-center justify-between gap-3 border-t border-slate-200 bg-white/95 p-3 shadow-[0_-4px_16px_rgba(0,0,0,0.06)] backdrop-blur-sm sm:hidden"
      >
        <div class="flex min-w-0 flex-col leading-none">
          <span class="t-price--sm">{{ formatPrice(currentPrice) }}</span>
          <span class="t-meta truncate">{{ model.name }} · {{ selectedSkin?.color }}</span>
        </div>
        <a :href="telegramHref" target="_blank" rel="noopener" class="btn btn-primary shrink-0 px-4 py-2 text-sm active:scale-95">Написать</a>
      </div>
    </Transition>

  </div>
</template>
