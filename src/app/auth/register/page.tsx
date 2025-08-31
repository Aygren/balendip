'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { User, Mail, Lock, Eye, EyeOff, ArrowLeft } from 'lucide-react'
import Card from '@/components/ui/Card'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import { useAuth } from '@/contexts/AuthContext'
import { useOnboarding } from '@/contexts/OnboardingContext'

export default function RegisterPage() {
    const router = useRouter()
    const { register, isAuthenticated, user } = useAuth()
    const { data: onboardingData, completeOnboarding } = useOnboarding()
    const [name, setName] = useState(onboardingData.userName)
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')

    // Обновляем имя при изменении данных онбординга
    React.useEffect(() => {
        if (onboardingData.userName) {
            setName(onboardingData.userName)
        }
    }, [onboardingData.userName])

    // Проверяем состояние аутентификации
    React.useEffect(() => {
        if (isAuthenticated && user) {
            // Если пользователь уже авторизован, перенаправляем на главную
            router.push('/')
        }
    }, [isAuthenticated, user, router])

    // Если пользователь уже авторизован, показываем загрузку
    if (isAuthenticated && user) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-20 h-20 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                        <span className="text-white font-bold text-3xl">B</span>
                    </div>
                    <h2 className="text-2xl font-bold text-secondary-900 mb-4">Перенаправление...</h2>
                    <p className="text-secondary-600">Вы уже авторизованы</p>
                </div>
            </div>
        )
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (password !== confirmPassword) {
            setError('Пароли не совпадают')
            return
        }

        setLoading(true)
        setError('')

        try {
            await register({ name, email, password })
            setSuccess('Регистрация успешна! Перенаправление...')

            // Завершаем онбординг
            completeOnboarding()

            // Ждем 2 секунды и перенаправляем на главную страницу
            setTimeout(() => {
                router.push('/')
            }, 2000)
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Ошибка при регистрации')
        } finally {
            setLoading(false)
        }
    }

    const handleEnterPress = () => {
        handleSubmit({ preventDefault: () => { } } as React.FormEvent)
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 flex flex-col" data-page="auth">
            {/* Основной контент */}
            <div className="flex-1 flex items-center justify-center p-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                    className="w-full max-w-2xl"
                >
                    <Card className="p-8 md:p-12 shadow-lg border border-secondary-200 text-center">
                        {/* Логотип и заголовок */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="text-center mb-12"
                        >
                            <div className="w-20 h-20 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                                <span className="text-white font-bold text-3xl">B</span>
                            </div>
                            <h1 className="text-3xl md:text-4xl font-bold text-secondary-900 mb-4">
                                Создать аккаунт
                            </h1>
                            <p className="text-secondary-600 text-lg md:text-xl">
                                Присоединяйтесь к Balendip и начните управлять своей жизнью
                            </p>
                        </motion.div>

                        {/* Форма */}
                        <motion.form
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.3 }}
                            onSubmit={handleSubmit}
                            className="space-y-6 grid place-items-center"
                        >
                            <div className="w-full max-w-md">
                                <Input
                                    label="Имя"
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    leftIcon={User}
                                    placeholder="Ваше имя"
                                    required
                                    onEnterPress={handleEnterPress}
                                    className="auth-input-override"
                                />
                            </div>

                            <div className="w-full max-w-md">
                                <Input
                                    label="Email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    leftIcon={Mail}
                                    placeholder="your@email.com"
                                    required
                                    onEnterPress={handleEnterPress}
                                    className="auth-input-override"
                                />
                            </div>

                            <div className="w-full max-w-md">
                                <Input
                                    label="Пароль"
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    leftIcon={Lock}
                                    rightIcon={showPassword ? EyeOff : Eye}
                                    onRightIconClick={() => setShowPassword(!showPassword)}
                                    placeholder="Минимум 6 символов"
                                    required
                                    onEnterPress={handleEnterPress}
                                    className="auth-input-override"
                                />
                            </div>

                            <div className="w-full max-w-md">
                                <Input
                                    label="Подтвердите пароль"
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    leftIcon={Lock}
                                    rightIcon={showConfirmPassword ? EyeOff : Eye}
                                    onRightIconClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    placeholder="Повторите пароль"
                                    required
                                    onEnterPress={handleEnterPress}
                                    className="auth-input-override"
                                />
                            </div>

                            {/* Сообщения об ошибках и успехе */}
                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="text-error-600 text-lg bg-error-50 border-2 border-error-200 rounded-xl p-6 text-center"
                                >
                                    {error}
                                </motion.div>
                            )}

                            {success && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="text-success-600 text-lg bg-success-50 border-2 border-success-200 rounded-xl p-6 text-center"
                                >
                                    {success}
                                </motion.div>
                            )}

                            {/* Кнопки */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.4 }}
                                className="flex flex-col sm:flex-row gap-4 justify-center items-center"
                            >
                                <Button
                                    type="button"
                                    variant="secondary"
                                    size="lg"
                                    onClick={() => router.push('/onboarding')}
                                    className="w-full sm:w-auto"
                                >
                                    <ArrowLeft size={20} className="mr-2" />
                                    Вернуться к настройке
                                </Button>

                                <Button
                                    type="submit"
                                    loading={loading}
                                    variant="primary"
                                    size="lg"
                                    className="w-full sm:w-auto"
                                    disabled={!name || !email || !password || !confirmPassword}
                                >
                                    {loading ? 'Создание аккаунта...' : 'Создать аккаунт'}
                                </Button>
                            </motion.div>
                        </motion.form>

                        {/* Ссылка на вход */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.5 }}
                            className="mt-12 text-center"
                        >
                            <p className="text-secondary-600 text-lg">
                                Уже есть аккаунт?{' '}
                                <button
                                    onClick={() => router.push('/auth/login')}
                                    className="text-primary-600 hover:text-primary-700 font-semibold underline text-lg transition-colors duration-200"
                                >
                                    Войти
                                </button>
                            </p>
                        </motion.div>
                    </Card>
                </motion.div>
            </div>
        </div>
    )
} 