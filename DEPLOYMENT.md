# 🚀 Инструкции по деплою Balendip

## Подготовка к деплою

### 1. Проверка файлов

Убедитесь, что у вас есть все необходимые файлы:

- ✅ `vercel.json` - конфигурация Vercel
- ✅ `public/manifest.json` - PWA манифест
- ✅ `public/sw.js` - Service Worker
- ✅ `src/app/layout.tsx` - мета-теги для PWA
- ✅ `package.json` - зависимости и скрипты

### 2. Настройка Supabase

1. Создайте проект в [Supabase](https://supabase.com)
2. Выполните SQL скрипт из `database/schema.sql`
3. Получите URL и API ключи

### 3. Переменные окружения

В Vercel Dashboard настройте следующие переменные:

```env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

## Деплой на Vercel

### Автоматический деплой (рекомендуется)

1. **Подключение репозитория**
   - Перейдите на [vercel.com](https://vercel.com)
   - Войдите в аккаунт
   - Нажмите "New Project"
   - Выберите ваш репозиторий

2. **Настройка проекта**
   - Framework Preset: Next.js
   - Root Directory: `balendip`
   - Build Command: `npm run build`
   - Output Directory: `.next`

3. **Переменные окружения**
   - В настройках проекта добавьте переменные окружения
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`

4. **Деплой**
   - Нажмите "Deploy"
   - Дождитесь завершения сборки

### Ручной деплой

1. **Установка Vercel CLI**
```bash
npm i -g vercel
```

2. **Вход в аккаунт**
```bash
vercel login
```

3. **Деплой**
```bash
cd balendip
vercel --prod
```

## Проверка деплоя

### 1. Основные функции
- ✅ Главная страница загружается
- ✅ Навигация работает
- ✅ PWA функциональность
- ✅ Service Worker регистрируется

### 2. PWA тестирование
- Откройте DevTools → Application
- Проверьте Manifest
- Проверьте Service Worker
- Протестируйте установку на устройство

### 3. Производительность
- Проверьте Lighthouse score
- Убедитесь, что Core Web Vitals в норме
- Проверьте мобильную версию

## Troubleshooting

### Ошибки сборки
```bash
# Очистка кеша
rm -rf .next
npm run build
```

### Проблемы с переменными окружения
- Проверьте правильность URL и ключей Supabase
- Убедитесь, что переменные добавлены в Vercel

### Проблемы с PWA
- Проверьте manifest.json
- Убедитесь, что Service Worker зарегистрирован
- Проверьте HTTPS (обязательно для PWA)

## Мониторинг

### Vercel Analytics
- Включите Vercel Analytics для отслеживания производительности
- Настройте алерты для ошибок

### Supabase Monitoring
- Отслеживайте использование базы данных
- Мониторьте API запросы

## Обновления

### Автоматические обновления
- При push в main ветку происходит автоматический деплой
- Preview деплои создаются для pull requests

### Ручные обновления
```bash
vercel --prod
```

## Домены

### Настройка кастомного домена
1. В Vercel Dashboard → Settings → Domains
2. Добавьте ваш домен
3. Настройте DNS записи

### SSL сертификат
- Vercel автоматически предоставляет SSL сертификаты
- Обновление происходит автоматически

## Безопасность

### Переменные окружения
- Никогда не коммитьте `.env.local`
- Используйте Vercel Environment Variables
- Ротация ключей Supabase

### CORS настройки
- Supabase автоматически настраивает CORS
- Дополнительные настройки в Supabase Dashboard

## Производительность

### Оптимизации
- ✅ Lazy loading компонентов
- ✅ Code splitting
- ✅ Image optimization
- ✅ Service Worker кеширование

### Мониторинг
- Vercel Analytics
- Core Web Vitals
- Lighthouse score

---

**Успешного деплоя! 🚀**
