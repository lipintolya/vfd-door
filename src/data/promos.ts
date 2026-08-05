/**
 * src/data/promos.ts
 *
 * Акции и спецпредложения — блок Promo.vue на главной показывает активные
 * (validUntil ещё не прошёл), страница /promo-archive — истёкшие.
 *
 * КАК ДОБАВИТЬ АКЦИЮ: добавь объект в конец массива PROMOS. Когда validUntil
 * пройдёт, акция сама уйдёт с главной в архив — ничего вручную переносить
 * не нужно, дата решает.
 */

export interface Promo {
  id:          number
  title:       string
  subtitle:    string
  description: string
  image:       string
  ctaText?:    string
  ctaLink?:    string
  discount?:   string
  validUntil:  string
}

export const PROMOS: Promo[] = [
  {
    id: 1,
    title: 'Бесплатный замер',
    subtitle: 'По Челябинску, при оформлении заказа',
    description:
      'Выезд замерщика по Челябинску — бесплатно при заказе межкомнатных дверей в нашем салоне на Братьев Кашириных. Гарантируем точность замеров и расчёт без лишних позиций.',
    image: 'https://storage.yandexcloud.net/vfd74ru/sale/zamer_render.webp',
    ctaText: 'Подробнее',
    ctaLink: '/contacts',
    discount: 'Бесплатно',
    validUntil: '2026-12-31',
  },
  {
    id: 2,
    title: 'Дверь Бэйсик 1В из наличия',
    subtitle: 'Цвет Эмалекс бежевый — скидка 10%',
    description:
      'Каркасно-щитовая дверь серии Бэйсик с покрытием Эмалекс — идеально гладкая поверхность, устойчивая к царапинам и влаге. Модель 1В в цвете Эмалекс бежевый уже в наличии на складе — не нужно ждать поставку. Комплект (полотно + короб + наличники) — 14 560 ₽. Предложение ограничено: только на складской остаток и до конца августа.',
    image: 'https://storage.yandexcloud.net/vfd74ru/outdoors/basic_render.webp',
    ctaText: 'Узнать наличие',
    ctaLink: '/contacts',
    discount: '-10%',
    validUntil: '2026-08-31',
  },
]
