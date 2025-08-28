'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { User, Mail, Lock, Eye, EyeOff } from 'lucide-react'
import Layout from '@/components/layout/Layout'
import Card from '@/components/ui/Card'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import { useAuth } from '@/contexts/AuthContext'

export default function RegisterPage() {
    const router = useRouter()
    const { register } = useAuth()
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')

    // Загружаем данные из онбординга
    React.useEffect(() => {
        const savedProgress = localStorage.getItem('onboardingProgress')
        if (savedProgress) {
            try {
                const progress = JSON.parse(savedProgress)
                if (progress.userName) {
                    setName(progress.userName)
                }
            } catch (error) {
                console.error('Ошибка загрузки данных онбординга:', error)
            }
        }
    }, [])

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
            localStorage.setItem('onboardingComplete', 'true')
            localStorage.removeItem('onboardingProgress')

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
        <Layout>
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-secondary-50 p-4">
                <Card className="w-full max-w-2xl">
                    <div className="text-center mb-10">
                        <div className="w-24 h-24 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center mx-auto mb-8">
                            <span className="text-white font-bold text-4xl">B</span>
                        </div>
                        <h1 className="text-4xl font-bold text-secondary-900">Создать аккаунт</h1>
                        <p className="text-secondary-600 mt-4 text-xl">Присоединяйтесь к Balendip</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-10">
                        <Input
                            label="Имя"
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            leftIcon={User}
                            placeholder="Ваше имя"
                            required
                            onEnterPress={handleEnterPress}
                        />

                        <Input
                            label="Email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            leftIcon={Mail}
                            placeholder="your@email.com"
                            required
                            onEnterPress={handleEnterPress}
                        />

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
                        />

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
                        />

                        {error && (
                            <div className="text-error-600 text-lg bg-error-50 border-2 border-error-200 rounded-xl p-6">
                                {error}
                            </div>
                        )}

                        {success && (
                            <div className="text-accent-600 text-lg bg-accent-50 border-2 border-accent-200 rounded-xl p-6">
                                {success}
                            </div>
                        )}

                        <Button
                            type="submit"
                            loading={loading}
                            className="w-full py-6 text-2xl font-bold"
                            disabled={!name || !email || !password || !confirmPassword}
                        >
                            Зарегистрироваться
                        </Button>
                    </form>

                    <div className="mt-10 text-center">
                        <p className="text-secondary-600 text-xl">
                            Уже есть аккаунт?{' '}
                            <button
                                onClick={() => router.push('/auth/login')}
                                className="text-primary-600 hover:text-primary-700 font-medium underline text-xl"
                            >
                                Войти
                            </button>
                        </p>
                    </div>
                </Card>
            </div>
        </Layout>
    )
} 