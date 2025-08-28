'use client'

import React, { useState } from 'react'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Modal from '@/components/ui/Modal'
import { User } from 'lucide-react'

interface EditProfileFormProps {
    isOpen: boolean
    onClose: () => void
    onSubmit: (profileData: { name: string; email: string; avatar: string }) => void
    initialData: {
        name: string
        email: string
        avatar: string
    }
}

export default function EditProfileForm({
    isOpen,
    onClose,
    onSubmit,
    initialData,
}: EditProfileFormProps) {
    const [formData, setFormData] = useState(initialData)
    const [errors, setErrors] = useState<Record<string, string>>({})

    const validateForm = () => {
        const newErrors: Record<string, string> = {}

        if (!formData.name.trim()) {
            newErrors.name = 'Имя обязательно'
        }

        if (!formData.email.trim()) {
            newErrors.email = 'Email обязателен'
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Введите корректный email'
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()

        if (!validateForm()) return

        onSubmit({
            name: formData.name.trim(),
            email: formData.email.trim(),
            avatar: formData.avatar.trim(),
        })

        onClose()
    }

    return (
        <Modal
            is_open={isOpen}
            on_close={onClose}
            title="Редактировать профиль"
            size="md"
        >
            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Аватар */}
                <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                        Аватар
                    </label>
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-full bg-primary-100 flex items-center justify-center">
                            {formData.avatar ? (
                                <img
                                    src={formData.avatar}
                                    alt="Avatar preview"
                                    className="w-16 h-16 rounded-full object-cover"
                                    onError={(e) => {
                                        const target = e.target as HTMLImageElement
                                        target.style.display = 'none'
                                        target.nextElementSibling?.classList.remove('hidden')
                                    }}
                                />
                            ) : null}
                            <User size={24} className={`text-primary-600 ${formData.avatar ? 'hidden' : ''}`} />
                        </div>
                        <div className="flex-1">
                            <Input
                                label="URL аватара"
                                value={formData.avatar}
                                onChange={(e) => setFormData({ ...formData, avatar: e.target.value })}
                                placeholder="https://example.com/avatar.jpg"
                            />
                        </div>
                    </div>
                </div>

                {/* Имя */}
                <Input
                    label="Имя"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Введите ваше имя"
                    error={errors.name}
                    required
                />

                {/* Email */}
                <Input
                    label="Email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="Введите ваш email"
                    error={errors.email}
                    required
                />

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
                        Сохранить
                    </Button>
                </div>
            </form>
        </Modal>
    )
}
