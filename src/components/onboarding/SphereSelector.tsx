'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import { useOnboarding, ONBOARDING_STEPS } from '@/contexts/OnboardingContext'
import { LifeSphere } from '@/types'

export const SphereSelector: React.FC = () => {
  const { data, setSelectedSpheres, setSpheres, goToNextStep, goToPreviousStep, canProceed, currentStep, completeOnboarding } = useOnboarding()
  const [localSpheres, setLocalSpheres] = useState<LifeSphere[]>(data.spheres)
  // По умолчанию выбираем все сферы
  const [selectedIds, setSelectedIds] = useState<string[]>(() =>
    data.spheres.map(sphere => sphere.id)
  )

  // Инициализируем выбранные сферы при загрузке
  React.useEffect(() => {
    const allSphereIds = data.spheres.map(sphere => sphere.id)
    setSelectedIds(allSphereIds)
    console.log('SphereSelector: useEffect - setting selectedIds to:', allSphereIds)
  }, [data.spheres])

  // Добавляем логирование для отладки
  React.useEffect(() => {
    console.log('SphereSelector: current data:', data)
    console.log('SphereSelector: current selectedIds:', selectedIds)
    console.log('SphereSelector: current localSpheres:', localSpheres)
  }, [data, selectedIds, localSpheres])

  const handleSphereScoreChange = (sphereId: string, newScore: number) => {
    const updatedSpheres = localSpheres.map(sphere =>
      sphere.id === sphereId ? { ...sphere, score: newScore } : sphere
    )
    setLocalSpheres(updatedSpheres)
  }

  const handleContinue = () => {
    console.log('=== SphereSelector: handleContinue called ===')
    console.log('currentStep:', currentStep)
    console.log('selectedIds:', selectedIds)
    console.log('localSpheres:', localSpheres)

    if (selectedIds.length === 0) {
      console.log('❌ No spheres selected, cannot continue')
      return
    }

    // Обновляем выбранные сферы
    console.log('✅ Setting selected spheres:', selectedIds)
    setSelectedSpheres(selectedIds)

    // Обновляем настроенные сферы
    console.log('✅ Setting configured spheres:', localSpheres)
    setSpheres(localSpheres)

    if (currentStep === ONBOARDING_STEPS.SPHERE_SETUP) {
      // На шаге настройки сфер - завершаем онбординг и переходим в главное окно
      console.log('🎯 SPHERE_SETUP step - completing onboarding and going to main page')
      completeOnboarding()
    } else {
      // На шаге выбора сфер - переходим к следующему шагу
      console.log('🎯 SPHERE_SELECTION step - going to next step')
      goToNextStep()
    }
  }

  const handleBack = () => {
    // Возвращаемся к предыдущему шагу через контекст
    console.log('SphereSelector: handleBack called')
    goToPreviousStep()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 p-4">
      <div className="w-full max-w-6xl mx-auto">
        {/* Заголовок */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-secondary-900 mb-4">
            Настройте сферы жизни ⚙️
          </h1>
          <p className="text-lg md:text-xl text-secondary-600 max-w-2xl mx-auto">
            Оцените текущее состояние всех жизненных сфер
          </p>
        </motion.div>

        {/* Сетка сфер */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12 max-w-6xl mx-auto"
        >
          {localSpheres.map((sphere, index) => (
            <motion.div
              key={sphere.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1, duration: 0.3 }}
              className="col-span-1"
            >
              <Card
                className="p-4 transition-all duration-200 hover:shadow-lg bg-white h-full"
              >
                {/* Иконка и название */}
                <div className="text-center mb-3">
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center text-xl mx-auto mb-2"
                    style={{ backgroundColor: `${sphere.color}20` }}
                  >
                    {sphere.icon}
                  </div>
                  <h3 className="font-semibold text-secondary-900 text-sm">{sphere.name}</h3>
                </div>

                {/* Слайдер оценки (всегда видимый) */}
                <div className="space-y-2">
                  <label className="text-xs text-secondary-600">
                    Оценка: {sphere.score}/10
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={sphere.score}
                    onChange={(e) => handleSphereScoreChange(sphere.id, parseInt(e.target.value))}
                    className="w-full h-2 bg-secondary-200 rounded-lg appearance-none cursor-pointer slider"
                    style={{
                      background: `linear-gradient(to right, ${sphere.color} 0%, ${sphere.color} ${sphere.score * 10}%, #e5e7eb ${sphere.score * 10}%, #e5e7eb 100%)`
                    }}
                  />
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Статистика */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-center mb-8"
        >
          <Card className="p-6 inline-block">
            <div className="text-2xl font-bold text-primary-600 mb-2">
              Все сферы: {selectedIds.length}
            </div>
            <div className="text-secondary-600">
              Средний балл: {Math.round(
                localSpheres
                  .filter(sphere => selectedIds.includes(sphere.id))
                  .reduce((sum, sphere) => sum + sphere.score, 0) / selectedIds.length
              )}/10
            </div>
          </Card>
        </motion.div>

        {/* Кнопки навигации */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <Button
            variant="secondary"
            onClick={handleBack}
            size="lg"
            className="min-w-[200px]"
          >
            ← Назад
          </Button>

          <Button
            onClick={handleContinue}
            disabled={selectedIds.length === 0}
            size="lg"
            className="min-w-[200px]"
          >
            Продолжить →
          </Button>
        </motion.div>

        {/* Прогресс */}
        <div className="text-center mt-6 text-sm text-secondary-500">
          {currentStep === ONBOARDING_STEPS.SPHERE_SELECTION ? 'Шаг 2 из 4' : 'Шаг 3 из 4'}
        </div>
      </div>
    </div>
  )
}
