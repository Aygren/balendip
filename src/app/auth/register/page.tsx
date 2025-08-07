'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { Mail, Lock, Eye, EyeOff, User } from 'lucide-react'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Card from '@/components/ui/Card'

export default function RegisterPage() {
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')
    
    const { signUp } = useAuth()
    const router = useRouter()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError('')
        setSuccess('')

        if (password !== confirmPassword) {
            setError('Пароли не совпадают')
            setLoading(false)
            return
        }

        if (password.length < 6) {
            setError('Пароль должен содержать минимум 6 символов')
            setLoading(false)
            return
        }

        // Временная логика для тестирования без Supabase
        try {
            const { error } = await signUp(email, password, name)
            
            if (error) {
                // Если Supabase не настроен, показываем успех для тестирования
                if (error.message.includes('your-project.supabase.co') || error.message.includes('your-anon-key')) {
                    setSuccess('Регистрация успешна! (тестовый режим - Supabase не настроен)')
                    setTimeout(() => {
                        router.push('/')
                    }, 2000)
                } else {
                    setError(error.message)
                }
            } else {
                setSuccess('Регистрация успешна!')
                setTimeout(() => {
                    router.push('/auth/verify-email')
                }, 2000)
            }
        } catch (err) {
            setError('Ошибка при регистрации. Проверьте настройки Supabase.')
        }
        
        setLoading(false)
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-secondary-50 p-4">
            <Card className="w-full max-w-md">
                <div className="text-center mb-6">
                    <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-white font-bold text-2xl">B</span>
                    </div>
                    <h1 className="text-2xl font-bold text-secondary-900">Создать аккаунт</h1>
                    <p className="text-secondary-600 mt-2">Присоединяйтесь к Balendip</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <Input
                        label="Имя"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        leftIcon={User}
                        placeholder="Ваше имя"
                        required
                    />

                    <Input
                        label="Email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        leftIcon={Mail}
                        placeholder="your@email.com"
                        required
                    />

                    <div className="relative">
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
                        />
                    </div>

                    <div className="relative">
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
                        />
                    </div>

                    {error && (
                        <div className="text-error-600 text-sm bg-error-50 border border-error-200 rounded-lg p-3">
                            {error}
                        </div>
                    )}

                    {success && (
                        <div className="text-accent-600 text-sm bg-accent-50 border border-accent-200 rounded-lg p-3">
                            {success}
                        </div>
                    )}

                    <Button
                        type="submit"
                        loading={loading}
                        className="w-full"
                        disabled={!name || !email || !password || !confirmPassword}
                    >
                        Создать аккаунт
                    </Button>
                </form>

                <div className="mt-6 text-center">
                    <p className="text-secondary-600">
                        Уже есть аккаунт?{' '}
                        <button
                            onClick={() => router.push('/auth/login')}
                            className="text-primary-600 hover:text-primary-700 font-medium"
                        >
                            Войти
                        </button>
                    </p>
                </div>
            </Card>
        </div>
    )
} 