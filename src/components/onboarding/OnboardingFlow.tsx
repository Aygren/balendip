'use client'

import React from 'react'
import { useOnboarding, ONBOARDING_STEPS } from '@/contexts/OnboardingContext'
import { WelcomeOnboarding } from './WelcomeOnboarding'
import { SphereSelector } from './SphereSelector'

export const OnboardingFlow: React.FC = () => {
  const { currentStep, isCompleted, isLoading } = useOnboarding()

  console.log('OnboardingFlow: currentStep =', currentStep, 'isCompleted =', isCompleted, 'isLoading =', isLoading)

  // Если онбординг завершен, не показываем ничего
  if (isCompleted) {
    console.log('OnboardingFlow: Onboarding completed, returning null')
    return null
  }

  // Если загрузка, показываем спиннер
  if (isLoading) {
    console.log('OnboardingFlow: Loading, showing spinner')
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
      </div>
    )
  }

  // Отображаем соответствующий шаг
  console.log('=== OnboardingFlow: Rendering step ===')
  console.log('Current step:', currentStep)
  console.log('Step constants:', ONBOARDING_STEPS)

  // Оборачиваем все в контейнер без отступов
  const renderStep = () => {
    switch (currentStep) {
      case ONBOARDING_STEPS.WELCOME:
        console.log('🎯 Rendering WelcomeOnboarding')
        return <WelcomeOnboarding />

      case ONBOARDING_STEPS.SPHERE_SELECTION:
        console.log('🎯 Rendering SphereSelector (SPHERE_SELECTION)')
        return <SphereSelector />

      case ONBOARDING_STEPS.SPHERE_SETUP:
        console.log('🎯 Rendering SphereSelector (SPHERE_SETUP)')
        return <SphereSelector /> // Используем тот же компонент для настройки сфер

      default:
        console.log('❌ Unknown step, defaulting to WelcomeOnboarding')
        return <WelcomeOnboarding />
    }
  }

  return (
    <>
      {renderStep()}
    </>
  )
}
