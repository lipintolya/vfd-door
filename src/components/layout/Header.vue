<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'
import { RouterLink, useRoute } from 'vue-router'

import BurgerIcon from '@/assets/icons/burger.svg'
import CloseIcon from '@/assets/icons/close.svg'


const HEADER_HEIGHT = 72
const HEADER_TOP_OFFSET = 16 // 1rem

const LOGO = {
  url: new URL('@/assets/icons/logo.svg', import.meta.url).href,
  alt: 'Двери и перегородки ВФД на Кашириных - Офлайн-магазин дверей и систем открывания',
} as const

const SOCIAL_NETWORKS = [
  {
    name: 'VK',
    label: 'ВКонтакте',
    url: 'https://vk.com/vfddoors174',
    icon: 'https://storage.yandexcloud.net/catalog-vfd/icons/vk_logo.svg',
    ariaLabel: 'Двери ВФД Челябинск на Братьев Кашириных ВКонтакте',
  },
  {
    name: 'TG',
    label: 'Telegram',
    url: 'https://t.me/vfddoors174',
    icon: 'https://storage.yandexcloud.net/catalog-vfd/icons/tg_logo.svg',
    ariaLabel: 'Двери ВФД Челябинск на Братьев Кашириных в Телеграмме',
  },
] as const

const CONTACTS = {
  phones: [
    { raw: '+79000297888', label: '+7 (900) 029-78-88' },
    { raw: '+79630807888', label: '+7 (963) 080-78-88' },
  ],
  address: 'Челябинск, улица Братьев Кашириных, 131Б (Вход с ул.Чичерина)',
  worktime: 'Пн–Пт: 10:00 – 20:00  Сб-Вс: 10:00 – 18:00',
  email: 'vfddoors74@mail.ru',
} as const

const WORK_SCHEDULE = {
  weekday: { open: 10, close: 20 },
  weekend: { open: 10, close: 18 },
} as const


const route = useRoute()

const scrolled = ref(false)
const mobileOpen = ref(false)
const contactsOpen = ref(false)

const logoLoaded = ref(false)
const logoError = ref(false)

const contactsBtnRef = ref<HTMLButtonElement | null>(null)
const contactsPanelRef = ref<HTMLDivElement | null>(null)
const mobileMenuRef = ref<HTMLDivElement | null>(null)
const burgerBtnRef = ref<HTMLButtonElement | null>(null)

const now = ref(new Date())
let timerId: ReturnType<typeof setInterval> | null = null

const isWeekend = computed(() => {
  const day = now.value.getDay()
  return day === 0 || day === 6
})

const workScheduleToday = computed(() => {
  return isWeekend.value ? WORK_SCHEDULE.weekend : WORK_SCHEDULE.weekday
})

const closingTime = computed(() => {
  const schedule = workScheduleToday.value
  const close = new Date(now.value)
  close.setHours(schedule.close, 0, 0, 0)
  return close
})

const isOpen = computed(() => {
  const schedule = workScheduleToday.value
  const currentHour = now.value.getHours()
  return currentHour >= schedule.open && currentHour < schedule.close
})

const timeUntilClose = computed(() => {
  if (!isOpen.value) return null

  const diff = closingTime.value.getTime() - now.value.getTime()

  const hours = Math.floor(diff / (1000 * 60 * 60))
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
  const seconds = Math.floor((diff % (1000 * 60)) / 1000)

  return { hours, minutes, seconds }
})

const timeUntilCloseText = computed(() => {
  const time = timeUntilClose.value
  if (!time) return null

  const hoursStr = time.hours > 0 ? `${time.hours} ч` : ''
  const minStr = time.minutes > 0 || time.hours > 0 ? `${time.minutes} мин` : ''
  const secStr = `${time.seconds} сек`

  return `${hoursStr} ${minStr} ${secStr}`.trim()
})

const nextWorkDay = computed(() => {
  const today = now.value.getDay()
  const schedule = workScheduleToday.value
  const currentHour = now.value.getHours()

  const isClosedToday = isWeekend.value || currentHour >= schedule.close

  let nextDay = today + (isClosedToday ? 1 : 0)
  if (nextDay > 6) nextDay = 0

  return nextDay
})

const nextWorkDayOpenTime = computed(() => {
  const isWeekendNext = nextWorkDay.value === 0 || nextWorkDay.value === 6
  const schedule = isWeekendNext ? WORK_SCHEDULE.weekend : WORK_SCHEDULE.weekday
  const hours = String(schedule.open).padStart(2, '0')
  return `${hours}:00`
})

const closedMessage = computed(() => {
  const todaySchedule = workScheduleToday.value
  const currentHour = now.value.getHours()

  const isClosedForDay = isWeekend.value && (currentHour < todaySchedule.open || currentHour >= todaySchedule.close)
  const isClosedAfterHours = !isWeekend.value && currentHour >= todaySchedule.close

  if (isClosedForDay || isClosedAfterHours) {
    return `Закрыто. Работаем завтра с ${nextWorkDayOpenTime.value}`
  }

  return 'Закрыто'
})


const isActive = (path: string) => route.path === path

const setHeaderVar = () => {
  // ✅ Учитываем высоту хедера + отступ сверху (1rem = 16px)
  // Это значение используется в app.vue как padding-top для <main>
  document.documentElement.style.setProperty(
    '--header-height',
    `${HEADER_HEIGHT + HEADER_TOP_OFFSET}px`
  )
}

const onScroll = () => {
  scrolled.value = window.scrollY > 20
}

const onKeydown = (ev: KeyboardEvent) => {
  if (ev.key === 'Escape') {
    if (mobileOpen.value) closeMobileMenu()
    if (contactsOpen.value) closeContacts()
  }
}

const onClickOutside = (ev: MouseEvent) => {
  const target = ev.target as Node

  if (
    contactsOpen.value &&
    contactsPanelRef.value &&
    !contactsPanelRef.value.contains(target) &&
    !contactsBtnRef.value?.contains(target)
  ) {
    closeContacts()
  }

  if (
    mobileOpen.value &&
    mobileMenuRef.value &&
    !mobileMenuRef.value.contains(target) &&
    !burgerBtnRef.value?.contains(target)
  ) {
    closeMobileMenu()
  }
}

const openMobileMenu = () => {
  mobileOpen.value = true
  document.body.style.overflow = 'hidden'
}

const closeMobileMenu = () => {
  mobileOpen.value = false
  document.body.style.overflow = ''
}

const toggleMobileMenu = () => {
  mobileOpen.value ? closeMobileMenu() : openMobileMenu()
}

const onResize = () => {
  if (window.innerWidth >= 768 && mobileOpen.value) {
    closeMobileMenu()
  }
}

const openContacts = async () => {
  contactsOpen.value = true
  await nextTick()

  const firstFocusable =
    contactsPanelRef.value?.querySelector<HTMLElement>(
      'a, button, [tabindex]:not([tabindex="-1"])'
    )

  firstFocusable?.focus()
}

const closeContacts = () => {
  contactsOpen.value = false
  contactsBtnRef.value?.focus()
}

const toggleContacts = () => {
  contactsOpen.value ? closeContacts() : openContacts()
}

const callPrimary = () => {
  window.location.href = `tel:${CONTACTS.phones[0].raw}`
}

const handleLogoLoad = () => {
  logoLoaded.value = true
}

const handleLogoError = () => {
  logoError.value = true
}


onMounted(() => {
  setHeaderVar()
  window.addEventListener('scroll', onScroll, { passive: true })
  window.addEventListener('keydown', onKeydown)
  window.addEventListener('resize', onResize)
  document.addEventListener('click', onClickOutside, { capture: true })

  timerId = setInterval(() => {
    now.value = new Date()
  }, 1000)
})

onUnmounted(() => {
  window.removeEventListener('scroll', onScroll)
  window.removeEventListener('keydown', onKeydown)
  window.removeEventListener('resize', onResize)
  document.removeEventListener('click', onClickOutside, { capture: true })
  document.body.style.overflow = ''

  if (timerId) {
    clearInterval(timerId)
  }
})
</script>

<template>
  <header
    class="fixed inset-x-0 z-60"
    :style="{
      top: 'calc(env(safe-area-inset-top, 0px) + 1rem)',
      paddingLeft: 'env(safe-area-inset-left)',
      paddingRight: 'env(safe-area-inset-right)',
    }"
  >
    <div class="max-w-7xl mx-auto px-4">
      <div
        class="flex items-center justify-between rounded-full border px-6 py-3.5 transition-all duration-300"
        :class="scrolled
          ? 'bg-white/90 backdrop-blur-md shadow-md'
          : 'bg-gray-50/80 backdrop-blur-sm'"
      >
        <!-- LOGO -->
        <RouterLink to="/" class="flex items-center gap-3 shrink-0">
          <div class="relative w-10 h-10 flex items-center justify-center">
            <div
              v-if="!logoLoaded && !logoError"
              class="absolute inset-0 bg-gray-200 rounded-lg animate-pulse"
            />
            <img
              v-if="!logoError"
              :src="LOGO.url"
              :alt="LOGO.alt"
              class="h-10 w-auto object-contain transition-opacity"
              :class="logoLoaded ? 'opacity-100' : 'opacity-0'"
              loading="lazy"
              decoding="async"
              @load="handleLogoLoad"
              @error="handleLogoError"
            />
            <div
              v-else
              class="w-10 h-10 rounded-lg bg-linear-to-br from-gray-700 to-gray-900
                     text-white flex items-center justify-center text-xs font-bold"
            >
              ВФД
            </div>
          </div>

          <span class="hidden sm:block text-sm font-bold tracking-wide">
            ВФД НА КАШИРИНЫХ
          </span>
        </RouterLink>

        <!-- DESKTOP NAV -->
        <nav class="hidden md:flex gap-8 text-sm">
          <RouterLink to="/" :class="isActive('/') ? 'text-black font-semibold' : 'text-gray-600'">
            Главная
          </RouterLink>
          <RouterLink to="/catalog" :class="isActive('/catalog') ? 'text-black font-semibold' : 'text-gray-600'">
            Каталог
          </RouterLink>
          <RouterLink to="/about" :class="isActive('/about') ? 'text-black font-semibold' : 'text-gray-600'">
            О нас
          </RouterLink>
        </nav>

        <!-- ACTIONS -->
        <div class="flex items-center gap-4">
          <!-- DESKTOP SOCIALS -->
          <div class="hidden md:flex gap-3">
            <a
              v-for="s in SOCIAL_NETWORKS"
              :key="s.name"
              :href="s.url"
              target="_blank"
              rel="noopener noreferrer"
              :aria-label="s.ariaLabel"
            >
              <img :src="s.icon" class="w-7 h-7" :alt="s.label" />
            </a>
          </div>

          <!-- CONTACT BUTTON (DESKTOP ONLY) -->
          <button
            ref="contactsBtnRef"
            class="hidden md:block header-btn"
            @click="toggleContacts"
            aria-haspopup="dialog"
            :aria-expanded="contactsOpen"
          >
            Связаться
          </button>

          <!-- MOBILE SOCIALS + BURGER -->
          <div class="md:hidden flex items-center gap-3">
            <div class="flex gap-2">
              <a
                v-for="s in SOCIAL_NETWORKS"
                :key="s.name"
                :href="s.url"
                target="_blank"
                rel="noopener noreferrer"
                :aria-label="s.ariaLabel"
              >
                <img :src="s.icon" class="w-7 h-7" :alt="s.label" />
              </a>
            </div>

            <button
              ref="burgerBtnRef"
              class="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors shrink-0"
              @click="toggleMobileMenu"
              :aria-expanded="mobileOpen"
              aria-label="Открыть меню навигации"
              type="button"
            >
              <img :src="mobileOpen ? CloseIcon : BurgerIcon" class="w-6 h-6" alt="" />
            </button>
          </div>
        </div>
      </div>

      <!-- CONTACTS POPOVER (DESKTOP ONLY) -->
      <Transition name="fade-slide">
        <div
          v-if="contactsOpen"
          ref="contactsPanelRef"
          class="hidden md:block mt-3 ml-auto w-[20rem] rounded-2xl
                 bg-white border shadow-lg p-4"
          role="dialog"
          aria-label="Контактная информация"
          aria-modal="false"
        >
          <div class="space-y-3 text-sm">
            <div>
              <div class="text-xs text-gray-500 mb-1">Телефоны</div>
              <a
                v-for="p in CONTACTS.phones"
                :key="p.raw"
                :href="`tel:${p.raw}`"
                class="block font-medium hover:text-teal-600 transition-colors"
              >
                {{ p.label }}
              </a>
            </div>

            <div>
              <div class="text-xs text-gray-500 mb-1">Адрес</div>
              <div class="wrap-break-word text-gray-700">
                {{ CONTACTS.address }}
              </div>
            </div>

            <div>
              <div class="text-xs text-gray-500 mb-1">Время работы</div>
              <div>{{ CONTACTS.worktime }}</div>
            </div>

            <div
              class="rounded-xl px-3 py-2.5 text-sm font-medium"
              :class="isOpen ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'"
            >
              <div class="flex items-center gap-2">
                <span
                  class="w-2 h-2 rounded-full shrink-0"
                  :class="isOpen ? 'bg-green-500 animate-pulse' : 'bg-red-500'"
                />
                <span class="flex-1">
                  {{ isOpen ? 'Салон открыт' : closedMessage }}
                </span>
                <span
                  v-if="isOpen && timeUntilCloseText"
                  class="text-xs text-gray-500 shrink-0"
                >
                  ({{ timeUntilCloseText }})
                </span>
              </div>
            </div>

            <div>
              <div class="text-xs text-gray-500 mb-1">Почта</div>
              <a :href="`mailto:${CONTACTS.email}`" class="underline hover:text-teal-600 transition-colors">
                {{ CONTACTS.email }}
              </a>
            </div>

            <button class="header-btn w-full" @click="callPrimary">
              Позвонить
            </button>
          </div>
        </div>
      </Transition>

      <!-- MOBILE MENU -->
      <Transition name="fade-slide">
        <div
          v-if="mobileOpen"
          ref="mobileMenuRef"
          class="md:hidden fixed left-0 right-0 z-55 mx-4 rounded-2xl bg-white border shadow-xl p-4"
          :style="{ top: `calc(1rem + env(safe-area-inset-top, 0px) + ${HEADER_HEIGHT}px + 0.75rem)` }"
          role="navigation"
          aria-label="Мобильное меню"
        >
          <nav class="flex flex-col gap-1">
            <RouterLink
              to="/"
              @click="closeMobileMenu"
              class="px-4 py-3 rounded-xl transition-colors text-base font-medium"
              :class="isActive('/') ? 'bg-gray-100 text-black' : 'hover:bg-gray-50 text-gray-700'"
            >
              Главная
            </RouterLink>
            <RouterLink
              to="/catalog"
              @click="closeMobileMenu"
              class="px-4 py-3 rounded-xl transition-colors text-base font-medium"
              :class="isActive('/catalog') ? 'bg-gray-100 text-black' : 'hover:bg-gray-50 text-gray-700'"
            >
              Каталог
            </RouterLink>
            <RouterLink
              to="/about"
              @click="closeMobileMenu"
              class="px-4 py-3 rounded-xl transition-colors text-base font-medium"
              :class="isActive('/about') ? 'bg-gray-100 text-black' : 'hover:bg-gray-50 text-gray-700'"
            >
              О нас
            </RouterLink>

            <!-- Индикатор работы салона (мобильные) -->
            <div
              class="mt-2 rounded-xl px-4 py-3 text-sm font-medium"
              :class="isOpen ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'"
            >
              <div class="flex items-center gap-2">
                <span
                  class="w-2 h-2 rounded-full shrink-0"
                  :class="isOpen ? 'bg-green-500 animate-pulse' : 'bg-red-500'"
                />
                <span class="flex-1">
                  {{ isOpen ? 'Салон открыт' : closedMessage }}
                </span>
                <span
                  v-if="isOpen && timeUntilCloseText"
                  class="text-xs text-gray-500 shrink-0"
                >
                  ({{ timeUntilCloseText }})
                </span>
              </div>
            </div>

            <div class="pt-3 border-t flex flex-col gap-2">
              <a
                v-for="p in CONTACTS.phones"
                :key="p.raw"
                :href="`tel:${p.raw}`"
                class="block text-center header-btn"
                @click="closeMobileMenu"
              >
                {{ p.label }}
              </a>
            </div>
          </nav>
        </div>
      </Transition>
    </div>
  </header>
</template>

<style scoped>
.header-btn {
  padding: 0.6rem 1.4rem;
  border-radius: 9999px;
  background: #212124;
  color: #fff;
  font-size: 0.875rem;
  font-weight: 600;
  border: none;
  cursor: pointer;
  transition: background-color 0.2s ease, color 0.2s ease;
}

.header-btn:hover {
  background: rgb(20 184 166);
}

:focus-visible {
  outline: 2px solid rgb(45 212 191);
  outline-offset: 3px;
}

.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.fade-slide-enter-from,
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
</style>