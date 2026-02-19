<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import type { BreadcrumbItem } from '@/components/ui/Breadcrumbs.vue'
import AppContainer from '@/components/layout/AppContainer.vue'
import Breadcrumbs from '@/components/ui/Breadcrumbs.vue'

interface StatItem {
  id: string
  value: string
  label: string
}

// ========================
// BREADCRUMBS
// ========================
const breadcrumbs = computed<BreadcrumbItem[]>(() => [
  { label: 'Главная', path: '/' },
  { label: 'О компании', isActive: true }
])

// ========================
// DATA
// ========================
const TELEGRAM_URL = 'https://t.me/vfddoors74'
const YANDEX_MAPS_URL = 'https://yandex.ru/maps/org/vladimirskaya_fabrika_dverey/17517257940/'

const stats: StatItem[] = [
  { id: 'years', value: '9+', label: 'лет на рынке' },
  { id: 'clients', value: '2000+', label: 'довольных клиентов' },
  { id: 'projects', value: '150+', label: 'коммерческих проектов' },
  { id: 'doors', value: '500+', label: 'образцов в выставке' }
]

// Реквизиты компании
const companyDetails = {
  name: 'ООО "Владимирская Фабрика Дверей"',
  inn: '3333000000',
  kpp: '333301001',
  ogrn: '1153333000000',
  legalAddress: '600000, Владимирская обл., г. Владимир, ул. Примерная, д. 1',
  postalAddress: '454000, г. Челябинск, ул. Братьев Кашириных, 131Б',
  bankName: 'ПАО "Сбербанк России"',
  bik: '044525225',
  account: '40702810000000000000',
  correspondentAccount: '30101810400000000225',
  director: 'Генеральный директор: Петров Владимир Сергеевич',
  phone: '+7 (900) 029-78-88',
  email: 'vfddoors74@mail.ru'
}

// QR код для СБП (заглушка, заменить на реальный QR)
const sbpQrCode = 'https://storage.yandexcloud.net/catalog-vfd/sbp-qr-placeholder.png'

// ========================
// IMAGE LOADING STATE
// ========================
const heroImageLoaded = ref(false)
const mapImageLoaded = ref(false)
const qrImageLoaded = ref(false)
const imageErrors = ref<Set<string>>(new Set())

const handleImageLoad = (id: string) => {
  if (id === 'hero') heroImageLoaded.value = true
  if (id === 'map') mapImageLoaded.value = true
  if (id === 'qr') qrImageLoaded.value = true
}

const handleImageError = (id: string) => {
  imageErrors.value.add(id)
}

// ========================
// ACTIONS
// ========================
const openTelegram = (): void => {
  window.open(TELEGRAM_URL, '_blank', 'noopener,noreferrer')
}

const openYandexMaps = (): void => {
  window.open(YANDEX_MAPS_URL, '_blank', 'noopener,noreferrer')
}

// ========================
// LIFECYCLE
// ========================
onMounted(() => {
  document.title = 'О компании VFD Кашириных — фирменный салон фабрики дверей'

  const metaDescription = document.querySelector('meta[name="description"]')
  if (metaDescription) {
    metaDescription.setAttribute(
      'content',
      'VFD Кашириных — фирменный салон фабрики дверей в Челябинске. Более 500 образцов, собственное производство, профессиональный монтаж. Работаем с 2015 года.'
    )
  }
})

onUnmounted(() => {
  imageErrors.value.clear()
})
</script>

<template>
  <div class="min-h-screen bg-white">
    <!-- BREADCRUMBS -->
    <div class="pt-6 sm:pt-8 lg:pt-10 pb-4 sm:pb-6">
      <AppContainer>
        <Breadcrumbs :items="breadcrumbs" :show-home="false" />
      </AppContainer>
    </div>

    <!-- HERO SECTION -->
    <div class="pb-8 sm:pb-12 lg:pb-16">
      <AppContainer>
        <div class="relative w-full overflow-hidden rounded-2xl sm:rounded-3xl" style="height: clamp(280px, 50vw, 500px)">
          <!-- Background Image -->
          <div class="absolute inset-0">
            <!-- Loading State -->
            <div
              v-if="!heroImageLoaded && !imageErrors.has('hero')"
              class="absolute inset-0 flex items-center justify-center bg-zinc-100"
            >
              <div class="w-10 h-10 sm:w-12 sm:h-12 border-2 sm:border-3 border-zinc-300 border-t-teal-500 rounded-full animate-spin" />
            </div>

            <img
              src="https://storage.yandexcloud.net/catalog-vfd/alum/alum-1.webp"
              alt="Выставочный зал VFD Кашириных"
              class="w-full h-full object-cover"
              :class="{ 'opacity-0': !heroImageLoaded, 'opacity-100': heroImageLoaded }"
              fetchpriority="high"
              @load="handleImageLoad('hero')"
              @error="handleImageError('hero')"
            />
          </div>

          <!-- Gradient Overlay -->
          <div class="absolute inset-0 bg-linear-to-t from-black/70 via-black/40 to-transparent" />

          <!-- Content -->
          <div class="absolute inset-0 flex items-end">
            <div class="w-full p-4 sm:p-6 lg:p-8 text-white pb-16 sm:pb-20 lg:pb-24">
              <p class="text-xs uppercase tracking-widest text-white/70 mb-2">
                О нашем салоне
              </p>
              <h1 class="text-2xl sm:text-3xl lg:text-4xl font-bold leading-tight break-words">
                VFD Кашириных — фирменный салон фабрики
              </h1>
              <p class="text-sm sm:text-base lg:text-lg text-white/90 mt-3 sm:mt-4 max-w-full sm:max-w-2xl leading-relaxed break-words">
                Работаем с 2015 года. Более 200 образцов дверей и перегородок, работа с дизайнерами и коммерческими проектами.
              </p>
              <div class="flex flex-wrap gap-3 mt-5 sm:mt-6">
                <button
                  @click="openTelegram"
                  class="ui-button ui-button--primary"
                  type="button"
                >
                  Консультация
                </button>
                <a
                  href="#contact"
                  class="ui-button ui-button--ghost"
                >
                  Посетить салон
                </a>
              </div>
            </div>
          </div>
        </div>
      </AppContainer>
    </div>

    <!-- STATS SECTION -->
    <div class="pb-8 sm:pb-12 lg:pb-16">
      <AppContainer>
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
          <div
            v-for="stat in stats"
            :key="stat.id"
            class="text-center p-4 sm:p-5 lg:p-6 rounded-xl sm:rounded-2xl bg-zinc-50 hover:bg-zinc-100 transition-colors duration-200"
          >
            <div class="text-2xl sm:text-3xl lg:text-4xl font-bold text-teal-600 mb-1">
              {{ stat.value }}
            </div>
            <div class="text-xs sm:text-sm text-zinc-600 font-medium">
              {{ stat.label }}
            </div>
          </div>
        </div>
      </AppContainer>
    </div>

    <!-- ABOUT CONTENT -->
    <div class="pb-8 sm:pb-12 lg:pb-16 bg-white">
      <AppContainer>
        <div class="max-w-4xl mx-auto">
          <h2 class="text-3xl sm:text-4xl lg:text-5xl font-semibold text-zinc-900 mb-5 sm:mb-6 lg:mb-8 break-words">
            О салоне VFD Кашириных
          </h2>

          <div class="space-y-4 sm:space-y-5 lg:space-y-6 text-base sm:text-lg text-zinc-700 leading-relaxed">
            <p class="break-words">
              <strong class="text-zinc-900">VFD Кашириных</strong> — это фирменный салон фабрики дверей, где качество и профессионализм встречаются в каждом проекте. Работаем с 2015 года и накопили огромный опыт в работе с межкомнатными и входными дверями, а также алюминиевыми перегородками.
            </p>

            <div class="bg-teal-50 border-l-4 border-teal-600 p-4 sm:p-5 lg:p-6 rounded-xl">
              <h3 class="text-lg sm:text-xl font-bold text-zinc-900 mb-3 sm:mb-4 break-words">
                Что нас отличает
              </h3>
              <ul class="space-y-2 sm:space-y-2.5 text-zinc-800">
                <li class="flex items-start gap-2">
                  <span class="text-teal-600 font-bold shrink-0 mt-0.5">✓</span>
                  <span class="break-words"><strong class="font-semibold">Большая выставка</strong> — более 500 образцов межкомнатных и входных дверей</span>
                </li>
                <li class="flex items-start gap-2">
                  <span class="text-teal-600 font-bold shrink-0 mt-0.5">✓</span>
                  <span class="break-words"><strong class="font-semibold">Фирменный статус</strong> — прямое сотрудничество с фабрикой для лучших цен</span>
                </li>
                <li class="flex items-start gap-2">
                  <span class="text-teal-600 font-bold shrink-0 mt-0.5">✓</span>
                  <span class="break-words"><strong class="font-semibold">Работа с дизайнерами</strong> — консультации и реализация дизайн-проектов</span>
                </li>
                <li class="flex items-start gap-2">
                  <span class="text-teal-600 font-bold shrink-0 mt-0.5">✓</span>
                  <span class="break-words"><strong class="font-semibold">Коммерческие проекты</strong> — опыт работы с офисами, ресторанами и магазинами</span>
                </li>
                <li class="flex items-start gap-2">
                  <span class="text-teal-600 font-bold shrink-0 mt-0.5">✓</span>
                  <span class="break-words"><strong class="font-semibold">Полный спектр услуг</strong> — от выбора до монтажа и обслуживания</span>
                </li>
              </ul>
            </div>

            <p class="break-words">
              Мы работаем как с частными клиентами, так и с дизайн-бюро и коммерческими компаниями. Для каждого проекта находим идеальное решение, которое соответствует бюджету, стилю и функциональности.
            </p>

            <p class="break-words">
              Наша команда состоит из опытных специалистов: проектировщиков, мастеров по монтажу и консультантов. Мы гарантируем качество работы, честное консультирование и сервис на высшем уровне.
            </p>
          </div>
        </div>
      </AppContainer>
    </div>

    <!-- REQUISITES SECTION -->
    <div class="pb-8 sm:pb-12 lg:pb-16 bg-zinc-50">
      <AppContainer>
        <h2 class="text-3xl sm:text-4xl lg:text-5xl font-semibold text-center text-zinc-900 mb-6 sm:mb-8 lg:mb-10">
          Реквизиты компании
        </h2>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          <!-- QR Code SBP -->
          <div class="lg:col-span-1">
            <div class="bg-white p-5 sm:p-6 rounded-2xl shadow-lg">
              <h3 class="text-lg font-bold text-zinc-900 mb-4 text-center">
                Оплата через СБП
              </h3>

              <div class="relative aspect-square w-full max-w-xs mx-auto mb-4 bg-zinc-50 rounded-xl overflow-hidden border-2 border-zinc-100">
                <!-- Loading State -->
                <div
                  v-if="!qrImageLoaded && !imageErrors.has('qr')"
                  class="absolute inset-0 flex items-center justify-center"
                >
                  <div class="w-8 h-8 border-2 border-zinc-300 border-t-teal-500 rounded-full animate-spin" />
                </div>

                <img
                  :src="sbpQrCode"
                  alt="QR код для оплаты через СБП"
                  class="w-full h-full object-contain p-4"
                  :class="{ 'opacity-0': !qrImageLoaded, 'opacity-100': qrImageLoaded }"
                  loading="lazy"
                  @load="handleImageLoad('qr')"
                  @error="handleImageError('qr')"
                />

                <!-- Error State -->
                <div
                  v-if="imageErrors.has('qr')"
                  class="absolute inset-0 flex items-center justify-center text-zinc-400 p-4 text-center"
                >
                  <div>
                    <svg class="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 4v16m8-8H4" />
                    </svg>
                    <p class="text-xs">QR код недоступен</p>
                  </div>
                </div>
              </div>

              <p class="text-xs text-zinc-500 text-center leading-relaxed">
                Отсканируйте QR-код для быстрой оплаты через Систему Быстрых Платежей (СБП)
              </p>
            </div>
          </div>

          <!-- Company Details -->
          <div class="lg:col-span-2">
            <div class="bg-white rounded-2xl shadow-lg overflow-hidden">
              <!-- Header -->
              <div class="bg-linear-to-r from-teal-600 to-teal-700 px-5 sm:px-6 lg:px-8 py-4 sm:py-5">
                <h3 class="text-base sm:text-lg lg:text-xl font-bold text-white">
                  {{ companyDetails.name }}
                </h3>
              </div>

              <!-- Content -->
              <div class="p-5 sm:p-6 lg:p-8 space-y-5 sm:space-y-6">
                <!-- INN, KPP, OGRN -->
                <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                  <div class="bg-zinc-50 p-3 sm:p-4 rounded-xl">
                    <div class="text-xs font-semibold text-zinc-500 uppercase tracking-wide mb-1">ИНН</div>
                    <div class="text-sm sm:text-base font-semibold text-zinc-900 break-all">{{ companyDetails.inn }}</div>
                  </div>
                  <div class="bg-zinc-50 p-3 sm:p-4 rounded-xl">
                    <div class="text-xs font-semibold text-zinc-500 uppercase tracking-wide mb-1">КПП</div>
                    <div class="text-sm sm:text-base font-semibold text-zinc-900 break-all">{{ companyDetails.kpp }}</div>
                  </div>
                  <div class="bg-zinc-50 p-3 sm:p-4 rounded-xl">
                    <div class="text-xs font-semibold text-zinc-500 uppercase tracking-wide mb-1">ОГРН</div>
                    <div class="text-sm sm:text-base font-semibold text-zinc-900 break-all">{{ companyDetails.ogrn }}</div>
                  </div>
                </div>

                <!-- Addresses -->
                <div class="space-y-3">
                  <div class="flex items-start gap-3">
                    <svg class="w-5 h-5 text-teal-600 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <div class="min-w-0">
                      <div class="text-xs font-semibold text-zinc-500 uppercase tracking-wide mb-1">Юридический адрес</div>
                      <p class="text-sm sm:text-base text-zinc-900 break-words">{{ companyDetails.legalAddress }}</p>
                    </div>
                  </div>

                  <div class="flex items-start gap-3">
                    <svg class="w-5 h-5 text-teal-600 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <div class="min-w-0">
                      <div class="text-xs font-semibold text-zinc-500 uppercase tracking-wide mb-1">Почтовый адрес</div>
                      <p class="text-sm sm:text-base text-zinc-900 break-words">{{ companyDetails.postalAddress }}</p>
                    </div>
                  </div>
                </div>

                <!-- Bank Details -->
                <div class="border-t border-zinc-200 pt-5">
                  <h4 class="text-sm font-bold text-zinc-900 mb-4">Банковские реквизиты</h4>
                  <div class="space-y-3">
                    <div class="flex justify-between items-center py-2 border-b border-zinc-100 gap-2">
                      <span class="text-sm text-zinc-500 shrink-0">Банк</span>
                      <span class="text-sm font-medium text-zinc-900 text-right break-words">{{ companyDetails.bankName }}</span>
                    </div>
                    <div class="flex justify-between items-center py-2 border-b border-zinc-100 gap-2">
                      <span class="text-sm text-zinc-500 shrink-0">БИК</span>
                      <span class="text-sm font-medium text-zinc-900 break-all">{{ companyDetails.bik }}</span>
                    </div>
                    <div class="flex justify-between items-center py-2 border-b border-zinc-100 gap-2">
                      <span class="text-sm text-zinc-500 shrink-0">Расчётный счёт</span>
                      <span class="text-sm font-medium text-zinc-900 break-all">{{ companyDetails.account }}</span>
                    </div>
                    <div class="flex justify-between items-center py-2 gap-2">
                      <span class="text-sm text-zinc-500 shrink-0">Корр. счёт</span>
                      <span class="text-sm font-medium text-zinc-900 break-all">{{ companyDetails.correspondentAccount }}</span>
                    </div>
                  </div>
                </div>

                <!-- Director & Contacts -->
                <div class="border-t border-zinc-200 pt-5">
                  <div class="flex items-start gap-3 mb-4">
                    <svg class="w-5 h-5 text-teal-600 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <div class="min-w-0">
                      <div class="text-xs font-semibold text-zinc-500 uppercase tracking-wide mb-1">Руководитель</div>
                      <p class="text-sm sm:text-base text-zinc-900 truncate">{{ companyDetails.director }}</p>
                    </div>
                  </div>

                  <div class="flex items-start gap-3 mb-4">
                    <svg class="w-5 h-5 text-teal-600 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    <div class="min-w-0">
                      <div class="text-xs font-semibold text-zinc-500 uppercase tracking-wide mb-1">Телефон</div>
                      <a :href="`tel:${companyDetails.phone.replace(/\s|\(|\)/g, '')}`" class="text-sm sm:text-base text-teal-600 hover:text-teal-700 font-medium whitespace-nowrap">
                        {{ companyDetails.phone }}
                      </a>
                    </div>
                  </div>

                  <div class="flex items-start gap-3">
                    <svg class="w-5 h-5 text-teal-600 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <div class="min-w-0">
                      <div class="text-xs font-semibold text-zinc-500 uppercase tracking-wide mb-1">Email</div>
                      <a :href="`mailto:${companyDetails.email}`" class="text-sm sm:text-base text-teal-600 hover:text-teal-700 font-medium break-all">
                        {{ companyDetails.email }}
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </AppContainer>
    </div>

    <!-- CONTACT SECTION -->
    <div id="contact" class="pb-8 sm:pb-12 lg:pb-16 bg-zinc-50">
      <AppContainer>
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10">
          <!-- Contact Info -->
          <div class="space-y-5 lg:space-y-6">
            <div>
              <h2 class="text-3xl sm:text-4xl lg:text-5xl font-semibold text-zinc-900 mb-3">
                Посетите наш салон
              </h2>
              <p class="text-base sm:text-lg text-zinc-700 leading-relaxed">
                Приходите лично, чтобы увидеть всю выставку дверей и перегородок. Наши специалисты помогут вам выбрать идеальный вариант для вашего интерьера.
              </p>
            </div>

            <div class="bg-white p-5 sm:p-6 rounded-2xl shadow-lg space-y-5">
              <!-- Address -->
              <div>
                <div class="flex items-center gap-2 mb-2">
                  <svg class="w-5 h-5 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <div class="text-xs font-semibold text-zinc-500 uppercase tracking-wide">Адрес</div>
                </div>
                <p class="text-base font-medium text-zinc-900 mt-1">
                  Челябинск, ул. Братьев Кашириных, 131Б
                </p>
              </div>

              <div class="border-t border-zinc-200" />

              <!-- Working Hours -->
              <div>
                <div class="flex items-center gap-2 mb-2">
                  <svg class="w-5 h-5 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div class="text-xs font-semibold text-zinc-500 uppercase tracking-wide">Время работы</div>
                </div>
                <div class="mt-2 space-y-1 text-sm sm:text-base text-zinc-900">
                  <p><span class="font-medium">Пн–Пт:</span> 10:00 – 19:00</p>
                  <p><span class="font-medium">Сб-Вс:</span> 10:00 – 18:00</p>
                </div>
              </div>

              <div class="border-t border-zinc-200" />

              <!-- Phones -->
              <div>
                <div class="flex items-center gap-2 mb-2">
                  <svg class="w-5 h-5 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <div class="text-xs font-semibold text-zinc-500 uppercase tracking-wide">Телефоны</div>
                </div>
                <div class="mt-2 space-y-2">
                  <a href="tel:+79000297888" class="block font-medium text-zinc-900 hover:text-teal-600 transition-colors text-sm sm:text-base">
                    +7 (900) 029-78-88
                  </a>
                  <a href="tel:+79630807888" class="block font-medium text-zinc-900 hover:text-teal-600 transition-colors text-sm sm:text-base">
                    +7 (963) 080-78-88
                  </a>
                </div>
              </div>

              <div class="border-t border-zinc-200" />

              <!-- Email -->
              <div>
                <div class="flex items-center gap-2 mb-2">
                  <svg class="w-5 h-5 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <div class="text-xs font-semibold text-zinc-500 uppercase tracking-wide">Email</div>
                </div>
                <a href="mailto:vfddoors74@mail.ru" class="block font-medium text-zinc-900 hover:text-teal-600 transition-colors text-sm sm:text-base mt-1">
                  vfddoors74@mail.ru
                </a>
              </div>

              <!-- Map Button -->
              <button
                @click="openYandexMaps"
                type="button"
                class="w-full inline-flex items-center justify-center gap-2 py-3 px-6 rounded-full bg-teal-600 hover:bg-teal-700 text-white font-semibold transition-all duration-200 hover:shadow-lg hover:shadow-teal-500/30 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
              >
                <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                <span>Смотреть на карте</span>
              </button>
            </div>
          </div>

          <!-- Map -->
          <div class="relative rounded-2xl overflow-hidden border-2 border-zinc-200 shadow-lg h-80 sm:h-96 lg:h-full min-h-80 group bg-zinc-100">
            <!-- Background Image -->
            <div class="absolute inset-0">
              <div
                v-if="!mapImageLoaded && !imageErrors.has('map')"
                class="absolute inset-0 flex items-center justify-center bg-zinc-100"
              >
                <div class="w-8 h-8 border-2 border-zinc-300 border-t-teal-500 rounded-full animate-spin" />
              </div>

              <img
                src="https://storage.yandexcloud.net/catalog-vfd/covers/yandex-location.webp"
                alt="Местоположение салона на карте"
                class="w-full h-full object-cover"
                :class="{ 'opacity-0': !mapImageLoaded, 'opacity-100': mapImageLoaded }"
                loading="lazy"
                @load="handleImageLoad('map')"
                @error="handleImageError('map')"
              />
            </div>

            <!-- Overlay -->
            <div class="absolute inset-0 bg-black/20" />

            <!-- Location Marker -->
            <div class="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div class="relative group-hover:opacity-0 transition-opacity duration-300">
                <div class="absolute inset-0 rounded-full border-2 border-teal-400 animate-pulse" style="width: 80px; height: 80px; margin: -40px 0 0 -40px;" />
                <div class="w-5 h-5 bg-teal-600 rounded-full shadow-lg shadow-teal-600/50 relative z-10" style="width: 20px; height: 20px; margin-left: -10px; margin-top: -10px;" />
              </div>
            </div>

            <!-- Info Banner -->
            <div class="absolute bottom-0 left-0 right-0 bg-linear-to-t from-black/80 via-black/40 to-transparent p-4 sm:p-6">
              <h3 class="text-white font-bold text-sm sm:text-base mb-1">
                Vladimirskaya Fabrika Dverey
              </h3>
              <p class="text-white/80 text-xs sm:text-sm">
                Челябинск, ул. Братьев Кашириных, 131Б
              </p>
            </div>

            <!-- Click Overlay -->
            <button
              @click="openYandexMaps"
              type="button"
              class="absolute inset-0 w-full h-full flex items-center justify-center group cursor-pointer"
              aria-label="Открыть на Яндекс.Картах"
            >
              <span class="text-white font-semibold text-sm sm:text-base lg:text-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 drop-shadow-lg">
                Смотреть в Яндекс.Картах
              </span>
            </button>
          </div>
        </div>
      </AppContainer>
    </div>

    <!-- CTA SECTION -->
    <div class="bg-linear-to-r from-teal-600 to-zinc-900 text-white">
      <AppContainer class="py-12 sm:py-16 lg:py-20 text-center space-y-5 sm:space-y-6">
        <h2 class="text-2xl sm:text-3xl lg:text-4xl font-bold break-words px-2">
          Готовы начать проект?
        </h2>
        <p class="text-base sm:text-lg max-w-2xl mx-auto text-white/90 px-2 break-words">
          Мы ответим на все вопросы и поможем с выбором дверей и перегородок, которые идеально подойдут для вашего интерьера.
        </p>
        <div class="flex flex-col sm:flex-row justify-center gap-4 pt-4 px-2">
          <a
            href="tel:+79000297888"
            class="inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-4 rounded-full bg-white text-teal-700 font-bold hover:bg-gray-100 transition-all duration-200 hover:shadow-lg hover:shadow-teal-500/30 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-teal-600 break-words max-w-full"
          >
            <svg class="w-5 h-5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
            </svg>
            <span class="break-words">Позвонить</span>
          </a>
          <a
            href="https://t.me/vfddoors74"
            target="_blank"
            rel="noopener noreferrer"
            class="inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-4 rounded-full border-2 border-white text-white hover:bg-white/10 font-bold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-teal-600 break-words max-w-full"
          >
            <svg class="w-5 h-5 shrink-0" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.16.16-.295.295-.605.295-.042 0-.084 0-.127-.01l.214-3.054 5.56-5.023c.242-.213-.054-.328-.373-.115L6.71 13.65l-2.994-.924c-.649-.204-.659-.649.134-.96l11.783-4.545c.548-.211 1.028.133.86.942z" />
            </svg>
            <span class="break-words">Написать в Telegram</span>
          </a>
        </div>
      </AppContainer>
    </div>
  </div>
</template>

<style scoped>
/* Smooth scroll for anchor links */
html {
  scroll-behavior: smooth;
}

/* Focus visible for accessibility */
button:focus-visible,
a:focus-visible {
  outline: 2px solid rgb(20 184 166);
  outline-offset: 2px;
}

/* Animation for pulse marker */
@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
</style>
