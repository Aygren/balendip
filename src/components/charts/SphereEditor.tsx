'use client'

import React, { useState } from 'react'
import { LifeSphere } from '@/types'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Card from '@/components/ui/Card'
import Modal from '@/components/ui/Modal'
import { Edit, X, Plus } from 'lucide-react'

interface SphereEditorProps {
    spheres: LifeSphere[]
    onSpheresChange: (spheres: LifeSphere[]) => void
    className?: string
}

export default function SphereEditor({
    spheres,
    onSpheresChange,
    className = '',
}: SphereEditorProps) {
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [editingSphere, setEditingSphere] = useState<LifeSphere | null>(null)
    const [formData, setFormData] = useState({
        name: '',
        score: 5,
        color: '#10B981',
        icon: '🏥',
    })

    const colorOptions = [
        { name: 'Зеленый', value: '#10B981' },
        { name: 'Синий', value: '#3B82F6' },
        { name: 'Оранжевый', value: '#F59E0B' },
        { name: 'Фиолетовый', value: '#8B5CF6' },
        { name: 'Голубой', value: '#06B6D4' },
        { name: 'Розовый', value: '#EC4899' },
        { name: 'Красный', value: '#F97316' },
        { name: 'Лаймовый', value: '#84CC16' },
    ]

    const iconOptions = [
        '🏥', '💼', '❤️', '💰', '📚', '🧘', '🏖️', '👥',
        '🏃', '🎯', '🌟', '🎨', '🎵', '🌱', '⚡', '🎪'
    ]

    const handleEditSphere = (sphere: LifeSphere) => {
        setEditingSphere(sphere)
        setFormData({
            name: sphere.name,
            score: sphere.score,
            color: sphere.color,
            icon: sphere.icon,
        })
        setIsModalOpen(true)
    }

    const handleAddSphere = () => {
        setEditingSphere(null)
        setFormData({
            name: '',
            score: 5,
            color: '#10B981',
            icon: '🏥',
        })
        setIsModalOpen(true)
    }

    const handleSave = () => {
        if (!formData.name.trim()) return

        if (editingSphere) {
            // Редактирование существующей сферы
            const updatedSpheres = spheres.map(sphere =>
                sphere.id === editingSphere.id
                    ? { ...sphere, ...formData }
                    : sphere
            )
            onSpheresChange(updatedSpheres)
        } else {
            // Добавление новой сферы
            const newSphere: LifeSphere = {
                id: `sphere-${Date.now()}`,
                name: formData.name,
                score: formData.score,
                color: formData.color,
                icon: formData.icon,
                isDefault: false,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            }
            onSpheresChange([...spheres, newSphere])
        }

        setIsModalOpen(false)
    }

    const handleDeleteSphere = (sphereId: string) => {
        const updatedSpheres = spheres.filter(sphere => sphere.id !== sphereId)
        onSpheresChange(updatedSpheres)
    }

    const handleScoreChange = (sphereId: string, newScore: number) => {
        const updatedSpheres = spheres.map(sphere =>
            sphere.id === sphereId
                ? { ...sphere, score: newScore, updatedAt: new Date().toISOString() }
                : sphere
        )
        onSpheresChange(updatedSpheres)
    }

    return (
        <div className={className}>
            {/* Заголовок */}
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-secondary-900">
                    Сферы жизни
                </h3>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={handleAddSphere}
                    className="flex items-center gap-2"
                >
                    <Plus size={16} />
                    Добавить
                </Button>
            </div>

            {/* Список сфер */}
            <div className="space-y-3">
                {spheres.map((sphere) => (
                    <Card key={sphere.id} className="p-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div
                                    className="w-10 h-10 rounded-full flex items-center justify-center text-xl"
                                    style={{ backgroundColor: `${sphere.color}20` }}
                                >
                                    {sphere.icon}
                                </div>
                                <div>
                                    <h4 className="font-medium text-secondary-900">
                                        {sphere.name}
                                    </h4>
                                    <div className="flex items-center gap-2 mt-1">
                                        <input
                                            type="range"
                                            min="1"
                                            max="10"
                                            value={sphere.score}
                                            onChange={(e) => handleScoreChange(sphere.id, parseInt(e.target.value))}
                                            className="w-20 h-2 bg-secondary-200 rounded-lg appearance-none cursor-pointer"
                                            style={{
                                                background: `linear-gradient(to right, ${sphere.color} 0%, ${sphere.color} ${sphere.score * 10}%, #e2e8f0 ${sphere.score * 10}%, #e2e8f0 100%)`
                                            }}
                                        />
                                        <span className="text-sm font-medium text-secondary-700 min-w-[2rem]">
                                            {sphere.score}/10
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleEditSphere(sphere)}
                                    className="p-1"
                                >
                                    <Edit size={16} />
                                </Button>
                                {!sphere.isDefault && (
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => handleDeleteSphere(sphere.id)}
                                        className="p-1 text-error-600 hover:text-error-700"
                                    >
                                        <X size={16} />
                                    </Button>
                                )}
                            </div>
                        </div>
                    </Card>
                ))}
            </div>

            {/* Модальное окно редактирования */}
            <Modal
                is_open={isModalOpen}
                on_close={() => setIsModalOpen(false)}
                title={editingSphere ? 'Редактировать сферу' : 'Добавить сферу'}
                size="md"
            >
                <div className="space-y-4">
                    <Input
                        label="Название"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Введите название сферы"
                        required
                    />

                    <div>
                        <label className="block text-sm font-medium text-secondary-700 mb-2">
                            Оценка: {formData.score}/10
                        </label>
                        <input
                            type="range"
                            min="1"
                            max="10"
                            value={formData.score}
                            onChange={(e) => setFormData({ ...formData, score: parseInt(e.target.value) })}
                            className="w-full h-2 bg-secondary-200 rounded-lg appearance-none cursor-pointer"
                            style={{
                                background: `linear-gradient(to right, ${formData.color} 0%, ${formData.color} ${formData.score * 10}%, #e2e8f0 ${formData.score * 10}%, #e2e8f0 100%)`
                            }}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-secondary-700 mb-2">
                            Цвет
                        </label>
                        <div className="grid grid-cols-4 gap-2">
                            {colorOptions.map((color) => (
                                <button
                                    key={color.value}
                                    type="button"
                                    onClick={() => setFormData({ ...formData, color: color.value })}
                                    className={`w-8 h-8 rounded-full border-2 transition-all ${formData.color === color.value
                                        ? 'border-secondary-900 scale-110'
                                        : 'border-secondary-200 hover:border-secondary-400'
                                        }`}
                                    style={{ backgroundColor: color.value }}
                                    title={color.name}
                                />
                            ))}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-secondary-700 mb-2">
                            Иконка
                        </label>
                        <div className="grid grid-cols-8 gap-2">
                            {iconOptions.map((icon) => (
                                <button
                                    key={icon}
                                    type="button"
                                    onClick={() => setFormData({ ...formData, icon })}
                                    className={`w-8 h-8 rounded-lg border-2 text-lg transition-all ${formData.icon === icon
                                        ? 'border-primary-500 bg-primary-50'
                                        : 'border-secondary-200 hover:border-secondary-400'
                                        }`}
                                >
                                    {icon}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="flex gap-3 pt-4">
                        <Button
                            variant="outline"
                            onClick={() => setIsModalOpen(false)}
                            className="flex-1"
                        >
                            Отмена
                        </Button>
                        <Button
                            onClick={handleSave}
                            disabled={!formData.name.trim()}
                            className="flex-1"
                        >
                            {editingSphere ? 'Сохранить' : 'Добавить'}
                        </Button>
                    </div>
                </div>
            </Modal>
        </div>
    )
} 