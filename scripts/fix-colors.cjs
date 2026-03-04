/**
 * Скрипт для исправления форматов цветов
 */

const fs = require('fs');
const path = require('path');

const doorsPath = path.join(__dirname, '..', 'src', 'data', 'doors.json');
const doors = JSON.parse(fs.readFileSync(doorsPath, 'utf8'));

// Маппинг цветов
const colorMap = {
  'Silky White': 'Шёлковый белый',
  'Silky Greige': 'Шёлковый греж',
  'Silky Rock': 'Шелковый камень',
  'Silky Sky': 'Шелковый небесный',
  'Ice': 'белый',
  'Midwhite': 'Мидвайт',
  'Steel': 'Сталь',
  'Onyx': 'Оникс',
  'Taupe': 'Тауп',
  'Грунт': 'Грунт'
};

doors.forEach((door) => {
  if (door.colors && Array.isArray(door.colors)) {
    door.colors.forEach(color => {
      const currentName = color.name;
      
      // Проверяем, есть ли уже формат "English/Русский"
      if (currentName.includes('/')) {
        const parts = currentName.split('/');
        const engName = parts[0].trim();
        
        // Если первая часть - английское название, оставляем формат
        if (colorMap[engName]) {
          color.name = `${engName}/${colorMap[engName]}`;
        }
      } else {
        // Если нет слэша, добавляем
        if (colorMap[currentName]) {
          color.name = `${currentName}/${colorMap[currentName]}`;
        }
      }
    });
  }
});

fs.writeFileSync(doorsPath, JSON.stringify(doors, null, 2), 'utf8');
console.log('Готово! Цвета исправлены.');
