import { defineMarkdocConfig, component } from '@astrojs/markdoc/config'

export default defineMarkdocConfig({
  tags: {
    // Фото с подписью
    // Использование: {% figure src="https://..." alt="..." caption="Подпись" /%}
    // Широкий вариант: {% figure src="..." wide=true /%}
    figure: {
      render: component('./src/components/articles/Figure.astro'),
      selfClosing: true,
      attributes: {
        src:     { type: String, required: true },
        alt:     { type: String },
        caption: { type: String },
        wide:    { type: Boolean, default: false },
      },
    },

    // Выделенный блок — совет, важно, предупреждение
    // Использование: {% callout type="tip" title="Совет" %}Текст{% /callout %}
    callout: {
      render: component('./src/components/articles/Callout.astro'),
      attributes: {
        type:  { type: String, default: 'tip', matches: ['tip', 'info', 'warning'] },
        title: { type: String },
      },
    },
  },
})
