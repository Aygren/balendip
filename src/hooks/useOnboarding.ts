import { useState, useCallback } from 'react'
import { useSpheres } from './useSpheres'
import { useInitializeSpheres } from './useSpheres'

// ===== ХУК ДЛЯ ОНБОРДИНГА =====

export interface OnboardingStep {
  id: string
  title: string
  description: string
  isCompleted: boolean
  isRequired: boolean
}

export interface OnboardingState {
  currentStep: number
  steps: OnboardingStep[]
  isCompleted: boolean
  progress: number
}

const DEFAULT_ONBOARDING_STEPS: OnboardingStep[] = [
  {
    id: 'welcome',
    title: 'Добро пожаловать в Balendip!',
    description: 'Давайте настроим ваше приложение для отслеживания жизненных сфер',
    isCompleted: false,
    isRequired: true,
  },
  {
    id: 'spheres-setup',
    title: 'Настройка жизненных сфер',
    description: 'Создайте основные сферы жизни, которые важны для вас',
    isCompleted: false,
    isRequired: true,
  },
  {
    id: 'first-event',
    title: 'Первое событие',
    description: 'Создайте свое первое событие для отслеживания',
    isCompleted: false,
    isRequired: false,
  },
  {
    id: 'preferences',
    title: 'Настройки',
    description: 'Настройте свои предпочтения и уведомления',
    isCompleted: false,
    isRequired: false,
  },
]

export const useOnboarding = () => {
  const [onboardingState, setOnboardingState] = useState<OnboardingState>(() => {
    // Загружаем состояние из localStorage
    const saved = localStorage.getItem('onboarding-state')
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        return {
          ...parsed,
          steps: DEFAULT_ONBOARDING_STEPS.map((step, index) => ({
            ...step,
            ...parsed.steps[index],
          })),
        }
      } catch {
        // Если ошибка парсинга, используем дефолтное состояние
      }
    }

    return {
      currentStep: 0,
      steps: DEFAULT_ONBOARDING_STEPS,
      isCompleted: false,
      progress: 0,
    }
  })

  const { spheres } = useSpheres()
  const { mutate: initializeSpheres, isPending: isInitializingSpheres } = useInitializeSpheres()

  // Сохранение состояния в localStorage
  const saveState = useCallback((newState: OnboardingState) => {
    localStorage.setItem('onboarding-state', JSON.stringify(newState))
    setOnboardingState(newState)
  }, [])

  // Переход к следующему шагу
  const goToNextStep = useCallback(() => {
    if (onboardingState.currentStep < onboardingState.steps.length - 1) {
      const newState = {
        ...onboardingState,
        currentStep: onboardingState.currentStep + 1,
      }
      saveState(newState)
    }
  }, [onboardingState, saveState])

  // Переход к предыдущему шагу
  const goToPreviousStep = useCallback(() => {
    if (onboardingState.currentStep > 0) {
      const newState = {
        ...onboardingState,
        currentStep: onboardingState.currentStep - 1,
      }
      saveState(newState)
    }
  }, [onboardingState, saveState])

  // Переход к конкретному шагу
  const goToStep = useCallback((stepIndex: number) => {
    if (stepIndex >= 0 && stepIndex < onboardingState.steps.length) {
      const newState = {
        ...onboardingState,
        currentStep: stepIndex,
      }
      saveState(newState)
    }
  }, [onboardingState, saveState])

  // Отметка шага как завершенного
  const completeStep = useCallback((stepId: string) => {
    const newSteps = onboardingState.steps.map(step =>
      step.id === stepId ? { ...step, isCompleted: true } : step
    )

    const completedSteps = newSteps.filter(step => step.isCompleted).length
    const progress = Math.round((completedSteps / newSteps.length) * 100)
    const isCompleted = progress === 100

    const newState = {
      ...onboardingState,
      steps: newSteps,
      progress,
      isCompleted,
    }

    saveState(newState)
  }, [onboardingState, saveState])

  // Сброс онбординга
  const resetOnboarding = useCallback(() => {
    const newState = {
      currentStep: 0,
      steps: DEFAULT_ONBOARDING_STEPS,
      isCompleted: false,
      progress: 0,
    }
    saveState(newState)
  }, [saveState])

  // Автоматическое завершение шага настройки сфер
  const completeSpheresSetup = useCallback(() => {
    if (spheres && spheres.length > 0) {
      completeStep('spheres-setup')
    }
  }, [spheres, completeStep])

  // Инициализация сфер жизни
  const handleInitializeSpheres = useCallback(() => {
    initializeSpheres(undefined, {
      onSuccess: () => {
        completeStep('spheres-setup')
        goToNextStep()
      },
    })
  }, [initializeSpheres, completeStep, goToNextStep])

  // Получение текущего шага
  const currentStep = onboardingState.steps[onboardingState.currentStep]

  // Проверка, можно ли перейти к следующему шагу
  const canGoToNext = currentStep?.isCompleted || !currentStep?.isRequired

  // Проверка, можно ли перейти к предыдущему шагу
  const canGoToPrevious = onboardingState.currentStep > 0

  // Получение прогресса в процентах
  const progressPercentage = onboardingState.progress

  // Проверка, завершен ли онбординг
  const isOnboardingCompleted = onboardingState.isCompleted

  return {
    // Состояние
    currentStep,
    currentStepIndex: onboardingState.currentStep,
    steps: onboardingState.steps,
    progress: progressPercentage,
    isCompleted: isOnboardingCompleted,

    // Действия
    goToNextStep,
    goToPreviousStep,
    goToStep,
    completeStep,
    resetOnboarding,

    // Специальные действия
    completeSpheresSetup,
    handleInitializeSpheres,

    // Проверки
    canGoToNext,
    canGoToPrevious,

    // Загрузка
    isInitializingSpheres,

    // Утилиты
    totalSteps: onboardingState.steps.length,
    completedSteps: onboardingState.steps.filter(step => step.isCompleted).length,
  }
}
