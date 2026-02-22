<script setup lang="ts">
import AppContainer from '@/components/layout/AppContainer.vue'

const year = new Date().getFullYear()
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
            © {{ year }} VFD
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
        
        <!-- COPYRIGHT NOTICE -->
        <div class="mt-6 pt-6 border-t border-white/10 text-center">
          <p class="text-xs text-white/40 max-w-2xl mx-auto">
            📸 Все изображения, представленные на сайте, являются объектами авторского права VFD Doors.
            Любое использование материалов возможно только с письменного разрешения правообладателя
            и обязательным указанием источника:
            <a href="https://vfd-door.vercel.app" class="text-white/60 hover:text-white transition underline">vfd-door.vercel.app</a>
          </p>
        </div>
      </div>
    </AppContainer>
  </footer>
</template>
