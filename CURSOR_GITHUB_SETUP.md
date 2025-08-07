# 🔗 Настройка GitHub из Cursor - Balendip

## 📋 **Пошаговая инструкция:**

### 1. **Создать репозиторий на GitHub**
1. Откройте [github.com](https://github.com) в браузере
2. Нажмите **"New repository"** (зеленая кнопка)
3. Заполните форму:
   - **Repository name:** `balendip`
   - **Description:** `Трекер баланса жизни - Next.js приложение с Supabase`
   - **Visibility:** Public (или Private)
   - **НЕ ставьте галочки** на "Add a README file", "Add .gitignore", "Choose a license"
4. Нажмите **"Create repository"**

### 2. **Выполнить команды в Cursor Terminal**
После создания репозитория, скопируйте URL и выполните команды в терминале Cursor:

```bash
# Добавить удаленный репозиторий (замените YOUR_USERNAME на ваше имя пользователя)
git remote add origin https://github.com/YOUR_USERNAME/balendip.git

# Переименовать ветку в main
git branch -M main

# Отправить код на GitHub
git push -u origin main
```

### 3. **Проверить результат**
```bash
# Проверить удаленные репозитории
git remote -v

# Проверить статус
git status
```

### 4. **Результат**
После выполнения команд ваш код будет доступен по адресу:
`https://github.com/YOUR_USERNAME/balendip`

---

## 🚀 **Готово к деплою!**

После настройки GitHub репозитория вы сможете:
1. **Подключить к Vercel** для деплоя
2. **Настроить Supabase** для базы данных
3. **Задеплоить приложение** за 10 минут

---

## 📁 **Что уже готово в Cursor:**
- ✅ Локальный Git репозиторий создан
- ✅ Все файлы добавлены в коммит
- ✅ Терминал готов к выполнению команд
- ✅ Проект готов к отправке на GitHub

**Следуйте инструкции выше для создания GitHub репозитория!** 🚀
