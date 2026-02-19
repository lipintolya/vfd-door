<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import { RouterLink, useRoute } from 'vue-router'

import BurgerIcon from '@/assets/icons/burger.svg'
import CloseIcon from '@/assets/icons/close.svg'

/* ================= CONFIG ================= */
const HEADER_HEIGHT = 72

const LOGO = {
  url: new URL('@/assets/icons/logo.svg', import.meta.url).href,
  alt: 'VFD Кашириных - Интернет-магазин дверных систем',
} as const

const SOCIAL_NETWORKS = [
  {
    name: 'VK',
    label: 'ВКонтакте',
    url: 'https://vk.com/vfddoors174',
    icon: 'https://storage.yandexcloud.net/catalog-vfd/icons/vk_logo.svg',
    ariaLabel: 'VFD Doors ВКонтакте',
  },
  {
    name: 'TG',
    label: 'Telegram',
    url: 'https://t.me/vfddoors174',
    icon: 'https://storage.yandexcloud.net/catalog-vfd/icons/tg_logo.svg',
    ariaLabel: 'VFD Doors Telegram',
  },
] as const

const CONTACTS = {
  phones: [
    { raw: '+79000297888', label: '+7 (900) 029-78-88' },
    { raw: '+79630807888', label: '+7 (963) 080-78-88' },
  ],
  address: 'Челябинск, улица Братьев Кашириных, 131Б',
  worktime: 'Пн–Пт: 10:00 – 19:00  Сб-Вс: 10:00 – 18:00',
  email: 'vfddoors74@mail.ru',
} as const

/* ================= STATE ================= */
const route = useRoute()

const scrolled = ref(false)
const mobileOpen = ref(false)
const contactsOpen = ref(false)

const logoLoaded = ref(false)
const logoError = ref(false)

const contactsBtnRef = ref<HTMLButtonElement | null>(null)
const contactsPanelRef = ref<HTMLDivElement | null>(null)

/* ================= HELPERS ================= */
const isActive = (path: string) => route.path === path

const setHeaderVar = () => {
  document.documentElement.style.setProperty(
    '--header-height',
    `${HEADER_HEIGHT}px`
  )
}

const onScroll = () => {
  scrolled.value = window.scrollY > 20
}

const onKeydown = (ev: KeyboardEvent) => {
  if (ev.key === 'Escape') {
    if (mobileOpen.value) closeMobileMenu()
    closeContacts()
  }
}

/* ================= MOBILE MENU ================= */
const openMobileMenu = () => {
  mobileOpen.value = true
  // Prevent body scroll when menu is open
  const scrollbarWidth = getScrollbarWidth()
  document.body.style.overflow = 'hidden'
  document.body.style.paddingRight = scrollbarWidth + 'px'
  // Fix header shift - add padding to header too
  document.documentElement.style.setProperty('--header-padding-right', scrollbarWidth + 'px')
}

const closeMobileMenu = () => {
  mobileOpen.value = false
  // Restore body scroll
  document.body.style.overflow = ''
  document.body.style.paddingRight = ''
  document.documentElement.style.setProperty('--header-padding-right', '0px')
}

const toggleMobileMenu = () => {
  mobileOpen.value ? closeMobileMenu() : openMobileMenu()
}

// Helper to get scrollbar width and prevent layout shift
const getScrollbarWidth = (): number => {
  const outer = document.createElement('div')
  outer.style.visibility = 'hidden'
  outer.style.overflow = 'scroll'
  document.body.appendChild(outer)
  const inner = document.createElement('div')
  outer.appendChild(inner)
  const scrollbarWidth = outer.offsetWidth - inner.offsetWidth
  outer.parentNode?.removeChild(outer)
  return scrollbarWidth
}

/* ================= CONTACTS ================= */
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

/* ================= LOGO ================= */
const handleLogoLoad = () => {
  logoLoaded.value = true
}

const handleLogoError = () => {
  logoError.value = true
}

/* ================= LIFECYCLE ================= */
onMounted(() => {
  setHeaderVar()
  window.addEventListener('scroll', onScroll, { passive: true })
  window.addEventListener('keydown', onKeydown)
})

onUnmounted(() => {
  window.removeEventListener('scroll', onScroll)
  window.removeEventListener('keydown', onKeydown)
  // Принудительный cleanup для предотвращения утечки памяти
  document.body.style.overflow = ''
  document.body.style.paddingRight = ''
})
</script>

<template>
  <header
    class="fixed inset-x-0 z-60"
    :style="{
      top: `calc(env(safe-area-inset-top, 0px) + 1rem)`,
      paddingLeft: 'env(safe-area-inset-left)',
      paddingRight: `calc(env(safe-area-inset-right) + var(--header-padding-right, 0px))`,
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
              VFD
            </div>
          </div>

          <span class="hidden sm:block text-sm font-bold tracking-wide">
            КАШИРИНЫХ
          </span>
        </RouterLink>

        <!-- DESKTOP NAV -->
        <nav class="hidden md:flex gap-8 text-sm">
          <RouterLink to="/" :class="isActive('/') ? 'text-black' : 'text-gray-600'">
            Главная
          </RouterLink>
          <RouterLink to="/catalog" :class="isActive('/catalog') ? 'text-black' : 'text-gray-600'">
            Каталог
          </RouterLink>
          <RouterLink to="/about" :class="isActive('/about') ? 'text-black' : 'text-gray-600'">
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
              rel="noopener"
              :aria-label="s.ariaLabel"
            >
              <img :src="s.icon" class="w-7 h-7" />
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
                rel="noopener"
                :aria-label="s.ariaLabel"
              >
                <img :src="s.icon" class="w-7 h-7" />
              </a>
            </div>

            <button
              class="w-10 h-10 flex items-center justify-center"
              @click="toggleMobileMenu"
              :aria-expanded="mobileOpen"
              aria-label="Открыть меню навигации"
            >
              <img :src="mobileOpen ? CloseIcon : BurgerIcon" class="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>

      <!-- CONTACTS POPOVER (DESKTOP) -->
      <div
        v-if="contactsOpen"
        ref="contactsPanelRef"
        class="hidden md:block mt-3 ml-auto w-[20rem] rounded-2xl
               bg-white border shadow-lg p-4"
        role="dialog"
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
            <div class="break-words text-gray-700">
              {{ CONTACTS.address }}
            </div>
          </div>

          <div>
            <div class="text-xs text-gray-500 mb-1">Время работы</div>
            <div>{{ CONTACTS.worktime }}</div>
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

      <!-- MOBILE MENU -->
      <Transition name="mobile-menu">
        <div
          v-if="mobileOpen"
          class="md:hidden fixed left-0 right-0 top-[calc(env(safe-area-inset-top)+1rem)] z-50
               mx-4 mt-2 rounded-2xl bg-white border shadow-xl p-4"
        >
          <nav class="flex flex-col gap-3 pt-20">
            <RouterLink 
              to="/" 
              @click="closeMobileMenu"
              class="px-4 py-3 rounded-xl hover:bg-gray-50 transition-colors text-base font-medium"
            >
              Главная
            </RouterLink>
            <RouterLink 
              to="/catalog" 
              @click="closeMobileMenu"
              class="px-4 py-3 rounded-xl hover:bg-gray-50 transition-colors text-base font-medium"
            >
              Каталог
            </RouterLink>
            <RouterLink 
              to="/about" 
              @click="closeMobileMenu"
              class="px-4 py-3 rounded-xl hover:bg-gray-50 transition-colors text-base font-medium"
            >
              О нас
            </RouterLink>

            <div class="pt-3 mt-3 border-t">
              <a
                v-for="p in CONTACTS.phones"
                :key="p.raw"
                :href="`tel:${p.raw}`"
                class="block text-center header-btn mb-2"
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
  background: rgb(20 184 166); /* teal-500 */
}

:focus-visible {
  outline: 2px solid rgb(45 212 191); /* teal-400 */
  outline-offset: 3px;
}

/* Mobile Menu Transition */
.mobile-menu-enter-active,
.mobile-menu-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.mobile-menu-enter-from {
  opacity: 0;
  transform: translateY(-10px);
  pointer-events: none;
}

.mobile-menu-leave-to {
  opacity: 0;
  transform: translateY(-10px);
  pointer-events: none;
}
</style>
