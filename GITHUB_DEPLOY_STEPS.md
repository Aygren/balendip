# 🚀 Пошаговая инструкция загрузки на GitHub

## Вариант 1: Автоматический (рекомендуется)

### Запустите один из скриптов:

**Для Windows (Command Prompt):**

```cmd
deploy-to-github.bat
```

**Для PowerShell:**

```powershell
.\deploy-to-github.ps1
```

## Вариант 2: Ручное выполнение команд

### 1. Откройте терминал в папке проекта

```cmd
cd G:\python\Cursor\Balendip\balendip
```

### 2. Проверьте статус Git

```cmd
git status
```

### 3. Добавьте все файлы в индекс

```cmd
git add .
```

### 4. Создайте коммит

```cmd
git commit -m "🚀 Инициализация проекта Balendip - трекер баланса жизни"
```

### 5. Отправьте на GitHub

```cmd
git push origin master
```

## 🔍 Проверка результата

После успешного выполнения:

1. Перейдите на [https://github.com/Aygren/balendip](https://github.com/Aygren/balendip)
2. Убедитесь, что все файлы загружены
3. Проверьте, что README.md отображается корректно

## ❗ Если возникнут проблемы

### Ошибка аутентификации:

- Настройте SSH ключи или используйте Personal Access Token
- Выполните: `git config --global user.name "Ваше имя"`
- Выполните: `git config --global user.email "ваш@email.com"`

### Конфликт веток:

- Сначала выполните: `git pull origin master`

### Большие файлы:

- Убедитесь, что `.gitignore` правильно настроен
- Проверьте, что `node_modules/` и `.next/` не загружаются
