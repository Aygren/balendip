#!/bin/bash

echo "🚀 Простой деплой Balendip на Vercel"
echo ""

echo "📦 Устанавливаю зависимости..."
npm install

echo "🔨 Собираю проект..."
npm run build

echo "🚀 Деплой на Vercel..."
vercel --prod

echo ""
echo "✅ Готово!"
