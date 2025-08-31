'use client'

import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface OnboardingStepProps {
  children: React.ReactNode
  title: string
  description: string
  currentStep: number
  totalSteps: number
  onNext: () => void
  onPrevious: () => void
  canProceed?: boolean
  isLastStep?: boolean
}

const stepVariants = {
  initial: {
    opacity: 0,
    x: 100,
    scale: 0.95
  },
  animate: {
    opacity: 1,
    x: 0,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: "easeOut" as const
    }
  },
  exit: {
    opacity: 0,
    x: -100,
    scale: 0.95,
    transition: {
      duration: 0.3,
      ease: "easeIn" as const
    }
  }
}

const progressVariants = {
  initial: { width: 0 },
  animate: (progress: number) => ({
    width: `${progress}%`,
    transition: {
      duration: 0.5,
      ease: "easeOut" as const
    }
  })
}

export const OnboardingStep: React.FC<OnboardingStepProps> = ({
  children,
  title,
  description,
  currentStep,
  totalSteps,
  onNext,
  onPrevious,
  canProceed = true,
  isLastStep = false
}) => {
  const progress = ((currentStep - 1) / (totalSteps - 1)) * 100

  return (
    <div className="onboarding-step-container bg-gradient-to-br from-primary-50 to-secondary-50 p-4">
      <div className="onboarding-step-content">
        <motion.div
          className="w-full"
          variants={stepVariants}
          initial="initial"
          animate="animate"
          exit="exit"
        >
          <Card className="onboarding-step-card p-6 md:p-8">
            {/* Прогресс бар */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-3">
                <span className="text-sm font-medium text-secondary-600">
                  Шаг {currentStep} из {totalSteps}
                </span>
                <span className="text-sm text-secondary-500">
                  {Math.round(progress)}%
                </span>
              </div>
              <div className="w-full bg-secondary-200 rounded-full h-3 overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-primary-500 to-primary-600 rounded-full"
                  variants={progressVariants}
                  initial="initial"
                  animate="animate"
                  custom={progress}
                />
              </div>
            </div>

            {/* Заголовок */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="onboarding-step-title mb-8"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-secondary-900 mb-3">
                {title}
              </h2>
              <p className="onboarding-step-description text-base md:text-lg text-secondary-600">
                {description}
              </p>
            </motion.div>

            {/* Контент */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="mb-8"
            >
              {children}
            </motion.div>

            {/* Навигация */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              className="onboarding-step-buttons flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
              <Button
                variant="secondary"
                size="lg"
                onClick={onPrevious}
                disabled={currentStep === 1}
                icon={<ChevronLeft className="w-5 h-5" />}
                className="w-full sm:w-auto"
              >
                Назад
              </Button>

              <Button
                variant="modern"
                size="lg"
                onClick={onNext}
                disabled={!canProceed}
                icon={<ChevronRight className="w-5 h-5" />}
                iconPosition="right"
                className="w-full sm:w-auto"
              >
                {isLastStep ? 'Завершить' : 'Далее'}
              </Button>
            </motion.div>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
