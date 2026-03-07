# Структура проекта VFD Door

Архитектура проекта основана на **Feature-Sliced Design** с элементами **Atomic Design**.

## 📁 Структура папок

```
src/
├── app/                  # Глобальные настройки приложения
│   ├── App.vue
│   └── main.ts
│
├── assets/               # Статические ресурсы
│   ├── icons/           # SVG иконки
│   └── fonts/           # Шрифты
│
├── components/           # UI компоненты
│   ├── atoms/           # Простейшие компоненты (кнопки, инпуты)
│   ├── molecules/       # Композиции атомов (карточки, формы)
│   ├── organisms/       # Сложные компоненты (хедер, футер)
│   ├── catalog/         # Компоненты каталога
│   ├── layout/          # Layout компоненты
│   ├── sections/        # Секции страниц
│   └── ui/              # Базовые UI компоненты
│
├── composables/          # Переиспользуемая логика (Vue 3 Composition API)
│   ├── useGallery.ts    # Галерея изображений
│   ├── useModal.ts      # Управление модалками
│   ├── useSwipe.ts      # Touch-жесты
│   ├── useDebounce.ts   # Debounce утилиты
│   ├── useScrollLock.ts # Блокировка скролла
│   └── index.ts         # Экспорт всех composables
│
├── config/              # Конфигурация приложения
│   ├── constants.ts     # Глобальные константы
│   ├── seo.ts           # SEO настройки
│   └── index.ts         # Экспорт конфига
│
├── data/                # Данные и контент
│   ├── doors/           # Данные о дверях
│   ├── partitions/      # Данные о перегородках
│   ├── portfolio/       # Портфолио
│   ├── articles/        # Статьи
│   └── index.ts         # Экспорт всех данных
│
├── router/              # Настройки роутинга
│   └── index.ts
│
├── services/            # Внешние сервисы и API
│   ├── formSubmit.ts    # Отправка форм
│   └── api.ts           # API клиент (будущий)
│
├── types/               # TypeScript типы
│   └── index.ts         # Все типы проекта
│
├── views/               # Страницы (route-level компоненты)
│   ├── Home.vue
│   ├── Catalog.vue
│   ├── ProductPage.vue
│   ├── AluminiumPartitionsPage.vue
│   ├── Portfolio.vue
│   └── About.vue
│
├── style.css            # Глобальные стили и дизайн-токены
├── env.d.ts             # Типы для environment variables
└── vite.config.ts       # Настройки Vite
```

## 🏗 Архитектурные принципы

### 1. Разделение ответственности

- **components/** — только UI, без бизнес-логики
- **composables/** — только логика, без UI
- **views/** — композиция компонентов для страниц
- **services/** — взаимодействие с внешним миром (API, localStorage)

### 2. Atomic Design

```
atoms → molecules → organisms → templates → pages
```

**Atoms** (атомы):
- Кнопки (`ui/Button.vue`)
- Инпуты (`ui/Input.vue`)
- Иконки (`ui/Icon.vue`)

**Molecules** (молекулы):
- Карточка товара (`catalog/ProductCard.vue`)
- Форма обратной связи (`ui/ContactForm.vue`)

**Organisms** (организмы):
- Хедер (`layout/Header.vue`)
- Футер (`layout/Footer.vue`)
- Каталог с фильтрами (`catalog/DoorCatalog.vue`)

### 3. Feature-Sliced Design

```
segments:
- app (глобальное)
- pages (маршруты)
- widgets (сложные блоки)
- features (бизнес-логика)
- entities (бизнес-сущности)
- shared (переиспользуемое)
```

## 📝 Правила именования

### Компоненты
- **PascalCase**: `ProductCard.vue`, `DoorCatalog.vue`
- **Префиксы по слою**: `ui/Button`, `catalog/ProductCard`

### Composables
- **use** префикс: `useGallery`, `useModal`
- **Глаголы для действий**: `useSwipe`, `useScrollLock`

### Типы
- **Интерфейсы**: `interface Door {}`
- **Типы-union**: `type Status = 'active' | 'inactive'`
- **Суффикс Props/Emits**: `ProductCardProps`, `ModalEmits`

### Данные
- **Множественное число**: `doors.ts`, `partitions.ts`
- **Функции-селекторы**: `getDoorsBySeries()`, `filterDoors()`

## 🎯 Добавление нового функционала

### 1. Новая страница
```
1. Создать view: src/views/NewPage.vue
2. Добавить роут: src/router/index.ts
3. Добавить SEO: src/config/seo.ts
```

### 2. Новый компонент
```
1. Выбрать слой (atom/molecule/organism)
2. Создать компонент в соответствующей папке
3. Экспортировать из components/index.ts (если нужно)
```

### 3. Новая бизнес-логика
```
1. Создать composable: src/composables/useFeature.ts
2. Экспортировать из composables/index.ts
3. Использовать в компонентах
```

### 4. Новые данные
```
1. Создать папку: src/data/newDomain/
2. Добавить типы: src/types/index.ts
3. Создать селекторы: src/data/newDomain/index.ts
```

## 🔧 Утилиты

### Composables
- `useGallery` — галерея изображений
- `useModal` — управление модалками
- `useSwipe` — touch-жесты
- `useDebounce` — debounce для функций
- `useScrollLock` — блокировка скролла
- `useSeo` — управление SEO
- `useSeriesTheme` — темы серий

### Конфиги
- `TELEGRAM_URL` — ссылка на Telegram
- `COMPANY` — информация о компании
- `SEO_DEFAULTS` — SEO по умолчанию
- `UI` — UI константы

## 📊 Метрики

| Метрика | Значение |
|---------|----------|
| Компонентов | ~40 |
| Composables | 8 |
| Страниц | 6 |
| Типов | ~30 |

## 🚀 Производительность

- **Lazy loading** для всех views
- **Code splitting** по страницам
- **Tree shaking** для unused кода
- **Memoization** через `computed`

## ♿ Доступность

- **ARIA** атрибуты для интерактивных элементов
- **Keyboard navigation** для всех компонентов
- **Focus trap** в модалках
- **Semantic HTML** разметка

## 📚 Ресурсы

- [Vue 3 Documentation](https://vuejs.org/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Feature-Sliced Design](https://feature-sliced.design/)
- [Atomic Design](https://atomicdesign.bradfrost.com/)
