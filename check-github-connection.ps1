Write-Host "🔍 Проверка соединения с GitHub..." -ForegroundColor Cyan
Write-Host ""

Write-Host "📡 Шаг 1: Проверка интернет-соединения..." -ForegroundColor Yellow
try {
    $ping = Test-Connection -ComputerName "github.com" -Count 1 -Quiet
    if ($ping) {
        Write-Host "✅ Интернет-соединение работает" -ForegroundColor Green
    } else {
        Write-Host "❌ Проблемы с интернет-соединением" -ForegroundColor Red
    }
} catch {
    Write-Host "❌ Ошибка проверки интернет-соединения" -ForegroundColor Red
}

Write-Host ""
Write-Host "🌐 Шаг 2: Проверка доступности GitHub..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "https://github.com" -TimeoutSec 10 -UseBasicParsing
    if ($response.StatusCode -eq 200) {
        Write-Host "✅ GitHub доступен (HTTP $($response.StatusCode))" -ForegroundColor Green
    } else {
        Write-Host "⚠️ GitHub отвечает с кодом $($response.StatusCode)" -ForegroundColor Yellow
    }
} catch {
    Write-Host "❌ GitHub недоступен: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""
Write-Host "🔑 Шаг 3: Проверка конфигурации Git..." -ForegroundColor Yellow
try {
    $userName = git config --global user.name
    $userEmail = git config --global user.email
    
    if ($userName) {
        Write-Host "✅ Имя пользователя: $userName" -ForegroundColor Green
    } else {
        Write-Host "❌ Имя пользователя не настроено" -ForegroundColor Red
    }
    
    if ($userEmail) {
        Write-Host "✅ Email пользователя: $userEmail" -ForegroundColor Green
    } else {
        Write-Host "❌ Email пользователя не настроен" -ForegroundColor Red
    }
} catch {
    Write-Host "❌ Ошибка проверки конфигурации Git" -ForegroundColor Red
}

Write-Host ""
Write-Host "🌍 Шаг 4: Проверка удаленного репозитория..." -ForegroundColor Yellow
try {
    $remote = git remote -v
    if ($remote) {
        Write-Host "✅ Удаленный репозиторий настроен:" -ForegroundColor Green
        Write-Host $remote -ForegroundColor Gray
    } else {
        Write-Host "❌ Удаленный репозиторий не настроен" -ForegroundColor Red
    }
} catch {
    Write-Host "❌ Ошибка проверки удаленного репозитория" -ForegroundColor Red
}

Write-Host ""
Write-Host "📊 Шаг 5: Проверка статуса Git..." -ForegroundColor Yellow
try {
    $status = git status --porcelain
    if ($status) {
        Write-Host "📝 Есть изменения для коммита:" -ForegroundColor Yellow
        Write-Host $status -ForegroundColor Gray
    } else {
        Write-Host "✅ Рабочая директория чистая" -ForegroundColor Green
    }
} catch {
    Write-Host "❌ Ошибка проверки статуса Git" -ForegroundColor Red
}

Write-Host ""
Write-Host "🔄 Шаг 6: Тест соединения с GitHub..." -ForegroundColor Yellow
try {
    $fetch = git fetch origin --dry-run 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Соединение с GitHub работает" -ForegroundColor Green
    } else {
        Write-Host "❌ Проблемы с соединением с GitHub:" -ForegroundColor Red
        Write-Host $fetch -ForegroundColor Red
    }
} catch {
    Write-Host "❌ Ошибка тестирования соединения с GitHub" -ForegroundColor Red
}

Write-Host ""
Write-Host "✅ Проверка завершена!" -ForegroundColor Green
Write-Host ""
Read-Host "Нажмите Enter для завершения"
