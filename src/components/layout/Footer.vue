<script setup lang="ts">
import { ref } from 'vue'
import AppContainer from '@/components/layout/AppContainer.vue'

const year = new Date().getFullYear()
const isModalOpen = ref(false)

const openModal = () => {
  isModalOpen.value = true
  document.body.style.overflow = 'hidden'
}

const closeModal = () => {
  isModalOpen.value = false
  document.body.style.overflow = ''
}
</script>

<template>
  <footer class="bg-gray-950 text-white/80">
    <AppContainer>
      <div class="pt-16 pb-10">
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          <!-- Brand -->
          <div>
            <div class="flex items-center gap-3 mb-4">
              <span class="text-lg font-semibold text-white">VFD</span>
              <span class="text-xs text-white/50">КАШИРИНЫХ</span>
            </div>
            <p class="text-sm leading-relaxed text-white/70 max-w-xs">
              Фирменный салон дверей и интерьерных решений.
              Архитектурный подход и собственное производство.
            </p>
          </div>

          <!-- Navigation -->
          <nav>
            <h4 class="text-sm font-medium text-white mb-4">Навигация</h4>
            <ul class="space-y-2 text-sm">
              <li key="nav-home"><RouterLink to="/" class="footer-link">Главная</RouterLink></li>
              <li key="nav-catalog"><RouterLink to="/catalog" class="footer-link">Каталог</RouterLink></li>
              <li key="nav-about"><RouterLink to="/about" class="footer-link">О нас</RouterLink></li>
            </ul>
          </nav>

          <!-- Categories -->
          <nav>
            <h4 class="text-sm font-medium text-white mb-4">Категории</h4>
            <ul class="space-y-2 text-sm">
              <li key="cat-interior"><RouterLink to="/catalog" class="footer-link">Межкомнатные</RouterLink></li>
              <li key="cat-entrance"><RouterLink to="/catalog" class="footer-link">Входные</RouterLink></li>
              <li key="cat-partitions"><RouterLink to="/partitions" class="footer-link">Перегородки</RouterLink></li>
            </ul>
          </nav>

          <!-- Contacts -->
          <address class="not-italic">
            <h4 class="text-sm font-medium text-white mb-4">Контакты</h4>
            <ul class="space-y-3 text-sm">
              <li key="contact-phone">
                <a href="tel:+79000297888" class="footer-link text-white">
                  +7 (900) 029-78-88
                </a>
              </li>
              <li key="contact-email">
                <a href="mailto:vfddoors74@mail.ru" class="footer-link">
                  vfddoors74@mail.ru
                </a>
              </li>
              <li key="contact-address" class="text-white/60 text-sm leading-relaxed">
                г. Челябинск, ул. Братьев Кашириных, 131Б
              </li>
            </ul>
          </address>
        </div>

        <div
          class="mt-12 pt-6 border-t border-white/10
                 flex flex-col sm:flex-row gap-4
                 sm:items-center sm:justify-between
                 text-xs text-white/50"
        >
          <span>
            © {{ year }} VFD. Все права защищены.
          </span>
          <span>
            Разработка —
            <a
              href="https://t.me/tolyalipin"
              target="_blank"
              class="text-white/70 hover:text-white transition"
            >
              Анатолий Липин
            </a>
          </span>
        </div>
        
        <!-- Legal Links -->
        <div class="mt-4 text-center text-xs text-white/40">
          <button
            @click="openModal"
            class="hover:text-white/70 transition underline"
          >
            Правовая информация
          </button>
        </div>
      </div>

      <!-- Modal -->
      <div
        v-if="isModalOpen"
        class="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
        @click="closeModal"
      >
        <div
          class="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 relative"
          @click.stop
        >
          <button
            @click="closeModal"
            class="absolute top-4 right-4 w-8 h-8 rounded-full bg-zinc-100 hover:bg-zinc-200 flex items-center justify-center transition-colors"
            aria-label="Закрыть"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <div class="space-y-6">
            <div>
              <h3 class="text-lg font-bold text-zinc-900 mb-3">
                📸 Авторские права
              </h3>
              <p class="text-sm text-zinc-700 leading-relaxed">
                Все изображения, представленные на сайте, являются объектами авторского права VFD Кашириных. Любое использование материалов возможно только с письменного разрешения правообладателя и обязательным указанием источника.
              </p>
            </div>

            <div class="border-t border-zinc-200 pt-4">
              <h3 class="text-lg font-bold text-zinc-900 mb-3">
                ⚠️ Публичная оферта
              </h3>
              <p class="text-sm text-zinc-700 leading-relaxed">
                Сайт не является публичной офертой в соответствии со ст. 437 ГК РФ. Цены указаны для ознакомления и не являются публичной офертой. Актуальную стоимость товаров и услуг уточняйте в фирменном салоне VFD Кашириных или у менеджеров компании.
              </p>
            </div>

            <div class="border-t border-zinc-200 pt-4">
              <h3 class="text-lg font-bold text-zinc-900 mb-3">
                Контакты
              </h3>
              <p class="text-sm text-zinc-700 leading-relaxed">
                г. Челябинск, ул. Братьев Кашириных, 131Б<br />
                Телефон: +7 (900) 029-78-88<br />
                Email: vfddoors74@mail.ru<br />
                Сайт: <a href="https://vfd74.ru" class="text-teal-600 hover:underline">vfd74.ru</a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </AppContainer>
  </footer>
</template>
