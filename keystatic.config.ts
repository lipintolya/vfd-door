import { config, collection, fields, wrapper, block } from '@keystatic/core'

export default config({
  storage: { kind: 'local' },

  ui: {
    brand: { name: 'ВФД — Редактор' },
    navigation: {
      Articles: ['articles'],
    },
  },

  collections: {
    articles: collection({
      label: 'Статьи',
      slugField: 'title',
      path: 'src/content/articles/*',
      format: { contentField: 'body' },
      entryLayout: 'content',

      schema: {
        // ── Основные поля ──────────────────────────────────────────
        title: fields.slug({
          name: {
            label: 'Заголовок',
            description: 'Заголовок статьи — появляется в карточке, на странице и в тегe <title>',
          },
          slug: {
            label: 'URL (slug)',
            description: 'Автоматически генерируется из заголовка. Менять осторожно — сломает ссылки.',
          },
        }),

        description: fields.text({
          label: 'Описание',
          description: 'Краткое описание — до 160 символов. Показывается под заголовком в карточке и в мета-теге description.',
          multiline: true,
          validation: { isRequired: true, length: { max: 160 } },
        }),

        publishDate: fields.date({
          label: 'Дата публикации',
          defaultValue: { kind: 'today' },
          validation: { isRequired: true },
        }),

        // ── Обложка ────────────────────────────────────────────────
        coverImage: fields.image({
          label: 'Обложка статьи',
          description: 'Рекомендуемый размер: 1920 × 1080 пикселей (16:9), формат WebP или JPEG.',
          directory: 'public/articles/images/',
          publicPath: '/articles/images/',
          validation: { isRequired: false },
        }),

        coverImageAlt: fields.text({
          label: 'Alt-текст обложки',
          description: 'Описание фото для поисковиков и людей с нарушением зрения. Например: «Межкомнатная дверь серии Иннова в интерьере».',
          validation: { isRequired: false },
        }),

        // ── Тело статьи ────────────────────────────────────────────
        body: fields.markdoc({
          label: 'Содержание',
          options: {
            image: {
              directory: 'public/articles/images/',
              publicPath: '/articles/images/',
            },
          },
          components: {
            // Фото с подписью — самозакрывающийся тег {% figure ... /%}
            figure: block({
              label: 'Фото с подписью',
              description: 'Добавить фото в тело статьи с необязательной подписью.',
              schema: {
                src: fields.image({
                  label: 'Фото',
                  directory: 'public/articles/images/',
                  publicPath: '/articles/images/',
                  validation: { isRequired: true },
                }),
                alt: fields.text({
                  label: 'Alt-текст (описание фото)',
                  validation: { isRequired: false },
                }),
                caption: fields.text({
                  label: 'Подпись под фото',
                  validation: { isRequired: false },
                }),
                wide: fields.checkbox({
                  label: 'Широкое фото (выходит за границы текста)',
                  defaultValue: false,
                }),
              },
            }),

            // Выделенный блок — {% callout %}...{% /callout %}
            callout: wrapper({
              label: 'Выделенный блок',
              description: 'Совет, важное замечание или предупреждение.',
              schema: {
                type: fields.select({
                  label: 'Тип',
                  options: [
                    { label: '💡 Совет', value: 'tip' },
                    { label: 'ℹ️ Важно', value: 'info' },
                    { label: '⚠️ Предупреждение', value: 'warning' },
                  ],
                  defaultValue: 'tip',
                }),
                title: fields.text({
                  label: 'Заголовок блока (необязательно)',
                  validation: { isRequired: false },
                }),
              },
            }),
          },
        }),
      },
    }),
  },
})
