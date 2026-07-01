/* ============================================================
   Наши работы — портфолио
   Чтобы добавить новую работу: вставь объект PortfolioWork
   в НАЧАЛО массива PORTFOLIO_WORKS.
   ============================================================ */

const CDN_OW = 'https://storage.yandexcloud.net/catalog-vfd/invisible/ourworks/'

export type WorkCategory = 'interior' | 'hidden' | 'partitions' | 'entrance'
export type ObjectType   = 'apartment' | 'house' | 'office' | 'commercial'

export const CATEGORY_LABELS: Record<WorkCategory, string> = {
  interior:   'Межкомнатные',
  hidden:     'Скрытые двери',
  partitions: 'Перегородки',
  entrance:   'Входные',
}

export const OBJECT_TYPE_LABELS: Record<ObjectType, string> = {
  apartment:  'Квартира',
  house:      'Частный дом',
  office:     'Офис',
  commercial: 'Коммерческая недвижимость',
}

export interface PortfolioWork {
  id:          string       // URL slug: '2026-06-17-urban-3room'
  date:        string       // ISO '2026-06-17'
  label:       string       // отображение: '17.06.2026'
  title:       string       // H1 на странице проекта
  description: string       // meta description, ~140 символов
  category:    WorkCategory
  objectType:  ObjectType
  location:    string       // 'Челябинск, ЖК Привилегия'
  story?:      string       // 2-3 предложения о проекте
  model?:      string       // 'Urban 1', 'Секрет', 'Alutech AL60'
  doorCount?:  number       // количество дверей / пролётов
  features?:   string[]     // ['Скрытые петли', 'Без наличников']
  images:      string[]     // images[0] — обложка
}

export const PORTFOLIO_WORKS: PortfolioWork[] = [
  {
    id:          '2026-06-17-sekret-pod-pokrasku',
    date:        '2026-06-17',
    label:       '17.06.2026',
    title:       'Скрытые двери «Секрет» под покраску в частной квартире',
    description: 'Дверь скрытого монтажа «Секрет» — полотно заподлицо со стеной, зазоры выверены вручную. Готово к покраске в цвет стен. Монтаж в Челябинске.',
    category:    'hidden',
    objectType:  'apartment',
    location:    'Челябинск, частный объект',
    story:       'Полотно установлено в одной плоскости со стеной, зазоры выверены вручную — после монтажа дверь готова под покраску в цвет стен.',
    model:       'Секрет',
    features:    ['Короб заподлицо', 'Скрытые петли', 'Без наличников'],
    images: [
      `${CDN_OW}16.06.26/7UN6NAn6RlJoy818Ox6UHyTxUavm1e_Nk32olpTpd38DWB-uy_OVrikpEHd8NPVFmmTdybwyZQvAHtddZbXNAAuR.webp`,
      `${CDN_OW}16.06.26/CF5LXIr2L7_lXBexI7LRGPXOVeUmX44RPSNPP-lkSkTXuADcTd7XzorEV1JUazPZnzF0u00kh1q92F1Id2DN0BNe.webp`,
      `${CDN_OW}16.06.26/tWn2QcmlFut0c3aki_ODzSnm8xfmYMcxpBFOPKdVM8DK8vZeY9IArl-4nyKS0zXn7cmAheL9F4sjr34G1qhl553s.webp`,
      `${CDN_OW}16.06.26/uidj-G7YEZlx-koSXLy4QUJSW-GrP--minZFlWrSnxwvxJ8POKlNOzxeG3AOo5yoIxn9y85cv9DVHxVOEbKEe59n.webp`,
    ],
  },
  {
    id:          '2026-01-05-sekret-chernaya-kromka',
    date:        '2026-01-05',
    label:       '05.01.2026',
    title:       'Скрытые двери «Секрет» с чёрной алюминиевой кромкой',
    description: 'Установка дверей скрытого монтажа «Секрет» с чёрной алюминиевой кромкой по периметру. Минималистичный дизайн, Челябинск.',
    category:    'hidden',
    objectType:  'apartment',
    location:    'Челябинск',
    story:       'Установили дверь скрытого монтажа с чёрной алюминиевой кромкой по периметру.',
    model:       'Секрет',
    features:    ['Чёрная алюминиевая кромка'],
    images: [
      `${CDN_OW}05.01.26/SrSaJHteDxFsF45XRcrxgY1ntwoHiJLdXACpn3C0H32eSurQ4LPGhR9YqAHVEOATSEU3Tw3bBMn_EWe2qMk30uQm.webp`,
      `${CDN_OW}05.01.26/Vri69KHrmJZ5ixVa9KptncDKtNeEUv51UWgWhXKFEMqZ0nZ84URREw_llqwQ4nHKcc8bKJh-MZ_SE4lsfdyFSQU8.webp`,
    ],
  },
  {
    id:          '2025-10-21-sekret-privilegiya',
    date:        '2025-10-21',
    label:       '21.10.2025',
    title:       'Двери скрытого монтажа «Секрет» в ЖК Привилегия',
    description: 'Монтаж дверей скрытого монтажа «Секрет» с чёрной алюминиевой кромкой в ЖК Привилегия, Челябинск. Установка перед финишной отделкой.',
    category:    'hidden',
    objectType:  'apartment',
    location:    'Челябинск, ЖК Привилегия',
    story:       'Установили дверь скрытого монтажа с чёрной алюминиевой кромкой в ЖК Привилегия. Монтаж выполнен перед финишной отделкой стен.',
    model:       'Секрет',
    features:    ['Чёрная алюминиевая кромка', 'Под покраску'],
    images: [
      `${CDN_OW}21.10.25/GVUk8kmwYRgdLkO2nAKVkccb7ZReMFQ6bm4DrPVaYG8k6uoAOmZcr20wr3usWUdS_Fy_mFk80Vs8CvZz3aXui6tE-1.webp`,
      `${CDN_OW}21.10.25/GVUk8kmwYRgdLkO2nAKVkccb7ZReMFQ6bm4DrPVaYG8k6uoAOmZcr20wr3usWUdS_Fy_mFk80Vs8CvZz3aXui6tE.webp`,
      `${CDN_OW}21.10.25/pOSS22itQBq3S9XIiFeQOneKqFxzLZhxhtl8ZP3_Yrnm-uYizzeYzgQguHSSu7mrgZgiQY8m0znFwLKu5seYQ8Qb.webp`,
    ],
  },
  {
    id:          '2025-10-17-sekret-oboi-salon',
    date:        '2025-10-17',
    label:       '17.10.2025',
    title:       'Скрытые двери «Секрет» с поклейкой обоев — выставочный образец',
    description: 'Скрытые двери «Секрет» с обоями прямо на полотне — посмотрите образец в нашем салоне на Братьев Кашириных, 131Б, Челябинск.',
    category:    'hidden',
    objectType:  'commercial',
    location:    'Челябинск, салон ВФД на Кашириных',
    story:       'Реализовали идею с поклейкой обоев на дверь скрытого монтажа. Образец можно посмотреть в нашем фирменном салоне на Кашириных, 131Б.',
    model:       'Секрет',
    features:    ['Обои на полотне', 'Чёрная алюминиевая кромка'],
    images: [
      `${CDN_OW}17.10.25/4a4dICVgZw4zQ6eyxWyX5g57oGMNz6Trzt-g6f3fkxy2Ra4Cd8s3NaEcbOmf-SUdpMvyCmcDiZyx_2sM2UuDzEIJ.webp`,
      `${CDN_OW}17.10.25/7kqCtqhk4MBTHq5TQMKuLFS0bEdKUrxoQoW2rfS6Mxph0m1AyqWpQtGhZ7G6862Lu3OEA3ZrSVwypHKDb_Llckx5.webp`,
      `${CDN_OW}17.10.25/kdIiQ-53bh6U0RfDlzcgk2Xj12-V6RaKAEmtYB2Kzuj-EGQHjcejMjl5pWh4bjMnXXEC-yDbIvc0U1mCB-RkvZ8D.webp`,
    ],
  },
  {
    id:          '2025-07-29-sekret-privilegiya-02',
    date:        '2025-07-29',
    label:       '29.07.2025',
    title:       'Монтаж дверей скрытого монтажа «Секрет» в ЖК Привилегия',
    description: 'Установка 3 дверей скрытого монтажа «Секрет» с чёрной алюминиевой кромкой в квартире ЖК Привилегия, Челябинск.',
    category:    'hidden',
    objectType:  'apartment',
    location:    'Челябинск, ЖК Привилегия',
    story:       'Установили 3 двери скрытого монтажа «Секрет» с чёрной алюминиевой кромкой по периметру в ЖК Привилегия.',
    model:       'Секрет',
    doorCount:   3,
    features:    ['Чёрная алюминиевая кромка', 'Без наличников'],
    images: [
      `${CDN_OW}29.07.25/-tygOqs6wWnQRncuyldbijKD30OM1RSc1rm0INTl1Xf5-7kpZwGgQxV25AAdzllP-FNh7amcKdZ0Lxb7er_V3P6P.webp`,
      `${CDN_OW}29.07.25/A6w3g6VFobsKsLaxAhvYypDKKbhmM5qT16v_5cirjfO-Oww6diFQXoMt4lpjN5-rwjCXh9IvvlhRJRCAOXVbi0x7.webp`,
      `${CDN_OW}29.07.25/L_thnz01M389akNR7PIdwcMnaC2bMpOJoK-P4464-Hu_bogj6prnFk_kvd7Ae6DlAtqWVQseR9BTWeuqPMgEC3CZ.webp`,
      `${CDN_OW}29.07.25/bJnzaZd486cmu-j3C-T_LVXmEWQ_2CZp9PMAIO4HuYVC_mzHjl9cmAIo5yoIxn9y85cv9DVHxVOEbKEe59n.webp`,
      `${CDN_OW}29.07.25/bzDNJ6XEeYDby_Uflth_lNZjvZ9a88OPkGw7VEa2VAniUt-6wE1b--lV8Uy4AojA2Jr8cshdowIhUFfQZfx9_HlEp.webp`,
      `${CDN_OW}29.07.25/wtyYghspdRhfrTNLaeRWb4NIlTxv5EKE4fjYu59AFNATzLNut6rDqFJfDaL4ix2LDryK6YCH8ITGgArplRG7twF0.webp`,
    ],
  },
]
