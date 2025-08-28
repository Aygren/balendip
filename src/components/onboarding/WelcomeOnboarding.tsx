'use client'

import React, { useState, useEffect } from 'react'
import { useOnboarding } from '@/hooks/useOnboarding'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import { User, Target, Heart, TrendingUp, ArrowRight } from 'lucide-react'

interface WelcomeOnboardingProps {
    onComplete: () => void
}

const WelcomeOnboarding: React.FC<WelcomeOnboardingProps> = ({ onComplete }) => {
    const { saveUserData, stepData } = useOnboarding()
    const [currentStep, setCurrentStep] = useState(0)
    const [userName, setUserName] = useState('')
    const [userGoal, setUserGoal] = useState('')

    // Загружаем сохраненные данные
    useEffect(() => {
        if (stepData.userName) {
            setUserName(stepData.userName)
        }
        if (stepData.userGoal) {
            setUserGoal(stepData.userGoal)
        }
    }, [stepData])

    const steps = [
        {
            title: 'Добро пожаловать в Balendip! 🎉',
            description: 'Давайте создадим ваш персональный профиль для отслеживания жизненных сфер',
            icon: <User className="w-16 h-16 text-primary-500" />,
            content: (
                <div className="space-y-4">
                    <Input
                        label="Как вас зовут?"
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                        placeholder="Введите ваше имя"
                        required
                    />
                </div>
            )
        },
        {
            title: 'Ваша цель 🎯',
            description: 'Расскажите, что вы хотите улучшить в своей жизни',
            icon: <Target className="w-16 h-16 text-primary-500" />,
            content: (
                <div className="space-y-4">
                    <Input
                        label="Ваша главная цель"
                        value={userGoal}
                        onChange={(e) => setUserGoal(e.target.value)}
                        placeholder="Например: улучшить баланс работы и отдыха"
                        required
                    />
                </div>
            )
        },
        {
            title: 'Готово! 🚀',
            description: 'Теперь давайте настроим ваши жизненные сферы и начнем отслеживать прогресс',
            icon: <TrendingUp className="w-16 h-16 text-primary-500" />,
            content: (
                <div className="space-y-4 text-center">
                    <p className="text-secondary-600">
                        Мы создадим для вас базовые сферы жизни, которые вы сможете настроить под себя
                    </p>
                </div>
            )
        }
    ]

    const handleNext = () => {
        if (currentStep < steps.length - 1) {
            setCurrentStep(currentStep + 1)
        } else {
            // Сохраняем данные пользователя и переходим к следующему шагу
            saveUserData(userName, userGoal)
            onComplete()
        }
    }

    const handleSkip = () => {
        onComplete()
    }

    const canProceed = () => {
        if (currentStep === 0) return userName.trim().length > 0
        if (currentStep === 1) return userGoal.trim().length > 0
        return true
    }

    const buttonStyle: React.CSSProperties = {
        fontSize: '20px', // Такой же размер, как у описания (text-xl)
        fontWeight: 'bold',
        padding: '16px 22px', // Уменьшено на 30% с 24px 32px
        minHeight: '56px', // Уменьшено на 30% с 80px
        borderRadius: '12px', // Уменьшено на 30% с 16px
        border: '2px solid', // Уменьшено на 30% с 3px
        cursor: 'pointer',
        transition: 'all 0.2s ease',
    }

    const primaryButtonStyle: React.CSSProperties = {
        ...buttonStyle,
        backgroundColor: '#0ea5e9',
        color: 'white',
        borderColor: '#0ea5e9',
    }

    const secondaryButtonStyle: React.CSSProperties = {
        ...buttonStyle,
        backgroundColor: '#f1f5f9',
        color: '#0f172a',
        borderColor: '#cbd5e1',
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 flex items-center justify-center p-4">
            <Card className="w-full max-w-2xl">
                <div className="text-center space-y-8">
                    {/* Иконка и заголовок */}
                    <div className="flex justify-center">
                        {steps[currentStep].icon}
                    </div>

                    <div className="space-y-4">
                        <h1 className="text-4xl font-bold text-secondary-900">
                            {steps[currentStep].title}
                        </h1>
                        <p className="text-xl text-secondary-600">
                            {steps[currentStep].description}
                        </p>
                    </div>

                    {/* Контент шага */}
                    <div className="min-h-[160px] flex items-center">
                        {steps[currentStep].content}
                    </div>

                    {/* Прогресс */}
                    <div className="flex justify-center space-x-3">
                        {steps.map((_, index) => (
                            <div
                                key={index}
                                className={`w-3 h-3 rounded-full ${index <= currentStep ? 'bg-primary-500' : 'bg-secondary-200'
                                    }`}
                            />
                        ))}
                    </div>

                    {/* Кнопки */}
                    <div className="flex space-x-4">
                        {currentStep < steps.length - 1 && (
                            <button
                                style={secondaryButtonStyle}
                                onClick={handleSkip}
                                className="flex-1 hover:bg-secondary-200 active:scale-95"
                            >
                                Пропустить
                            </button>
                        )}
                        <button
                            style={primaryButtonStyle}
                            onClick={handleNext}
                            disabled={!canProceed()}
                            className={`flex-1 hover:bg-primary-700 active:scale-95 ${!canProceed() ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            {currentStep === steps.length - 1 ? 'Начать' : 'Далее'}
                            <ArrowRight className="w-6 h-6 ml-2 inline" />
                        </button>
                    </div>
                </div>
            </Card>
        </div>
    )
}

export default WelcomeOnboarding
