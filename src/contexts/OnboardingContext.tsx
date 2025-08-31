'use client'

import React, { createContext, useContext, ReactNode, useState, useCallback, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { LifeSphere } from '@/types'

// ===== КОНТЕКСТ ОНБОРДИНГА =====

export interface OnboardingData {
  userName: string
  userGoal: string
  selectedSpheres: string[]
  spheres: LifeSphere[]
}

export interface OnboardingContextType {
  // Состояние
  currentStep: number
  data: OnboardingData
  isCompleted: boolean
  isLoading: boolean

  // Действия
  setUserName: (name: string) => void
  setUserGoal: (goal: string) => void
  setSelectedSpheres: (sphereIds: string[]) => void
  setSpheres: (spheres: LifeSphere[]) => void
  goToNextStep: () => void
  goToPreviousStep: () => void
  goToStep: (step: number) => void
  completeOnboarding: () => void
  resetOnboarding: () => void

  // Проверки
  canProceed: (localData?: Partial<OnboardingData>) => boolean
  canGoBack: boolean
  progressPercentage: number
}

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined)

// Константы для шагов онбординга
export const ONBOARDING_STEPS = {
  WELCOME: 1,
  SPHERE_SELECTION: 2,
  SPHERE_SETUP: 3,
  COMPLETE: 4
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
  ONBOARDING_DATA: 'onboardingData',
  ONBOARDING_STEP: 'onboardingStep',
  ONBOARDING_COMPLETE: 'onboardingComplete'
} as const

const isBrowser = () => typeof window !== 'undefined'

function getStorageItem<T>(key: string, defaultValue: T): T {
  if (!isBrowser()) return defaultValue

  try {
    const item = localStorage.getItem(key)
    return item ? JSON.parse(item) : defaultValue
  } catch (error) {
    console.error(`Ошибка чтения из localStorage для ключа ${key}:`, error)
    return defaultValue
  }
}

function setStorageItem<T>(key: string, value: T): void {
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

// Провайдер контекста онбординга
export const OnboardingProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)

  // Инициализируем состояние из localStorage
  const [state, setState] = useState<{
    currentStep: number
    data: OnboardingData
    isCompleted: boolean
  }>(() => {
    const isCompleted = getStorageItem(STORAGE_KEYS.ONBOARDING_COMPLETE, false)

    // Проверяем корректность currentStep
    let currentStep = getStorageItem(STORAGE_KEYS.ONBOARDING_STEP, ONBOARDING_STEPS.WELCOME)
    if (currentStep < ONBOARDING_STEPS.WELCOME || currentStep > ONBOARDING_STEPS.COMPLETE) {
      console.log('⚠️ Invalid currentStep from localStorage:', currentStep, 'resetting to WELCOME')
      currentStep = ONBOARDING_STEPS.WELCOME
    }

    const data = getStorageItem<OnboardingData>(STORAGE_KEYS.ONBOARDING_DATA, {
      userName: '',
      userGoal: '',
      selectedSpheres: [],
      spheres: DEFAULT_SPHERES
    })

    console.log('OnboardingContext: Initializing state from localStorage:', {
      isCompleted,
      currentStep,
      data
    })

    return {
      currentStep,
      data,
      isCompleted
    }
  })

  // Загружаем состояние при монтировании
  useEffect(() => {
    console.log('OnboardingContext: Component mounted, setting isLoading to false')
    setIsLoading(false)
  }, [])

  // Сохраняем состояние в localStorage при изменениях
  useEffect(() => {
    if (!isLoading) {
      console.log('OnboardingContext: Saving state to localStorage:', {
        step: state.currentStep,
        data: state.data,
        isCompleted: state.isCompleted
      })
      setStorageItem(STORAGE_KEYS.ONBOARDING_STEP, state.currentStep)
      setStorageItem(STORAGE_KEYS.ONBOARDING_DATA, state.data)
    } else {
      console.log('OnboardingContext: Still loading, not saving state')
    }
  }, [state, isLoading])

  // Обновляем состояние
  const updateState = useCallback((updates: Partial<typeof state> | ((prev: typeof state) => typeof state)) => {
    console.log('=== updateState called ===')
    console.log('Updates:', updates)

    setState(prev => {
      const newState = typeof updates === 'function' ? updates(prev) : { ...prev, ...updates }
      console.log('Current state before update:', prev)
      console.log('New state after update:', newState)
      return newState
    })
  }, []) // Убираем state из зависимостей!

  // Устанавливаем имя пользователя
  const setUserName = useCallback((userName: string) => {
    console.log('OnboardingContext: setUserName called with:', userName)
    console.log('OnboardingContext: Current state before setUserName:', state)
    updateState(prev => {
      const newState = {
        ...prev,
        data: { ...prev.data, userName }
      }
      console.log('OnboardingContext: New state after setUserName:', newState)
      return newState
    })
  }, [updateState, state])

  // Устанавливаем цель пользователя
  const setUserGoal = useCallback((userGoal: string) => {
    console.log('OnboardingContext: setUserGoal called with:', userGoal)
    console.log('OnboardingContext: Current state before setUserGoal:', state)
    updateState(prev => {
      const newState = {
        ...prev,
        data: { ...prev.data, userGoal }
      }
      console.log('OnboardingContext: New state after setUserGoal:', newState)
      return newState
    })
  }, [updateState, state])

  // Устанавливаем выбранные сферы
  const setSelectedSpheres = useCallback((selectedSpheres: string[]) => {
    console.log('OnboardingContext: setSelectedSpheres called with:', selectedSpheres)
    updateState(prev => ({
      ...prev,
      data: { ...prev.data, selectedSpheres }
    }))
  }, [updateState])

  // Устанавливаем настроенные сферы
  const setSpheres = useCallback((spheres: LifeSphere[]) => {
    console.log('OnboardingContext: setSpheres called with:', spheres)
    updateState(prev => ({
      ...prev,
      data: { ...prev.data, spheres }
    }))
  }, [updateState])

  // Завершение онбординга
  const completeOnboarding = useCallback(() => {
    console.log('OnboardingContext: completeOnboarding called')
    setStorageItem(STORAGE_KEYS.ONBOARDING_COMPLETE, true)
    removeStorageItem(STORAGE_KEYS.ONBOARDING_DATA)
    removeStorageItem(STORAGE_KEYS.ONBOARDING_STEP)

    updateState({ isCompleted: true })

    // Переходим к главной странице
    try {
      if (router) {
        console.log('✅ Router available, redirecting to /')
        router.push('/')
      } else {
        console.log('❌ Router not available, using window.location')
        window.location.href = '/'
      }
    } catch (error) {
      console.error('Error during navigation:', error)
      // Fallback to window.location
      window.location.href = '/'
    }
  }, [router, updateState])

  // Сброс онбординга
  const resetOnboarding = useCallback(() => {
    console.log('OnboardingContext: resetOnboarding called')
    removeStorageItem(STORAGE_KEYS.ONBOARDING_COMPLETE)
    removeStorageItem(STORAGE_KEYS.ONBOARDING_DATA)
    removeStorageItem(STORAGE_KEYS.ONBOARDING_STEP)

    updateState({
      currentStep: ONBOARDING_STEPS.WELCOME,
      data: {
        userName: '',
        userGoal: '',
        selectedSpheres: [],
        spheres: DEFAULT_SPHERES
      },
      isCompleted: false
    })
  }, [updateState])

  // Переход к следующему шагу
  const goToNextStep = useCallback(() => {
    console.log('=== goToNextStep called ===')
    console.log('Current state:', state)

    // Простая проверка для шага WELCOME
    if (state.currentStep === ONBOARDING_STEPS.WELCOME) {
      if (state.data.userName && state.data.userGoal) {
        console.log('✅ Welcome step: can proceed, moving to next step')
        setState(prev => ({ ...prev, currentStep: ONBOARDING_STEPS.SPHERE_SELECTION }))
        return
      } else {
        console.log('❌ Welcome step: missing userName or userGoal')
        return
      }
    }

    // Простая проверка для других шагов
    if (state.currentStep === ONBOARDING_STEPS.SPHERE_SELECTION) {
      if (state.data.selectedSpheres.length > 0) {
        console.log('✅ Sphere selection: can proceed, moving to next step')
        setState(prev => ({ ...prev, currentStep: ONBOARDING_STEPS.SPHERE_SETUP }))
        return
      }
    }

    if (state.currentStep === ONBOARDING_STEPS.SPHERE_SETUP) {
      if (state.data.selectedSpheres.length > 0) {
        console.log('✅ Sphere setup: can proceed, moving to next step')
        setState(prev => ({ ...prev, currentStep: ONBOARDING_STEPS.COMPLETE }))
        return
      }
    }

    if (state.currentStep === ONBOARDING_STEPS.COMPLETE) {
      console.log('✅ Complete step: finishing onboarding')
      completeOnboarding()
      return
    }

    console.log('❌ Cannot proceed from current step:', state.currentStep)
  }, [state, completeOnboarding])

  // Переход к предыдущему шагу
  const goToPreviousStep = useCallback(() => {
    console.log('OnboardingContext: goToPreviousStep called')
    updateState(prev => {
      console.log('goToPreviousStep: currentStep:', prev.currentStep)
      if (prev.currentStep > ONBOARDING_STEPS.WELCOME) {
        const prevStep = prev.currentStep - 1
        console.log('Moving to previous step:', prevStep)
        return { ...prev, currentStep: prevStep }
      } else {
        console.log('Cannot go back: already at first step')
        return prev
      }
    })
  }, [updateState])

  // Переход к конкретному шагу
  const goToStep = useCallback((step: number) => {
    console.log('OnboardingContext: goToStep called with:', step)
    updateState(prev => {
      if (step >= ONBOARDING_STEPS.WELCOME && step <= ONBOARDING_STEPS.COMPLETE) {
        console.log('Moving to step:', step)
        return { ...prev, currentStep: step }
      } else {
        console.log('Invalid step:', step, 'must be between', ONBOARDING_STEPS.WELCOME, 'and', ONBOARDING_STEPS.COMPLETE)
        return prev
      }
    })
  }, [updateState])

  const contextValue: OnboardingContextType = {
    // Состояние
    currentStep: state.currentStep,
    data: state.data,
    isCompleted: state.isCompleted,
    isLoading,

    // Действия
    setUserName,
    setUserGoal,
    setSelectedSpheres,
    setSpheres,
    goToNextStep,
    goToPreviousStep,
    goToStep,
    completeOnboarding,
    resetOnboarding,

    // Проверки
    canProceed: (localData?: Partial<OnboardingData>) => {
      // Используем локальные данные, если они переданы, иначе используем данные из контекста
      const dataToCheck = localData ? { ...state.data, ...localData } : state.data

      console.log('canProceed called with:', { localData, dataToCheck, currentStep: state.currentStep })

      switch (state.currentStep) {
        case ONBOARDING_STEPS.WELCOME:
          const canProceedWelcome = !!(dataToCheck.userName && dataToCheck.userGoal)
          console.log('Welcome step canProceed:', canProceedWelcome, { userName: dataToCheck.userName, userGoal: dataToCheck.userGoal })
          return canProceedWelcome
        case ONBOARDING_STEPS.SPHERE_SELECTION:
          const canProceedSpheres = dataToCheck.selectedSpheres.length > 0
          console.log('Sphere step canProceed:', canProceedSpheres, { selectedSpheres: dataToCheck.selectedSpheres })
          return canProceedSpheres
        case ONBOARDING_STEPS.SPHERE_SETUP:
          const canProceedSetup = dataToCheck.selectedSpheres.length > 0
          console.log('Setup step canProceed:', canProceedSetup, { selectedSpheres: dataToCheck.selectedSpheres })
          return canProceedSetup
        case ONBOARDING_STEPS.COMPLETE:
          return true
        default:
          return false
      }
    },
    canGoBack: state.currentStep > ONBOARDING_STEPS.WELCOME,
    progressPercentage: Math.round((state.currentStep / ONBOARDING_STEPS.COMPLETE) * 100)
  }

  return (
    <OnboardingContext.Provider value={contextValue}>
      {children}
    </OnboardingContext.Provider>
  )
}

// Хук для использования контекста онбординга
export const useOnboarding = (): OnboardingContextType => {
  const context = useContext(OnboardingContext)

  if (context === undefined) {
    throw new Error('useOnboarding должен использоваться внутри OnboardingProvider')
  }

  return context
}

// Утилиты для проверки состояния онбординга
export const useOnboardingStep = (): number => {
  const { currentStep } = useOnboarding()
  return currentStep
}

export const useOnboardingData = (): OnboardingData => {
  const { data } = useOnboarding()
  return data
}

export const useIsOnboardingCompleted = (): boolean => {
  const { isCompleted } = useOnboarding()
  return isCompleted
}
