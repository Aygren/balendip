'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import { useOnboarding } from '@/contexts/OnboardingContext'

export const WelcomeOnboarding: React.FC = () => {
  const { data, setUserName, setUserGoal, goToNextStep, canProceed } = useOnboarding()
  const [localName, setLocalName] = useState(data.userName || 'Сергей')
  const [localGoal, setLocalGoal] = useState(data.userGoal || 'Хочу на море!!!')

  // Добавляем логирование для отладки
  React.useEffect(() => {
    console.log('WelcomeOnboarding: Component mounted/updated')
    console.log('WelcomeOnboarding: data from context:', data)
    console.log('WelcomeOnboarding: localName:', `"${localName}"`)
    console.log('WelcomeOnboarding: localGoal:', `"${localGoal}"`)
    console.log('WelcomeOnboarding: localName.trim():', `"${localName.trim()}"`)
    console.log('WelcomeOnboarding: localGoal.trim():', `"${localGoal.trim()}"`)
    console.log('WelcomeOnboarding: Button disabled:', !localName.trim() || !localGoal.trim())
    console.log('WelcomeOnboarding: Button enabled:', !(!localName.trim() || !localGoal.trim()))
  }, [data, localName, localGoal])



  const handleContinue = () => {
    console.log('=== WelcomeOnboarding: handleContinue called ===')
    console.log('localName:', localName, 'localGoal:', localGoal)
    console.log('Button disabled state:', !(localName.trim() && localGoal.trim()))

    if (localName.trim() && localGoal.trim()) {
      console.log('✅ Setting user data and moving to next step')
      
      const trimmedName = localName.trim()
      const trimmedGoal = localGoal.trim()
      
      console.log('Calling setUserName with:', trimmedName)
      setUserName(trimmedName)
      console.log('Calling setUserGoal with:', trimmedGoal)
      setUserGoal(trimmedGoal)

      // Вызываем goToNextStep сразу
      console.log('Calling goToNextStep() immediately')
      goToNextStep()
      console.log('✅ goToNextStep() called successfully')
    } else {
      console.log('❌ Missing user data, cannot continue')
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && localName.trim() && localGoal.trim()) {
      handleContinue()
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="p-8 text-center">
          {/* Логотип */}
          <motion.div
            className="w-20 h-20 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center mx-auto mb-6"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5, type: "spring" }}
          >
            <span className="text-white text-2xl font-bold">B</span>
          </motion.div>

          {/* Заголовок */}
          <motion.h1
            className="text-2xl font-bold text-secondary-900 mb-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            Добро пожаловать в Balendip!
          </motion.h1>

          <motion.p
            className="text-secondary-600 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            Давайте настроим ваш персональный трекер баланса жизни
          </motion.p>

          {/* Форма */}
          <motion.div
            className="space-y-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.5 }}
          >
            <Input
              label="Ваше имя"
              value={localName}
              onChange={(e) => setLocalName(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Введите ваше имя"
              className="text-center"
            />

            <Input
              label="Ваша цель"
              value={localGoal}
              onChange={(e) => setLocalGoal(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Что хотите улучшить в жизни?"
              className="text-center"
            />
          </motion.div>

          {/* Кнопка продолжения */}
          <motion.div
            className="mt-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0, duration: 0.5 }}
          >
            <Button
              onClick={() => {
                console.log('🔥 Button clicked!')
                console.log('🔥 Button state check:')
                console.log('  - localName:', `"${localName}"`)
                console.log('  - localGoal:', `"${localGoal}"`)
                console.log('  - localName.trim():', `"${localName.trim()}"`)
                console.log('  - localGoal.trim():', `"${localGoal.trim()}"`)
                console.log('  - Button disabled:', !localName.trim() || !localGoal.trim())
                handleContinue()
              }}
              disabled={!localName.trim() || !localGoal.trim()}
              className="w-full"
              size="lg"
            >
              Продолжить
            </Button>
          </motion.div>

          {/* Прогресс */}
          <div className="mt-6 text-sm text-secondary-500">
            Шаг 1 из 4
          </div>
        </Card>
      </motion.div>
    </div>
  )
}
