Write-Host "🚀 Загрузка проекта Balendip на GitHub..." -ForegroundColor Green
Write-Host ""

Write-Host "📋 Проверка статуса Git..." -ForegroundColor Yellow
git status

Write-Host ""
Write-Host "📦 Добавление всех файлов в индекс..." -ForegroundColor Yellow
git add .

Write-Host ""
Write-Host "💾 Создание коммита..." -ForegroundColor Yellow
git commit -m "🚀 Инициализация проекта Balendip - трекер баланса жизни"

Write-Host ""
Write-Host "📤 Отправка на GitHub..." -ForegroundColor Yellow
git push origin master

Write-Host ""
Write-Host "✅ Готово! Проект загружен на GitHub." -ForegroundColor Green
Write-Host ""
Read-Host "Нажмите Enter для завершения"
