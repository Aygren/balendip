'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { Mail, Lock, Eye, EyeOff } from 'lucide-react'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Card from '@/components/ui/Card'

export default function LoginPage() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')
    
    const { signIn } = useAuth()
    const router = useRouter()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError('')
        setSuccess('')

        try {
            const { error } = await signIn(email, password)
            
            if (error) {
                // Если Supabase не настроен, показываем успех для тестирования
                if (error.message.includes('your-project.supabase.co') || error.message.includes('your-anon-key')) {
                    setSuccess('Вход успешен! (тестовый режим - Supabase не настроен)')
                    setTimeout(() => {
                        router.push('/')
                    }, 2000)
                } else {
                    setError(error.message)
                }
            } else {
                setSuccess('Вход успешен!')
                setTimeout(() => {
                    router.push('/')
                }, 1000)
            }
        } catch (err) {
            setError('Ошибка при входе. Проверьте настройки Supabase.')
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
                    <h1 className="text-2xl font-bold text-secondary-900">Вход в аккаунт</h1>
                    <p className="text-secondary-600 mt-2">Войдите в свой аккаунт Balendip</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
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
                            placeholder="Введите пароль"
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
                        disabled={!email || !password}
                    >
                        Войти
                    </Button>
                </form>

                <div className="mt-6 text-center">
                    <p className="text-secondary-600">
                        Нет аккаунта?{' '}
                        <button
                            onClick={() => router.push('/auth/register')}
                            className="text-primary-600 hover:text-primary-700 font-medium"
                        >
                            Зарегистрироваться
                        </button>
                    </p>
                </div>

                <div className="mt-4 text-center">
                    <button
                        onClick={() => router.push('/auth/forgot-password')}
                        className="text-secondary-600 hover:text-secondary-700 text-sm"
                    >
                        Забыли пароль?
                    </button>
                </div>
            </Card>
        </div>
    )
} 