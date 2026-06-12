<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, useTemplateRef } from 'vue'

const VK_URL = 'https://vk.com/vfddoors74'

const CATEGORIES = [
  {
    id: 'sliding',
    title: 'Раздвижные перегородки',
    description: 'Полотно уходит вдоль стены или убирается в нишу — экономит место. Идеально для зонирования студий и гостиных.',
    features: ['Нет зоны открывания', 'Ширина до 6 м', 'Тихий механизм', 'Со стеклом и без'],
    image: 'https://storage.yandexcloud.net/catalog-vfd/partitions/sliding.webp',
    stat: '≤6 м', statLabel: 'ширина пролёта',
  },
  {
    id: 'swing',
    title: 'Маятниковые системы',
    description: 'Открываются в обе стороны без дополнительных фурнитурных элементов. Востребованы в ресторанах, офисах и медучреждениях.',
    features: ['Обе стороны', 'Самозакрывание', 'Ударопрочное стекло', 'Нержавеющая фурнитура'],
    image: 'https://storage.yandexcloud.net/catalog-vfd/partitions/swing.webp',
    stat: '360°', statLabel: 'открывание',
  },
  {
    id: 'stationary',
    title: 'Стационарные перегородки',
    description: 'Жёсткие конструкции от пола до потолка. Максимальная звуко- и теплоизоляция, полное или частичное остекление.',
    features: ['До потолка', 'Матовое / прозрачное', 'Комбинация с дверью', 'Любая высота'],
    image: 'https://storage.yandexcloud.net/catalog-vfd/partitions/stationary.webp',
    stat: '40 дБ', statLabel: 'звукоизоляция',
  },
  {
    id: 'office',
    title: 'Офисные системы',
    description: 'Модульные алюминиевые системы для open space. Легко демонтируются и переносятся при перепланировке.',
    features: ['Модульная сборка', 'Электрика внутри', 'RAL любой цвет', 'Быстрый монтаж'],
    image: 'https://storage.yandexcloud.net/catalog-vfd/partitions/office.webp',
    stat: '1 день', statLabel: 'монтаж до 10 м²',
  },
] as const

const ADVANTAGES = [
  { title: 'Алюминиевый профиль', text: 'Анодированный или порошковый — не ржавеет, не деформируется, сохраняет геометрию десятилетиями.' },
  { title: 'Закалённое стекло', text: 'Толщина 6–10 мм, триплекс — безопасно, не рассыпается при ударе. Матовое, прозрачное, тонированное.' },
  { title: 'Замер и проект', text: 'Выезжаем на объект, составляем чертёж и смету. Нестандартные размеры и скошенные потолки — без доплат.' },
  { title: 'Монтаж за 1 день', text: 'Бригада выезжает по Челябинску и области. Перегородка до 10 м² устанавливается за один рабочий день.' },
  { title: 'Гарантия 2 года', text: 'На все конструкции и фурнитуру. Сервисный выезд при любой неисправности в течение гарантийного срока.' },
  { title: 'Производство 45 дней', text: 'Изготовление в течение 45 дней после оформления заказа. Доставка по Челябинску включена.' },
] as const

const STEPS = [
  { num: '01', title: 'Заявка в ВК', text: 'Напишите нам — расскажите задачу, пришлите фото или чертёж.' },
  { num: '02', title: 'Замер', text: 'Бесплатный выезд специалиста на объект в Челябинске.' },
  { num: '03', title: 'Проект', text: 'Чертёж и смета в течение 1 рабочего дня.' },
  { num: '04', title: 'Монтаж', text: 'Производство и установка в согласованный срок.' },
] as const

/* ── Entrance animation ── */
const sectionRef = useTemplateRef<HTMLElement>('sectionEl')
const visible = ref(false)
let observer: IntersectionObserver | null = null

onMounted(() => {
  const el = sectionRef.value
  if (!el) return
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    visible.value = true
    return
  }
  observer = new IntersectionObserver(
    ([entry]) => {
      if (entry?.isIntersecting) { visible.value = true; observer?.disconnect() }
    },
    { threshold: 0.1 }
  )
  observer.observe(el)
})

onBeforeUnmount(() => observer?.disconnect())
</script>

<template>

  <!-- ══ Hero ══════════════════════════════════════════════════ -->
  <section class="part-hero">
    <div class="absolute inset-0" aria-hidden="true">
      <img
        src="https://storage.yandexcloud.net/catalog-vfd/alum/alum-1.webp"
        alt=""
        class="w-full h-full object-cover object-center"
        loading="eager"
        decoding="async"
      />
      <div class="absolute inset-0 bg-linear-to-t from-black/75 via-black/45 to-black/20" />
    </div>
    <div class="container relative z-10 flex flex-col justify-end h-full py-12 sm:py-16">
      <p class="part-eyebrow">Алюминиевые системы ВФД</p>
      <h1 class="part-hero__title">
        Стеклянные и алюминиевые<br class="hidden sm:block" />
        перегородки в Челябинске
      </h1>
      <p class="part-hero__lead">
        Производство и монтаж раздвижных, маятниковых и стационарных перегородок.
        Офисные модульные системы, зонирование квартир и частных домов.
      </p>
      <div class="flex flex-wrap gap-3 mt-6">
        <a
          :href="VK_URL"
          target="_blank"
          rel="noopener noreferrer"
          class="btn btn-ghost"
        >
          Написать в ВКонтакте
          <svg class="btn-arrow-icon" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </a>
        <a href="#categories" class="btn btn-ghost">
          Смотреть системы
        </a>
      </div>

      <!-- Stat row -->
      <div class="part-hero__stats">
        <div class="part-hero__stat"><strong>10+</strong><span>лет на рынке</span></div>
        <div class="part-hero__stat"><strong>500+</strong><span>объектов</span></div>
        <div class="part-hero__stat"><strong>2 года</strong><span>гарантия</span></div>
        <div class="part-hero__stat"><strong>45 дней</strong><span>производство</span></div>
      </div>
    </div>
  </section>

  <!-- ══ Categories ════════════════════════════════════════════ -->
  <section
    id="categories"
    ref="sectionEl"
    class="section part-cats-section"
    aria-labelledby="part-cats-heading"
  >
    <div class="container">
      <header class="part-section-head" :class="{ 'is-visible': visible }">
        <p class="part-eyebrow-dark">Виды перегородок</p>
        <h2 id="part-cats-heading" class="part-section-title">Подберём систему под проект</h2>
        <p class="part-section-lead">Жилые и коммерческие объекты — от студии до офиса</p>
      </header>

      <ul class="part-cats-grid" role="list">
        <li
          v-for="(cat, idx) in CATEGORIES"
          :key="cat.id"
          class="features-card"
          :class="{ 'is-visible': visible }"
          :style="{ '--delay': `${idx * 100}ms` }"
          role="listitem"
        >
          <!-- Image -->
          <div class="features-card__media" aria-hidden="true">
            <img
              :src="cat.image"
              :alt="cat.title"
              class="features-card__image"
              loading="lazy"
              decoding="async"
              width="480"
              height="270"
              @error="($event.target as HTMLImageElement).closest<HTMLElement>('.features-card__media')!.style.background='linear-gradient(135deg,#f0fdfa,#e6f7f5)'"
            />
            <div class="features-card__stat">
              <span class="features-card__stat-num">{{ cat.stat }}</span>
              <span class="features-card__stat-label">{{ cat.statLabel }}</span>
            </div>
          </div>

          <!-- Body -->
          <div class="features-card__body">
            <div class="features-card__content">
              <h3 class="features-card__title">{{ cat.title }}</h3>
              <p class="features-card__text">{{ cat.description }}</p>
              <ul class="part-features-list" aria-label="Особенности">
                <li v-for="f in cat.features" :key="f">
                  <svg fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 16 16" aria-hidden="true">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M3 8l3.5 3.5L13 4"/>
                  </svg>
                  {{ f }}
                </li>
              </ul>
            </div>
            <a
              :href="VK_URL"
              target="_blank"
              rel="noopener noreferrer"
              class="btn btn-accent"
              style="align-self: flex-start"
            >
              Узнать цену в ВК
              <svg class="btn-arrow-icon" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </a>
          </div>
        </li>
      </ul>
    </div>
  </section>

  <!-- ══ Advantages ════════════════════════════════════════════ -->
  <section class="section" style="background:#fff" aria-labelledby="part-adv-heading">
    <div class="container">
      <header class="part-section-head" :class="{ 'is-visible': visible }">
        <p class="part-eyebrow-dark">Почему выбирают нас</p>
        <h2 id="part-adv-heading" class="part-section-title">Работаем с 2014 года</h2>
        <p class="part-section-lead">Знаем все нюансы монтажа в Челябинске — от замера до сдачи объекта</p>
      </header>
      <ul class="part-adv-grid" role="list">
        <li
          v-for="(adv, idx) in ADVANTAGES"
          :key="adv.title"
          class="features-card part-adv-card"
          :class="{ 'is-visible': visible }"
          :style="{ '--delay': `${idx * 80}ms` }"
          role="listitem"
        >
          <div class="features-card__body">
            <div class="features-card__content">
              <h3 class="features-card__title">{{ adv.title }}</h3>
              <p class="features-card__text">{{ adv.text }}</p>
            </div>
          </div>
        </li>
      </ul>
    </div>
  </section>

  <!-- ══ How it works ══════════════════════════════════════════ -->
  <section class="section part-steps-section" aria-labelledby="part-steps-heading">
    <div class="container">
      <header class="part-section-head" :class="{ 'is-visible': visible }">
        <p class="part-eyebrow-dark">Как это работает</p>
        <h2 id="part-steps-heading" class="part-section-title">От заявки до готовой перегородки</h2>
      </header>
      <ol class="part-steps" role="list">
        <li
          v-for="(step, idx) in STEPS"
          :key="step.num"
          class="part-step features-card"
          :class="{ 'is-visible': visible }"
          :style="{ '--delay': `${idx * 100}ms` }"
        >
          <div class="features-card__body">
            <div class="features-card__content">
              <span class="part-step__num" aria-hidden="true">{{ step.num }}</span>
              <h3 class="features-card__title">{{ step.title }}</h3>
              <p class="features-card__text">{{ step.text }}</p>
            </div>
          </div>
        </li>
      </ol>
    </div>
  </section>

  <!-- ══ CTA Banner ════════════════════════════════════════════ -->
  <section class="part-cta-section section" aria-labelledby="part-cta-heading">
    <div class="container">
      <div class="part-cta">
        <div class="part-cta__text">
          <p class="part-eyebrow">Получите расчёт бесплатно</p>
          <h2 id="part-cta-heading" class="part-hero__title" style="font-size: clamp(1.5rem,3vw,2rem); margin-bottom: 0.5rem">
            Напишите нам в ВКонтакте
          </h2>
          <p style="color: rgba(255,255,255,0.7); font-size: 0.975rem; margin: 0">
            Пришлите фото или замеры — рассчитаем стоимость и предложим варианты.
            Выезд специалиста по Челябинску и области.
          </p>
        </div>
        <a
          :href="VK_URL"
          target="_blank"
          rel="noopener noreferrer"
          class="btn btn-ghost part-cta__btn"
        >
          <img
            src="/svg/w_vk.svg"
            alt=""
            class="w-5 h-5"
            aria-hidden="true"
          />
          Написать в ВКонтакте
        </a>
      </div>
    </div>
  </section>

</template>

<style scoped>
/* ── Hero ── */
.part-hero {
  position: relative;
  min-height: clamp(420px, 55vw, 640px);
  display: flex;
  flex-direction: column;
}

.part-hero__title {
  margin: 0.5rem 0 1rem;
  color: #fff;
  font-size: clamp(1.85rem, 4.5vw, 3rem);
  font-weight: 800;
  line-height: 1.12;
  letter-spacing: -0.02em;
}

.part-hero__lead {
  max-width: 560px;
  color: rgba(255,255,255,0.78);
  font-size: clamp(0.95rem, 2vw, 1.1rem);
  line-height: 1.65;
  margin: 0;
}

.part-hero__stats {
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem;
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 1px solid rgba(255,255,255,0.15);
}

.part-hero__stat {
  display: flex;
  flex-direction: column;
  gap: 0.1rem;
}

.part-hero__stat strong {
  color: #fff;
  font-size: 1.4rem;
  font-weight: 900;
  line-height: 1;
}

.part-hero__stat span {
  color: rgba(255,255,255,0.55);
  font-size: 0.72rem;
  font-weight: 600;
}

/* ── Section header typography ── */
.part-section-head {
  max-width: 52rem;
  margin-bottom: clamp(2.5rem, 5vw, 4rem);
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 600ms ease-out, transform 600ms ease-out;
}

.part-section-head.is-visible {
  opacity: 1;
  transform: translateY(0);
}

/* Eyebrow on dark bg */
.part-eyebrow {
  display: inline-block;
  margin-bottom: 0.85rem;
  color: #5eead4;
  font-size: 0.75rem;
  font-weight: 800;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

/* Eyebrow on light bg — matches features/catalog pattern */
.part-eyebrow-dark {
  margin: 0 0 0.85rem;
  color: var(--color-accent-hover);
  font-size: 0.75rem;
  font-weight: 800;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

.part-section-title {
  margin: 0 0 1rem;
  color: #0f172a;
  font-size: clamp(2rem, 4.5vw, 3rem);
  font-weight: 800;
  line-height: 1.12;
  letter-spacing: -0.02em;
}

.part-section-lead {
  margin: 0;
  max-width: 42rem;
  color: #475569;
  font-size: clamp(1rem, 2vw, 1.125rem);
  line-height: 1.65;
}

/* ── Categories section ── */
.part-cats-section {
  background:
    radial-gradient(ellipse 70% 50% at 50% 0%, color-mix(in srgb, #14b8a6 8%, transparent), transparent),
    #f8f9fa;
}

.part-cats-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: clamp(1rem, 2.5vw, 1.5rem);
  list-style: none;
  padding: 0;
  margin: 0;
}

/* Feature list inside card */
.part-features-list {
  list-style: none;
  padding: 0;
  margin: 0.65rem 0 0;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.3rem 0.75rem;
}

.part-features-list li {
  display: flex;
  align-items: center;
  gap: 0.35rem;
  font-size: 0.8rem;
  color: #334155;
  font-weight: 600;
}

.part-features-list svg {
  width: 0.9rem;
  height: 0.9rem;
  color: var(--color-accent-hover);
  flex-shrink: 0;
}

/* ── Advantages grid ── */
.part-adv-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: clamp(1rem, 2.5vw, 1.5rem);
  list-style: none;
  padding: 0;
  margin: 0;
}

/* Adv card — no image, just body */
.part-adv-card {
  min-height: 0;
}

/* ── Steps section ── */
.part-steps-section {
  background: #f8f9fa;
}

.part-steps {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: clamp(1rem, 2.5vw, 1.5rem);
  list-style: none;
  padding: 0;
  margin: 0;
  counter-reset: step;
}

.part-step {
  text-align: center;
}

.part-step__num {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 3rem;
  height: 3rem;
  border-radius: 9999px;
  background: linear-gradient(135deg, #0f172a, #1e293b);
  color: #5eead4;
  font-size: 0.85rem;
  font-weight: 900;
  margin-bottom: 0.85rem;
}

/* ── CTA Banner ── */
.part-cta-section {
  background: linear-gradient(135deg, #0f172a 0%, #1e293b 60%, #0f3d38 100%);
}

.part-cta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 2rem;
  flex-wrap: wrap;
}

.part-cta__btn {
  flex-shrink: 0;
  padding: 0.75rem 1.75rem;
  font-size: 0.9375rem;
}

/* ── Responsive ── */
@media (max-width: 900px) {
  .part-adv-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 768px) {
  .part-cats-grid {
    grid-template-columns: 1fr;
  }
  .part-steps {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  .part-cta {
    flex-direction: column;
    text-align: center;
  }
  .part-cta__btn {
    width: 100%;
    justify-content: center;
  }
}

@media (max-width: 560px) {
  .part-adv-grid {
    grid-template-columns: 1fr;
  }
  .part-steps {
    grid-template-columns: 1fr;
  }
  .part-features-list {
    grid-template-columns: 1fr;
  }
}

@media (prefers-reduced-motion: reduce) {
  .part-section-head {
    opacity: 1;
    transform: none;
    transition: none;
  }
}
</style>
