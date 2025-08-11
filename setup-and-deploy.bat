@echo off
echo 🚀 Полная настройка Git и загрузка на GitHub...
echo.

echo 🔧 Шаг 1: Очистка состояния Git...
git reset --hard HEAD
git clean -fd

echo.
echo 📋 Шаг 2: Проверка статуса...
git status

echo.
echo 🔄 Шаг 3: Синхронизация с удаленным репозиторием...
git fetch origin

echo.
echo 📦 Шаг 4: Добавление всех файлов...
git add .

echo.
echo 💾 Шаг 5: Создание коммита...
git commit -m "🚀 Инициализация проекта Balendip - трекер баланса жизни"

echo.
echo 📤 Шаг 6: Отправка на GitHub...
git push origin master

echo.
echo ✅ Готово! Проект настроен и загружен на GitHub.
echo.
pause
