# 🚀 Развертывание Balendip в Vercel

## 📋 Предварительные требования

- [Vercel CLI](https://vercel.com/cli) установлен
- Аккаунт на [Vercel](https://vercel.com)
- Проект подключен к Git репозиторию

## 🔧 Настройка переменных окружения

### В Vercel Dashboard:

1. Перейдите в настройки проекта
2. Выберите "Environment Variables"
3. Добавьте переменные из данных проекта:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://mwnzdkqmconsaobioxxo.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im13bnpka3FtY29uc2FvYmlveHhvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM5ODg0MTEsImV4cCI6MjA2OTU2NDQxMX0.2wUiLbqaIXGIuoig1fWrhMQeQ3Zgt6qLvJA9W1Bpvjo
```

### Локально через CLI:

```bash
vercel env add NEXT_PUBLIC_SUPABASE_URL
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
```

## 🚀 Развертывание

### Первое развертывание:

```bash
# В корне проекта
vercel
```

### Последующие развертывания:

```bash
# Продакшн
vercel --prod

# Предварительный просмотр
vercel
```

## 📁 Структура конфигурации

### vercel.json
- **builds**: Конфигурация сборки Next.js
- **rewrites**: Перезапись маршрутов для PWA
- **headers**: Заголовки безопасности и кэширования
- **env**: Переменные окружения
- **functions**: Настройки серверных функций
- **regions**: Регион развертывания (iad1 = US East)

### next.config.js
- Оптимизации для Vercel
- PWA настройки
- Оптимизация изображений
- Заголовки безопасности

## 🔒 Безопасность

Проект включает:
- CSP заголовки
- XSS защита
- Clickjacking защита
- MIME sniffing защита
- Referrer Policy
- Permissions Policy

## 📱 PWA поддержка

- Service Worker кэширование
- Manifest файл
- Иконки приложения
- Offline функциональность

## 🚨 Устранение неполадок

### Ошибка сборки:
```bash
# Проверьте логи
vercel logs

# Локальная сборка
npm run build
```

### Проблемы с переменными окружения:
```bash
# Проверьте переменные
vercel env ls

# Пересоберите проект
vercel --prod
```

### Проблемы с PWA:
- Убедитесь, что `/sw.js` и `/manifest.json` доступны
- Проверьте кэширование в браузере
- Убедитесь, что HTTPS включен

## 📊 Мониторинг

- **Analytics**: Встроенные в Vercel
- **Performance**: Core Web Vitals
- **Errors**: Автоматический мониторинг
- **Uptime**: 99.9% SLA

## 🔄 Автоматическое развертывание

При push в main ветку:
1. Vercel автоматически запускает сборку
2. Выполняется `npm run build`
3. Проект развертывается в продакшн

## 📞 Поддержка

- [Vercel Documentation](https://vercel.com/docs)
- [Next.js on Vercel](https://nextjs.org/docs/deployment#vercel)
- [Vercel Community](https://github.com/vercel/vercel/discussions)
