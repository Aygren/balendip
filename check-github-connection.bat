@echo off
echo 🔍 Проверка соединения с GitHub...
echo.

echo 📡 Шаг 1: Проверка интернет-соединения...
ping -n 1 github.com >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ Интернет-соединение работает
) else (
    echo ❌ Проблемы с интернет-соединением
)

echo.
echo 🌐 Шаг 2: Проверка доступности GitHub...
ping -n 1 github.com
if %errorlevel% equ 0 (
    echo ✅ GitHub доступен
) else (
    echo ❌ GitHub недоступен
)

echo.
echo 🔑 Шаг 3: Проверка конфигурации Git...
git config --list --local | findstr "user.name"
git config --list --local | findstr "user.email"

echo.
echo 🌍 Шаг 4: Проверка удаленного репозитория...
git remote -v

echo.
echo 📊 Шаг 5: Проверка статуса Git...
git status

echo.
echo 🔄 Шаг 6: Тест соединения с GitHub...
git fetch origin --dry-run

echo.
echo ✅ Проверка завершена!
echo.
pause
