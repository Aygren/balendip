'use client'

import React, { useState, useEffect } from 'react'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Modal from '@/components/ui/Modal'
import { LifeSphere } from '@/types'

interface EditSphereFormProps {
    isOpen: boolean
    onClose: () => void
    onSubmit: (sphereData: Partial<LifeSphere>) => void
    sphere: LifeSphere | null
}

const defaultColors = [
    '#10B981', '#3B82F6', '#F59E0B', '#8B5CF6', '#06B6D4',
    '#EC4899', '#F97316', '#84CC16', '#EF4444', '#6B7280'
]

const defaultIcons = ['🏥', '💼', '❤️', '💰', '📚', '🧘', '🏖️', '👥', '🎯', '🌟']

export default function EditSphereForm({
    isOpen,
    onClose,
    onSubmit,
    sphere,
}: EditSphereFormProps) {
    const [formData, setFormData] = useState({
        name: '',
        score: 5,
        color: '#10B981',
        icon: '🏥',
    })

    const [errors, setErrors] = useState<Record<string, string>>({})

    // Заполняем форму данными сферы при открытии
    useEffect(() => {
        if (sphere) {
            setFormData({
                name: sphere.name || '',
                score: sphere.score || 5,
                color: sphere.color || '#10B981',
                icon: sphere.icon || '🏥',
            })
        }
    }, [sphere])

    const validateForm = () => {
        const newErrors: Record<string, string> = {}

        if (!formData.name.trim()) {
            newErrors.name = 'Название сферы обязательно'
        }

        if (formData.score < 1 || formData.score > 10) {
            newErrors.score = 'Оценка должна быть от 1 до 10'
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()

        if (!validateForm()) return

        onSubmit({
            name: formData.name.trim(),
            score: formData.score,
            color: formData.color,
            icon: formData.icon,
        })

        onClose()
    }

    const handleEmojiSelect = (emoji: string) => {
        setFormData(prev => ({ ...prev, icon: emoji }))
    }

    if (!sphere) return null

    return (
        <Modal
            is_open={isOpen}
            on_close={onClose}
            title="Редактировать сферу жизни"
            size="md"
        >
            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Название сферы */}
                <Input
                    label="Название сферы"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Введите название сферы"
                    error={errors.name}
                    required
                />

                {/* Оценка */}
                <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                        Текущая оценка: {formData.score}/10
                    </label>
                    <input
                        type="range"
                        min="1"
                        max="10"
                        value={formData.score}
                        onChange={(e) => setFormData({ ...formData, score: parseInt(e.target.value) })}
                        className="w-full h-2 bg-secondary-200 rounded-lg appearance-none cursor-pointer"
                        style={{
                            background: `linear-gradient(to right, ${formData.color} 0%, ${formData.color} ${formData.score * 10}%, #e5e7eb ${formData.score * 10}%, #e5e7eb 100%)`
                        }}
                    />
                    {errors.score && (
                        <p className="text-sm text-error-600 mt-1">{errors.score}</p>
                    )}
                </div>

                {/* Цвет */}
                <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                        Цвет сферы
                    </label>
                    <div className="grid grid-cols-5 gap-2">
                        {defaultColors.map((color) => (
                            <button
                                key={color}
                                type="button"
                                onClick={() => setFormData({ ...formData, color })}
                                className={`w-10 h-10 rounded-full border-2 transition-all ${formData.color === color
                                        ? 'border-secondary-900 scale-110'
                                        : 'border-secondary-300 hover:border-secondary-500'
                                    }`}
                                style={{ backgroundColor: color }}
                            />
                        ))}
                    </div>
                </div>

                {/* Иконка */}
                <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                        Иконка сферы
                    </label>
                    <div className="grid grid-cols-5 gap-2 max-h-32 overflow-y-auto">
                        {defaultIcons.map((icon) => (
                            <button
                                key={icon}
                                type="button"
                                onClick={() => handleEmojiSelect(icon)}
                                className={`w-10 h-10 rounded-lg border-2 text-lg transition-all flex items-center justify-center ${formData.icon === icon
                                        ? 'border-primary-500 bg-primary-50'
                                        : 'border-secondary-200 hover:border-secondary-400'
                                    }`}
                            >
                                {icon}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Предварительный просмотр */}
                <div className="p-4 bg-secondary-50 rounded-lg">
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                        Предварительный просмотр
                    </label>
                    <div className="flex items-center gap-3">
                        <div
                            className="w-12 h-12 rounded-full flex items-center justify-center text-2xl"
                            style={{ backgroundColor: `${formData.color}20`, border: `2px solid ${formData.color}` }}
                        >
                            {formData.icon}
                        </div>
                        <div>
                            <h4 className="font-medium text-secondary-900">{formData.name || 'Название сферы'}</h4>
                            <p className="text-sm text-secondary-600">Оценка: {formData.score}/10</p>
                        </div>
                    </div>
                </div>

                {/* Кнопки */}
                <div className="flex gap-3 pt-4">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={onClose}
                        className="flex-1"
                    >
                        Отмена
                    </Button>
                    <Button
                        type="submit"
                        className="flex-1"
                    >
                        Сохранить изменения
                    </Button>
                </div>
            </form>
        </Modal>
    )
}
