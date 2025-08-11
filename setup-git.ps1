Write-Host "🔧 Настройка Git для проекта Balendip..." -ForegroundColor Green
Write-Host ""

Write-Host "📋 Проверка текущей конфигурации Git..." -ForegroundColor Yellow
git config --list --local

Write-Host ""
Write-Host "🌐 Проверка удаленного репозитория..." -ForegroundColor Yellow
git remote -v

Write-Host ""
Write-Host "📊 Проверка статуса веток..." -ForegroundColor Yellow
git branch -a

Write-Host ""
Write-Host "🔑 Проверка настроек пользователя..." -ForegroundColor Yellow
git config --global user.name
git config --global user.email

Write-Host ""
Write-Host "✅ Настройка Git завершена!" -ForegroundColor Green
Write-Host ""
Read-Host "Нажмите Enter для завершения"
