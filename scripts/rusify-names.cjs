/**
 * Скрипт для русификации названий серий и моделей в doors.json
 * Формат: "innova" -> "innova/Иннова", "Innova 01C" -> "Innova 01C/Иннова 01C"
 */

const fs = require('fs');
const path = require('path');

const doorsPath = path.join(__dirname, '..', 'src', 'data', 'doors.json');
const doors = JSON.parse(fs.readFileSync(doorsPath, 'utf8'));

// Маппинг серий: id -> русское название
const seriesMap = {
  'innova': 'Иннова',
  'emalex': 'Эмалекс',
  'invisible': 'Инвизибл',
  'urban': 'Урбан',
  'linea': 'Линеа',
  'skinel': 'Скинель'
};

// Маппинг цветов: английское -> русское
const colorMap = {
  'Silky White': 'Шёлковый белый',
  'Silky Greige': 'Шёлковый греж',
  'Silky Rock': 'Шёлковый рок',
  'Silky Sky': 'Шёлковое небо',
  'Ice': 'Лёд',
  'Midwhite': 'Мидвайт',
  'Steel': 'Сталь',
  'Onyx': 'Оникс',
  'Taupe': 'Тауп',
  'White': 'Белый',
  'Crystal Cloud': 'Кристальное облако',
  'Air Space': 'Воздушное пространство',
  'Dark Cloud': 'Тёмное облако',
  'White Cloud': 'Белое облако'
};

// Функция для транслитерации/перевода названия модели
function rusifyModelName(modelName, seriesName) {
  // Если модель уже содержит русские символы, оставляем как есть
  if (/[\u0400-\u04FF]/.test(modelName)) {
    return modelName;
  }
  
  const seriesRus = seriesMap[seriesName] || seriesName;
  
  // Базовые замены для моделей
  let rusName = modelName;
  
  // Заменяем названия цветов в модели
  for (const [eng, rus] of Object.entries(colorMap)) {
    rusName = rusName.replace(new RegExp(eng, 'gi'), rus);
  }
  
  // Если модель содержит только цифры и буквы, добавляем серию
  if (/^[a-zA-Z0-9\s]+$/.test(modelName.trim())) {
    // Простая модель типа "1c", "02st" и т.д.
    rusName = `${seriesRus} ${modelName.toUpperCase()}`;
  }
  
  return rusName;
}

// Функция для русификации названия двери
function rusifyDoorName(doorName, seriesName, model) {
  // Если уже содержит русские символы, оставляем
  if (/[\u0400-\u04FF]/.test(doorName)) {
    return doorName;
  }
  
  const seriesRus = seriesMap[seriesName] || seriesName;
  let rusName = doorName;
  
  // Заменяем названия серий в имени
  for (const [eng, rus] of Object.entries(seriesMap)) {
    rusName = rusName.replace(new RegExp(`\\b${eng}\\b`, 'gi'), rus);
  }
  
  // Заменяем названия цветов
  for (const [eng, rus] of Object.entries(colorMap)) {
    rusName = rusName.replace(new RegExp(eng, 'gi'), rus);
  }
  
  return rusName;
}

// Обрабатываем каждую дверь
doors.forEach((door, index) => {
  const seriesId = door.series;
  const seriesRus = seriesMap[seriesId] || seriesId;
  
  // Обновляем серию в формате "оригинал/Русский"
  door.series = `${seriesId}/${seriesRus}`;
  
  // Обновляем модель в формате "оригинал/Русский"
  const modelRus = rusifyModelName(door.model, seriesId);
  door.model = `${door.model}/${modelRus}`;
  
  // Обновляем название двери
  const nameRus = rusifyDoorName(door.name, seriesId, door.model);
  door.name = `${door.name}/${nameRus}`;
  
  // Обновляем названия цветов
  if (door.colors && Array.isArray(door.colors)) {
    door.colors.forEach(color => {
      if (colorMap[color.name]) {
        const rusName = colorMap[color.name];
        color.name = `${color.name}/${rusName}`;
      }
    });
  }
  
  console.log(`Обработано: ${door.id} - серия: ${door.series}, модель: ${door.model}`);
});

// Сохраняем результат
fs.writeFileSync(doorsPath, JSON.stringify(doors, null, 2), 'utf8');
console.log('\nГотово! Файл doors.json обновлён.');
