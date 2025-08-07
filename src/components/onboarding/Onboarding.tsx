'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { OnboardingStep } from './OnboardingStep'
import { SphereSelector } from './SphereSelector'
import { LifeSphere } from '@/types'
import { useRouter } from 'next/navigation'

interface OnboardingProps {
  onComplete: (spheres: LifeSphere[]) => void
}

const defaultSpheres: LifeSphere[] = [
  { id: '1', user_id: '1', name: 'Здоровье', score: 5, color: '#10B981', icon: '🏥', is_default: true, created_at: '', updated_at: '' },
  { id: '2', user_id: '1', name: 'Карьера', score: 5, color: '#3B82F6', icon: '💼', is_default: true, created_at: '', updated_at: '' },
  { id: '3', user_id: '1', name: 'Отношения', score: 5, color: '#F59E0B', icon: '❤️', is_default: true, created_at: '', updated_at: '' },
  { id: '4', user_id: '1', name: 'Финансы', score: 5, color: '#8B5CF6', icon: '💰', is_default: true, created_at: '', updated_at: '' },
  { id: '5', user_id: '1', name: 'Саморазвитие', score: 5, color: '#06B6D4', icon: '📚', is_default: true, created_at: '', updated_at: '' },
  { id: '6', user_id: '1', name: 'Духовность', score: 5, color: '#EC4899', icon: '🧘', is_default: true, created_at: '', updated_at: '' },
  { id: '7', user_id: '1', name: 'Отдых', score: 5, color: '#F97316', icon: '🏖️', is_default: true, created_at: '', updated_at: '' },
  { id: '8', user_id: '1', name: 'Окружение', score: 5, color: '#84CC16', icon: '👥', is_default: true, created_at: '', updated_at: '' },
]

const steps = [
  {
    id: 1,
    title: 'Добро пожаловать в Balendip!',
    description: 'Давайте настроим ваш персональный трекер баланса жизни'
  },
  {
    id: 2,
    title: 'Выберите важные сферы',
    description: 'Отметьте сферы жизни, которые наиболее важны для вас'
  },
  {
    id: 3,
    title: 'Оцените текущее состояние',
    description: 'Поставьте оценку от 1 до 10 для каждой выбранной сферы'
  },
  {
    id: 4,
    title: 'Готово!',
    description: 'Ваш персональный трекер настроен и готов к использованию'
  }
]

export const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(1)
  const [spheres, setSpheres] = useState<LifeSphere[]>(defaultSpheres)
  const [selectedSpheres, setSelectedSpheres] = useState<string[]>([])
  const router = useRouter()

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1)
    } else {
      // Завершение онбординга
      const finalSpheres = spheres.filter(sphere => selectedSpheres.includes(sphere.id))
      onComplete(finalSpheres)
      router.push('/')
    }
  }

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSphereToggle = (sphereId: string) => {
    setSelectedSpheres(prev => 
      prev.includes(sphereId)
        ? prev.filter(id => id !== sphereId)
        : [...prev, sphereId]
    )
  }

  const handleSpheresChange = (newSpheres: LifeSphere[]) => {
    setSpheres(newSpheres)
  }

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return true
      case 2:
        return selectedSpheres.length > 0
      case 3:
        return selectedSpheres.length > 0
      case 4:
        return true
      default:
        return false
    }
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <motion.div
              className="w-24 h-24 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center mx-auto mb-6"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5, type: "spring" }}
            >
              <span className="text-white text-3xl font-bold">B</span>
            </motion.div>
            <motion.h3
              className="text-xl font-semibold text-secondary-900 mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              Balendip поможет вам отслеживать баланс жизни
            </motion.h3>
            <motion.p
              className="text-secondary-600"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.5 }}
            >
              Записывайте события, анализируйте тренды и улучшайте качество жизни
            </motion.p>
          </motion.div>
        )

      case 2:
        return (
          <SphereSelector
            spheres={spheres}
            selectedSpheres={selectedSpheres}
            onSphereToggle={handleSphereToggle}
            onSpheresChange={handleSpheresChange}
          />
        )

      case 3:
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-4"
          >
            <div className="text-center mb-6">
              <h3 className="text-lg font-semibold text-secondary-900 mb-2">
                Оцените текущее состояние
              </h3>
              <p className="text-sm text-secondary-600">
                Поставьте оценку от 1 до 10 для каждой выбранной сферы
              </p>
            </div>
            
            <div className="space-y-4">
              {spheres
                .filter(sphere => selectedSpheres.includes(sphere.id))
                .map((sphere, index) => (
                  <motion.div
                    key={sphere.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.3 }}
                    className="flex items-center space-x-4 p-4 bg-secondary-50 rounded-lg"
                  >
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center text-lg"
                      style={{ backgroundColor: `${sphere.color}20` }}
                    >
                      {sphere.icon}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-secondary-900">{sphere.name}</h4>
                      <div className="flex items-center space-x-3 mt-2">
                        <input
                          type="range"
                          min="1"
                          max="10"
                          value={sphere.score}
                          onChange={(e) => handleSpheresChange(
                            spheres.map(s => 
                              s.id === sphere.id 
                                ? { ...s, score: parseInt(e.target.value) }
                                : s
                            )
                          )}
                          className="flex-1 h-2 bg-secondary-200 rounded-lg appearance-none cursor-pointer"
                          style={{
                            background: `linear-gradient(to right, ${sphere.color} 0%, ${sphere.color} ${sphere.score * 10}%, #e5e7eb ${sphere.score * 10}%, #e5e7eb 100%)`
                          }}
                        />
                        <span className="text-sm font-medium text-secondary-900 min-w-[2rem]">
                          {sphere.score}/10
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))}
            </div>
          </motion.div>
        )

      case 4:
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <motion.div
              className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5, type: "spring" }}
            >
              <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </motion.div>
            <h3 className="text-xl font-semibold text-secondary-900 mb-2">
              Отлично! Настройка завершена
            </h3>
            <p className="text-secondary-600 mb-4">
              Ваш персональный трекер готов к использованию
            </p>
            <div className="text-sm text-secondary-500">
              Выбрано сфер: {selectedSpheres.length}
            </div>
          </motion.div>
        )

      default:
        return null
    }
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={currentStep}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        <OnboardingStep
          title={steps[currentStep - 1].title}
          description={steps[currentStep - 1].description}
          currentStep={currentStep}
          totalSteps={steps.length}
          onNext={handleNext}
          onPrevious={handlePrevious}
          canProceed={canProceed()}
          isLastStep={currentStep === steps.length}
        >
          {renderStepContent()}
        </OnboardingStep>
      </motion.div>
    </AnimatePresence>
  )
}
