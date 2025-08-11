Write-Host "🔐 Тестирование аутентификации с GitHub..." -ForegroundColor Magenta
Write-Host ""

Write-Host "🔑 Шаг 1: Проверка настроек пользователя..." -ForegroundColor Yellow
try {
    $userName = git config --global user.name
    $userEmail = git config --global user.email
    
    if ($userName) {
        Write-Host "✅ Имя пользователя: $userName" -ForegroundColor Green
    } else {
        Write-Host "❌ Имя пользователя не настроено" -ForegroundColor Red
        Write-Host "💡 Выполните: git config --global user.name 'Ваше Имя'" -ForegroundColor Yellow
    }
    
    if ($userEmail) {
        Write-Host "✅ Email пользователя: $userEmail" -ForegroundColor Green
    } else {
        Write-Host "❌ Email пользователя не настроен" -ForegroundColor Red
        Write-Host "💡 Выполните: git config --global user.email 'ваш@email.com'" -ForegroundColor Yellow
    }
} catch {
    Write-Host "❌ Ошибка проверки настроек пользователя" -ForegroundColor Red
}

Write-Host ""
Write-Host "🌐 Шаг 2: Проверка URL репозитория..." -ForegroundColor Yellow
try {
    $remoteUrl = git remote get-url origin
    Write-Host "✅ URL репозитория: $remoteUrl" -ForegroundColor Green
    
    if ($remoteUrl -like "*https://*") {
        Write-Host "ℹ️ Используется HTTPS соединение" -ForegroundColor Cyan
    } elseif ($remoteUrl -like "*git@*") {
        Write-Host "ℹ️ Используется SSH соединение" -ForegroundColor Cyan
    }
} catch {
    Write-Host "❌ Ошибка получения URL репозитория" -ForegroundColor Red
}

Write-Host ""
Write-Host "🔄 Шаг 3: Тест fetch (без загрузки)..." -ForegroundColor Yellow
try {
    $fetchResult = git fetch origin --dry-run 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Fetch работает корректно" -ForegroundColor Green
    } else {
        Write-Host "❌ Проблемы с fetch:" -ForegroundColor Red
        Write-Host $fetchResult -ForegroundColor Red
    }
} catch {
    Write-Host "❌ Ошибка тестирования fetch" -ForegroundColor Red
}

Write-Host ""
Write-Host "📤 Шаг 4: Тест push (проверка прав)..." -ForegroundColor Yellow
try {
    $pushResult = git push origin master --dry-run 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Push права проверены" -ForegroundColor Green
    } else {
        Write-Host "⚠️ Проблемы с push правами:" -ForegroundColor Yellow
        Write-Host $pushResult -ForegroundColor Yellow
    }
} catch {
    Write-Host "❌ Ошибка тестирования push" -ForegroundColor Red
}

Write-Host ""
Write-Host "🔍 Шаг 5: Проверка токенов и ключей..." -ForegroundColor Yellow
try {
    $sshKeyPath = "$env:USERPROFILE\.ssh\id_rsa"
    if (Test-Path $sshKeyPath) {
        Write-Host "✅ SSH ключ найден: $sshKeyPath" -ForegroundColor Green
    } else {
        Write-Host "❌ SSH ключ не найден" -ForegroundColor Red
        Write-Host "💡 Создайте SSH ключ: ssh-keygen -t rsa -b 4096 -C '$userEmail'" -ForegroundColor Yellow
    }
    
    $sshAgent = Get-Service ssh-agent -ErrorAction SilentlyContinue
    if ($sshAgent -and $sshAgent.Status -eq 'Running') {
        Write-Host "✅ SSH агент запущен" -ForegroundColor Green
    } else {
        Write-Host "⚠️ SSH агент не запущен" -ForegroundColor Yellow
    }
} catch {
    Write-Host "❌ Ошибка проверки SSH ключей" -ForegroundColor Red
}

Write-Host ""
Write-Host "📋 Шаг 6: Проверка переменных окружения..." -ForegroundColor Yellow
Write-Host "GIT_SSH_COMMAND: $env:GIT_SSH_COMMAND" -ForegroundColor Gray
Write-Host "GIT_TERMINAL_PROMPT: $env:GIT_TERMINAL_PROMPT" -ForegroundColor Gray

Write-Host ""
Write-Host "✅ Тестирование завершено!" -ForegroundColor Green
Write-Host ""
Read-Host "Нажмите Enter для завершения"
