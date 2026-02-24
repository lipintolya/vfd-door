/**
 * Защита контента от копирования
 * vfd74.ru - Все права защищены
 */

// Отключение контекстного меню (правая кнопка мыши)
document.addEventListener('contextmenu', (e) => {
  e.preventDefault()
})

// Блокировка выделения текста (опционально)
document.addEventListener('selectstart', (_e) => {
  // Можно включить, если нужно запретить выделение
  // _e.preventDefault()
})

// Блокировка горячих клавиш копирования
document.addEventListener('keydown', (e) => {
  // Ctrl+C, Ctrl+U (просмотр кода), Ctrl+S (сохранение)
  if (
    (e.ctrlKey && e.key === 'c') ||
    (e.ctrlKey && e.key === 'u') ||
    (e.ctrlKey && e.key === 's') ||
    (e.ctrlKey && e.key === 'p')
  ) {
    // Можно включить, но это ухудшит UX
    // e.preventDefault()
  }
})

// Предупреждение при попытке копирования
document.addEventListener('copy', (e) => {
  const selectedText = window.getSelection()?.toString() || ''
  if (selectedText && e.clipboardData) {
    // Добавляем attribution при копировании
    const attribution = `\n\nИсточник: ${window.location.href} © VFD Кашириных`
    e.clipboardData.setData('text/plain', selectedText + attribution)
    e.preventDefault()
  }
})

console.log('%c🛡️ VFD Кашириных - Все права защищены', 'color: #0d9488; font-size: 16px; font-weight: bold;')
console.log('%cКопирование материалов без разрешения запрещено (ст. 1270 ГК РФ)', 'color: #dc2626; font-size: 12px;')
