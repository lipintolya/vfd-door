<template>
  <section class="section min-h-screen flex items-center justify-center">
    <div class="container max-w-2xl">
      <div class="text-center">
        <!-- Иконка -->
        <div class="mb-8 flex justify-center">
          <div class="w-24 h-24 rounded-full bg-linear-to-br from-teal-100 to-teal-50 flex items-center justify-center">
            <svg class="w-12 h-12 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>

        <!-- Заголовок -->
        <h1 class="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
          Страница на этапе обновления
        </h1>

        <!-- Описание -->
        <p class="text-xl text-gray-600 mb-4">
          Приносим извинения за предоставленные неудобства
        </p>

        <p class="text-gray-600 mb-8 leading-relaxed">
          Мы активно работаем над улучшением этого раздела сайта. Новая версия будет доступна в ближайшее время.
        </p>

        <!-- Контакты -->
        <div class="bg-gray-50 rounded-lg p-6 mb-8">
          <p class="text-sm text-gray-600 mb-4">
            Если у вас есть вопросы, свяжитесь с нами по телефону:
          </p>
          <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="tel:+79000297888"
              class="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-teal-600 hover:bg-teal-700 text-white font-semibold transition-colors"
            >
              <img src="/svg/phone-call.svg" alt="" class="w-5 h-5" />
              +7 (900) 029-78-88
            </a>
            <a
              href="https://vk.com/vfddoors74"
              target="_blank"
              rel="noopener noreferrer"
              class="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-gray-600 hover:bg-gray-700 text-white font-semibold transition-colors"
            >
              <img src="https://storage.yandexcloud.net/catalog-vfd/icons/vk_logo.svg" alt="" class="w-5 h-5" />
              ВКонтакте
            </a>
          </div>
        </div>

        <!-- Кнопка возврата -->
        <a
          href="/"
          class="inline-flex items-center gap-2 text-teal-600 hover:text-teal-700 font-semibold transition-colors"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
          Вернуться на главную
        </a>
      </div>
    </div>
  </section>
</template>

<style scoped>
.section {
  padding: 4rem 1rem;
}

.container {
  margin: 0 auto;
}

@media (max-width: 640px) {
  .section {
    padding: 2rem 1rem;
  }
}
</style>
