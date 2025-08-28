'use client'

import React from 'react'
import { Onboarding } from '@/components/onboarding/Onboarding'
import { useOnboarding } from '@/hooks/useOnboarding'
import { LifeSphere } from '@/types'

export default function OnboardingPage() {
  const { completeOnboarding, isInitializingSpheres } = useOnboarding()

  const handleOnboardingComplete = async (spheres: LifeSphere[]) => {
    try {
      await completeOnboarding(spheres)
      console.log('Onboarding completed successfully')
    } catch (error) {
      console.error('Error completing onboarding:', error)
      // В случае ошибки с Supabase, все равно завершаем онбординг локально
    }
  }

  if (isInitializingSpheres) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500 mx-auto mb-4"></div>
          <p className="text-secondary-600">Загрузка...</p>
        </div>
      </div>
    )
  }

  return (
    <Onboarding onComplete={handleOnboardingComplete} />
  )
}
