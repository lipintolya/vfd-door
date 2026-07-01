import { config, collection, fields } from '@keystatic/core'

export default config({
  storage: { kind: 'local' },
  ui: { brand: { name: 'ВФД — Редактор статей' } },
  collections: {
    articles: collection({
      label: 'Статьи',
      slugField: 'title',
      path: 'src/content/articles/*',
      format: { contentField: 'body' },
      schema: {
        title: fields.slug({ name: { label: 'Заголовок статьи' } }),
        description: fields.text({
          label: 'Описание (meta description, до 160 символов)',
          multiline: true,
        }),
        publishDate: fields.date({ label: 'Дата публикации' }),
        coverImage: fields.text({
          label: 'URL обложки на Yandex Cloud (необязательно)',
          validation: { isRequired: false },
        }),
        body: fields.markdoc({ label: 'Содержание статьи' }),
      },
    }),
  },
})
