/**
 * Скрипт для корректной русификации:
 * 1. Cloud → Клауд (транслит, не перевод)
 * 2. Ice → белый
 * 3. Silky Sky → Шелковый небесный
 * 4. Silky Rock → Шелковый камень
 * 5. StrongFlex → ПЭТ
 * 6. Emalex → Эмалекс (в material)
 */

const fs = require('fs');
const path = require('path');

const doorsPath = path.join(__dirname, '..', 'src', 'data', 'doors.json');
const doors = JSON.parse(fs.readFileSync(doorsPath, 'utf8'));

doors.forEach((door) => {
  // 1. Обновляем material: StrongFlex → ПЭТ, Emalex → Эмалекс
  if (door.material) {
    door.material = door.material
      .replace(/StrongFlex/g, 'ПЭТ')
      .replace(/Emalex/g, 'Эмалекс');
  }

  // 2. Обновляем cover: strong-flex → ПЭТ
  if (door.cover === 'strong-flex') {
    door.cover = 'ПЭТ';
  }

  // 3. Обновляем модели с Cloud (транслит)
  if (door.model && door.model.toLowerCase().includes('cloud')) {
    const parts = door.model.split('/');
    if (parts.length === 2) {
      const engPart = parts[0];
      let rusPart = parts[1];
      
      // Заменяем на транслит
      rusPart = rusPart
        .replace(/кристальное стекло/i, 'Кристал Клауд')
        .replace(/белое стекло/i, 'Вайт Клауд')
        .replace(/тёмное стекло/i, 'Дарк Клауд');
      
      door.model = `${engPart}/${rusPart}`;
    }
  }

  // 4. Обновляем название двери с Cloud (транслит)
  if (door.name && door.name.toLowerCase().includes('cloud')) {
    const parts = door.name.split('/');
    if (parts.length === 2) {
      const engPart = parts[0];
      let rusPart = parts[1];
      
      rusPart = rusPart
        .replace(/кристальное стекло/i, 'Кристал Клауд')
        .replace(/белое стекло/i, 'Вайт Клауд')
        .replace(/тёмное стекло/i, 'Дарк Клауд');
      
      door.name = `${engPart}/${rusPart}`;
    }
  }

  // 5. Обновляем цвета
  if (door.colors && Array.isArray(door.colors)) {
    door.colors.forEach(color => {
      if (color.name) {
        // Ice → белый
        if (color.name.startsWith('Ice')) {
          color.name = color.name.replace('Ice', 'белый');
        }
        
        // Silky Sky → Шелковый небесный
        if (color.name.includes('Silky Sky')) {
          color.name = color.name.replace('Silky Sky', 'Шелковый небесный');
        }
        
        // Silky Rock → Шелковый камень
        if (color.name.includes('Silky Rock')) {
          color.name = color.name.replace('Silky Rock', 'Шелковый камень');
        }
      }
    });
  }

  console.log(`Обновлено: ${door.id}`);
});

fs.writeFileSync(doorsPath, JSON.stringify(doors, null, 2), 'utf8');
console.log('\nГотово!');
