<template>
  <section class="section">
    <div class="container">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        <!-- Левая колонка: Информация -->
        <div>
          <div class="mb-12">
            <h1 class="text-4xl lg:text-5xl font-bold mb-4 text-gray-900">Контакты</h1>
            <p class="text-lg text-gray-600">Свяжитесь с нами удобным способом</p>
          </div>

          <!-- Телефоны -->
          <div class="mb-8">
            <h3 class="text-sm uppercase tracking-widest text-gray-500 font-semibold mb-4">Телефоны</h3>
            <div class="space-y-3">
              <a
                href="tel:+79000297888"
                class="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors group"
              >
                <div class="w-10 h-10 rounded-full bg-teal-500 flex items-center justify-center shrink-0 group-hover:bg-teal-600 transition-colors">
                  <img src="/svg/w_phone.svg" alt="" class="w-5 h-5" />
                </div>
                <div>
                  <p class="font-semibold text-gray-900 group-hover:text-teal-600 transition-colors">+7 (900) 029-78-88</p>
                  <p class="text-sm text-gray-500">Основной номер</p>
                </div>
              </a>
              <a
                href="tel:+79630807888"
                class="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors group"
              >
                <div class="w-10 h-10 rounded-full bg-teal-500 flex items-center justify-center shrink-0 group-hover:bg-teal-600 transition-colors">
                  <img src="/svg/w_phone.svg" alt="" class="w-5 h-5" />
                </div>
                <div>
                  <p class="font-semibold text-gray-900 group-hover:text-teal-600 transition-colors">+7 (963) 080-78-88</p>
                  <p class="text-sm text-gray-500">Дополнительный номер</p>
                </div>
              </a>
            </div>
          </div>

          <!-- Email -->
          <div class="mb-8">
            <h3 class="text-sm uppercase tracking-widest text-gray-500 font-semibold mb-4">Электронная почта</h3>
            <a
              href="mailto:vfddoors74@mail.ru"
              class="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors group"
            >
              <div class="w-10 h-10 rounded-full bg-teal-500 flex items-center justify-center shrink-0 group-hover:bg-teal-600 transition-colors">
                <img src="/svg/w_mail_logo.svg" alt="" class="w-5 h-5" />
              </div>
              <div>
                <p class="font-semibold text-gray-900 group-hover:text-teal-600 transition-colors">vfddoors74@mail.ru</p>
              </div>
            </a>
          </div>

          <!-- Время работы -->
          <div class="mb-8">
            <h3 class="text-sm uppercase tracking-widest text-gray-500 font-semibold mb-4">Часы работы (летний график)</h3>
            <div class="space-y-2 p-4 bg-gray-50 rounded-lg">
              <div class="flex justify-between">
                <span class="text-gray-600">Пн–Пт</span>
                <span class="font-semibold text-gray-900">10:00–20:00</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Сб</span>
                <span class="font-semibold text-gray-900">11:00–16:00</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Вс</span>
                <span class="font-semibold text-gray-900">Выходной</span>
              </div>
              <p class="text-xs text-gray-500 mt-3 pt-3 border-t border-gray-200">
                По выходным возможна консультация и посещение по предварительной записи
              </p>
            </div>
          </div>

          <!-- Социальные сети -->
          <div class="mb-8">
            <h3 class="text-sm uppercase tracking-widest text-gray-500 font-semibold mb-4">Мы в соцсетях</h3>
            <div class="flex gap-4">
              <a
                href="https://vk.com/vfddoors74"
                target="_blank"
                rel="noopener noreferrer"
                class="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
                aria-label="ВКонтакте"
              >
                <img src="https://storage.yandexcloud.net/catalog-vfd/icons/vk_logo.svg" alt="ВКонтакте" class="w-6 h-6" />
              </a>
              <a
                href="https://t.me/vfddoors174"
                target="_blank"
                rel="noopener noreferrer"
                class="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
                aria-label="Telegram"
              >
                <img src="https://storage.yandexcloud.net/catalog-vfd/icons/tg_logo.svg" alt="Telegram" class="w-6 h-6" />
              </a>
              <a
                href="https://max.ru/id452402308842_biz"
                target="_blank"
                rel="noopener noreferrer"
                class="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
                aria-label="Max"
              >
                <img src="https://storage.yandexcloud.net/catalog-vfd/svg/max-logo.svg" alt="Max" class="w-6 h-6" />
              </a>
            </div>
          </div>
        </div>

        <!-- Правая колонка: Адрес и реквизиты -->
        <div>
          <!-- Адрес -->
          <div class="mb-8">
            <h3 class="text-sm uppercase tracking-widest text-gray-500 font-semibold mb-4">Адрес</h3>
            <div class="bg-gray-50 rounded-lg p-6 mb-6">
              <p class="text-lg font-semibold text-gray-900 mb-2">
                г. Челябинск, ул. Братьев Кашириных, 131Б
              </p>
              <p class="text-gray-600 text-sm mb-4">Вход со стороны ул. Чичерина</p>
              <a
                href="https://yandex.ru/maps/-/CPTwZPi-"
                target="_blank"
                rel="noopener noreferrer"
                class="inline-flex items-center gap-2 text-teal-600 hover:text-teal-700 font-semibold transition-colors"
              >
                Смотреть на карте
                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clip-rule="evenodd" />
                </svg>
              </a>
            </div>

            <!-- Карта (встроенная) -->
            <div class="rounded-lg overflow-hidden h-64 bg-gray-100 mb-6">
              <iframe
                src="https://yandex.ru/map-widget/v1/?ll=61.306572%2C55.172868&amp;z=17&amp;pt=61.306572%2C55.172868&amp;l=map&amp;source=constructor"
                width="100%"
                height="100%"
                frameborder="0"
                style="border: none;"
              />
            </div>
          </div>

          <!-- Реквизиты -->
          <div class="mb-8">
            <h3 class="text-sm uppercase tracking-widest text-gray-500 font-semibold mb-4">Реквизиты компании</h3>
            <div class="bg-gray-50 rounded-lg p-6 space-y-3 text-sm">
              <div>
                <p class="text-xs text-gray-500 mb-1">Собственник</p>
                <p class="font-semibold text-gray-900">Липина Надежда Анатольевна</p>
              </div>
              <div>
                <p class="text-xs text-gray-500 mb-1">Форма деятельности</p>
                <p class="font-semibold text-gray-900">Индивидуальный предприниматель</p>
              </div>
              <div>
                <p class="text-xs text-gray-500 mb-1">ОГРНИП</p>
                <p class="font-semibold text-gray-900 font-mono">323745600047178</p>
              </div>
              <div>
                <p class="text-xs text-gray-500 mb-1">ИНН</p>
                <p class="font-semibold text-gray-900 font-mono">452402308842</p>
              </div>
              <div>
                <p class="text-xs text-gray-500 mb-1">Система налогообложения</p>
                <p class="font-semibold text-gray-900">УСН (упрощённая система)</p>
              </div>
              <div>
                <p class="text-xs text-gray-500 mb-1">Дата регистрации</p>
                <p class="font-semibold text-gray-900">27 марта 2023 г.</p>
              </div>
              <div>
                <p class="text-xs text-gray-500 mb-1">Регистратор</p>
                <p class="font-semibold text-gray-900">Межрайонная инспекция ФНС России № 17 по Челябинской области</p>
              </div>
            </div>
          </div>

          <!-- Способы оплаты -->
          <div>
            <h3 class="text-sm uppercase tracking-widest text-gray-500 font-semibold mb-4">Способы оплаты</h3>
            <div class="bg-gray-50 rounded-lg p-6">
              <ul class="space-y-3">
                <li class="flex items-center gap-3">
                  <svg class="w-5 h-5 text-teal-600 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                  </svg>
                  <span class="text-gray-700">Наличные деньги</span>
                </li>
                <li class="flex items-center gap-3">
                  <svg class="w-5 h-5 text-teal-600 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                  </svg>
                  <span class="text-gray-700">Банковские карты (Visa, MasterCard)</span>
                </li>
                <li class="flex items-center gap-3">
                  <svg class="w-5 h-5 text-teal-600 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                  </svg>
                  <span class="text-gray-700">Переводы через Сбербанк</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <!-- Дополнительная информация -->
      <div class="mt-16 pt-12 border-t border-gray-200">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h4 class="font-semibold text-gray-900 mb-2">Консультации</h4>
            <p class="text-gray-600 text-sm">
              Бесплатная консультация специалиста по подбору дверей и перегородок
            </p>
          </div>
          <div>
            <h4 class="font-semibold text-gray-900 mb-2">Замеры</h4>
            <p class="text-gray-600 text-sm">
              Бесплатный выезд мастера для замера при заказе дверей или перегородок
            </p>
          </div>
          <div>
            <h4 class="font-semibold text-gray-900 mb-2">Гарантия</h4>
            <p class="text-gray-600 text-sm">
              Гарантия на монтажные работы - 12 месяцев, на двери согласно условиям производителя
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.section {
  padding: 4rem 1rem;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
}

@media (max-width: 640px) {
  .section {
    padding: 2rem 1rem;
  }
}
</style>
