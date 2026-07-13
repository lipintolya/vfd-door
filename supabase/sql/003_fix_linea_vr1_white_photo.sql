-- Фикс: у модели "Линия ВР 1" обе цветовые строки (Эмаль белая / Эмаль графит)
-- указывали на одно и то же фото linea_vr1_graphite_bm.webp — белый цвет
-- визуально показывал графитовую дверь. Правильное фото для белого
-- (linea_vr1_polar_bm.webp) уже существует на CDN и следует паттерну
-- соседней модели "Линия ВР 2" (polar = белый, silver/graphite = цвет).

update model_colors
set photo_url = 'https://storage.yandexcloud.net/catalog-vfd/emal/linea/linea_vr1_polar_bm.webp'
where model_id = '75ed61ce-e460-4dd3-a9e6-c58f402e738d'
  and color_id = '2c31ec57-c60c-4a03-8998-07df47d53496';
