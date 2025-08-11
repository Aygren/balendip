@echo off
echo 🔧 Настройка Git для проекта Balendip...
echo.

echo 📋 Проверка текущей конфигурации Git...
git config --list --local

echo.
echo 🌐 Проверка удаленного репозитория...
git remote -v

echo.
echo 📊 Проверка статуса веток...
git branch -a

echo.
echo 🔑 Проверка настроек пользователя...
git config --global user.name
git config --global user.email

echo.
echo ✅ Настройка Git завершена!
echo.
pause
