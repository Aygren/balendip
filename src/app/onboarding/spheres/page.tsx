'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import { LifeSphere } from '@/types'
import { useOnboarding } from '@/hooks/useOnboarding'

// Дефолтные сферы жизни
const defaultSpheres: LifeSphere[] = [
    { id: '1', user_id: '', name: 'Здоровье', score: 5, color: '#10B981', icon: '🏥', is_default: true, created_at: '', updated_at: '' },
    { id: '2', user_id: '', name: 'Карьера', score: 5, color: '#3B82F6', icon: '💼', is_default: true, created_at: '', updated_at: '' },
    { id: '3', user_id: '', name: 'Отношения', score: 5, color: '#F59E0B', icon: '❤️', is_default: true, created_at: '', updated_at: '' },
    { id: '4', user_id: '', name: 'Финансы', score: 5, color: '#8B5CF6', icon: '💰', is_default: true, created_at: '', updated_at: '' },
    { id: '5', user_id: '', name: 'Саморазвитие', score: 5, color: '#06B6D4', icon: '📚', is_default: true, created_at: '', updated_at: '' },
    { id: '6', user_id: '', name: 'Духовность', score: 5, color: '#EC4899', icon: '🧘', is_default: true, created_at: '', updated_at: '' },
    { id: '7', user_id: '', name: 'Отдых', score: 5, color: '#F97316', icon: '🏖️', is_default: true, created_at: '', updated_at: '' },
    { id: '8', user_id: '', name: 'Окружение', score: 5, color: '#84CC16', icon: '👥', is_default: true, created_at: '', updated_at: '' },
]

export default function SphereSelectorPage() {
    const { saveSelectedSpheres, spheres, stepData, saveProgress } = useOnboarding()
    const [selectedSpheres, setSelectedSpheres] = useState<string[]>([])
    const [localSpheres, setLocalSpheres] = useState<LifeSphere[]>(spheres)

    // Загружаем сохраненные данные
    useEffect(() => {
        if (stepData.selectedSpheres) {
            setSelectedSpheres(stepData.selectedSpheres)
        }
        if (stepData.spheres) {
            setLocalSpheres(stepData.spheres)
        }
    }, [stepData])

    const handleSphereToggle = (sphereId: string) => {
        setSelectedSpheres(prev =>
            prev.includes(sphereId)
                ? prev.filter(id => id !== sphereId)
                : [...prev, sphereId]
        )
    }

    const handleScoreChange = (sphereId: string, newScore: number) => {
        setLocalSpheres(prev => prev.map(sphere =>
            sphere.id === sphereId
                ? { ...sphere, score: newScore }
                : sphere
        ))
    }

    const handleContinue = () => {
        if (selectedSpheres.length === 0) {
            alert('Пожалуйста, выберите хотя бы одну сферу жизни')
            return
        }

        // Сохраняем выбранные сферы и переходим к следующему шагу
        const selectedSpheresData = localSpheres.filter(sphere => selectedSpheres.includes(sphere.id))
        saveProgress({ selectedSpheres, spheres: selectedSpheresData })
        saveSelectedSpheres(selectedSpheres)
    }

    const handleBack = () => {
        // Возвращаемся к предыдущему шагу
        window.history.back()
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
                            Выберите сферы жизни 🎯
                        </h1>
                        <p className="text-xl text-secondary-600">
                            Отметьте сферы, которые наиболее важны для вас
                        </p>
                    </motion.div>

                    {/* Выбор сфер */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="grid grid-cols-2 md:grid-cols-4 gap-4"
                    >
                        {localSpheres.map((sphere, index) => {
                            const isSelected = selectedSpheres.includes(sphere.id)

                            return (
                                <motion.div
                                    key={sphere.id}
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.3, delay: index * 0.1 }}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <Card
                                        className={`p-4 cursor-pointer transition-all duration-200 ${isSelected
                                                ? 'ring-2 ring-primary-500 bg-primary-50'
                                                : 'hover:bg-secondary-50'
                                            }`}
                                        onClick={() => handleSphereToggle(sphere.id)}
                                    >
                                        {/* Чекмарк */}
                                        {isSelected && (
                                            <div className="absolute top-2 right-2 w-5 h-5 bg-primary-500 rounded-full flex items-center justify-center">
                                                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                </svg>
                                            </div>
                                        )}

                                        {/* Иконка сферы */}
                                        <div className="text-center mb-3">
                                            <div
                                                className="w-12 h-12 rounded-full flex items-center justify-center text-2xl mx-auto"
                                                style={{
                                                    backgroundColor: `${sphere.color}20`,
                                                    border: `2px solid ${sphere.color}`
                                                }}
                                            >
                                                {sphere.icon}
                                            </div>
                                        </div>

                                        {/* Название сферы */}
                                        <h4 className="text-sm font-medium text-secondary-900 text-center mb-2">
                                            {sphere.name}
                                        </h4>

                                        {/* Слайдер для оценки */}
                                        {isSelected && (
                                            <motion.div
                                                initial={{ opacity: 0, height: 0 }}
                                                animate={{ opacity: 1, height: "auto" }}
                                                className="mt-3"
                                            >
                                                <div className="flex items-center justify-between mb-1">
                                                    <span className="text-xs text-secondary-600">Оценка</span>
                                                    <span className="text-xs font-medium text-secondary-900">
                                                        {sphere.score}/10
                                                    </span>
                                                </div>
                                                <input
                                                    type="range"
                                                    min="1"
                                                    max="10"
                                                    value={sphere.score}
                                                    onChange={(e) => handleScoreChange(sphere.id, parseInt(e.target.value))}
                                                    className="w-full h-2 bg-secondary-200 rounded-lg appearance-none cursor-pointer slider"
                                                    style={{
                                                        background: `linear-gradient(to right, ${sphere.color} 0%, ${sphere.color} ${sphere.score * 10}%, #e5e7eb ${sphere.score * 10}%, #e5e7eb 100%)`
                                                    }}
                                                />
                                            </motion.div>
                                        )}
                                    </Card>
                                </motion.div>
                            )
                        })}
                    </motion.div>

                    {/* Статистика */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.5 }}
                        className="text-center"
                    >
                        <p className="text-lg text-secondary-600">
                            Выбрано: <span className="font-semibold text-primary-600">{selectedSpheres.length}</span> из {localSpheres.length} сфер
                        </p>
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
                            onClick={handleContinue}
                            disabled={selectedSpheres.length === 0}
                            className="px-8 py-3"
                        >
                            Продолжить
                        </Button>
                    </motion.div>
                </div>
            </Card>
        </div>
    )
}
