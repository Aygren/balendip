'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { useOnboarding } from '@/contexts/OnboardingContext'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'

export default function ResetOnboardingPage() {
  const { resetOnboarding } = useOnboarding()
  const router = useRouter()

  const handleReset = () => {
    resetOnboarding()
    router.push('/')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 flex items-center justify-center p-4">
      <Card className="p-8 text-center max-w-md">
        <h1 className="text-2xl font-bold text-secondary-900 mb-4">
          Сброс онбординга
        </h1>
        <p className="text-secondary-600 mb-6">
          Вы уверены, что хотите сбросить прогресс онбординга? 
          Это действие нельзя отменить.
        </p>
        
        <div className="space-y-3">
          <Button
            onClick={handleReset}
            variant="primary"
            className="w-full"
          >
            Сбросить онбординг
          </Button>
          
          <Button
            onClick={() => router.push('/')}
            variant="secondary"
            className="w-full"
          >
            Отмена
          </Button>
        </div>
      </Card>
    </div>
  )
}
