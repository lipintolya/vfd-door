<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import AppSection from '@/components/layout/AppSection.vue'
import AppContainer from '@/components/layout/AppContainer.vue'

interface Article {
  id: string
  title: string
  excerpt: string
  content: string
  category: 'guide' | 'news' | 'tips' | 'promo'
  image: string
  readTime: number
  date: string
  featured?: boolean
  popular?: boolean
  seoTitle?: string
  seoDescription?: string
}

interface BentoItem {
  id: string
  type: 'article'
  article?: Article
  colspan?: number
  rowspan?: number
}

/* ============================================
   ARTICLES DATA
============================================ */
const articles: Article[] = [
  {
    id: '1',
    title: 'Как выбрать межкомнатную дверь в Челябинске: полное руководство 2025',
    excerpt: 'Разбираемся в материалах, покрытиях и конструкциях. Поможем выбрать идеальную дверь для вашего интерьера с учётом климата Челябинска.',
    content: `
      <h2>Введение</h2>
      <p>Выбор межкомнатных дверей в Челябинске имеет свои особенности. Суровый климат, перепады температур и влажность влияют на долговечность конструкций. В этом руководстве мы расскажем, как выбрать двери, которые прослужат десятилетия.</p>

      <h2>1. Материалы дверей</h2>
      <h3>Массив сосны</h3>
      <p>Классический выбор для челябинских квартир. Сосна устойчива к перепадам влажности, что важно для нашего климата. Преимущества:</p>
      <ul>
        <li>Экологичность — натуральный материал</li>
        <li>Хорошая звукоизоляция</li>
        <li>Доступная цена</li>
        <li>Ремонтопригодность</li>
      </ul>

      <h3>MDF с покрытием</h3>
      <p>Современное решение, популярное в Челябинске. Покрытия StrongFlex, Emalex обеспечивают защиту от влаги и механических повреждений.</p>

      <h2>2. Типы покрытий</h2>
      <p><strong>StrongFlex (УФ-отверждение)</strong> — инновационное покрытие, устойчивое к царапинам. Идеально для семей с детьми и животными.</p>
      <p><strong>Emalex (экошпон)</strong> — немецкая технология, экологичный материал с защитным слоем лака.</p>
      <p><strong>Эмаль</strong> — классика для стилей Арт Деко, модерн. Требует аккуратного обращения.</p>

      <h2>3. Размеры и проёмы</h2>
      <p>Стандартные размеры для Челябинска:</p>
      <ul>
        <li>Высота: 2000 мм</li>
        <li>Ширина: 600, 700, 800, 900 мм</li>
        <li>Толщина полотна: 35-40 мм</li>
      </ul>
      <p>Важно: в старых домах Челябинска проёмы могут быть нестандартными. Требуется индивидуальный замер.</p>

      <h2>4. Фурнитура</h2>
      <p>Качественные петли и ручки — залог долгой службы. Рекомендуем:</p>
      <ul>
        <li>Скрытые петли — для систем Invisible</li>
        <li>Накладные петли — классический вариант</li>
        <li>Ручки с магнитными защёлками — тихо и надёжно</li>
      </ul>

      <h2>5. Установка в Челябинске</h2>
      <p>Профессиональный монтаж критически важен. Наши специалисты:</p>
      <ul>
        <li>Выполнят замер бесплатно</li>
        <li>Учтут особенности вашего дома</li>
        <li>Установят двери за 1 день</li>
        <li>Дадут гарантию 3 года</li>
      </ul>

      <h2>6. Уход за дверями</h2>
      <p>Для Челябинска с его пылью и перепадами температур рекомендуем:</p>
      <ul>
        <li>Протирать влажной тканью 1-2 раза в неделю</li>
        <li>Избегать абразивных средств</li>
        <li>Смазывать петли раз в год</li>
        <li>Проверять уплотнители</li>
      </ul>

      <h2>Заключение</h2>
      <p>Выбор дверей в Челябинске требует учёта климатических особенностей. Наши специалисты помогут подобрать оптимальное решение под ваш бюджет и интерьер.</p>
    `,
    category: 'guide',
    image: 'https://storage.yandexcloud.net/catalog-vfd/articles/door-guide.webp',
    readTime: 8,
    date: '2025-02-15',
    featured: true,
    seoTitle: 'Как выбрать межкомнатную дверь в Челябинске | Руководство 2025',
    seoDescription: 'Полное руководство по выбору межкомнатных дверей в Челябинске. Материалы, покрытия, размеры, установка. Советы экспертов VFD Doors.',
  },
  {
    id: '2',
    title: 'Алюминиевые перегородки для зонирования в Челябинске: тренды 2025',
    excerpt: 'Минимализм, скрытые короба, максимальное остекление — главные тенденции в дизайне интерьеров Челябинска.',
    content: `
      <h2>Почему алюминиевые перегородки популярны в Челябинске</h2>
      <p>Перегородки из алюминиевого профиля — современное решение для зонирования пространства. В Челябинске они особенно востребованы в новостройках и офисных помещениях.</p>

      <h2>Преимущества для челябинского климата</h2>
      <ul>
        <li>Устойчивость к перепадам температур</li>
        <li>Влагостойкость</li>
        <li>Долговечность (срок службы от 15 лет)</li>
        <li>Лёгкость конструкции</li>
      </ul>

      <h2>Типы систем</h2>
      <p><strong>ГРАФ101</strong> — базовая система для раздвижных перегородок. Оптимальна для жилых помещений.</p>
      <p><strong>ГРАФ102</strong> — усиленный профиль для тяжёлых конструкций. Подходит для коммерческих помещений.</p>
      <p><strong>ГРАФ103</strong> — для распашных систем. Классическое решение.</p>

      <h2>Варианты заполнения</h2>
      <ul>
        <li>Закалённое стекло 4-8 мм</li>
        <li>МДФ-панели</li>
        <li>Зеркала</li>
        <li>Комбинированные решения</li>
      </ul>

      <h2>Сроки изготовления в Челябинске</h2>
      <p>Стандартное изготовление занимает 14-30 дней. Для срочных заказов возможно сокращение срока до 10 дней.</p>

      <h2>Монтаж</h2>
      <p>Установка занимает 1-2 дня. Наши специалисты работают чисто и аккуратно, с соблюдением всех технологий.</p>
    `,
    category: 'news',
    image: 'https://storage.yandexcloud.net/catalog-vfd/articles/partitions-trends.webp',
    readTime: 5,
    date: '2025-02-10',
    popular: true,
    seoTitle: 'Алюминиевые перегородки в Челябинске | Тренды 2025',
    seoDescription: 'Алюминиевые перегородки для зонирования в Челябинске. Современные решения, цены, сроки изготовления. VFD Doors.',
  },
  {
    id: '3',
    title: '5 ошибок при замере дверного проёма',
    excerpt: 'Типичные ошибки и как их избежать. Чек-лист для самостоятельного замера в квартирах Челябинска.',
    content: `
      <h2>Почему важен точный замер</h2>
      <p>Неправильный замер — причина 80% проблем при установке дверей. В Челябинске, где много домов разных серий, это особенно актуально.</p>

      <h2>Ошибка 1: Замер только в одной точке</h2>
      <p>Проемы редко бывают идеально ровными. Замеряйте ширину и высоту минимум в трёх точках.</p>

      <h2>Ошибка 2: Игнорирование кривизны стен</h2>
      <p>Используйте уровень для проверки вертикальности стен. Перекос более 5 мм потребует дополнительной подготовки.</p>

      <h2>Ошибка 3: Неучтённая толщина коробки</h2>
      <p>Коробка добавляет 30-40 мм к ширине полотна. Учитывайте это при расчётах.</p>

      <h2>Ошибка 4: Отсутствие запаса на монтажный шов</h2>
      <p>Оставляйте 15-20 мм с каждой стороны для монтажной пены.</p>

      <h2>Ошибка 5: Замер до укладки чистового пола</h2>
      <p>Высота проёма зависит от уровня чистового пола. Дождитесь укладки покрытия.</p>

      <h2>Чек-лист для замера</h2>
      <ul>
        <li>Рулетка металлическая</li>
        <li>Уровень строительный</li>
        <li>Блокнот для записей</li>
        <li>Фото проёма с разных ракурсов</li>
      </ul>

      <h2>Профессиональный замер в Челябинске</h2>
      <p>Наши специалисты выезжают на замер бесплатно. Точность гарантирована.</p>
    `,
    category: 'tips',
    image: 'https://storage.yandexcloud.net/catalog-vfd/articles/measurement-tips.webp',
    readTime: 4,
    date: '2025-02-05',
    seoTitle: 'Как замерить дверной проём в Челябинске | 5 ошибок',
    seoDescription: 'Типичные ошибки при замере дверных проёмов. Чек-лист для самостоятельного замера. Советы экспертов VFD Doors Челябинск.',
  },
  {
    id: '4',
    title: 'Скидка 15% на серию Innova в Челябинске',
    excerpt: 'Успейте заказать двери Innova по специальной цене. Акция действует в салоне на Кашириных до конца февраля.',
    content: `
      <h2>Акция на серию Innova</h2>
      <p>Только до конца февраля скидка 15% на все двери серии Innova в нашем салоне на Кашириных, 131Б.</p>

      <h2>Почему Innova</h2>
      <ul>
        <li>Покрытие StrongFlex с УФ-отверждением</li>
        <li>Не оставляет отпечатков пальцев</li>
        <li>Устойчиво к царапинам</li>
        <li>6 цветов в наличии</li>
      </ul>

      <h2>Условия акции</h2>
      <ul>
        <li>Скидка 15% на все двери Innova</li>
        <li>При заказе от 3 дверей — бесплатный замер</li>
        <li>При заказе от 5 дверей — скидка на монтаж 10%</li>
      </ul>

      <h2>Адрес салона</h2>
      <p>г. Челябинск, ул. Братьев Кашириных, 131Б</p>
      <p>Режим работы: Пн-Пт 10:00-19:00, Сб-Вс 10:00-18:00</p>
    `,
    category: 'promo',
    image: 'https://storage.yandexcloud.net/catalog-vfd/articles/innova-promo.webp',
    readTime: 2,
    date: '2025-02-18',
    seoTitle: 'Скидка на двери Innova в Челябинске | Акция VFD',
    seoDescription: 'Скидка 15% на серию Innova в Челябинске. Акция в салоне на Кашириных. Успейте заказать выгодно!',
  },
  {
    id: '5',
    title: 'Эмаль или экошпон: сравнение для квартир Челябинска',
    excerpt: 'Сравниваем два популярных покрытия по долговечности, уходу и внешнему виду в условиях челябинского климата.',
    content: `
      <h2>Введение</h2>
      <p>Эмаль и экошпон — два самых популярных покрытия в Челябинске. Разбираемся, что выбрать для вашей квартиры.</p>

      <h2>Эмаль: плюсы и минусы</h2>
      <h3>Плюсы</h3>
      <ul>
        <li>Идеально гладкая поверхность</li>
        <li>Богатая палитра цветов по RAL</li>
        <li>Влагостойкость</li>
        <li>Легко моется</li>
      </ul>
      <h3>Минусы</h3>
      <ul>
        <li>Видны отпечатки пальцев</li>
        <li>Требует аккуратного обращения</li>
        <li>Высокая цена</li>
      </ul>

      <h2>Экошпон: плюсы и минусы</h2>
      <h3>Плюсы</h3>
      <ul>
        <li>Текстура натурального дерева</li>
        <li>Устойчивость к царапинам</li>
        <li>Экологичность</li>
        <li>Средняя ценовая категория</li>
      </ul>
      <h3>Минусы</h3>
      <ul>
        <li>Меньше вариантов цветов</li>
        <li>Требует специального ухода</li>
      </ul>

      <h2>Что выбрать для Челябинска</h2>
      <p>Для челябинского климата с его перепадами влажности рекомендуем:</p>
      <ul>
        <li><strong>Эмаль</strong> — для ванных и кухонь</li>
        <li><strong>Экошпон</strong> — для спален и гостиных</li>
      </ul>

      <h2>Уход</h2>
      <p>Оба покрытия легко моются влажной тканью. Избегайте абразивных средств.</p>
    `,
    category: 'guide',
    image: 'https://storage.yandexcloud.net/catalog-vfd/articles/enamel-vs-ecoshpon.webp',
    readTime: 6,
    date: '2025-01-28',
    seoTitle: 'Эмаль или экошпон: что выбрать в Челябинске | Сравнение',
    seoDescription: 'Сравнение эмали и экошпона для межкомнатных дверей. Плюсы, минусы, уход. Рекомендации для Челябинска.',
  },
]

/* ============================================
   STATE
============================================ */
const isModalOpen = ref(false)
const selectedArticle = ref<Article | null>(null)
const scrollPosition = ref(0)

/* ============================================
   BENTO GRID
============================================ */
const bentoItems = computed<BentoItem[]>(() => {
  const featured = articles.find(a => a.featured) ?? articles[0]
  const remaining = articles.filter(a => a !== featured)

  return [
    {
      id: 'featured',
      type: 'article',
      article: featured,
      colspan: 2,
      rowspan: 2,
    },
    ...remaining.slice(0, 5).map(article => ({
      id: article.id,
      type: 'article' as const,
      article,
      colspan: 1,
      rowspan: 1,
    })),
  ]
})

const categoryColors: Record<string, string> = {
  guide: 'bg-teal-100 text-teal-800',
  news: 'bg-purple-100 text-purple-800',
  tips: 'bg-amber-100 text-amber-800',
  promo: 'bg-red-100 text-red-800',
}

const categoryLabels: Record<string, string> = {
  guide: 'Руководство',
  news: 'Новости',
  tips: 'Советы',
  promo: 'Акция',
}

/* ============================================
   SCROLL LOCK HELPERS
============================================ */
function getScrollbarWidth(): number {
  const outer = document.createElement('div')
  outer.style.cssText = 'visibility:hidden;overflow:scroll;position:absolute;top:-9999px'
  document.body.appendChild(outer)
  const inner = document.createElement('div')
  outer.appendChild(inner)
  const width = outer.offsetWidth - inner.offsetWidth
  outer.remove()
  return width
}

function lockScroll(): void {
  scrollPosition.value = window.scrollY
  const sbw = getScrollbarWidth()
  document.body.style.overflow = 'hidden'
  // Compensate scrollbar to prevent layout shift
  document.body.style.paddingRight = `${sbw}px`
}

function unlockScroll(): void {
  document.body.style.overflow = ''
  document.body.style.paddingRight = ''
  window.scrollTo({ top: scrollPosition.value, behavior: 'instant' })
}

/* ============================================
   MODAL
============================================ */
function openArticle(article: Article): void {
  selectedArticle.value = article
  lockScroll()
  isModalOpen.value = true
}

function closeArticle(): void {
  isModalOpen.value = false
  // Delay unlock until transition completes
  setTimeout(unlockScroll, 300)
  selectedArticle.value = null
}

function handleEscape(e: KeyboardEvent): void {
  if (e.key === 'Escape' && isModalOpen.value) closeArticle()
}

onMounted(() => window.addEventListener('keydown', handleEscape))
onUnmounted(() => {
  window.removeEventListener('keydown', handleEscape)
  unlockScroll()
})

/* ============================================
   FORMATTERS
============================================ */
function formatReadTime(minutes: number): string {
  return minutes < 1 ? '< 1 мин' : `${minutes} мин`
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}
</script>

<template>
  <AppSection size="lg">
    <AppContainer>
      <!-- Header -->
      <div class="mb-10 sm:mb-12">
        <h2 class="text-3xl sm:text-4xl lg:text-5xl font-semibold text-gray-900 mb-3">
          Полезные статьи
        </h2>
        <p class="text-base sm:text-lg text-gray-600 max-w-2xl">
          Руководства, советы и новости о дверях и интерьерных решениях
        </p>
      </div>

      <!-- Bento Grid -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        <div
          v-for="item in bentoItems"
          :key="item.id"
          class="group relative rounded-2xl sm:rounded-3xl overflow-hidden cursor-pointer
                 transition-all duration-300 ease-out
                 hover:shadow-xl hover:-translate-y-1"
          :class="[
            item.colspan === 2 ? 'sm:col-span-2' : 'col-span-1',
            item.rowspan === 2 ? 'sm:row-span-2' : 'row-span-1',
          ]"
          @click="item.article ? openArticle(item.article) : undefined"
        >
          <template v-if="item.type === 'article' && item.article">
            <!-- Background Image -->
            <div class="absolute inset-0">
              <div
                class="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                :style="{ backgroundImage: `url(${item.article.image})` }"
              />
              <div
                class="absolute inset-0 transition-colors duration-300"
                :class="[
                  item.rowspan === 2
                    ? 'bg-linear-to-t from-black/80 via-black/40 to-black/20'
                    : 'bg-linear-to-t from-black/85 via-black/50 to-transparent',
                ]"
              />
            </div>

            <!-- Content -->
            <div
              class="relative z-10 h-full flex flex-col justify-end p-4 sm:p-5 lg:p-6 text-white"
              :class="item.rowspan === 2 ? 'pb-6 sm:pb-8' : ''"
            >
              <span
                class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold mb-3 w-fit"
                :class="categoryColors[item.article.category]"
              >
                {{ categoryLabels[item.article.category] }}
              </span>

              <h3
                class="font-bold text-white leading-tight mb-2 line-clamp-3"
                :class="item.rowspan === 2 ? 'text-xl sm:text-2xl lg:text-3xl' : 'text-base sm:text-lg'"
              >
                {{ item.article.title }}
              </h3>

              <p
                v-if="item.rowspan === 2"
                class="text-sm sm:text-base text-white/80 mb-4 line-clamp-2 hidden sm:block"
              >
                {{ item.article.excerpt }}
              </p>

              <div class="flex items-center gap-3 text-xs sm:text-sm text-white/70">
                <span>⏱ {{ formatReadTime(item.article.readTime) }}</span>
                <span>•</span>
                <span>{{ formatDate(item.article.date) }}</span>
              </div>
            </div>
          </template>
        </div>
      </div>
    </AppContainer>
  </AppSection>

  <!-- ==================== MODAL ==================== -->
  <Teleport to="body">
    <Transition name="modal-fade">
      <div
        v-if="isModalOpen"
        class="modal-overlay"
        role="dialog"
        aria-modal="true"
        :aria-label="selectedArticle?.title"
        @click.self="closeArticle"
      >
        <Transition name="modal-slide">
          <div v-if="isModalOpen" class="modal-sheet">

            <!-- Floating close button — стоит над изображением -->
            <button
              class="modal-close-btn"
              type="button"
              aria-label="Закрыть статью"
              @click="closeArticle"
            >
              <!-- Pixel-perfect SVG X, 12×12 на viewBox 24×24, strokeLinecap=round -->
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <path
                  d="M18 6L6 18M6 6l12 12"
                  stroke="currentColor"
                  stroke-width="2.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </button>

            <!-- Scrollable body -->
            <div class="modal-body" v-if="selectedArticle">

              <!-- Hero image -->
              <div class="modal-hero">
                <img
                  :src="selectedArticle.image"
                  :alt="selectedArticle.seoTitle ?? selectedArticle.title"
                  class="modal-hero-img"
                  loading="lazy"
                  decoding="async"
                />
                <!-- Bottom fade so text starts readable -->
                <div class="modal-hero-fade" />
              </div>

              <!-- Content area -->
              <div class="modal-content-area">

                <!-- Category pill -->
                <span
                  class="modal-category-pill"
                  :class="categoryColors[selectedArticle.category]"
                >
                  {{ categoryLabels[selectedArticle.category] }}
                </span>

                <!-- Title -->
                <h1 class="modal-title">
                  {{ selectedArticle.seoTitle ?? selectedArticle.title }}
                </h1>

                <!-- Meta row -->
                <div class="modal-meta">
                  <span class="modal-meta-item">
                    <!-- Clock icon -->
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                      <circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.75"/>
                      <path d="M12 7v5l3 3" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    {{ formatReadTime(selectedArticle.readTime) }}
                  </span>
                  <span class="modal-meta-dot" aria-hidden="true" />
                  <span class="modal-meta-item">
                    <!-- Calendar icon -->
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                      <rect x="3" y="5" width="18" height="16" rx="2" stroke="currentColor" stroke-width="1.75"/>
                      <path d="M3 10h18M8 3v4M16 3v4" stroke="currentColor" stroke-width="1.75" stroke-linecap="round"/>
                    </svg>
                    {{ formatDate(selectedArticle.date) }}
                  </span>
                </div>

                <!-- Rich article content -->
                <div
                  class="modal-rich-content"
                  v-html="selectedArticle.content"
                />

              </div>
            </div>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
/* ─── Utilities ─── */
.line-clamp-2 {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  overflow: hidden;
}
.line-clamp-3 {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
  line-clamp: 3;
  overflow: hidden;
}

@media (min-width: 640px) {
  .row-span-2 { grid-row: span 2 / span 2; }
  .col-span-2 { grid-column: span 2 / span 2; }
}

/* ─── Modal Overlay ─── */
.modal-overlay {
  position: fixed;
  inset: 0;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  background: rgba(10, 10, 15, 0.65);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
}

/* ─── Modal Sheet ─── */
.modal-sheet {
  position: relative;
  width: 100%;
  max-width: 760px;
  max-height: 92vh;
  background: #fff;
  border-radius: 20px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  box-shadow:
    0 0 0 1px rgba(0, 0, 0, 0.06),
    0 8px 24px rgba(0, 0, 0, 0.08),
    0 32px 64px rgba(0, 0, 0, 0.18);
}

/* ─── Close Button ─── */
/*
  Absolute, floating over the hero image.
  32×32px, circle, white/translucent bg with blur — glass effect.
  Icon is pixel-perfect SVG X at proper optical center.
*/
.modal-close-btn {
  position: absolute;
  top: 16px;
  right: 16px;
  z-index: 10;

  display: flex;
  align-items: center;
  justify-content: center;

  width: 32px;
  height: 32px;
  padding: 0;

  border: none;
  border-radius: 50%;
  cursor: pointer;
  outline: none;

  /* Glass pill look */
  background: rgba(255, 255, 255, 0.88);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  box-shadow:
    0 0 0 1px rgba(0, 0, 0, 0.08),
    0 2px 8px rgba(0, 0, 0, 0.12);

  color: #1a1a1a;
  transition:
    background 0.18s ease,
    box-shadow 0.18s ease,
    transform 0.18s ease,
    color 0.18s ease;
}

.modal-close-btn:hover {
  background: #1a1a1a;
  color: #fff;
  box-shadow:
    0 0 0 1px rgba(0, 0, 0, 0.1),
    0 4px 16px rgba(0, 0, 0, 0.2);
  transform: scale(1.08);
}

.modal-close-btn:active {
  transform: scale(0.96);
}

.modal-close-btn:focus-visible {
  outline: 2px solid #3b82f6;
  outline-offset: 2px;
}

/* ─── Scrollable body ─── */
.modal-body {
  overflow-y: auto;
  flex: 1;
  /* Custom scrollbar */
  scrollbar-width: thin;
  scrollbar-color: #d1d5db transparent;
}
.modal-body::-webkit-scrollbar {
  width: 6px;
}
.modal-body::-webkit-scrollbar-track {
  background: transparent;
}
.modal-body::-webkit-scrollbar-thumb {
  background: #d1d5db;
  border-radius: 999px;
}
.modal-body::-webkit-scrollbar-thumb:hover {
  background: #9ca3af;
}

/* ─── Hero Image ─── */
.modal-hero {
  position: relative;
  width: 100%;
  height: 280px;
  flex-shrink: 0;
  overflow: hidden;
  background: #f3f4f6;
}
.modal-hero-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}
/* Subtle bottom fade to blend into white content */
.modal-hero-fade {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 64px;
  background: linear-gradient(to bottom, transparent, #fff);
}

/* ─── Content Area ─── */
.modal-content-area {
  padding: 24px 32px 40px;
}

/* ─── Category Pill ─── */
.modal-category-pill {
  display: inline-flex;
  align-items: center;
  padding: 4px 12px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.02em;
  margin-bottom: 16px;
}

/* ─── Title ─── */
.modal-title {
  font-size: clamp(1.375rem, 2.5vw, 1.875rem);
  font-weight: 700;
  color: #0f172a;
  line-height: 1.25;
  letter-spacing: -0.02em;
  margin-bottom: 14px;
}

/* ─── Meta row ─── */
.modal-meta {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 28px;
}
.modal-meta-item {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-size: 13px;
  color: #6b7280;
  line-height: 1;
}
.modal-meta-dot {
  width: 3px;
  height: 3px;
  border-radius: 50%;
  background: #d1d5db;
  flex-shrink: 0;
}

/* ─── Rich Article Content ─── */
.modal-rich-content {
  color: #374151;
  line-height: 1.75;
  font-size: 15px;
}
.modal-rich-content :deep(h2) {
  font-size: 1.3rem;
  font-weight: 700;
  color: #0f172a;
  margin-top: 2rem;
  margin-bottom: 0.75rem;
  line-height: 1.3;
  letter-spacing: -0.01em;
}
.modal-rich-content :deep(h3) {
  font-size: 1.1rem;
  font-weight: 600;
  color: #1e293b;
  margin-top: 1.5rem;
  margin-bottom: 0.5rem;
  line-height: 1.4;
}
.modal-rich-content :deep(p) {
  margin-bottom: 1rem;
}
.modal-rich-content :deep(ul) {
  list-style: none;
  padding: 0;
  margin-bottom: 1rem;
}
.modal-rich-content :deep(li) {
  position: relative;
  padding-left: 1.25rem;
  margin-bottom: 0.5rem;
}
.modal-rich-content :deep(li)::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0.55em;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #9ca3af;
}
.modal-rich-content :deep(strong) {
  font-weight: 600;
  color: #0f172a;
}

/* ─── Transitions ─── */

/* Overlay fade */
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.28s ease;
}
.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

/* Sheet slide+scale */
.modal-slide-enter-active {
  transition: opacity 0.28s ease, transform 0.28s cubic-bezier(0.34, 1.36, 0.64, 1);
}
.modal-slide-leave-active {
  transition: opacity 0.22s ease, transform 0.22s cubic-bezier(0.4, 0, 1, 1);
}
.modal-slide-enter-from {
  opacity: 0;
  transform: scale(0.96) translateY(12px);
}
.modal-slide-leave-to {
  opacity: 0;
  transform: scale(0.97) translateY(8px);
}

/* ─── Mobile ─── */
@media (max-width: 600px) {
  .modal-overlay {
    padding: 0;
    align-items: flex-end;
  }
  .modal-sheet {
    max-height: 96vh;
    border-radius: 20px 20px 0 0;
    max-width: 100%;
  }
  .modal-hero {
    height: 220px;
  }
  .modal-content-area {
    padding: 20px 20px 32px;
  }
  .modal-title {
    font-size: 1.25rem;
  }
}
</style>