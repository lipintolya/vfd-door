<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'

/* ============================================================
   Constants
   ============================================================ */
const HEADER_HEIGHT     = 72
const HEADER_TOP_OFFSET = 16

const LOGO_URL = '/svg/logo.svg'

const SOCIAL_NETWORKS = [
  {
    name: 'VK',
    label: 'ВКонтакте',
    url: 'https://vk.com/vfddoors74',
    icon: '/svg/b_vk_logo.svg',
  },
  {
    name: 'Telegram',
    label: 'Telegram',
    url: 'https://t.me/vfddoors74',
    icon: '/svg/b_tg_logo.svg',
  },
  {
    name: 'MAX',
    label: 'Max',
    url: 'https://max.ru/id452402308842_biz',
    icon: '/svg/b_max_logo.svg',
  },
] as const

const CONTACTS = {
  phones: [
    { raw: '+79000297888', label: '+7 (900) 029-78-88' },
    { raw: '+79630807888', label: '+7 (963) 080-78-88' },
  ],
  address: 'Челябинск, ул. Братьев Кашириных, 131Б (вход с ул. Чичерина)',
  worktime: 'Пн–Пт: 10:00–20:00  ·  Сб: 11:00–16:00  ·  Вс: выходной',
  email: 'vfddoors74@mail.ru',
} as const

const NAV_LINKS = [
  { href: '/',           label: 'Главная' },
  { href: '/catalog',    label: 'Каталог' },
  { href: '/partitions', label: 'Перегородки' },
  { href: '/about',      label: 'О нас' },
  { href: '/contacts',   label: 'Контакты' },
] as const

const WORK_SCHEDULE = {
  weekday: { open: 10, close: 20 },  // Пн-Пт: 10:00-20:00
  saturday: { open: 11, close: 16 }, // Сб: 11:00-16:00
  sunday: { open: 0, close: 0 },     // Вс: закрыто
} as const

/* ============================================================
   State
   ============================================================ */
const scrolled     = ref(false)
const mobileOpen   = ref(false)
const contactsOpen = ref(false)
const logoLoaded   = ref(false)
const logoError    = ref(false)
const now          = ref(new Date())
const currentPath  = ref('/')

const contactsBtnRef   = ref<HTMLButtonElement | null>(null)
const contactsPanelRef = ref<HTMLDivElement | null>(null)
const mobileMenuRef    = ref<HTMLDivElement | null>(null)
const burgerBtnRef     = ref<HTMLButtonElement | null>(null)

let timerId: ReturnType<typeof setInterval> | null = null

/* ============================================================
   Active link
   ============================================================ */
const isActive = (href: string) => currentPath.value === href

/* ============================================================
   Work-hours logic
   ============================================================ */
const getScheduleForDay = (date: Date) => {
  const day = date.getDay()
  if (day === 0) return WORK_SCHEDULE.sunday    // Воскресенье
  if (day === 6) return WORK_SCHEDULE.saturday  // Суббота
  return WORK_SCHEDULE.weekday                   // Пн-Пт
}

const schedule = computed(() => getScheduleForDay(now.value))

const isOpen = computed(() => {
  const h = now.value.getHours()
  const s = schedule.value
  // Воскресенье всегда закрыто
  if (s === WORK_SCHEDULE.sunday) return false
  return h >= s.open && h < s.close
})

const timeUntilCloseText = computed(() => {
  if (!isOpen.value) return null
  const close = new Date(now.value)
  close.setHours(schedule.value.close, 0, 0, 0)
  const diff = close.getTime() - now.value.getTime()
  const h = Math.floor(diff / 3_600_000)
  const m = Math.floor((diff % 3_600_000) / 60_000)
  const s = Math.floor((diff % 60_000) / 1_000)
  return [h > 0 && `${h} ч`, (m > 0 || h > 0) && `${m} мин`, `${s} сек`]
    .filter(Boolean).join(' ')
})

const closedMessage = computed(() => {
  const tomorrow = new Date(now.value)
  tomorrow.setDate(tomorrow.getDate() + 1)
  const tomorrowSchedule = getScheduleForDay(tomorrow)
  
  if (tomorrowSchedule === WORK_SCHEDULE.sunday) {
    // Завтра воскресенье (закрыто)
    const dayAfter = new Date(tomorrow)
    dayAfter.setDate(dayAfter.getDate() + 1)
    const nextOpen = WORK_SCHEDULE.weekday.open
    return `Закрыто · Откроемся в пн в ${String(nextOpen).padStart(2, '0')}:00`
  }
  
  const nextOpen = tomorrowSchedule.open
  return `Закрыто · Откроемся завтра в ${String(nextOpen).padStart(2, '0')}:00`
})

/* ============================================================
   Handlers
   ============================================================ */
const setHeaderVar = () =>
  document.documentElement.style.setProperty(
    '--header-height',
    `${HEADER_HEIGHT + HEADER_TOP_OFFSET}px`
  )

const onScroll = () => { scrolled.value = window.scrollY > 20 }

const onResize = () => {
  if (window.innerWidth >= 768) {
    closeMobileMenu()
    // Закрываем contacts-попап тоже — он hidden на мобильном через CSS,
    // но state может остаться true если resized с открытым мобильным меню
    closeContacts()
  }
}

const onKeydown = (e: KeyboardEvent) => {
  if (e.key !== 'Escape') return
  // Закрываем только верхний слой
  if (contactsOpen.value) { closeContacts(); return }
  if (mobileOpen.value)   { closeMobileMenu() }
}

const onClickOutside = (e: MouseEvent) => {
  const t = e.target as Node

  if (
    contactsOpen.value &&
    contactsPanelRef.value &&
    !contactsPanelRef.value.contains(t) &&
    !contactsBtnRef.value?.contains(t)
  ) closeContacts()

  if (
    mobileOpen.value &&
    mobileMenuRef.value &&
    !mobileMenuRef.value.contains(t) &&
    !burgerBtnRef.value?.contains(t)
  ) closeMobileMenu()
}

const openMobileMenu   = () => { mobileOpen.value = true;  document.body.style.overflow = 'hidden' }
const closeMobileMenu  = () => { mobileOpen.value = false; document.body.style.overflow = '' }
const toggleMobileMenu = () => mobileOpen.value ? closeMobileMenu() : openMobileMenu()

const openContacts = async () => {
  contactsOpen.value = true
  await nextTick()
  contactsPanelRef.value
    ?.querySelector<HTMLElement>('a, button, [tabindex]:not([tabindex="-1"])')
    ?.focus()
}
const closeContacts  = () => { contactsOpen.value = false; contactsBtnRef.value?.focus() }
const toggleContacts = () => contactsOpen.value ? closeContacts() : openContacts()

// Используем первый телефон — optional chaining страхует от пустого массива
const callPrimary = () => {
  const phone = CONTACTS.phones[0]
  if (phone) window.location.href = `tel:${phone.raw}`
}

/* ============================================================
   Lifecycle
   ============================================================ */
onMounted(() => {
  currentPath.value = window.location.pathname
  setHeaderVar()
  window.addEventListener('scroll',  onScroll,       { passive: true })
  window.addEventListener('keydown', onKeydown)
  window.addEventListener('resize',  onResize,       { passive: true })
  document.addEventListener('click', onClickOutside, { capture: true })
  timerId = setInterval(() => { now.value = new Date() }, 1_000)
})

onUnmounted(() => {
  window.removeEventListener('scroll',  onScroll)
  window.removeEventListener('keydown', onKeydown)
  window.removeEventListener('resize',  onResize)
  document.removeEventListener('click', onClickOutside, { capture: true })
  // Гарантируем сброс overflow при размонтировании (напр. при HMR)
  document.body.style.overflow = ''
  if (timerId !== null) clearInterval(timerId)
})
</script>

<template>
  <header
    class="fixed inset-x-0 z-50"
    :style="{
      top: 'calc(env(safe-area-inset-top, 0px) + 1rem)',
      paddingLeft:  'env(safe-area-inset-left)',
      paddingRight: 'env(safe-area-inset-right)',
    }"
  >
    <div class="container">

      <!-- ── Pill bar ── -->
      <div
        class="flex items-center justify-between rounded-full border px-5 py-3 transition-all duration-300"
        :class="scrolled
          ? 'bg-white/95 backdrop-blur-md border-gray-200 shadow-[0_4px_20px_rgba(0,0,0,0.10)]'
          : 'bg-white/88 backdrop-blur-sm border-gray-200'"
      >

        <!-- Logo -->
        <a href="/" class="flex items-center gap-3 shrink-0 group" aria-label="ВФД на Кашириных — главная">
          <div class="relative w-9 h-9 flex items-center justify-center">
            <div
              v-if="!logoLoaded && !logoError"
              class="absolute inset-0 bg-gray-200 rounded-lg animate-pulse"
              aria-hidden="true"
            />
            <img
              v-if="!logoError"
              :src="LOGO_URL"
              alt=""
              class="h-9 w-auto object-contain transition-opacity duration-300"
              :class="logoLoaded ? 'opacity-100' : 'opacity-0'"
              width="36"
              height="36"
              loading="eager"
              decoding="async"
              @load="logoLoaded = true"
              @error="logoError = true"
            />
            <!-- Fallback если картинка не загрузилась -->
            <div
              v-if="logoError"
              class="w-9 h-9 rounded-lg bg-linear-to-br from-gray-700 to-gray-900
                     text-white flex items-center justify-center text-xs font-bold"
              aria-hidden="true"
            >
              ВФД
            </div>
          </div>
          <span class="hidden sm:block text-sm font-bold tracking-wide
                       group-hover:text-teal-600 transition-colors duration-200">
            ВФД НА КАШИРИНЫХ
          </span>
        </a>

        <!-- Desktop nav -->
        <nav class="hidden md:flex gap-7 text-sm" aria-label="Основная навигация">
          <a
            v-for="link in NAV_LINKS"
            :key="link.href"
            :href="link.href"
            class="transition-colors duration-200"
            :class="isActive(link.href)
              ? 'text-gray-900 font-semibold'
              : 'text-gray-500 hover:text-gray-900'"
            :aria-current="isActive(link.href) ? 'page' : undefined"
          >
            {{ link.label }}
          </a>
        </nav>

        <!-- Actions -->
        <div class="flex items-center gap-3">

          <!-- Desktop actions -->
          <div class="hidden lg:flex items-center gap-3">
            <a
              v-for="s in SOCIAL_NETWORKS"
              :key="s.name"
              :href="s.url"
              target="_blank"
              rel="noopener noreferrer"
              :aria-label="`${s.label} (открывается в новой вкладке)`"
              class="hover:scale-105 transition-transform duration-200"
            >
              <img :src="s.icon" :alt="s.label" class="w-7 h-7" width="28" height="28" />
            </a>

            <!-- Contacts dropdown -->
            <div class="relative">
              <button
                ref="contactsBtnRef"
                type="button"
                class="btn btn-primary"
                aria-haspopup="dialog"
                :aria-expanded="contactsOpen"
                aria-controls="contacts-panel"
                @click="toggleContacts"
              >
                Связаться
              </button>

              <!-- Contacts popover -->
              <Transition name="fade-slide">
                <div
                  v-if="contactsOpen"
                  id="contacts-panel"
                  ref="contactsPanelRef"
                  role="dialog"
                  aria-label="Контактная информация"
                  aria-modal="false"
                  class="absolute top-full right-0 mt-2 w-80 rounded-2xl
                         bg-white border border-gray-100 p-5 z-50"
                >
                  <div class="space-y-4 text-sm">

                    <div>
                      <p class="text-xs text-gray-400 uppercase tracking-wide mb-1.5">Телефоны</p>
                      <a
                        v-for="p in CONTACTS.phones"
                        :key="p.raw"
                        :href="`tel:${p.raw}`"
                        class="flex items-center gap-2 font-semibold text-gray-800 hover:text-teal-600
                               transition-colors duration-200 py-0.5"
                      >
                        <img src="/svg/phone-call.svg" alt="" class="w-4 h-4 shrink-0" />
                        {{ p.label }}
                      </a>
                    </div>

                    <div>
                      <p class="text-xs text-gray-400 uppercase tracking-wide mb-1.5">Адрес</p>
                      <p class="text-gray-700 leading-snug">{{ CONTACTS.address }}</p>
                    </div>

                    <div>
                      <p class="text-xs text-gray-400 uppercase tracking-wide mb-1.5">Время работы</p>
                      <p class="text-gray-700">{{ CONTACTS.worktime }}</p>
                    </div>

                    <!-- Open / closed badge -->
                    <div
                      class="rounded-xl px-3 py-2.5 font-medium"
                      :class="isOpen ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'"
                      aria-live="polite"
                      aria-atomic="true"
                    >
                      <div class="flex items-center gap-2">
                        <span
                          class="w-2 h-2 rounded-full shrink-0"
                          :class="isOpen ? 'bg-green-500 animate-pulse' : 'bg-red-500'"
                          aria-hidden="true"
                        />
                        <span class="flex-1">
                          {{ isOpen ? 'Салон открыт' : closedMessage }}
                        </span>
                        <span v-if="isOpen && timeUntilCloseText" class="text-xs text-gray-400 shrink-0">
                          ({{ timeUntilCloseText }})
                        </span>
                      </div>
                    </div>

                    <div>
                      <p class="text-xs text-gray-400 uppercase tracking-wide mb-1.5">Email</p>
                      <a
                        :href="`mailto:${CONTACTS.email}`"
                        class="underline underline-offset-2 hover:text-teal-600 transition-colors duration-200"
                      >
                        {{ CONTACTS.email }}
                      </a>
                    </div>

                    <button
                      type="button"
                      class="btn btn-primary w-full justify-center inline-flex items-center gap-2"
                      @click="callPrimary"
                    >
                      <img src="/svg/phone-call.svg" alt="" class="w-4 h-4" />
                      Позвонить
                    </button>

                  </div>
                </div>
              </Transition>
            </div>
          </div>

          <!-- Mobile: socials + burger -->
          <div class="md:hidden flex items-center gap-2.5 ml-auto">
            <a
              v-for="s in SOCIAL_NETWORKS"
              :key="s.name"
              :href="s.url"
              target="_blank"
              rel="noopener noreferrer"
              :aria-label="`${s.label} (открывается в новой вкладке)`"
            >
              <img :src="s.icon" :alt="s.label" class="w-7 h-7" width="28" height="28" />
            </a>

            <button
              ref="burgerBtnRef"
              type="button"
              class="w-10 h-10 flex items-center justify-center rounded-xl
                     hover:bg-gray-100 transition-colors shrink-0"
              :aria-expanded="mobileOpen"
              :aria-label="mobileOpen ? 'Закрыть меню' : 'Открыть меню'"
              aria-controls="mobile-menu"
              @click="toggleMobileMenu"
            >
              <!-- Иконки в aria-hidden — смысл несёт aria-label кнопки -->
              <svg v-if="!mobileOpen" class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16"/>
              </svg>
              <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          </div>

        </div>
      </div>

    </div><!-- /container -->

    <!-- ── Mobile menu ── -->
    <Transition name="fade-slide">
      <div
        v-if="mobileOpen"
        id="mobile-menu"
        ref="mobileMenuRef"
        role="dialog"
        aria-label="Мобильное меню"
        aria-modal="true"
        class="md:hidden fixed left-0 right-0 z-40 mx-4 rounded-2xl
               bg-white border border-gray-100 p-4"
        :style="{
          top: `calc(1rem + env(safe-area-inset-top, 0px) + ${HEADER_HEIGHT}px + 0.75rem)`
        }"
      >
        <nav aria-label="Мобильная навигация">
          <ul class="flex flex-col gap-1" role="list">
            <li v-for="link in NAV_LINKS" :key="link.href">
              <a
                :href="link.href"
                class="block px-4 py-3 rounded-xl transition-colors text-base font-medium"
                :class="isActive(link.href)
                  ? 'bg-gray-100 text-gray-900'
                  : 'hover:bg-gray-50 text-gray-600'"
                :aria-current="isActive(link.href) ? 'page' : undefined"
                @click="closeMobileMenu"
              >
                {{ link.label }}
              </a>
            </li>
          </ul>

          <!-- Open/closed badge mobile -->
          <div
            class="mt-2 rounded-xl px-4 py-3 text-sm font-medium"
            :class="isOpen ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'"
            aria-live="polite"
            aria-atomic="true"
          >
            <div class="flex items-center gap-2">
              <span
                class="w-2 h-2 rounded-full shrink-0"
                :class="isOpen ? 'bg-green-500 animate-pulse' : 'bg-red-500'"
                aria-hidden="true"
              />
              <span class="flex-1">
                {{ isOpen ? 'Салон открыт' : closedMessage }}
              </span>
              <span v-if="isOpen && timeUntilCloseText" class="text-xs text-gray-400 shrink-0">
                ({{ timeUntilCloseText }})
              </span>
            </div>
          </div>

          <!-- Phone buttons -->
          <div class="pt-3 mt-1 border-t border-gray-100 flex flex-col gap-2">
            <a
              v-for="p in CONTACTS.phones"
              :key="p.raw"
              :href="`tel:${p.raw}`"
              class="btn btn-primary text-center justify-center"
              @click="closeMobileMenu"
            >
              {{ p.label }}
            </a>
          </div>
        </nav>
      </div>
    </Transition>

  </header>
</template>