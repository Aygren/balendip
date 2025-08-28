'use client'

import React, { useState } from 'react'
import Layout from '@/components/layout/Layout'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import { User, Edit, Calendar, TrendingUp, Target } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import EditProfileForm from '@/components/forms/EditProfileForm'

export default function ProfilePage() {
    const { user } = useAuth()
    const [showEditProfile, setShowEditProfile] = useState(false)

    const mockUser = {
        name: user?.name || 'Пользователь',
        email: user?.email || 'user@example.com',
        avatar: user?.avatar_url,
        joinDate: '15 января 2024',
        totalEvents: 23,
        averageScore: 7.2,
        goalsCompleted: 8,
        totalGoals: 12,
    }

    const handleEditProfile = () => {
        setShowEditProfile(true)
    }

    const handleSaveProfile = (profileData: { name: string; email: string; avatar: string }) => {
        // TODO: Добавить вызов API для обновления профиля
        console.log('Saving profile:', profileData)
        // Обновляем локальное состояние
        mockUser.name = profileData.name
        mockUser.avatar = profileData.avatar
        setShowEditProfile(false)
    }

    return (
        <Layout title="Профиль" showNavigation={true}>
            <div className="p-4 space-y-6">
                {/* Основная информация */}
                <Card>
                    <div className="flex items-center gap-4">
                        <div className="w-20 h-20 rounded-full bg-primary-100 flex items-center justify-center">
                            {mockUser.avatar ? (
                                <img
                                    src={mockUser.avatar}
                                    alt={mockUser.name}
                                    className="w-20 h-20 rounded-full object-cover"
                                />
                            ) : (
                                <User size={32} className="text-primary-600" />
                            )}
                        </div>
                        <div className="flex-1">
                            <h2 className="text-xl font-semibold text-secondary-900">
                                {mockUser.name}
                            </h2>
                            <p className="text-secondary-600">{mockUser.email}</p>
                            <p className="text-sm text-secondary-500">
                                Участник с {mockUser.joinDate}
                            </p>
                        </div>
                        <Button variant="outline" size="sm" onClick={handleEditProfile}>
                            <Edit size={16} />
                            Редактировать
                        </Button>
                    </div>
                </Card>

                {/* Статистика */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card>
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                                <Calendar size={24} className="text-blue-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-secondary-900">
                                    {mockUser.totalEvents}
                                </p>
                                <p className="text-sm text-secondary-600">Событий</p>
                            </div>
                        </div>
                    </Card>

                    <Card>
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                                <TrendingUp size={24} className="text-green-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-secondary-900">
                                    {mockUser.averageScore}
                                </p>
                                <p className="text-sm text-secondary-600">Средний балл</p>
                            </div>
                        </div>
                    </Card>

                    <Card>
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                                <Target size={24} className="text-purple-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-secondary-900">
                                    {mockUser.goalsCompleted}/{mockUser.totalGoals}
                                </p>
                                <p className="text-sm text-secondary-600">Целей выполнено</p>
                            </div>
                        </div>
                    </Card>
                </div>

                {/* Достижения */}
                <Card>
                    <h3 className="font-semibold text-secondary-900 mb-4">
                        Достижения
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="flex items-center gap-3 p-3 bg-yellow-50 rounded-lg">
                            <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                                🏆
                            </div>
                            <div>
                                <p className="font-medium text-secondary-900">Первая неделя</p>
                                <p className="text-sm text-secondary-600">7 дней подряд</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                                📈
                            </div>
                            <div>
                                <p className="font-medium text-secondary-900">Прогресс</p>
                                <p className="text-sm text-secondary-600">Улучшение на 2 балла</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                🎯
                            </div>
                            <div>
                                <p className="font-medium text-secondary-900">Целеустремленность</p>
                                <p className="text-sm text-secondary-600">10 целей подряд</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
                            <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                                ⭐
                            </div>
                            <div>
                                <p className="font-medium text-secondary-900">Баланс</p>
                                <p className="text-sm text-secondary-600">Все сферы &gt; 6 баллов</p>
                            </div>
                        </div>
                    </div>
                </Card>

                {/* Последние активности */}
                <Card>
                    <h3 className="font-semibold text-secondary-900 mb-4">
                        Последние активности
                    </h3>
                    <div className="space-y-3">
                        <div className="flex items-center gap-3 p-3 hover:bg-secondary-50 rounded-lg">
                            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                                <Calendar size={16} className="text-green-600" />
                            </div>
                            <div className="flex-1">
                                <p className="text-sm font-medium text-secondary-900">
                                    Добавлено событие "Утренняя пробежка"
                                </p>
                                <p className="text-xs text-secondary-600">2 минуты назад</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 p-3 hover:bg-secondary-50 rounded-lg">
                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                <TrendingUp size={16} className="text-blue-600" />
                            </div>
                            <div className="flex-1">
                                <p className="text-sm font-medium text-secondary-900">
                                    Обновлен баланс жизни
                                </p>
                                <p className="text-xs text-secondary-600">1 час назад</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 p-3 hover:bg-secondary-50 rounded-lg">
                            <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                                <Target size={16} className="text-purple-600" />
                            </div>
                            <div className="flex-1">
                                <p className="text-sm font-medium text-secondary-900">
                                    Достигнута цель "Читать 30 минут в день"
                                </p>
                                <p className="text-xs text-secondary-600">3 часа назад</p>
                            </div>
                        </div>
                    </div>
                </Card>
            </div>

            {/* Форма редактирования профиля */}
            {showEditProfile && (
                <EditProfileForm
                    isOpen={showEditProfile}
                    onClose={() => setShowEditProfile(false)}
                    onSubmit={handleSaveProfile}
                    initialData={{
                        name: mockUser.name,
                        email: mockUser.email,
                        avatar: mockUser.avatar || '',
                    }}
                />
            )}
        </Layout>
    )
}
