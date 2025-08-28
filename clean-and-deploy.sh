#!/bin/bash

echo "🧹 Полная очистка проекта..."
echo ""

echo "🗑️ Удаляю временные файлы..."
rm -rf .next
rm -rf node_modules
rm -rf .jest-cache

echo "📦 Переустанавливаю зависимости..."
npm install

echo "🔨 Собираю проект..."
npm run build

echo "🚀 Деплой на Vercel..."
vercel --prod

echo ""
echo "✅ Готово!"
