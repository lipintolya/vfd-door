<script setup lang="ts">
import { ref, computed } from 'vue'
import { getSkin, type EntranceDoorModel } from '../../data/entrance-doors'
import { companyLegalInfo } from '../../lib/contacts-data'

const props = defineProps<{
  model: EntranceDoorModel
}>()

const phone = companyLegalInfo.contacts.phone[0]!

const view = ref<'outside' | 'inside'>('outside')
const selectedIdx = ref(0)

const selectedOption = computed(() => props.model.skinOptions[selectedIdx.value]!)
const selectedSkin   = computed(() => getSkin(selectedOption.value.skinId))
const currentPrice   = computed(() => selectedOption.value.price)

const formatPrice = (price: number) => `${price.toLocaleString('ru-RU')} ₽`

/* Накладки — двухшаговый выбор (сначала серия — Niuta, ER 1, Atum Pro 28…,
   потом цвет внутри серии). 37 вариантов плоским списком — стена на весь
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

const selectSeries = (group: SkinGroup) => {
  selectedIdx.value = group.items[0]!.idx
  view.value = 'inside'
}
const selectColor = (idx: number) => {
  selectedIdx.value = idx
  view.value = 'inside'
}

/* Характеристики и фурнитура — за аккордеоном, свёрнуты по умолчанию.
   Вынесены ЗА ПРЕДЕЛЫ грида фото+инфо (см. ниже) — иначе раскрытие
   аккордеона растягивает grid-row и тянет фото-карточку вниз/вширь. */
type InfoTab = 'specs' | 'hardware'
const infoTab = ref<InfoTab | null>(null)
const toggleTab = (tab: InfoTab) => { infoTab.value = infoTab.value === tab ? null : tab }
</script>

<template>
  <div class="flex flex-col gap-5">

    <!-- ── Фото+инфо — равная высота по умолчанию (items-stretch),
         аккордеон характеристик сюда не входит ── -->
    <div class="flex flex-col gap-5 md:grid md:grid-cols-[380px_1fr] md:items-stretch md:gap-8">

      <!-- Фото + переключатель снаружи/изнутри -->
      <div class="relative flex aspect-4/3 w-full items-center justify-center rounded-2xl bg-slate-50 p-4 md:aspect-auto md:h-full md:p-6">
        <img
          v-if="view === 'outside'"
          :key="model.doorImage"
          :src="model.doorImage"
          :alt="`${model.name} — вид снаружи`"
          class="h-full w-full object-contain"
          loading="lazy"
          decoding="async"
        />
        <img
          v-else-if="selectedSkin?.photo"
          :key="selectedSkin.photo"
          :src="selectedSkin.photo"
          :alt="`${model.name} — накладка ${selectedSkin.name} ${selectedSkin.color}`"
          class="h-full w-full object-contain"
          loading="lazy"
          decoding="async"
        />
        <div v-else class="flex max-w-80 flex-col items-center justify-center gap-2 p-6 text-center">
          <span v-if="selectedSkin" class="text-[1.0625rem] font-extrabold text-slate-700">{{ selectedSkin.name }}, {{ selectedSkin.color }}</span>
          <span class="text-[0.8125rem] leading-snug text-slate-400">Фото скоро появится — образец можно посмотреть в салоне</span>
        </div>

        <div class="absolute left-3 top-3 inline-flex gap-1 rounded-full bg-white/90 p-1 backdrop-blur-sm" role="tablist" aria-label="Вид двери">
          <button
            type="button" role="tab"
            class="rounded-full px-3.5 py-1.5 text-xs font-bold transition-colors"
            :class="view === 'outside' ? 'bg-ink text-white' : 'text-slate-500'"
            :aria-selected="view === 'outside'"
            @click="view = 'outside'"
          >Снаружи</button>
          <button
            type="button" role="tab"
            class="rounded-full px-3.5 py-1.5 text-xs font-bold transition-colors"
            :class="view === 'inside' ? 'bg-ink text-white' : 'text-slate-500'"
            :aria-selected="view === 'inside'"
            @click="view = 'inside'"
          >Изнутри</button>
        </div>
      </div>

      <!-- Инфо-карточка: название, цена, выбор накладки, CTA -->
      <div class="flex flex-col gap-5 rounded-2xl border border-slate-200 bg-white p-4.5 sm:p-6">
        <div class="flex flex-col gap-3.5 border-b border-slate-200 pb-4.5 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
          <div>
            <h3 class="m-0 mb-1 text-[clamp(1.375rem,3vw,1.875rem)] font-black tracking-tight text-ink">{{ model.name }}</h3>
            <p class="m-0 text-sm leading-relaxed text-slate-500">{{ model.tagline }}</p>
          </div>
          <div class="flex flex-col gap-0.5 sm:items-end sm:text-right">
            <span class="whitespace-nowrap text-[1.625rem] font-black leading-none text-ink">{{ formatPrice(currentPrice) }}</span>
            <span class="text-xs text-slate-500">{{ selectedSkin?.name }}, {{ selectedSkin?.color }}</span>
          </div>
        </div>

        <!-- Шаг 1: серия накладки -->
        <div>
          <p class="m-0 mb-2 text-[0.6875rem] font-extrabold uppercase tracking-wide text-teal-700">Накладка изнутри — модель</p>
          <div class="flex flex-wrap gap-2">
            <button
              v-for="group in groupedSkins"
              :key="group.name"
              type="button"
              class="shrink-0 rounded-full border-[1.5px] px-4 py-2 text-[0.8125rem] font-bold transition-colors"
              :class="group.name === activeGroup?.name
                ? 'border-teal-600 bg-teal-700 text-white'
                : 'border-slate-200 bg-white text-slate-700 hover:border-teal-200'"
              :aria-pressed="group.name === activeGroup?.name"
              @click="selectSeries(group)"
            >
              {{ group.name }}
            </button>
          </div>
        </div>

        <!-- Шаг 2: цвет внутри серии -->
        <div>
          <p class="m-0 mb-2 text-[0.6875rem] font-extrabold uppercase tracking-wide text-teal-700">Цвет</p>
          <div class="flex flex-wrap gap-2">
            <button
              v-for="item in activeGroup?.items ?? []"
              :key="item.idx"
              type="button"
              class="flex w-28 shrink-0 flex-col items-center gap-2 rounded-xl border-[1.5px] p-2 transition-colors sm:w-32"
              :class="item.idx === selectedIdx ? 'border-teal-600 shadow-[0_0_0_3px_rgba(20,184,166,0.14)]' : 'border-slate-200 hover:border-teal-200'"
              :aria-pressed="item.idx === selectedIdx"
              @click="selectColor(item.idx)"
            >
              <!-- Фото накладки — целая дверь изнутри (портретное фото, как doorImage),
                   не квадратный образец материала — превью тоже портретное, иначе
                   квадратный кроп обрезает дверь до бессмысленного фрагмента -->
              <span class="flex aspect-3/4 w-full items-center justify-center overflow-hidden rounded-lg bg-slate-50">
                <img v-if="item.skin.photo" :src="item.skin.photo" :alt="item.skin.color" class="h-full w-full object-cover" loading="lazy" decoding="async" />
              </span>
              <span class="text-center text-[0.6875rem] font-bold leading-tight" :class="item.idx === selectedIdx ? 'text-teal-700' : 'text-slate-700'">
                {{ item.skin.color }}
              </span>
            </button>
          </div>
        </div>

        <!-- CTA -->
        <div class="flex flex-wrap gap-2.5">
          <a href="https://t.me/vfddoors74" target="_blank" rel="noopener" class="btn btn-primary flex-1 justify-center sm:flex-none">Написать в Telegram</a>
          <a :href="`tel:${phone.raw}`" class="btn btn-outline flex-1 justify-center sm:flex-none">{{ phone.label }}</a>
        </div>
      </div>

    </div>

    <!-- ── Характеристики / комплектация — свёрнуты по умолчанию, вне грида
         фото+инфо, чтобы раскрытие не тянуло фото-карточку за собой ── -->
    <div class="flex flex-col rounded-2xl border border-slate-200 bg-white p-4.5 sm:p-6">
      <div class="border-b border-slate-200">
        <button
          type="button"
          class="flex w-full items-center justify-between gap-3 py-3.5 text-left text-sm font-bold text-ink"
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
            <dt class="text-xs font-bold text-slate-500">{{ s.label }}</dt>
            <dd class="m-0 text-[0.8125rem] leading-relaxed text-ink">{{ s.value }}</dd>
          </div>
        </dl>
      </div>

      <div>
        <button
          type="button"
          class="flex w-full items-center justify-between gap-3 py-3.5 text-left text-sm font-bold text-ink"
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
            <span class="absolute left-0 top-2 h-1.5 w-1.5 rounded-full bg-teal-600" aria-hidden="true" />
            {{ h }}
          </li>
        </ul>
      </div>
    </div>

  </div>
</template>
