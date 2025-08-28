'use client'

import React from 'react'
import { Onboarding } from '@/components/onboarding/Onboarding'
import { useOnboarding } from '@/hooks/useOnboarding'
import { LifeSphere } from '@/types'

export default function OnboardingPage() {
  const { completeOnboarding } = useOnboarding()

  const handleOnboardingComplete = async (spheres: LifeSphere[]) => {
    try {
      await completeOnboarding()
      console.log('Onboarding completed successfully')
    } catch (error) {
      console.error('Error completing onboarding:', error)
      // В случае ошибки с Supabase, все равно завершаем онбординг локально
    }
  }

  return (
    <Onboarding onComplete={handleOnboardingComplete} />
  )
}
