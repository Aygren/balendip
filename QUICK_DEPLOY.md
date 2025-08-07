# 🚀 Быстрый деплой Balendip

## 1. Подготовка Supabase
1. Создайте проект на [supabase.com](https://supabase.com)
2. Выполните SQL из `database/schema.sql`
3. Скопируйте URL и ANON KEY

## 2. Деплой на Vercel
1. Перейдите на [vercel.com](https://vercel.com)
2. Нажмите "New Project"
3. Выберите ваш репозиторий
4. Настройте:
   - Framework: Next.js
   - Root Directory: `balendip`
5. Добавьте переменные окружения:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
6. Нажмите "Deploy"

## 3. Проверка
- ✅ Главная страница загружается
- ✅ PWA устанавливается
- ✅ Все функции работают

**Готово! 🎉**
