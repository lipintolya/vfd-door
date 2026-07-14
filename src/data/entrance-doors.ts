/* ============================================================
   Входные (металлические) двери — каталог моделей + накладок
   ============================================================
   Архитектура:
   - ENTRANCE_SKINS — общий каталог декоративных накладок (внутренняя
     сторона двери). Один накладка = одна запись (имя + цвет + цвет
     стекла, если есть). Переиспользуется всеми моделями дверей.
   - ENTRANCE_DOOR_MODELS — модели металлических дверей (Оптима и т.д.).
     У каждой модели свой список доступных накладок со своей ценой
     (skinOptions: skinId → price) — цена за накладку зависит от модели,
     сама накладка (имя/цвет/фото) не дублируется.

   ЧТОБЫ ДОБАВИТЬ ФОТО НАКЛАДКИ:
     Найди накладку в ENTRANCE_SKINS по id, впиши URL в поле photo.
     Пока photo пустой — на месте фото показывается цветной свотч-плейсхолдер.

   ЧТОБЫ ДОБАВИТЬ НОВУЮ МОДЕЛЬ ДВЕРИ:
     Добавь объект в ENTRANCE_DOOR_MODELS. Если модель использует уже
     существующие накладки — просто сошлись на их id в skinOptions.
     Если нужна новая накладка (или у существующей появился вариант
     со стеклом) — добавь новую запись в ENTRANCE_SKINS.
   ============================================================ */

const CDN = 'https://storage.yandexcloud.net/vfd74ru/metal_doors/'

export interface EntranceSkin {
  id:          string   // 'niuta-ice'
  name:        string   // 'Niuta'
  color:       string   // 'Ice'
  glassColor?: string   // 'Лакобель Черный' — только у накладок со стеклом
  /** Фото накладки (вид изнутри). Пусто — показывается плейсхолдер. */
  photo:       string
}

export const ENTRANCE_SKINS: EntranceSkin[] = [
  { id: 'niuta-ice',                    name: 'Niuta',        color: 'Ice',                photo: 'https://storage.yandexcloud.net/vfd74ru/metal_doors/Optima/niuta/niuta_ice.webp' },
  { id: 'niuta-steel',                  name: 'Niuta',        color: 'Steel',              photo: 'https://storage.yandexcloud.net/vfd74ru/metal_doors/Optima/niuta/niuta_steel.webp' },
  { id: 'niuta-onyx',                   name: 'Niuta',        color: 'Onyx',               photo: 'https://storage.yandexcloud.net/vfd74ru/metal_doors/Optima/niuta/niuta_onyx.webp' },
  { id: 'niuta-taupe',                  name: 'Niuta',        color: 'Taupe',              photo: 'https://storage.yandexcloud.net/vfd74ru/metal_doors/Optima/niuta/niuta_taupe.webp' },
  { id: 'niuta-midwhite',               name: 'Niuta',        color: 'Midwhite',           photo: 'https://storage.yandexcloud.net/vfd74ru/metal_doors/Optima/niuta/niuta_midwhite.webp' },
  { id: 'niuta-dub-tehas',              name: 'Niuta',        color: 'Дуб Техас',          photo: 'https://storage.yandexcloud.net/vfd74ru/metal_doors/Optima/niuta/niuta_texas.webp' },

  { id: 'stockholm-ice',                name: 'Stockholm',    color: 'White',              photo: 'https://storage.yandexcloud.net/vfd74ru/metal_doors/Optima/niuta/stockholm.webp' },

  { id: 'er1-ice',                      name: 'ER 1',         color: 'Ice',                photo: 'https://storage.yandexcloud.net/vfd74ru/metal_doors/Optima/niuta/er1_ice.webp' },
  { id: 'er1-onyx',                     name: 'ER 1',         color: 'Onyx',               photo: 'https://storage.yandexcloud.net/vfd74ru/metal_doors/Optima/niuta/er1_onyx.webp' },

  { id: 'er2-steel',                    name: 'ER 2',         color: 'Steel',              photo: 'https://storage.yandexcloud.net/vfd74ru/metal_doors/Optima/niuta/er2_steel.webp' },
  { id: 'er2-taupe',                    name: 'ER 2',         color: 'Taupe',              photo: 'https://storage.yandexcloud.net/vfd74ru/metal_doors/Optima/niuta/er2_taupe.webp' },

  { id: 'glanta-ice',                   name: 'Glanta',       color: 'Ice',                photo: 'https://storage.yandexcloud.net/vfd74ru/metal_doors/Optima/niuta/glanta_ice.webp' },
  { id: 'glanta-onyx',                  name: 'Glanta',       color: 'Onyx',               photo: 'https://storage.yandexcloud.net/vfd74ru/metal_doors/Optima/niuta/glanta_onyx.webp' },

  { id: 'dorren-ice',                   name: 'Dorren',       color: 'Ice',                photo: 'https://storage.yandexcloud.net/vfd74ru/metal_doors/Optima/niuta/dorren_ice.webp' },
  { id: 'dorren-midwhite',              name: 'Dorren',       color: 'Midwhite',           photo: 'https://storage.yandexcloud.net/vfd74ru/metal_doors/Optima/niuta/dorren_midwhite.webp' },

  { id: 'atumpro33-dub-arktik',         name: 'Atum Pro 33',  color: 'Дуб Арктический',    glassColor: 'Лакобель Черный', photo: 'https://storage.yandexcloud.net/vfd74ru/metal_doors/Optima/niuta/atum_pro_dubark.webp' },
  { id: 'atumpro33-dub-kamenny',        name: 'Atum Pro 33',  color: 'Дуб Каменный',       glassColor: 'Лакобель Черный', photo: 'https://storage.yandexcloud.net/vfd74ru/metal_doors/Optima/niuta/atum_pro_dubkam.webp' },

  { id: 'e33-ice',                      name: 'E33',          color: 'Ice',                glassColor: 'Лакобель Черный', photo: 'https://storage.yandexcloud.net/vfd74ru/metal_doors/Optima/niuta/e33_ice.webp' },
  { id: 'e33-taupe',                    name: 'E33',          color: 'Taupe',              glassColor: 'Лакобель Черный', photo: 'https://storage.yandexcloud.net/vfd74ru/metal_doors/Optima/niuta/e33_taupe.webp' },
  { id: 'e33-onyx',                     name: 'E33',          color: 'Onyx',               glassColor: 'Лакобель Черный', photo: 'https://storage.yandexcloud.net/vfd74ru/metal_doors/Optima/niuta/e33_onyx.webp' },

  { id: 'graphica-vr-ice',              name: 'Graphica VR',  color: 'Ice',                photo: 'https://storage.yandexcloud.net/vfd74ru/metal_doors/Optima/niuta/graphica_ice.webp' },
  { id: 'graphica-vr-beton-svetly',     name: 'Graphica VR',  color: 'Бетон Светлый',      photo: 'https://storage.yandexcloud.net/vfd74ru/metal_doors/Optima/niuta/graphica_beton.webp' },
  { id: 'graphica-vr-beton-temny',      name: 'Graphica VR',  color: 'Бетон Темный',       photo: 'https://storage.yandexcloud.net/vfd74ru/metal_doors/Optima/niuta/graphica_beton_black.webp' },
  { id: 'graphica-vr-freska-titan',     name: 'Graphica VR',  color: 'Фреска Титан',       photo: '' },

  { id: 'atum5-snezhny',                name: 'Atum 5',       color: 'Снежный',            glassColor: 'Лакобель Черный', photo: 'https://storage.yandexcloud.net/vfd74ru/metal_doors/Optima/niuta/drop2/atum5_ice.webp' },
  { id: 'atum5-belenyi-dub',            name: 'Atum 5',       color: 'Беленый Дуб',        glassColor: 'Лакобель Белый',  photo: 'https://storage.yandexcloud.net/vfd74ru/metal_doors/Optima/niuta/drop2/atum5_whitedub.webp' },
  { id: 'atum5-kapuchino',              name: 'Atum 5',       color: 'Капучино',           glassColor: 'Лакобель Черный', photo: 'https://storage.yandexcloud.net/vfd74ru/metal_doors/Optima/niuta/drop2/atum5_kapuch.webp' },
  { id: 'atum5-dub-sery',               name: 'Atum 5',       color: 'Дуб Серый',          glassColor: 'Лакобель Черный', photo: 'https://storage.yandexcloud.net/vfd74ru/metal_doors/Optima/niuta/drop2/atum5_graydub.webp' },

  { id: 'atumpro32-dub-kamenny',        name: 'Atum Pro 32',  color: 'Дуб Каменный',       photo: 'https://storage.yandexcloud.net/vfd74ru/metal_doors/Optima/niuta/drop2/atumpro32_stone.webp' },

  { id: 'atumpro28-dub-arktik',         name: 'Atum Pro 28',  color: 'Дуб Арктический',    glassColor: 'Лакобель Черный', photo: 'https://storage.yandexcloud.net/vfd74ru/metal_doors/Optima/niuta/drop2/atumpro28_dubark.webp' },
  { id: 'atumpro28-dub-kamenny',        name: 'Atum Pro 28',  color: 'Дуб Каменный',       glassColor: 'Лакобель Черный', photo: 'https://storage.yandexcloud.net/vfd74ru/metal_doors/Optima/niuta/drop2/atumpro28_stonedub.webp' },
  { id: 'atumpro28-dub-krasny',         name: 'Atum Pro 28',  color: 'Дуб Красный',        glassColor: 'Лакобель Черный', photo: 'https://storage.yandexcloud.net/vfd74ru/metal_doors/Optima/niuta/drop2/atumpro28_reddub.webp' },
  { id: 'atumpro28-dub-skandinavsky',   name: 'Atum Pro 28',  color: 'Дуб Скандинавский',  glassColor: 'Лакобель Черный', photo: 'https://storage.yandexcloud.net/vfd74ru/metal_doors/Optima/niuta/drop2/atumpro28_scandi.webp' },
  { id: 'atumpro28-beton-svetly',       name: 'Atum Pro 28',  color: 'Бетон Светлый',      glassColor: 'Лакобель Черный', photo: 'https://storage.yandexcloud.net/vfd74ru/metal_doors/Optima/niuta/drop2/atumpro28_beton.webp' },

  { id: 'atumpro26-dub-arktik',         name: 'Atum Pro 26',  color: 'Дуб Арктический',    glassColor: 'Лакобель Черный', photo: 'https://storage.yandexcloud.net/vfd74ru/metal_doors/Optima/niuta/drop2/atumpro26_dubark.webp' },

  { id: 'atum6-belenyi-dub',            name: 'Atum 6',       color: 'Беленый Дуб',        photo: 'https://storage.yandexcloud.net/vfd74ru/metal_doors/Optima/niuta/drop2/atum6_whitedub.webp' },
  { id: 'atum6-kapuchino',              name: 'Atum 6',       color: 'Капучино',           photo: 'https://storage.yandexcloud.net/vfd74ru/metal_doors/Optima/niuta/drop2/atum6_capuccino.webp' },
  { id: 'atum6-venge',                  name: 'Atum 6',       color: 'Венге',              photo: 'https://storage.yandexcloud.net/vfd74ru/metal_doors/Optima/niuta/drop2/atum6_wenge.webp' },
]

export interface EntranceDoorSpec {
  label: string
  value: string
}

export interface EntranceDoorSkinOption {
  skinId: string   // ссылка на ENTRANCE_SKINS[].id
  price:  number    // цена именно для этой модели двери
}

export interface EntranceDoorModel {
  id:          string   // URL-независимый ключ, используется как якорь на странице
  name:        string   // 'Оптима'
  tagline:     string   // короткий подзаголовок для карточки/hero
  description: string   // 1-2 предложения
  /** Обложка для превью/hero (рендер) */
  coverImage:  string
  /** Фото двери снаружи (реальное фото/рендер полотна) */
  doorImage:   string
  specs:       EntranceDoorSpec[]
  hardware:    string[]
  skinOptions: EntranceDoorSkinOption[]
}

const OPTIMA_CDN = `${CDN}Optima/`

export const ENTRANCE_DOOR_MODELS: EntranceDoorModel[] = [
  {
    id:          'optima',
    name:        'Оптима',
    tagline:     'Квартирная входная дверь для подъезда',
    description: 'Стальное полотно с декоративной штамповкой, три контура уплотнения и утеплённый закрытый короб — надёжная дверь для квартиры в подъезде.',
    coverImage:  `${OPTIMA_CDN}render_optima.webp`,
    doorImage:   `${OPTIMA_CDN}optima.webp`,
    specs: [
      { label: 'Тип двери',                       value: 'Квартирная входная дверь, для эксплуатации в подъезде' },
      { label: 'Отделка снаружи',                  value: 'Стальной лист с декоративной штамповкой наружу в порошковой окраске' },
      { label: 'Цвет',                             value: 'Муар серый (RAL 7016)' },
      { label: 'Отделка внутри',                   value: 'Декоративная панель MDF от 10–16 мм с отделкой PVC/PP' },
      { label: 'Толщина дверного полотна',         value: '94–100 мм' },
      { label: 'Толщина стали полотна',            value: '1,2 мм' },
      { label: 'Размер дверного блока по коробке', value: '2050×860 мм, 2050×960 мм' },
      { label: 'Вес дверного блока',                value: '80 кг' },
      { label: 'Ширина наличника',                 value: '70 мм' },
      { label: 'Тип короба',                       value: 'Закрытый с утеплением' },
      { label: 'Толщина короба',                   value: '117 мм' },
      { label: 'Толщина стали короба',              value: '1,4 мм' },
      { label: 'Уплотнение',                       value: 'Три контура' },
      { label: 'Открывание',                       value: '180°' },
      { label: 'Утепление',                        value: 'Пенополистирол' },
      { label: 'Петли',                             value: '3 шт., приварные, на подшипнике' },
    ],
    hardware: [
      'Дверная ручка',
      'Замок нижний — Галеон 816, цилиндровый, 4 класс защиты',
      'Замок верхний — Галеон 817, сувальдный, 4 класс защиты',
      'Ночная задвижка',
      'Цилиндровый механизм ключ-вертушок',
      'Панорамный глазок с пластиковой линзой',
      'Декоративная накладка со шторкой',
      'Броненакладка',
      'Металлический регулируемый эксцентрик',
    ],
    skinOptions: [
      { skinId: 'niuta-ice',                  price: 30_200 },
      { skinId: 'niuta-steel',                price: 30_200 },
      { skinId: 'niuta-onyx',                 price: 30_200 },
      { skinId: 'niuta-taupe',                price: 30_200 },
      { skinId: 'niuta-midwhite',             price: 30_200 },
      { skinId: 'stockholm-ice',              price: 30_200 },
      { skinId: 'er1-ice',                    price: 30_200 },
      { skinId: 'er1-onyx',                   price: 30_200 },
      { skinId: 'er2-steel',                  price: 30_200 },
      { skinId: 'er2-taupe',                  price: 30_200 },
      { skinId: 'glanta-ice',                 price: 30_200 },
      { skinId: 'glanta-onyx',                price: 30_200 },
      { skinId: 'dorren-ice',                 price: 30_200 },
      { skinId: 'dorren-midwhite',            price: 30_200 },
      { skinId: 'atumpro33-dub-arktik',       price: 28_300 },
      { skinId: 'atumpro33-dub-kamenny',      price: 28_300 },
      { skinId: 'e33-ice',                    price: 30_200 },
      { skinId: 'e33-taupe',                  price: 30_200 },
      { skinId: 'e33-onyx',                   price: 30_200 },
      { skinId: 'graphica-vr-ice',            price: 30_200 },
      { skinId: 'graphica-vr-beton-svetly',   price: 28_300 },
      { skinId: 'graphica-vr-beton-temny',    price: 28_300 },
      { skinId: 'atum5-snezhny',              price: 27_800 },
      { skinId: 'atum5-belenyi-dub',          price: 27_800 },
      { skinId: 'atum5-kapuchino',            price: 27_800 },
      { skinId: 'atum5-dub-sery',             price: 27_800 },
      { skinId: 'atumpro32-dub-kamenny',      price: 27_800 },
      { skinId: 'atumpro28-dub-arktik',       price: 27_800 },
      { skinId: 'atumpro28-dub-kamenny',      price: 27_800 },
      { skinId: 'atumpro28-dub-krasny',       price: 27_800 },
      { skinId: 'atumpro28-dub-skandinavsky', price: 28_300 },
      { skinId: 'atumpro28-beton-svetly',     price: 28_300 },
      { skinId: 'atumpro26-dub-arktik',       price: 28_300 },
      { skinId: 'atum6-belenyi-dub',          price: 28_300 },
      { skinId: 'atum6-kapuchino',            price: 28_300 },
      { skinId: 'atum6-venge',                price: 28_300 },
      { skinId: 'niuta-dub-tehas',            price: 28_300 },
    ],
  },
  {
    id:          'ekspertpro',
    name:        'ЭкспертПро',
    tagline:     'Усиленная квартирная дверь с комбинированным утеплением',
    description: 'Стальное полотно 102 мм с комбинированным утеплением (минплита + XPS), замки Гардиан 3 и 4 класса защиты, три контура уплотнения — дверь повышенной защиты для квартиры.',
    coverImage:  `${OPTIMA_CDN}expert_pro/render_expert_pro3k.webp`,
    doorImage:   `${OPTIMA_CDN}expert_pro/expert_pro_3k.webp`,
    specs: [
      { label: 'Тип двери',              value: 'Квартирная входная дверь, для эксплуатации в подъезде' },
      { label: 'Назначение',             value: 'Для квартиры' },
      { label: 'Толщина металла',        value: '1,4 мм' },
      { label: 'Цвет металла',           value: 'Антрацит' },
      { label: 'Внешняя отделка',        value: 'Гладкий лист металла, цвет Антрацит' },
      { label: 'Внутренняя отделка',     value: 'Фрезерованная МДФ-панель, 12 мм, цвет Ice' },
      { label: 'Верхний замок',          value: 'Гардиан 3001, цилиндровый, 3 класс защиты' },
      { label: 'Нижний замок',           value: 'Гардиан 3211, сувальдный, 4 класс защиты' },
      { label: 'Петли',                  value: 'Шарниры на опорном подшипнике, 3 шт., угол открывания 180°' },
      { label: 'Наполнитель полотна',    value: 'Комбинированное: минеральная плита «Технониколь» (50 мм) + панель пенополистирола XPS (30 мм)' },
      { label: 'Уплотнитель',            value: 'Три контура уплотнения. На полотне — Schlegel (2 контура). На коробе — EPDM (1 контур)' },
      { label: 'Размер по коробу',       value: '860×2050 мм' },
      { label: 'Глубина по коробу',      value: '117 мм' },
      { label: 'Полотно толщина',        value: '102 мм' },
      { label: 'Крепёж',                 value: 'Рамный дюбель 10×132 (арт. 000860), 6 шт. — приобретается отдельно' },
    ],
    hardware: [
      'Глазок',
      'Ночная задвижка',
      'Накладки на замок',
      'Эксцентрик',
      'Противосъёмные штыри',
    ],
    skinOptions: [
      { skinId: 'niuta-ice',                  price: 32_800 },
      { skinId: 'niuta-steel',                price: 32_800 },
      { skinId: 'niuta-onyx',                 price: 32_800 },
      { skinId: 'niuta-midwhite',             price: 32_800 },
      { skinId: 'niuta-taupe',                price: 32_800 },
      { skinId: 'niuta-dub-tehas',            price: 32_800 },
      { skinId: 'glanta-ice',                 price: 32_800 },
      { skinId: 'glanta-onyx',                price: 32_800 },
      { skinId: 'er2-steel',                  price: 32_800 },
      { skinId: 'er2-taupe',                  price: 32_800 },
      { skinId: 'er1-ice',                    price: 32_800 },
      { skinId: 'er1-onyx',                   price: 32_800 },
      { skinId: 'dorren-ice',                 price: 32_800 },
      { skinId: 'dorren-midwhite',            price: 32_800 },
      { skinId: 'atumpro33-dub-arktik',       price: 32_000 },
      { skinId: 'atumpro33-dub-kamenny',      price: 32_000 },
      { skinId: 'e33-ice',                    price: 32_000 },
      { skinId: 'e33-taupe',                  price: 32_000 },
      { skinId: 'e33-onyx',                   price: 32_000 },
      { skinId: 'graphica-vr-ice',            price: 32_000 },
      { skinId: 'graphica-vr-beton-svetly',   price: 32_000 },
      { skinId: 'graphica-vr-beton-temny',    price: 32_000 },
      { skinId: 'graphica-vr-freska-titan',   price: 32_000 },
      { skinId: 'atumpro32-dub-kamenny',      price: 32_000 },
      { skinId: 'atumpro28-dub-arktik',       price: 32_000 },
      { skinId: 'atumpro28-dub-kamenny',      price: 32_000 },
      { skinId: 'atumpro28-dub-skandinavsky', price: 32_000 },
      { skinId: 'atumpro28-dub-krasny',       price: 32_000 },
      { skinId: 'atumpro28-beton-svetly',     price: 32_000 },
      { skinId: 'atum5-belenyi-dub',          price: 32_000 },
      { skinId: 'atum5-kapuchino',            price: 32_000 },
      { skinId: 'atum5-dub-sery',             price: 32_000 },
      { skinId: 'atum5-snezhny',              price: 32_000 },
      { skinId: 'atum6-belenyi-dub',          price: 32_000 },
      { skinId: 'atum6-kapuchino',            price: 32_000 },
      { skinId: 'atum6-venge',                price: 32_000 },
      { skinId: 'atumpro26-dub-arktik',       price: 32_000 },
    ],
  },
]

/** Минимальная цена по модели (для "от X ₽" в превью/хиро) */
export function minPriceOf(model: EntranceDoorModel): number {
  return Math.min(...model.skinOptions.map(o => o.price))
}

/** Найти данные накладки по id (для рендера имени/цвета/фото по skinId) */
export function getSkin(skinId: string): EntranceSkin | undefined {
  return ENTRANCE_SKINS.find(s => s.id === skinId)
}
