-- Новая серия "Смарт", модель "Смарт 1В", покрытие "Протач".
-- Выполнить один раз в Supabase Dashboard → SQL Editor, по порядку.

-- 1. Новое покрытие
insert into coatings (name, slug, kit_price)
values ('Протач', 'protach', 3650);

-- 2. Новая серия
insert into series (name, slug, coating_id)
values (
  'Смарт',
  'smart',
  (select id from coatings where slug = 'protach')
);

-- 3. Новая модель (без остекления)
insert into models (name, sku, series_id, has_glass)
values (
  'Смарт 1В',
  'SMART-1V',
  (select id from series where slug = 'smart'),
  false
);

-- 4. Новые цвета (привязаны к покрытию "Протач")
insert into colors (name, hex_preview, coating_id)
values
  ('Белый',   '#F5F5F0', (select id from coatings where slug = 'protach')),
  ('Мокко',   '#8B6F5C', (select id from coatings where slug = 'protach')),
  ('Шоколад', '#4A2E1E', (select id from coatings where slug = 'protach')),
  ('Серый',   '#9B9B93', (select id from coatings where slug = 'protach'));

-- 5. Цена и фото за пару модель+цвет (полотно — 9580 ₽ для всех вариантов)
insert into model_colors (model_id, color_id, price_rrp, photo_url)
values
  (
    (select id from models where sku = 'SMART-1V'),
    (select id from colors where name = 'Белый' and coating_id = (select id from coatings where slug = 'protach')),
    9580,
    'https://storage.yandexcloud.net/catalog-vfd/Smart/smart1v_white.webp'
  ),
  (
    (select id from models where sku = 'SMART-1V'),
    (select id from colors where name = 'Мокко' and coating_id = (select id from coatings where slug = 'protach')),
    9580,
    'https://storage.yandexcloud.net/catalog-vfd/Smart/smart1v_mocco.webp'
  ),
  (
    (select id from models where sku = 'SMART-1V'),
    (select id from colors where name = 'Шоколад' and coating_id = (select id from coatings where slug = 'protach')),
    9580,
    'https://storage.yandexcloud.net/catalog-vfd/Smart/smart1v_chocolate.webp'
  ),
  (
    (select id from models where sku = 'SMART-1V'),
    (select id from colors where name = 'Серый' and coating_id = (select id from coatings where slug = 'protach')),
    9580,
    'https://storage.yandexcloud.net/catalog-vfd/Smart/smart1v_grey.webp'
  );
