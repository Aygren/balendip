@echo off
echo 🔐 Тестирование аутентификации с GitHub...
echo.

echo 🔑 Шаг 1: Проверка настроек пользователя...
git config --global user.name
git config --global user.email

echo.
echo 🌐 Шаг 2: Проверка URL репозитория...
git remote get-url origin

echo.
echo 🔄 Шаг 3: Тест fetch (без загрузки)...
git fetch origin --dry-run

echo.
echo 📤 Шаг 4: Тест push (проверка прав)...
git push origin master --dry-run

echo.
echo 🔍 Шаг 5: Проверка токенов и ключей...
echo Проверяем наличие SSH ключей...
dir "%USERPROFILE%\.ssh\id_rsa" >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ SSH ключ найден
) else (
    echo ❌ SSH ключ не найден
)

echo.
echo 📋 Шаг 6: Проверка переменных окружения...
echo GIT_SSH_COMMAND: %GIT_SSH_COMMAND%
echo GIT_TERMINAL_PROMPT: %GIT_TERMINAL_PROMPT%

echo.
echo ✅ Тестирование завершено!
echo.
pause
