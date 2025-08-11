@echo off
echo 🚀 Загрузка проекта Balendip на GitHub...
echo.

echo 📋 Проверка статуса Git...
git status

echo.
echo 📦 Добавление всех файлов в индекс...
git add .

echo.
echo 💾 Создание коммита...
git commit -m "🚀 Инициализация проекта Balendip - трекер баланса жизни"

echo.
echo 📤 Отправка на GitHub...
git push origin master

echo.
echo ✅ Готово! Проект загружен на GitHub.
echo.
pause
