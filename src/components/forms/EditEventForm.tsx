'use client'

import React, { useState, useEffect } from 'react'
import { Event, LifeSphere } from '@/types'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Modal from '@/components/ui/Modal'
import { Calendar, Clock, Tag, X } from 'lucide-react'

interface EditEventFormProps {
    isOpen: boolean
    onClose: () => void
    onSubmit: (eventId: string, event: Partial<Event>) => void
    event: Event | null
    spheres: LifeSphere[]
    loading?: boolean
}

export default function EditEventForm({
    isOpen,
    onClose,
    onSubmit,
    event,
    spheres,
    loading = false,
}: EditEventFormProps) {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        date: '',
        time: '',
        emotion: 'positive',
        emoji: '😊',
        sphereIds: [] as string[],
    })

    const [errors, setErrors] = useState<Record<string, string>>({})

    const emotionOptions = [
        { value: 'positive', label: 'Позитивное', emoji: '😊', color: '#10B981' },
        { value: 'neutral', label: 'Нейтральное', emoji: '😐', color: '#6B7280' },
        { value: 'negative', label: 'Негативное', emoji: '😔', color: '#EF4444' },
    ]

    const emojiOptions = [
        '😊', '😄', '😃', '😁', '😆', '😅', '😂', '🤣',
        '😐', '😑', '😶', '😏', '😒', '🙄', '😬', '🤔',
        '😔', '😞', '😟', '😕', '🙁', '☹️', '😣', '😖',
        '😫', '😩', '😢', '😭', '😤', '😠', '😡', '🤬',
        '🤯', '😳', '😱', '😨', '😰', '😥', '😓', '🤗',
        '🤭', '🤫', '🤥', '😶', '😐', '😑', '😯', '😦',
        '😧', '😮', '😲', '😴', '🤤', '😪', '😵', '🤐',
        '🥴', '🤢', '🤮', '🤧', '😷', '🤒', '🤕', '🤑',
    ]

    // Заполняем форму данными события при открытии
    useEffect(() => {
        if (event) {
            setFormData({
                title: event.title || '',
                description: event.description || '',
                date: event.date || '',
                time: event.time || '',
                emotion: event.emotion || 'positive',
                emoji: event.emoji || '😊',
                sphereIds: event.spheres || [],
            })
        }
    }, [event])

    const validateForm = () => {
        const newErrors: Record<string, string> = {}

        if (!formData.title.trim()) {
            newErrors.title = 'Название события обязательно'
        }

        if (!formData.date) {
            newErrors.date = 'Дата обязательна'
        }

        if (formData.sphereIds.length === 0) {
            newErrors.spheres = 'Выберите хотя бы одну сферу жизни'
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()

        if (!validateForm() || !event) return

        const eventData = {
            title: formData.title.trim(),
            description: formData.description.trim(),
            date: formData.date,
            time: formData.time,
            emotion: formData.emotion,
            emoji: formData.emoji,
            spheres: formData.sphereIds,
        }

        onSubmit(event.id, {
            ...eventData,
            emotion: eventData.emotion as 'positive' | 'neutral' | 'negative',
            updated_at: new Date().toISOString(),
        })

        onClose()
    }

    const handleSphereToggle = (sphereId: string) => {
        setFormData(prev => ({
            ...prev,
            sphereIds: prev.sphereIds.includes(sphereId)
                ? prev.sphereIds.filter(id => id !== sphereId)
                : [...prev.sphereIds, sphereId]
        }))
    }

    const handleEmojiSelect = (emoji: string) => {
        setFormData(prev => ({ ...prev, emoji }))
    }

    if (!event) return null

    return (
        <Modal
            is_open={isOpen}
            on_close={onClose}
            title="Редактировать событие"
            size="lg"
        >
            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Название события */}
                <Input
                    label="Название события"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Что произошло?"
                    error={errors.title}
                    required
                />

                {/* Описание */}
                <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                        Описание
                    </label>
                    <textarea
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        placeholder="Подробности события..."
                        className="w-full rounded-lg border border-secondary-300 bg-white px-3 py-2 text-secondary-900 placeholder-secondary-500 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 transition-all duration-200"
                        rows={3}
                    />
                </div>

                {/* Дата и время */}
                <div className="grid grid-cols-2 gap-4">
                    <Input
                        label="Дата"
                        type="date"
                        value={formData.date}
                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                        error={errors.date}
                        leftIcon={Calendar}
                        required
                    />
                    <Input
                        label="Время"
                        type="time"
                        value={formData.time}
                        onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                        leftIcon={Clock}
                    />
                </div>

                {/* Эмоция */}
                <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                        Эмоция
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                        {emotionOptions.map((emotion) => (
                            <button
                                key={emotion.value}
                                type="button"
                                onClick={() => setFormData({ ...formData, emotion: emotion.value })}
                                className={`flex items-center gap-2 p-3 rounded-lg border-2 transition-all ${formData.emotion === emotion.value
                                    ? 'border-primary-500 bg-primary-50'
                                    : 'border-secondary-200 hover:border-secondary-400'
                                    }`}
                            >
                                <span className="text-lg">{emotion.emoji}</span>
                                <span className="text-sm font-medium">{emotion.label}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Эмодзи */}
                <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                        Эмодзи
                    </label>
                    <div className="grid grid-cols-8 gap-2 max-h-32 overflow-y-auto">
                        {emojiOptions.map((emoji) => (
                            <button
                                key={emoji}
                                type="button"
                                onClick={() => handleEmojiSelect(emoji)}
                                className={`w-8 h-8 rounded-lg border-2 text-lg transition-all ${formData.emoji === emoji
                                    ? 'border-primary-500 bg-primary-50'
                                    : 'border-secondary-200 hover:border-secondary-400'
                                    }`}
                            >
                                {emoji}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Сферы жизни */}
                <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                        Сферы жизни
                    </label>
                    {errors.spheres && (
                        <p className="text-sm text-error-600 mb-2">{errors.spheres}</p>
                    )}
                    <div className="grid grid-cols-2 gap-3">
                        {spheres.map((sphere) => (
                            <button
                                key={sphere.id}
                                type="button"
                                onClick={() => handleSphereToggle(sphere.id)}
                                className={`flex items-center gap-3 p-3 rounded-lg border-2 transition-all ${formData.sphereIds.includes(sphere.id)
                                    ? 'border-primary-500 bg-primary-50'
                                    : 'border-secondary-200 hover:border-secondary-400'
                                    }`}
                            >
                                <div
                                    className="w-8 h-8 rounded-full flex items-center justify-center text-lg"
                                    style={{ backgroundColor: `${sphere.color}20` }}
                                >
                                    {sphere.icon}
                                </div>
                                <span className="text-sm font-medium text-secondary-900">
                                    {sphere.name}
                                </span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Выбранные сферы */}
                {formData.sphereIds.length > 0 && (
                    <div>
                        <label className="block text-sm font-medium text-secondary-700 mb-2">
                            Выбрано: {formData.sphereIds.length}
                        </label>
                        <div className="flex flex-wrap gap-2">
                            {formData.sphereIds.map((sphereId) => {
                                const sphere = spheres.find(s => s.id === sphereId)
                                if (!sphere) return null

                                return (
                                    <div
                                        key={sphereId}
                                        className="flex items-center gap-2 px-3 py-1 rounded-full text-sm"
                                        style={{ backgroundColor: `${sphere.color}20`, color: sphere.color }}
                                    >
                                        <span>{sphere.icon}</span>
                                        <span>{sphere.name}</span>
                                        <button
                                            type="button"
                                            onClick={() => handleSphereToggle(sphereId)}
                                            className="ml-1 hover:opacity-70"
                                        >
                                            <X size={14} />
                                        </button>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                )}

                {/* Кнопки */}
                <div className="flex gap-3 pt-4">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={onClose}
                        className="flex-1"
                        disabled={loading}
                    >
                        Отмена
                    </Button>
                    <Button
                        type="submit"
                        className="flex-1"
                        loading={loading}
                    >
                        Сохранить изменения
                    </Button>
                </div>
            </form>
        </Modal>
    )
}
