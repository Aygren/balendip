Write-Host "🛠️ Исправление проблем с Git..." -ForegroundColor Red
Write-Host ""

Write-Host "🔧 Очистка состояния Git..." -ForegroundColor Yellow
git reset --hard HEAD
git clean -fd

Write-Host ""
Write-Host "📋 Проверка статуса после очистки..." -ForegroundColor Yellow
git status

Write-Host ""
Write-Host "🔄 Проверка удаленного репозитория..." -ForegroundColor Yellow
git fetch origin

Write-Host ""
Write-Host "📊 Проверка веток..." -ForegroundColor Yellow
git branch -a

Write-Host ""
Write-Host "✅ Исправление завершено!" -ForegroundColor Green
Write-Host ""
Read-Host "Нажмите Enter для завершения"
