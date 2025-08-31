# 🏗️ Новая архитектура онбординга Balendip

## 📋 Обзор

Мы полностью переработали архитектуру онбординга, чтобы исправить проблемы с дублированием логики, зацикливанием и несинхронизированным состоянием.

## 🎯 Основные принципы

### 1. **Единый источник истины**
- Все состояние онбординга управляется через `OnboardingContext`
- Нет дублирования логики между компонентами
- Централизованное управление состоянием

### 2. **Простая навигация**
- Навигация происходит через контекст, а не через роутер
- Каждый шаг знает только о своем состоянии
- Нет сложной логики переходов

### 3. **Четкий поток**
- 4 четких шага онбординга
- Каждый шаг имеет одну ответственность
- Прогресс сохраняется автоматически

## 🏛️ Архитектура

```
┌─────────────────────────────────────────────────────────────┐
│                    OnboardingProvider                       │
│                     (Context)                              │
├─────────────────────────────────────────────────────────────┤
│  State: currentStep, data, isCompleted                    │
│  Actions: goToNextStep, setUserName, etc.                 │
│  Storage: localStorage management                          │
└─────────────────────────────────────────────────────────────┤
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                   OnboardingFlow                           │
│                (Router Component)                          │
├─────────────────────────────────────────────────────────────┤
│  - Проверяет текущий шаг                                  │
│  - Отображает соответствующий компонент                   │
│  - Управляет загрузкой                                    │
└─────────────────────────────────────────────────────────────┤
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│              Step Components                               │
├─────────────────┬─────────────────┬───────────────────────┤
│ WelcomeOnboarding│ SphereSelector  │ OnboardingComplete   │
│                 │                 │                       │
│ - Ввод имени   │ - Выбор сфер    │ - Итоги               │
│ - Ввод цели    │ - Настройка     │ - Создание аккаунта   │
└─────────────────┴─────────────────┴───────────────────────┘
```

## 🔄 Поток онбординга

### **Шаг 1: WelcomeOnboarding**
- **URL:** `/` (главная страница)
- **Действие:** Ввод имени и цели пользователя
- **Переход:** Автоматически к следующему шагу после заполнения

### **Шаг 2: SphereSelector**
- **URL:** `/onboarding/spheres`
- **Действие:** Выбор и настройка жизненных сфер
- **Переход:** К следующему шагу после выбора сфер

### **Шаг 3: OnboardingComplete**
- **URL:** `/onboarding` (встроенный)
- **Действие:** Показ итогов и предложение создать аккаунт
- **Переход:** К регистрации или завершение онбординга

### **Шаг 4: AccountCreation**
- **URL:** `/auth/register`
- **Действие:** Создание аккаунта
- **Переход:** К главному дашборду

## 🛠️ Техническая реализация

### **OnboardingContext**
```typescript
interface OnboardingContextType {
  // Состояние
  currentStep: number
  data: OnboardingData
  isCompleted: boolean
  
  // Действия
  setUserName: (name: string) => void
  goToNextStep: () => void
  completeOnboarding: () => void
  
  // Проверки
  canProceed: boolean
  progressPercentage: number
}
```

### **OnboardingFlow**
```typescript
export const OnboardingFlow: React.FC = () => {
  const { currentStep, isCompleted } = useOnboarding()
  
  if (isCompleted) return null
  
  switch (currentStep) {
    case ONBOARDING_STEPS.WELCOME:
      return <WelcomeOnboarding />
    case ONBOARDING_STEPS.SPHERE_SELECTION:
      return <SphereSelector />
    // ... другие шаги
  }
}
```

### **Шаговые компоненты**
```typescript
export const WelcomeOnboarding: React.FC = () => {
  const { data, setUserName, goToNextStep, canProceed } = useOnboarding()
  
  const handleContinue = () => {
    setUserName(localName)
    goToNextStep()
  }
  
  return (
    // UI компонент
  )
}
```

## 💾 Управление состоянием

### **localStorage структура**
```typescript
const STORAGE_KEYS = {
  ONBOARDING_DATA: 'onboardingData',      // Данные пользователя и сфер
  ONBOARDING_STEP: 'onboardingStep',      // Текущий шаг
  ONBOARDING_COMPLETE: 'onboardingComplete' // Флаг завершения
}
```

### **Автоматическое сохранение**
- Состояние сохраняется при каждом изменении
- Восстанавливается при перезагрузке страницы
- Очищается после завершения онбординга

## 🚀 Преимущества новой архитектуры

### ✅ **Исправлено:**
1. **Дублирование логики** - все в одном контексте
2. **Зацикливание** - четкий поток шагов
3. **Несинхронизированное состояние** - единый источник истины
4. **Сложная навигация** - простые переходы через контекст

### 🎯 **Улучшения:**
1. **Простота** - каждый компонент имеет одну ответственность
2. **Надежность** - состояние всегда синхронизировано
3. **Тестируемость** - легко тестировать каждый шаг отдельно
4. **Расширяемость** - просто добавить новые шаги

## 🔧 Использование

### **В компонентах**
```typescript
import { useOnboarding } from '@/contexts/OnboardingContext'

export const MyComponent = () => {
  const { currentStep, data, goToNextStep } = useOnboarding()
  
  // Используем состояние и действия
}
```

### **В страницах**
```typescript
import { OnboardingFlow } from '@/components/onboarding/OnboardingFlow'

export default function OnboardingPage() {
  return <OnboardingFlow />
}
```

### **Проверка состояния**
```typescript
const { isCompleted } = useOnboarding()

if (!isCompleted) {
  return <OnboardingFlow />
}
```

## 🧪 Тестирование

### **Сброс онбординга**
Для тестирования доступна страница `/onboarding/reset`, которая сбрасывает весь прогресс.

### **Отладка**
В консоли браузера можно отслеживать изменения состояния:
```typescript
// В OnboardingContext добавлены console.log для отладки
console.log('Onboarding state updated:', state)
```

## 📱 Адаптивность

Все компоненты онбординга адаптированы для мобильных устройств:
- Responsive дизайн
- Touch-friendly интерфейс
- Оптимизированные размеры элементов

## 🎨 UI/UX принципы

1. **Консистентность** - единый стиль всех шагов
2. **Прогресс** - четкое понимание текущего положения
3. **Простота** - минимальное количество действий на шаг
4. **Обратная связь** - мгновенная реакция на действия пользователя

---

**Результат:** Онбординг стал простым, надежным и легко поддерживаемым! 🎉
