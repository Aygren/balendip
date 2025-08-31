'use client'

import { useEffect } from 'react'
import Button from '@/components/ui/Button'

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    useEffect(() => {
        console.error(error)
    }, [error])

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-secondary-50">
            <div className="text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                    <span className="text-white font-bold text-3xl">!</span>
                </div>
                <h2 className="text-2xl font-bold text-secondary-900 mb-4">Что-то пошло не так</h2>
                <p className="text-secondary-600 mb-6">Произошла ошибка при загрузке страницы</p>
                <Button variant="primary" size="lg" onClick={reset}>
                    Попробовать снова
                </Button>
            </div>
        </div>
    )
}
