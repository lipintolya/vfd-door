/**
 * Скрипт для обновления названий:
 * 1. Invisible/Скрытого монтажа -> Invisible/скрытая
 * 2. Модели с Cloud -> добавить "стекло"
 */

const fs = require('fs');
const path = require('path');

const doorsPath = path.join(__dirname, '..', 'src', 'data', 'doors.json');
const doors = JSON.parse(fs.readFileSync(doorsPath, 'utf8'));

// Обновляем каждую дверь
doors.forEach((door) => {
  // 1. Обновляем серию Invisible
  if (door.series && door.series.startsWith('invisible/')) {
    door.series = 'invisible/скрытая';
  }

  // 2. Обновляем модели с Cloud
  if (door.model && door.model.toLowerCase().includes('cloud')) {
    const parts = door.model.split('/');
    if (parts.length === 2) {
      const engPart = parts[0];
      const rusPart = parts[1];
      
      // Добавляем "стекло" к русской части
      if (!rusPart.toLowerCase().includes('стекло')) {
        // Заменяем "облако" на "стекло" или добавляем стекло
        let newRusPart = rusPart
          .replace(/кристальное облако/i, 'кристальное стекло')
          .replace(/белое облако/i, 'белое стекло')
          .replace(/тёмное облако/i, 'тёмное стекло')
          .replace(/облако/i, 'стекло');
        
        // Если не было замены, добавляем "стекло" в конец
        if (newRusPart === rusPart) {
          newRusPart = rusPart + ' стекло';
        }
        
        door.model = `${engPart}/${newRusPart}`;
      }
    }
  }

  // 3. Обновляем название двери с Cloud
  if (door.name && door.name.toLowerCase().includes('cloud')) {
    const parts = door.name.split('/');
    if (parts.length === 2) {
      const engPart = parts[0];
      const rusPart = parts[1];
      
      // Заменяем "облако" на "стекло" в русской части
      let newRusPart = rusPart
        .replace(/кристальное облако/i, 'кристальное стекло')
        .replace(/белое облако/i, 'белое стекло')
        .replace(/тёмное облако/i, 'тёмное стекло')
        .replace(/облако/i, 'стекло');
      
      door.name = `${engPart}/${newRusPart}`;
    }
  }

  console.log(`Обновлено: ${door.id} - серия: ${door.series}, модель: ${door.model}`);
});

// Сохраняем результат
fs.writeFileSync(doorsPath, JSON.stringify(doors, null, 2), 'utf8');
console.log('\nГотово! Файл doors.json обновлён.');
