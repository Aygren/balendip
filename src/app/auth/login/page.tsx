'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Mail, Lock, Eye, EyeOff } from 'lucide-react'
import Layout from '@/components/layout/Layout'
import Card from '@/components/ui/Card'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import { useAuth } from '@/contexts/AuthContext'

export default function LoginPage() {
    const router = useRouter()
    const { login } = useAuth()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError('')

        try {
            await login({ email, password })
            router.push('/')
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Ошибка при входе')
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
                        <h1 className="text-4xl font-bold text-secondary-900">Войти в аккаунт</h1>
                        <p className="text-secondary-600 mt-4 text-xl">Добро пожаловать обратно</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-10">
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
                            placeholder="Введите пароль"
                            required
                            onEnterPress={handleEnterPress}
                        />

                        {error && (
                            <div className="text-error-600 text-lg bg-error-50 border-2 border-error-200 rounded-xl p-6">
                                {error}
                            </div>
                        )}

                        <Button
                            type="submit"
                            loading={loading}
                            className="w-full py-6 text-2xl font-bold"
                            disabled={!email || !password}
                        >
                            Войти
                        </Button>
                    </form>

                    <div className="mt-10 text-center">
                        <p className="text-secondary-600 text-xl">
                            Нет аккаунта?{' '}
                            <button
                                onClick={() => router.push('/auth/register')}
                                className="text-primary-600 hover:text-primary-700 font-medium underline text-xl"
                            >
                                Зарегистрироваться
                            </button>
                        </p>
                    </div>
                </Card>
            </div>
        </Layout>
    )
} 