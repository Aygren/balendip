@echo off
echo 🛠️ Исправление проблем с Git...
echo.

echo 🔧 Очистка состояния Git...
git reset --hard HEAD
git clean -fd

echo.
echo 📋 Проверка статуса после очистки...
git status

echo.
echo 🔄 Проверка удаленного репозитория...
git fetch origin

echo.
echo 📊 Проверка веток...
git branch -a

echo.
echo ✅ Исправление завершено!
echo.
pause
