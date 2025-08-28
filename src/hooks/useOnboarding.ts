import { useState, useCallback, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { LifeSphere } from '@/types'

// Типы для онбординга
export interface OnboardingProgress {
  step: number
  userName?: string
  userGoal?: string
  selectedSpheres?: string[]
  spheres?: LifeSphere[]
  spheresConfigured?: boolean
}

export interface OnboardingState {
  currentStep: number
  progress: OnboardingProgress
  isCompleted: boolean
}

// Константы для шагов онбординга
export const ONBOARDING_STEPS = {
  WELCOME: 1,
  SPHERE_SELECTION: 2,
  SPHERE_SETUP: 3,
  ACCOUNT_CREATION: 4,
  MAIN_DASHBOARD: 5
} as const

export type OnboardingStep = typeof ONBOARDING_STEPS[keyof typeof ONBOARDING_STEPS]

// Дефолтные сферы жизни
const DEFAULT_SPHERES: LifeSphere[] = [
  { id: '1', user_id: '', name: 'Здоровье', score: 5, color: '#10B981', icon: '🏥', is_default: true, created_at: '', updated_at: '' },
  { id: '2', user_id: '', name: 'Карьера', score: 5, color: '#3B82F6', icon: '💼', is_default: true, created_at: '', updated_at: '' },
  { id: '3', user_id: '', name: 'Отношения', score: 5, color: '#F59E0B', icon: '❤️', is_default: true, created_at: '', updated_at: '' },
  { id: '4', user_id: '', name: 'Финансы', score: 5, color: '#8B5CF6', icon: '💰', is_default: true, created_at: '', updated_at: '' },
  { id: '5', user_id: '', name: 'Саморазвитие', score: 5, color: '#06B6D4', icon: '📚', is_default: true, created_at: '', updated_at: '' },
  { id: '6', user_id: '', name: 'Духовность', score: 5, color: '#EC4899', icon: '🧘', is_default: true, created_at: '', updated_at: '' },
  { id: '7', user_id: '', name: 'Отдых', score: 5, color: '#F97316', icon: '🏖️', is_default: true, created_at: '', updated_at: '' },
  { id: '8', user_id: '', name: 'Окружение', score: 5, color: '#84CC16', icon: '👥', is_default: true, created_at: '', updated_at: '' },
]

// Утилиты для работы с localStorage
const STORAGE_KEYS = {
  ONBOARDING_PROGRESS: 'onboardingProgress',
  ONBOARDING_COMPLETE: 'onboardingComplete'
} as const

const isBrowser = () => typeof window !== 'undefined'

const getStorageItem = <T>(key: string, defaultValue: T): T => {
  if (!isBrowser()) return defaultValue

  try {
    const item = localStorage.getItem(key)
    return item ? JSON.parse(item) : defaultValue
  } catch (error) {
    console.error(`Ошибка чтения из localStorage для ключа ${key}:`, error)
    return defaultValue
  }
}

const setStorageItem = <T>(key: string, value: T): void => {
  if (!isBrowser()) return

  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch (error) {
    console.error(`Ошибка записи в localStorage для ключа ${key}:`, error)
  }
}

const removeStorageItem = (key: string): void => {
  if (!isBrowser()) return

  try {
    localStorage.removeItem(key)
  } catch (error) {
    console.error(`Ошибка удаления из localStorage для ключа ${key}:`, error)
  }
}

export const useOnboarding = () => {
  const router = useRouter()
  const [state, setState] = useState<OnboardingState>(() => {
    const isCompleted = getStorageItem(STORAGE_KEYS.ONBOARDING_COMPLETE, false)
    const progress = getStorageItem<OnboardingProgress>(STORAGE_KEYS.ONBOARDING_PROGRESS, {
      step: ONBOARDING_STEPS.WELCOME
    })

    return {
      currentStep: progress.step,
      progress,
      isCompleted
    }
  })

  // Используем useRef для предотвращения замыканий
  const stateRef = useRef(state)
  stateRef.current = state

  // Сохранение состояния в localStorage
  const saveProgress = useCallback((newProgress: Partial<OnboardingProgress>) => {
    const updatedProgress = { ...stateRef.current.progress, ...newProgress }
    setStorageItem(STORAGE_KEYS.ONBOARDING_PROGRESS, updatedProgress)

    setState(prev => ({
      ...prev,
      progress: updatedProgress,
      currentStep: updatedProgress.step || prev.currentStep
    }))
  }, [])

  // Переход к следующему шагу
  const goToNextStep = useCallback(() => {
    const nextStep = stateRef.current.currentStep + 1
    if (nextStep <= ONBOARDING_STEPS.MAIN_DASHBOARD) {
      saveProgress({ step: nextStep })
    }
  }, [saveProgress])

  // Переход к предыдущему шагу
  const goToPreviousStep = useCallback(() => {
    const prevStep = stateRef.current.currentStep - 1
    if (prevStep >= ONBOARDING_STEPS.WELCOME) {
      saveProgress({ step: prevStep })
    }
  }, [saveProgress])

  // Переход к конкретному шагу
  const goToStep = useCallback((step: OnboardingStep) => {
    if (step >= ONBOARDING_STEPS.WELCOME && step <= ONBOARDING_STEPS.MAIN_DASHBOARD) {
      saveProgress({ step })
    }
  }, [saveProgress])

  // Сохранение данных пользователя (шаг 1)
  const saveUserData = useCallback((userName: string, userGoal: string) => {
    saveProgress({ userName, userGoal })
    goToNextStep()
  }, [saveProgress, goToNextStep])

  // Сохранение выбранных сфер (шаг 2)
  const saveSelectedSpheres = useCallback((selectedSpheres: string[]) => {
    saveProgress({ selectedSpheres })
    goToNextStep()
  }, [saveProgress, goToNextStep])

  // Сохранение настроенных сфер (шаг 3)
  const saveConfiguredSpheres = useCallback((spheres: LifeSphere[]) => {
    saveProgress({ spheres, spheresConfigured: true })
    goToNextStep()
  }, [saveProgress, goToNextStep])

  // Завершение онбординга
  const completeOnboarding = useCallback(() => {
    setStorageItem(STORAGE_KEYS.ONBOARDING_COMPLETE, true)
    removeStorageItem(STORAGE_KEYS.ONBOARDING_PROGRESS)

    setState(prev => ({
      ...prev,
      isCompleted: true
    }))
  }, [])

  // Сброс онбординга
  const resetOnboarding = useCallback(() => {
    removeStorageItem(STORAGE_KEYS.ONBOARDING_COMPLETE)
    removeStorageItem(STORAGE_KEYS.ONBOARDING_PROGRESS)

    setState({
      currentStep: ONBOARDING_STEPS.WELCOME,
      progress: { step: ONBOARDING_STEPS.WELCOME },
      isCompleted: false
    })
  }, [])

  // Получение текущего шага
  const getCurrentStep = useCallback(() => {
    return stateRef.current.currentStep
  }, [])

  // Проверка, можно ли перейти к следующему шагу
  const canGoToNext = useCallback(() => {
    const { currentStep, progress } = stateRef.current

    switch (currentStep) {
      case ONBOARDING_STEPS.WELCOME:
        return !!(progress.userName && progress.userGoal)
      case ONBOARDING_STEPS.SPHERE_SELECTION:
        return !!(progress.selectedSpheres && progress.selectedSpheres.length > 0)
      case ONBOARDING_STEPS.SPHERE_SETUP:
        return progress.spheresConfigured === true
      case ONBOARDING_STEPS.ACCOUNT_CREATION:
        return true
      default:
        return false
    }
  }, [])

  // Проверка, можно ли перейти к предыдущему шагу
  const canGoToPrevious = useCallback(() => {
    return stateRef.current.currentStep > ONBOARDING_STEPS.WELCOME
  }, [])

  // Получение прогресса в процентах
  const getProgressPercentage = useCallback(() => {
    const { currentStep } = stateRef.current
    return Math.round((currentStep / ONBOARDING_STEPS.MAIN_DASHBOARD) * 100)
  }, [])

  // Получение данных для текущего шага
  const getStepData = useCallback(() => {
    const { progress } = stateRef.current
    return progress
  }, [])

  // Навигация между страницами онбординга
  const navigateToStep = useCallback((step: OnboardingStep) => {
    const routes = {
      [ONBOARDING_STEPS.WELCOME]: '/',
      [ONBOARDING_STEPS.SPHERE_SELECTION]: '/onboarding/spheres',
      [ONBOARDING_STEPS.SPHERE_SETUP]: '/onboarding/setup',
      [ONBOARDING_STEPS.ACCOUNT_CREATION]: '/auth/register',
      [ONBOARDING_STEPS.MAIN_DASHBOARD]: '/'
    }

    const route = routes[step]
    if (route) {
      router.push(route)
    }
  }, [router])

  // Автоматическая навигация при изменении шага
  useEffect(() => {
    if (state.currentStep !== state.progress.step) {
      navigateToStep(state.progress.step)
    }
  }, [state.progress.step, navigateToStep])

  return {
    // Состояние
    currentStep: state.currentStep,
    progress: state.progress,
    isCompleted: state.isCompleted,

    // Данные
    spheres: DEFAULT_SPHERES,
    stepData: getStepData(),

    // Навигация
    goToNextStep,
    goToPreviousStep,
    goToStep,
    navigateToStep,

    // Действия для конкретных шагов
    saveUserData,
    saveSelectedSpheres,
    saveConfiguredSpheres,
    completeOnboarding,
    resetOnboarding,
    saveProgress,

    // Проверки
    canGoToNext: canGoToNext(),
    canGoToPrevious: canGoToPrevious(),

    // Утилиты
    progressPercentage: getProgressPercentage(),
    totalSteps: ONBOARDING_STEPS.MAIN_DASHBOARD,

    // Константы
    steps: ONBOARDING_STEPS
  }
}
