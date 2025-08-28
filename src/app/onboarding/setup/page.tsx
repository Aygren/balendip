'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import { LifeSphere } from '@/types'
import { useOnboarding } from '@/hooks/useOnboarding'

export default function SphereSetupPage() {
    const { saveConfiguredSpheres, stepData } = useOnboarding()
    const [spheres, setSpheres] = useState<LifeSphere[]>([])
    const [isLoading, setIsLoading] = useState(true)

    // Загружаем сохраненные данные
    useEffect(() => {
        if (stepData.spheres) {
            setSpheres(stepData.spheres)
        }
        setIsLoading(false)
    }, [stepData])

    const handleScoreChange = (sphereId: string, newScore: number) => {
        setSpheres(prev => prev.map(sphere =>
            sphere.id === sphereId
                ? { ...sphere, score: newScore }
                : sphere
        ))
    }

    const handleColorChange = (sphereId: string, newColor: string) => {
        setSpheres(prev => prev.map(sphere =>
            sphere.id === sphereId
                ? { ...sphere, color: newColor }
                : sphere
        ))
    }

    const handleIconChange = (sphereId: string, newIcon: string) => {
        setSpheres(prev => prev.map(sphere =>
            sphere.id === sphereId
                ? { ...sphere, icon: newIcon }
                : sphere
        ))
    }

    const handleComplete = () => {
        // Сохраняем настроенные сферы и переходим к следующему шагу
        saveConfiguredSpheres(spheres)
    }

    const handleBack = () => {
        // Возвращаемся к предыдущему шагу
        window.history.back()
    }

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500 mx-auto mb-4"></div>
                    <p className="text-secondary-600">Загрузка...</p>
                </div>
            </div>
        )
    }

    if (spheres.length === 0) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 flex items-center justify-center p-4">
                <Card className="w-full max-w-2xl text-center">
                    <h1 className="text-2xl font-bold text-secondary-900 mb-4">
                        Ошибка загрузки данных
                    </h1>
                    <p className="text-secondary-600 mb-6">
                        Не удалось загрузить выбранные сферы жизни. Пожалуйста, вернитесь к выбору сфер.
                    </p>
                    <Button onClick={handleBack} variant="primary">
                        Вернуться к выбору сфер
                    </Button>
                </Card>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 flex items-center justify-center p-4">
            <Card className="w-full max-w-4xl">
                <div className="text-center space-y-8">
                    {/* Заголовок */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <h1 className="text-4xl font-bold text-secondary-900 mb-4">
                            Настройка сфер жизни ⚙️
                        </h1>
                        <p className="text-xl text-secondary-600">
                            Оцените каждую выбранную сферу и настройте её под себя
                        </p>
                    </motion.div>

                    {/* Настройка сфер */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="space-y-6"
                    >
                        {spheres.map((sphere, index) => (
                            <motion.div
                                key={sphere.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.3, delay: index * 0.1 }}
                                className="bg-white rounded-lg p-6 shadow-sm border border-secondary-200"
                            >
                                <div className="flex items-center space-x-4">
                                    {/* Иконка и цвет */}
                                    <div className="flex flex-col items-center space-y-2">
                                        <div
                                            className="w-16 h-16 rounded-full flex items-center justify-center text-2xl cursor-pointer hover:scale-110 transition-transform"
                                            style={{ backgroundColor: `${sphere.color}20`, border: `3px solid ${sphere.color}` }}
                                            onClick={() => {
                                                const newIcon = prompt('Введите новую иконку (эмодзи):', sphere.icon)
                                                if (newIcon) {
                                                    handleIconChange(sphere.id, newIcon)
                                                }
                                            }}
                                        >
                                            {sphere.icon}
                                        </div>
                                        <input
                                            type="color"
                                            value={sphere.color}
                                            onChange={(e) => handleColorChange(sphere.id, e.target.value)}
                                            className="w-8 h-8 rounded border-2 border-secondary-300 cursor-pointer"
                                            title="Изменить цвет"
                                        />
                                    </div>

                                    {/* Название и настройки */}
                                    <div className="flex-1">
                                        <h3 className="text-lg font-semibold text-secondary-900 mb-4">
                                            {sphere.name}
                                        </h3>

                                        {/* Оценка */}
                                        <div className="space-y-3">
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm font-medium text-secondary-700">
                                                    Текущая оценка: {sphere.score}/10
                                                </span>
                                                <span className="text-sm text-secondary-500">
                                                    {sphere.score < 4 ? 'Требует внимания' :
                                                        sphere.score < 7 ? 'Хорошо' : 'Отлично!'}
                                                </span>
                                            </div>

                                            <input
                                                type="range"
                                                min="1"
                                                max="10"
                                                value={sphere.score}
                                                onChange={(e) => handleScoreChange(sphere.id, parseInt(e.target.value))}
                                                className="w-full h-3 bg-secondary-200 rounded-lg appearance-none cursor-pointer slider"
                                                style={{
                                                    background: `linear-gradient(to right, ${sphere.color} 0%, ${sphere.color} ${sphere.score * 10}%, #e5e7eb ${sphere.score * 10}%, #e5e7eb 100%)`
                                                }}
                                            />

                                            <div className="flex justify-between text-xs text-secondary-500">
                                                <span>1 - Плохо</span>
                                                <span>5 - Нормально</span>
                                                <span>10 - Отлично</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>

                    {/* Кнопки навигации */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.6 }}
                        className="flex space-x-4 justify-center"
                    >
                        <Button
                            variant="secondary"
                            onClick={handleBack}
                            className="px-8 py-3"
                        >
                            Назад
                        </Button>
                        <Button
                            variant="primary"
                            onClick={handleComplete}
                            className="px-8 py-3"
                        >
                            Завершить настройку
                        </Button>
                    </motion.div>
                </div>
            </Card>
        </div>
    )
}
