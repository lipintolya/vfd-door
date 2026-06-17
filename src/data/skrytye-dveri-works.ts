/* ============================================================
   Наши работы — скрытые двери
   Добавляй новые объекты в массив INVISIBLE_WORKS.
   Последний объект — сверху (push в начало массива).
   ============================================================ */

const CDN_WORKS = 'https://storage.yandexcloud.net/catalog-vfd/invisible/ourworks/'

export interface InvisibleWork {
  id:        string    // slug: '2026-06-17-01'
  date:      string    // ISO '2026-06-17'  (Schema.org dateCreated)
  label:     string    // отображение: '17.06.2026'
  title:     string    // заголовок карточки
  desc?:     string    // краткое описание (опционально)
  location?: string    // 'Челябинск' или 'Челябинск, мкр. Северок'
  series?:   'Секрет' | 'Секрет Реверс'
  edge?:     'Чёрная' | 'Серебро' | 'Золото'
  images:    string[]  // полные CDN-ссылки
}

export const INVISIBLE_WORKS: InvisibleWork[] = [
  {
    id:       '2026-06-17-01',
    date:     '2026-06-17',
    label:    '17.06.2026',
    title:    'Скрытые двери «Секрет» под покраску',
    desc:     'Смонтировали скрытые двери серии «Секрет»: алюминиевый короб установлен заподлицо со стеной, полотно навешено на скрытые петли вровень с плоскостью. Полотно в грунте — под последующую покраску в цвет стен. Зазоры выверены, петли регулируемые.',
    location: 'Челябинск',
    series:   'Секрет',
    images: [
      `${CDN_WORKS}16.06.26/7UN6NAn6RlJoy818Ox6UHyTxUavm1e_Nk32olpTpd38DWB-uy_OVrikpEHd8NPVFmmTdybwyZQvAHtddZbXNAAuR.webp`,
      `${CDN_WORKS}16.06.26/CF5LXIr2L7_lXBexI7LRGPXOVeUmX44RPSNPP-lkSkTXuADcTd7XzorEV1JUazPZnzF0u00kh1q92F1Id2DN0BNe.webp`,
      `${CDN_WORKS}16.06.26/tWn2QcmlFut0c3aki_ODzSnm8xfmYMcxpBFOPKdVM8DK8vZeY9IArl-4nyKS0zXn7cmAheL9F4sjr34G1qhl553s.webp`,
      `${CDN_WORKS}16.06.26/uidj-G7YEZlx-koSXLy4QUJSW-GrP--minZFlWrSnxwvxJ8POKlNOzxeG3AOo5yoIxn9y85cv9DVHxVOEbKEe59n.webp`,
    ],
  },
]
