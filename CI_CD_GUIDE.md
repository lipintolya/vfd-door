# 🚀 CI/CD для VFD Doors

## 📋 Как работает деплой

```
Вы пушите код → GitHub Actions → Сборка + Pre-render → Деплой на Beget → Сайт обновлён!
```

---

## ⚙️ Workflow: Deploy to Beget VPS

### Файл: `.github/workflows/deploy-to-beget.yml`

### Что делает:

1. **Checkout** — забирает код из репозитория
2. **Node.js setup** — устанавливает Node.js 22
3. **Install** — `npm ci` (быстрая установка)
4. **Build** — `npm run build` (сборка Vite)
5. **Pre-render** — `npm run prerender` (SEO HTML)
6. **Sitemap** — `npm run sitemap` (карта сайта)
7. **Verify** — проверка сборки
8. **Deploy** — загрузка на Beget через SSH/rsync

---

## 🔑 Секреты (GitHub Secrets)

### Настроить в GitHub:
`Settings → Secrets and variables → Actions`

| Secret | Описание | Пример |
|--------|----------|--------|
| `BEGET_SSH_KEY` | Приватный SSH ключ | `-----BEGIN OPENSSH PRIVATE KEY-----...` |
| `BEGET_HOST` | IP или домен сервера | `vfd74.ru` или `185.xxx.xxx.xxx` |
| `BEGET_USER` | Пользователь SSH | `root` или `vfd` |
| `BEGET_PORT` | SSH порт | `22` |
| `BEGET_TARGET_PATH` | Путь на сервере | `/var/www/vfd-door/data/` |
| `YANDEX_CAPTCHA_SITE_KEY` | Ключ Яндекс.Капчи | `6xxxx...` |
| `YANDEX_CAPTCHA_SECRET_KEY` | Секретный ключ | `6xxxx...` |
| `VITE_FORM_SECRET_TOKEN` | Токен формы | `xxxx...` |

---

## 📤 Триггеры деплоя

### Автоматически:
```bash
git push origin main
```

### Вручную:
1. GitHub → Actions → Deploy to Beget VPS
2. Кнопка "Run workflow"
3. Выбираете ветку → "Run workflow"

---

## 📊 Логи деплоя

### Просмотр:
1. GitHub → Actions → Deploy to Beget VPS
2. Клик на последний запуск
3. Смотрите логи каждого шага

### Пример логов:
```
✅ Build project (15s)
✅ Generate pre-rendered pages (SEO) (3s)
✅ Generate sitemap.xml (1s)
✅ Verify build (1s)
✅ Deploy to Beget via SSH (8s)
✅ Deployment complete!
```

---

## 🛠️ Команды для разработки

### Локально (перед пушем):
```bash
# Проверка сборки
npm run build

# Проверка pre-render
npm run prerender

# Проверка sitemap
npm run sitemap

# Полный цикл локально
npm run deploy
```

### Деплой (автоматически):
```bash
git add .
git commit -m "feat: описание изменений"
git push origin main
```

### Деплой (вручную через GitHub):
```bash
git add .
git commit -m "feat: описание изменений"
git push origin main
# Затем: GitHub → Actions → Run workflow
```

---

## ⚡ Время сборки

| Шаг | Время |
|-----|-------|
| Checkout | ~3s |
| Setup Node.js | ~5s |
| Install dependencies | ~15s |
| Build project | ~30s |
| Pre-render | ~3s |
| Sitemap | ~1s |
| Deploy to Beget | ~10s |
| **Итого** | **~67s** |

---

## 🔍 Проверка после деплоя

### 1. Сайт:
```
https://vfd74.ru
https://vfd74.ru/about
https://vfd74.ru/portfolio
https://vfd74.ru/partitions
```

### 2. Sitemap:
```
https://vfd74.ru/sitemap.xml
```

### 3. Robots.txt:
```
https://vfd74.ru/robots.txt
```

### 4. GitHub Actions:
```
https://github.com/lipintolya/vfd-door/actions
```

---

## 🐛 Если деплой не сработал

### 1. Проверить логи:
```
GitHub → Actions → Deploy to Beget VPS → Последний запуск
```

### 2. Частые ошибки:

**"SSH connection failed":**
- Проверьте `BEGET_SSH_KEY` (актуален ли)
- Проверьте `BEGET_HOST` (правильный ли IP)
- Проверьте доступность сервера

**"npm run build failed":**
- Проверьте TypeScript ошибки: `npm run build` локально
- Проверьте зависимости: `npm install`

**"Pre-render failed":**
- Проверьте doors.json на синтаксические ошибки
- Проверьте что dist/ существует после build

### 3. Перезапустить:
```
GitHub Actions → Клик на failed job → "Re-run jobs"
```

---

## 📈 Мониторинг

### После каждого деплоя:

1. **Проверить сайт** (открывается ли)
2. **Проверить SEO** (view-source: контент виден?)
3. **Яндекс.Вебмастер** (индексация)
4. **Google Search Console** (покрытие)

---

## 🎯 Best Practices

### ✅ Делайте:
- Пушьте в `main` только протестированный код
- Проверяйте сборку локально перед пушем
- Пишите понятные коммиты
- Делайте маленькие пуши (чаще)

### ❌ Не делайте:
- Не пушьте битый код ("починю на проде")
- Не меняйте secrets без необходимости
- Не удаляйте workflow файлы
- Не игнорируйте failed деплои

---

## 📞 Troubleshooting

### Вопрос: "Как откатить деплой?"
**Ответ:**
```bash
git revert HEAD
git push origin main
# Или: git reset --hard HEAD~1 && git push --force
```

### Вопрос: "Как задеплоить конкретную ветку?"
**Ответ:**
1. GitHub Actions → Deploy to Beget VPS
2. "Run workflow"
3. Выберите ветку из dropdown
4. "Run workflow"

### Вопрос: "Сколько стоит GitHub Actions?"
**Ответ:**
- Бесплатно: 2000 минут/месяц
- Ваш workflow: ~1.5 минуты
- Итого: ~1300 деплоев в месяц бесплатно

---

## 🚀 Автоматизация

### В будущем можно добавить:

1. **Preview деплой** — для pull requests
2. **Тесты** — перед деплоем
3. **Уведомления** — в Telegram при деплое
4. **Кэширование** — для ускорения сборки
5. **Staging окружение** — тест перед продом

---

## 📚 Документация

- [GitHub Actions](https://docs.github.com/en/actions)
- [SSH Deploy Action](https://github.com/easingthemes/ssh-deploy)
- [Vite SSR/SSG Guide](./SSR_SSG_GUIDE.md)
- [SEO Checklist](./SEO_CHECKLIST.md)
