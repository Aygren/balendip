'use client'

import React, { useState } from 'react'
import { Menu, Transition } from '@headlessui/react'
import { User, Bell, Settings, LogOut, User as UserIcon, ChevronDown } from 'lucide-react'
import Button from '@/components/ui/Button'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'

interface HeaderProps {
    title?: string
    user?: {
        name?: string
        avatar?: string
    }
    showNotifications?: boolean
    showSettings?: boolean
    onNotificationClick?: () => void
    onSettingsClick?: () => void
    className?: string
}

const Header: React.FC<HeaderProps> = ({
    title = 'Balendip',
    user,
    showNotifications = true,
    showSettings = true,
    onNotificationClick,
    onSettingsClick,
    className = '',
}) => {
    const { signOut } = useAuth()
    const router = useRouter()
    const [notificationCount, setNotificationCount] = useState(3) // Мок-данные для уведомлений

    const handleSignOut = async () => {
        try {
            await signOut()
            router.push('/auth/login')
        } catch (error) {
            console.error('Ошибка выхода:', error)
        }
    }

    const handleSettingsClick = () => {
        router.push('/settings')
        onSettingsClick?.()
    }

    const handleProfileClick = () => {
        router.push('/profile')
    }

    return (
        <header className={`flex items-center justify-between bg-white border-b border-secondary-200 px-4 py-3 ${className}`}>
            <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center">
                        <span className="text-white font-bold text-sm">B</span>
                    </div>
                    <h1 className="text-lg font-semibold text-secondary-900">{title}</h1>
                </div>
            </div>

            <div className="flex items-center gap-2">
                {/* Уведомления */}
                {showNotifications && (
                    <Menu as="div" className="relative">
                        <Menu.Button className="relative p-2 text-secondary-600 hover:text-secondary-900 hover:bg-secondary-100 rounded-lg transition-colors">
                            <Bell size={20} />
                            {notificationCount > 0 && (
                                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                                    {notificationCount > 9 ? '9+' : notificationCount}
                                </span>
                            )}
                        </Menu.Button>
                        <Transition
                            enter="transition ease-out duration-100"
                            enterFrom="transform opacity-0 scale-95"
                            enterTo="transform opacity-100 scale-100"
                            leave="transition ease-in duration-75"
                            leaveFrom="transform opacity-100 scale-100"
                            leaveTo="transform opacity-0 scale-95"
                        >
                            <Menu.Items className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-secondary-200 py-2 z-50">
                                <div className="px-4 py-2 border-b border-secondary-200">
                                    <h3 className="text-sm font-semibold text-secondary-900">Уведомления</h3>
                                </div>
                                <div className="max-h-64 overflow-y-auto">
                                    {/* Мок-уведомления */}
                                    <Menu.Item>
                                        {({ active }) => (
                                            <div className={`px-4 py-3 ${active ? 'bg-secondary-50' : ''}`}>
                                                <div className="flex items-start gap-3">
                                                    <div className="w-2 h-2 bg-primary-500 rounded-full mt-2"></div>
                                                    <div className="flex-1">
                                                        <p className="text-sm font-medium text-secondary-900">
                                                            Новое событие добавлено
                                                        </p>
                                                        <p className="text-xs text-secondary-600 mt-1">
                                                            Вы добавили событие "Утренняя пробежка"
                                                        </p>
                                                        <p className="text-xs text-secondary-500 mt-1">
                                                            2 минуты назад
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </Menu.Item>
                                    <Menu.Item>
                                        {({ active }) => (
                                            <div className={`px-4 py-3 ${active ? 'bg-secondary-50' : ''}`}>
                                                <div className="flex items-start gap-3">
                                                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                                                    <div className="flex-1">
                                                        <p className="text-sm font-medium text-secondary-900">
                                                            Обновлен баланс жизни
                                                        </p>
                                                        <p className="text-xs text-secondary-600 mt-1">
                                                            Ваш средний балл увеличился до 7/10
                                                        </p>
                                                        <p className="text-xs text-secondary-500 mt-1">
                                                            1 час назад
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </Menu.Item>
                                </div>
                                <div className="px-4 py-2 border-t border-secondary-200">
                                    <button
                                        onClick={() => setNotificationCount(0)}
                                        className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                                    >
                                        Отметить все как прочитанные
                                    </button>
                                </div>
                            </Menu.Items>
                        </Transition>
                    </Menu>
                )}

                {/* Настройки */}
                {showSettings && (
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleSettingsClick}
                        className="p-2"
                    >
                        <Settings size={20} />
                    </Button>
                )}

                {/* Аватар пользователя */}
                {user && (
                    <Menu as="div" className="relative">
                        <Menu.Button className="flex items-center gap-2 p-2 hover:bg-secondary-100 rounded-lg transition-colors">
                            {user.avatar ? (
                                <img
                                    src={user.avatar}
                                    alt={user.name || 'User'}
                                    className="w-8 h-8 rounded-full object-cover"
                                />
                            ) : (
                                <div className="w-8 h-8 bg-secondary-100 rounded-full flex items-center justify-center">
                                    <User size={16} className="text-secondary-600" />
                                </div>
                            )}
                            {user.name && (
                                <span className="text-sm font-medium text-secondary-700 hidden sm:block">
                                    {user.name}
                                </span>
                            )}
                            <ChevronDown size={16} className="text-secondary-600" />
                        </Menu.Button>
                        <Transition
                            enter="transition ease-out duration-100"
                            enterFrom="transform opacity-0 scale-95"
                            enterTo="transform opacity-100 scale-100"
                            leave="transition ease-in duration-75"
                            leaveFrom="transform opacity-100 scale-100"
                            leaveTo="transform opacity-0 scale-95"
                        >
                            <Menu.Items className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-secondary-200 py-2 z-50">
                                <div className="px-4 py-2 border-b border-secondary-200">
                                    <p className="text-sm font-medium text-secondary-900">{user.name}</p>
                                    <p className="text-xs text-secondary-600">Пользователь</p>
                                </div>
                                <Menu.Item>
                                    {({ active }) => (
                                        <button
                                            onClick={handleProfileClick}
                                            className={`${
                                                active ? 'bg-secondary-50' : ''
                                            } flex items-center gap-3 w-full px-4 py-2 text-sm text-secondary-700 hover:text-secondary-900`}
                                        >
                                            <UserIcon size={16} />
                                            Профиль
                                        </button>
                                    )}
                                </Menu.Item>
                                <Menu.Item>
                                    {({ active }) => (
                                        <button
                                            onClick={handleSettingsClick}
                                            className={`${
                                                active ? 'bg-secondary-50' : ''
                                            } flex items-center gap-3 w-full px-4 py-2 text-sm text-secondary-700 hover:text-secondary-900`}
                                        >
                                            <Settings size={16} />
                                            Настройки
                                        </button>
                                    )}
                                </Menu.Item>
                                <div className="border-t border-secondary-200 my-1"></div>
                                <Menu.Item>
                                    {({ active }) => (
                                        <button
                                            onClick={handleSignOut}
                                            className={`${
                                                active ? 'bg-secondary-50' : ''
                                            } flex items-center gap-3 w-full px-4 py-2 text-sm text-red-600 hover:text-red-700`}
                                        >
                                            <LogOut size={16} />
                                            Выйти
                                        </button>
                                    )}
                                </Menu.Item>
                            </Menu.Items>
                        </Transition>
                    </Menu>
                )}
            </div>
        </header>
    )
}

export default Header 