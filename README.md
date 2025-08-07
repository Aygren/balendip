# Balendip - Трекер баланса жизни

Balendip - это веб-приложение для отслеживания событий жизни и анализа баланса между различными сферами. Приложение помогает пользователям вести дневник событий, анализировать эмоциональное состояние и экспортировать историю для дальнейшего анализа.

## 🚀 Основные возможности

### 📝 Отслеживание событий
- Добавление событий с описанием и эмоциональной оценкой
- Привязка событий к сферам жизни (здоровье, карьера, отношения и др.)
- Использование эмодзи для визуального представления
- Фильтрация и поиск по событиям

### 📊 Аналитика и история
- **Загрузка истории событий** из Supabase базы данных
- Интерактивные графики и диаграммы
- Анализ эмоциональных трендов
- Статистика по сферам жизни
- Группировка событий по датам

### 📤 Экспорт данных
- Экспорт истории в PDF формат
- Экспорт в CSV для дальнейшего анализа
- Настраиваемые диапазоны дат
- Предварительный просмотр данных

### 🎯 Колесо жизни
- Интерактивное колесо баланса
- Визуализация сфер жизни
- Отслеживание прогресса

## 🛠 Технологии

- **Frontend**: Next.js 14 + TypeScript
- **Стили**: Tailwind CSS
- **UI**: HeadlessUI + Framer Motion
- **Графики**: Chart.js + D3.js
- **Backend**: Supabase
- **Экспорт**: jsPDF для PDF, нативный CSV

## 📦 Установка и настройка

### 1. Клонирование репозитория
```bash
git clone <repository-url>
cd balendip
```

### 2. Установка зависимостей
```bash
npm install
```

### 3. Настройка Supabase

#### 3.1 Создание проекта Supabase
1. Перейдите на [supabase.com](https://supabase.com)
2. Создайте новый проект
3. Получите URL и API ключи

#### 3.2 Настройка переменных окружения
Создайте файл `.env.local` в корне проекта:

```env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

#### 3.3 Настройка базы данных
Выполните SQL скрипт из `database/schema.sql` в Supabase SQL Editor:

```sql
-- Создание таблиц для Balendip
-- (весь скрипт из database/schema.sql)
```

### 4. Запуск приложения
```bash
npm run dev
```

Приложение будет доступно по адресу [http://localhost:3000](http://localhost:3000)

## 📱 Использование

### Загрузка истории событий

1. **Авторизация**: Войдите в приложение через Supabase Auth
2. **Просмотр событий**: Перейдите на страницу "События" для просмотра истории
3. **Фильтрация**: Используйте фильтры для поиска конкретных событий
4. **Аналитика**: Изучите аналитику на странице "Аналитика"

### Экспорт истории

1. Перейдите на страницу "Экспорт"
2. Выберите формат экспорта (PDF или CSV)
3. Укажите диапазон дат
4. Нажмите "Экспортировать"

### Структура данных

#### События (events)
```typescript
interface Event {
  id: string
  title: string
  description: string
  date: string
  time: string
  emotion: 'positive' | 'neutral' | 'negative'
  emoji: string
  sphereIds: string[]
  createdAt: string
  updatedAt: string
}
```

#### Сферы жизни (life_spheres)
```typescript
interface LifeSphere {
  id: string
  name: string
  score: number
  color: string
  icon: string
  isDefault: boolean
  createdAt: string
  updatedAt: string
}
```

## 🔧 Разработка

### Структура проекта
```
src/
├── app/                    # Next.js App Router
├── components/             # React компоненты
│   ├── events/            # Компоненты событий
│   ├── ui/                # Базовые UI компоненты
│   └── layout/            # Компоненты макета
├── hooks/                 # Кастомные хуки
├── lib/                   # Утилиты и конфигурации
├── types/                 # TypeScript типы
└── utils/                 # Вспомогательные функции
```

### Основные хуки

#### useEvents
```typescript
const { events, loading, error, addEvent, updateEvent, deleteEvent } = useEvents()
```

#### useSpheres
```typescript
const { spheres, loading, error, addSphere, updateSphere, deleteSphere } = useSpheres()
```

### Экспорт данных
```typescript
import { exportEvents } from '@/utils/exportUtils'

await exportEvents({
  format: 'pdf' | 'csv',
  dateRange: { start: string, end: string },
  events: Event[],
  spheres: LifeSphere[]
})
```

## 🚀 Деплой

### Vercel (рекомендуется)
1. Подключите репозиторий к Vercel
2. Настройте переменные окружения
3. Деплой произойдет автоматически

### Другие платформы
Приложение можно развернуть на любой платформе, поддерживающей Next.js.

## 📄 Лицензия

MIT License

## 🤝 Вклад в проект

1. Форкните репозиторий
2. Создайте ветку для новой функции
3. Внесите изменения
4. Создайте Pull Request

## 📞 Поддержка

Если у вас есть вопросы или проблемы, создайте Issue в репозитории.
