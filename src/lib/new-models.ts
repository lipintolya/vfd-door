/**
 * src/lib/new-models.ts
 *
 * Модели, помеченные бейджем «Новинка» в каталоге и на странице товара.
 * В Supabase нет поля под это (models: id, series_id, name, sku, has_glass,
 * trim) — ключ по model.id, самый надёжный (name может повторяться).
 *
 * Добавлять/убирать вручную. Не забывай снимать модель отсюда, когда она
 * перестаёт быть новинкой — иначе бейдж останется навсегда.
 */
export const NEW_MODEL_IDS: ReadonlySet<string> = new Set([
  '7434f55c-b2a8-4f12-b0c6-56c7c57888eb', // Штрих 2А (чёрный молдинг/кромка)
  '78543d40-b617-4976-809e-06bc22c61fc1', // Штрих 2А (золото молдинг/кромка)
])

export const isNewModel = (modelId: string): boolean => NEW_MODEL_IDS.has(modelId)
