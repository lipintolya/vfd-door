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

/** Цвет бейджа категории на карточке/странице работы — разные цвета на
    глаз различают категории в сетке (сейчас все были одинаковым teal). */
export const CATEGORY_BADGE_COLORS: Record<WorkCategory, string> = {
  interior:   'bg-[oklch(50.5%_0.213_27.518)]',
  hidden:     'bg-teal-500',
  partitions: 'bg-teal-500',
  entrance:   'bg-teal-500',
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
  features?:   string[]     // ['Скрытые петли', 'Без наличников'] — атрибуты конкретного монтажа
  /** Категориальные метки для будущих фильтров (площадка/покрытие/фурнитура и
      т.п.) — отдельно от features, т.к. это не описание объекта, а признаки
      для поиска/фильтрации. Фильтр по ним пока не реализован, только данные. */
  tags?:       string[]     // ['Загородный дом', 'ПЭТ', 'Внешние петли']
  images:      string[]     // images[0] — обложка
}

export const PORTFOLIO_WORKS: PortfolioWork[] = [
  {
    id:          '2026-08-13-feniks-2-magnoliya',
    date:        '2026-08-13',
    label:       '13.08.2026',
    title:       'Монтаж дверей Феникс 2 эмаль цвета «Магнолия» в Челябинске',
    description: 'Установка эмалевых дверей Феникс 2 в изящном и актуальном цвете «Магнолия». Челябинск.',
    category:    'interior',
    objectType:  'apartment',
    location:    'Челябинск',
    story:       'Цвет «Магнолия» — изящный и актуальный оттенок, который добавляет интерьеру лёгкости и тепла, не теряя строгости эмалевого покрытия. Двери Феникс 2 отлично держат геометрию и хорошо смотрятся как в современных, так и в более классических интерьерах.',
    model:       'Феникс 2',
    features:    ['Эмаль', 'Цвет «Магнолия»'],
    images: [
      'https://storage.yandexcloud.net/vfd74ru/works_prod/13.08.26_fenix2/IMG_20260813_191909.webp',
      'https://storage.yandexcloud.net/vfd74ru/works_prod/13.08.26_fenix2/IMG_20260813_191908.webp',
      'https://storage.yandexcloud.net/vfd74ru/works_prod/13.08.26_fenix2/IMG_20260813_191907.webp',
      'https://storage.yandexcloud.net/vfd74ru/works_prod/13.08.26_fenix2/IMG_20260813_191906.webp',
      'https://storage.yandexcloud.net/vfd74ru/works_prod/13.08.26_fenix2/IMG_20260813_191905.webp',
      'https://storage.yandexcloud.net/vfd74ru/works_prod/13.08.26_fenix2/IMG_20260813_191904.webp',
      'https://storage.yandexcloud.net/vfd74ru/works_prod/13.08.26_fenix2/IMG_20260813_191844.webp',
    ],
  },
  {
    id:          '2026-08-10-innova-banya',
    date:        '2026-08-10',
    label:       '10.08.2026',
    title:       'Монтаж дверей Иннова 02В цвета «Шёлк бежевый» в загородной бане',
    description: 'Установка дверей Иннова 02В цвета «Шёлк бежевый» в загородной бане в Челябинской области — двери гармонично вписались в деревянный интерьер.',
    category:    'interior',
    objectType:  'house',
    location:    'Челябинская область',
    story:       'Двери отлично вписались в интерьер: светлая отделка гармонично сочетается с деревянными полами, фактурными стенами и общей атмосферой загородного отдыха.',
    model:       'Иннова 02В',
    features:    ['Цвет «Шёлк бежевый»'],
    tags:        ['Загородный дом', 'ПЭТ', 'Внешние петли'],
    images: [
      'https://storage.yandexcloud.net/vfd74ru/works_prod/10.08.26_Innova/a7-3z7ZtVUBul-zTxTjFT9hX82TiMp9dQ_q2H9DikICfdFIUgu0lUc-m74qoE-UZwbkpmmG9KVMTUfheO73SPwcd.webp',
      'https://storage.yandexcloud.net/vfd74ru/works_prod/10.08.26_Innova/ctSABCZ85q73IYYaTBpuLad8jMt9MgK9CB3aRR-iisvy8YEjlphZjchFRSLH89iLzMhBC220EigU-ALvHIdbQzg6.webp',
      'https://storage.yandexcloud.net/vfd74ru/works_prod/10.08.26_Innova/wtn7_6T__9cEkWeCadqLNYCpsDhfCutF_VbAnDzrUDcNNR9GGn3qlflxhLIeLOI7JVnGHLEuKN1CjPweH_XuHder.webp',
    ],
  },
  {
    id:          '2026-07-23-feniks-rondo-idilliya',
    date:        '2026-07-23',
    label:       '23.07.2026',
    title:       'Монтаж эмалевых дверей «Феникс Рондо» в коттеджном посёлке «Идиллия»',
    description: 'Монтаж эмалевых дверей «Феникс Рондо» в стиле арт-деко в коттеджном посёлке «Идиллия», Челябинск. Премиальное эмалевое покрытие, чёткие линии.',
    category:    'interior',
    objectType:  'house',
    location:    'Челябинск, коттеджный посёлок «Идиллия»',
    story:       'Монтаж в коттеджном посёлке «Идиллия». В интерьере установлены эмалевые двери «Феникс Рондо» — гармоничное сочетание элегантности и выразительных элементов стиля арт-деко. Чёткие линии, изящные формы и премиальное эмалевое покрытие делают двери стильным акцентом интерьера, подчёркивая вкус владельцев и создавая атмосферу уюта и благородства.',
    model:       'Феникс Рондо',
    features:    ['Эмаль', 'Стиль арт-деко'],
    images: [
      'https://storage.yandexcloud.net/vfd74ru/works_prod/23.07.26_fenix_emal/WDacVRGW8VGWPEjKrxH-qN7rGiyrSk27Vm0UF2oD7uJuc-dd1YpgTFMzyDwEkz9iB5hV0uKxd10w-aVHx2kq2BBa.webp',
      'https://storage.yandexcloud.net/vfd74ru/works_prod/23.07.26_fenix_emal/y1vSUNbfaJB8te9GJwwSX_3cXrIf4LA9ZL3MG6iAgMvePZERSRtYzCQ7HFYxVGSug9UP6MOgdpWVx6uh06oXkYBi.webp',
      'https://storage.yandexcloud.net/vfd74ru/works_prod/23.07.26_fenix_emal/vb1nlvpK7ThrwW8avttqzvqIujkgKE8V96-O5pV3yzLhHds5irSbNhk9hMnTd7IL9YzY90C_1bbElNfJt8XlxcZt.webp',
      'https://storage.yandexcloud.net/vfd74ru/works_prod/23.07.26_fenix_emal/X_sec2cS7Gz5k0sqVfSV_WbrY49UR51bAUI3T1sYy-JixtyUBiSpevJEDXSqO7nQbVo3mUkdT9qXvZtsFPKiCWg-.webp',
      'https://storage.yandexcloud.net/vfd74ru/works_prod/23.07.26_fenix_emal/cGkXPyKSayh80M74ggKI-e5VU44YYVWuIgRsCasbjf7bXzIFeEpDCZQz0ynYSwjQe9kHRHbVOnzFyl8bCB32qJ01.webp',
      'https://storage.yandexcloud.net/vfd74ru/works_prod/23.07.26_fenix_emal/U09bvr-RTc5DtUqZLRR6_DuaiSPa6F1n8Qz8vq71Tam1yRAI0dRhJWRdK63Ftmyy42pNAPETHJ8yt34xHpJH-z2Z.webp',
      'https://storage.yandexcloud.net/vfd74ru/works_prod/23.07.26_fenix_emal/IYEqsV-_OB0zcx0DrpsHjzPtyIbSJ4p1LEpJKLQMQ90V4NoAJ26CM75Ax-uf-ri-h8xutVaNgVEJKqeKmWf5R9aE.webp',
      'https://storage.yandexcloud.net/vfd74ru/works_prod/23.07.26_fenix_emal/IYEqsV-_OB0zcx0DrpsHjzPtyIbSJ4p1LEpJKLQMQ90V4NoAJ26CM75Ax-uf-ri-h8xutVaNgVEJKqeKmWf5R9aE-1.webp',
    ],
  },
  {
    id:          '2026-07-22-innova-lesnoy-ostrov',
    date:        '2026-07-22',
    label:       '22.07.2026',
    title:       'Монтаж дверей серии «Иннова» в цвете «Шёлк Белый» в коттеджном посёлке «Лесной остров»',
    description: 'Установка дверей Иннова 03В и 01В — глухие и со стеклом — в цвете «Шёлк Белый» в коттеджном посёлке «Лесной остров», Челябинск.',
    category:    'interior',
    objectType:  'house',
    location:    'Челябинск, коттеджный посёлок «Лесной остров»',
    story:       'Цвет «Шёлк Белый» — универсальное решение для современных и классических интерьеров. Он визуально делает пространство светлее, гармонично сочетается с любыми оттенками стен и напольных покрытий и остаётся актуальным вне времени.',
    model:       'Иннова 03В, Иннова 01В',
    features:    ['Цвет «Шёлк Белый»', 'Глухие и со стеклом'],
    images: [
      'https://storage.yandexcloud.net/vfd74ru/works_prod/22.07.26_Innova/b_E-N5mLPwpV1erz0Jb1g0bnRbmvA2WSo6HAKHDt0WBj6sduL3i71Fbc-q3imMzaLMRX04khGPGriquDuU--b3zs.webp',
      'https://storage.yandexcloud.net/vfd74ru/works_prod/22.07.26_Innova/1yu0zbctjL621JOBdubsa8rfuHjHJizAUZzJjbqucnrJVVPyy4_MbHe1_bgufkj0pbj30XV1vRTCIvHJ96dwjVkO.webp',
      'https://storage.yandexcloud.net/vfd74ru/works_prod/22.07.26_Innova/AQmaV9k4enBGzZWkVhQdwPa73p6YXISVXN5W9G3wCtxrV3b3euywPHmMf5cR5lL7UBu6Zf0iSdQNuowiGVHPMu6Z.webp',
      'https://storage.yandexcloud.net/vfd74ru/works_prod/22.07.26_Innova/H5T40S0OygVtMJWwe48TjQTV9nFqm7lvlSgRahE4_Rt3QsqKSviC0sWtZV2GV7cdl0VIrp0Zf2F4S5BIJYtcp-0h.webp',
      'https://storage.yandexcloud.net/vfd74ru/works_prod/22.07.26_Innova/SopWxZxymKZD-X7o-i3jhuTO98vZ-i4reuKUkCcO4jR6oO-4cIVIhtlYEbVkvMidmdOz488N0AB5thimtDNiEmqL.webp',
      'https://storage.yandexcloud.net/vfd74ru/works_prod/22.07.26_Innova/kpyiOmT2jSQ4_qzL5yI52ZNYyu8b_-7V299AQbbSSgiwvlF4dzpJ3k4Vh7CA4DekTu4lnaBNXE40Ysm8zomimWF6.webp',
      'https://storage.yandexcloud.net/vfd74ru/works_prod/22.07.26_Innova/o9CinrY5XbO2oK-Tj_rOsTHkORorzlGOtNrkxoP0NApW410rzZqeztBXMl0889EsyRJBqmq2ieT83JqsZutj57cX.webp',
      'https://storage.yandexcloud.net/vfd74ru/works_prod/22.07.26_Innova/pIUlA8sAYfWipeuXyQ4qz4uoXSYR3z_CRg7nMCV39myl8ZdXgo8clXXwr9bG2gf-dV5dedhSpa53M-No8lI2FefT.webp',
      'https://storage.yandexcloud.net/vfd74ru/works_prod/22.07.26_Innova/pmE99gasbURUKdwuqsppmFn-WbF9pwS3M_XqS87jlhC4gFACKn_goHRyBE9pCMyd6DLif0oYZyJonnWYjhI8OW54.webp',
    ],
  },
  {
    id:          '2026-07-13-liniya-vr1-krasitsya',
    date:        '2026-07-13',
    label:       '13.07.2026',
    title:       'Покраска эмалевых дверей «Линия ВР 1» в индивидуальный цвет',
    description: 'Эмалевые двери «Линия ВР 1» окрашены в индивидуальный оттенок вне каталога RAL под дизайн-проект. Челябинск, центральный район.',
    category:    'interior',
    objectType:  'apartment',
    location:    'Челябинск, центральный район',
    story:       'Можно ли красить эмалевые двери? Да — даже если нужного оттенка нет в каталоге RAL. Установили новые эмалевые двери «Линия ВР 1» и подобрали именно тот цвет, который требовался по дизайн-проекту, включая фурнитуру в тон кромке. Дизайн-проект — Оксана Лаврентьева (vk.com/olav.design).',
    model:       'Линия ВР 1',
    features:    ['Индивидуальный цвет (вне RAL)', 'Фурнитура в тон кромке'],
    images: [
      'https://storage.yandexcloud.net/vfd74ru/works_prod/13.07.26_sector/PW10blsDnTOf-SZUI7dmbdxTgZYG1XIFtbMzOkgjhmuIqdV36SS5IwlK3DjeJgNFi_KFOyuftOs5z10lcBobEUbB.webp',
      'https://storage.yandexcloud.net/vfd74ru/works_prod/13.07.26_sector/j17wYkkdOXvmpe_z3GWJSsLF8ZqywUOHg_5vpkCGMakKRoM5n0mjf7oIlQIz1QQmdpMKJ27_y94Sy0DeG-wst5I9.webp',
      'https://storage.yandexcloud.net/vfd74ru/works_prod/13.07.26_sector/eAduEvSO0IUVBH0jODWrrZQBOFZFG6jFIthp7PvDIyWuV00YXrnvYwKOqE3D2ujMSM9vKcm1bjX0cCR15oc2t6B7.webp',
      'https://storage.yandexcloud.net/vfd74ru/works_prod/13.07.26_sector/B1iLLgkUAwlNpohXJOf5rFG0cSNDhavwuHSMC6fSgk3ePTC9eCBgyJit9SI8PfSw2o3ULkgcIzQkz9cHzHiCfKqB.webp',
    ],
  },
  {
    id:          '2026-07-11-emaleks-r1-sery',
    date:        '2026-07-11',
    label:       '11.07.2026',
    title:       'Монтаж дверей Эмалекс Р1 в сером цвете',
    description: 'Глухие и остеклённые двери Эмалекс Р1 в сером цвете — современная классика, вписывается практически в любой интерьер. Челябинск.',
    category:    'interior',
    objectType:  'apartment',
    location:    'Челябинск',
    story:       'Эмалекс Р1 в сером цвете — современная классика, которая легко вписывается практически в любой интерьер. На фото — готовый монтаж: глухие и остеклённые полотна в едином стиле. Серый оттенок выглядит сдержанно и элегантно, подчёркивает светлые стены и древесную текстуру пола, отлично сочетается с чёрной, хромированной или матовой фурнитурой.',
    model:       'Эмалекс Р1',
    features:    ['Серый цвет', 'Глухие и со стеклом'],
    images: [
      'https://storage.yandexcloud.net/vfd74ru/works_prod/11.07.26_emalex/8OJ8s3Dqkj9GAcHUR7zk4c3WOpteyOXwLZqY_EXViePZosxWoKNauvEchEot1_UNmTb6STIVbngZ86yrAJnshLN1.webp',
      'https://storage.yandexcloud.net/vfd74ru/works_prod/11.07.26_emalex/OJrRL-0NYCmCUU6Brr-BIFo-H45Wi9MOU1cuX4Y_wwT4_X6hYOx-HnqF1RSPzoa1IKeoB4KkutLG4wscGeeirUzN.webp',
      'https://storage.yandexcloud.net/vfd74ru/works_prod/11.07.26_emalex/R26Dqm0LFW_uccaPZ4BFiviKt_sCWh6XCYtaXKwN8PeuUw1Dc7_UxTi84Kbg3kBqd7hunzbaCfEbSCkN4F6pXNfJ.webp',
      'https://storage.yandexcloud.net/vfd74ru/works_prod/11.07.26_emalex/ROwgKpfye1c9XLTHt_ZCYbIVqVG2XzZuoz_kAzp7IyFb6g3Qet85-xYbomVs2LljHD7eu0yr9gnTTMbm5gI_bi1M.webp',
      'https://storage.yandexcloud.net/vfd74ru/works_prod/11.07.26_emalex/_43W5DX7vX7HehCUFP59YtpaYz2oIjASRoVkSBwFD4amAAzdZtF71UgCtvy78LdXZahZqcYyWYz3qBFZVEXGxX-G.webp',
      'https://storage.yandexcloud.net/vfd74ru/works_prod/11.07.26_emalex/dDd16bHHpB1JppzRMe4H1eEbyB4-XE8y6gdH8FxNDzcEZTOGbNPnNGGAR9sMr_IhQiskUAP0nV-irK_rI9GM2An-.webp',
      'https://storage.yandexcloud.net/vfd74ru/works_prod/11.07.26_emalex/gY-q0RsgbxvVy_dfi6zs86J361arw5mUf7WMt8xOID-1II72lL735CwdEZz1F0GUoKqDxwhQkaj24usp_sn0hzES.webp',
      'https://storage.yandexcloud.net/vfd74ru/works_prod/11.07.26_emalex/iw_h87YXDRFwRGYi1Hmq8gBKd-_RUnluHEfXEHb-jLalQA3yRXM8_EOJF5UQl8HM4MAXrOOQ1lmg-FUgiUqnRtwR.webp',
    ],
  },
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
