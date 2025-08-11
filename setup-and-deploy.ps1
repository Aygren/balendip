Write-Host "🚀 Полная настройка Git и загрузка на GitHub..." -ForegroundColor Green
Write-Host ""

Write-Host "🔧 Шаг 1: Очистка состояния Git..." -ForegroundColor Yellow
git reset --hard HEAD
git clean -fd

Write-Host ""
Write-Host "📋 Шаг 2: Проверка статуса..." -ForegroundColor Yellow
git status

Write-Host ""
Write-Host "🔄 Шаг 3: Синхронизация с удаленным репозиторием..." -ForegroundColor Yellow
git fetch origin

Write-Host ""
Write-Host "📦 Шаг 4: Добавление всех файлов..." -ForegroundColor Yellow
git add .

Write-Host ""
Write-Host "💾 Шаг 5: Создание коммита..." -ForegroundColor Yellow
git commit -m "🚀 Инициализация проекта Balendip - трекер баланса жизни"

Write-Host ""
Write-Host "📤 Шаг 6: Отправка на GitHub..." -ForegroundColor Yellow
git push origin master

Write-Host ""
Write-Host "✅ Готово! Проект настроен и загружен на GitHub." -ForegroundColor Green
Write-Host ""
Read-Host "Нажмите Enter для завершения"
