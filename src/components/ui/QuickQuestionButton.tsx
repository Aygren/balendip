'use client'

import { useState } from 'react'

interface QuickQuestion {
    id: string
    label: string
    question: string
    icon: string
}

const QUICK_QUESTIONS: QuickQuestion[] = [
    {
        id: 'supabase-config',
        label: 'Supabase конфигурация',
        question: 'Нужно ли настроить конфигурацию Supabase? Что уже готово и что нужно доделать?',
        icon: '⚙️'
    },
    {
        id: 'project-status',
        label: 'Статус проекта',
        question: 'Какой текущий статус проекта? Что уже сделано и что в планах?',
        icon: '📊'
    },
    {
        id: 'next-steps',
        label: 'Следующие шаги',
        question: 'Какие следующие шаги для развития проекта? Что приоритетно?',
        icon: '🎯'
    },
    {
        id: 'code-review',
        label: 'Обзор кода',
        question: 'Проверь код на соответствие стандартам и предложи улучшения',
        icon: '🔍'
    }
]

interface QuickQuestionButtonProps {
    onQuestionSelect: (question: string) => void
    className?: string
}

export const QuickQuestionButton = ({ onQuestionSelect, className = '' }: QuickQuestionButtonProps) => {
    const [isOpen, setIsOpen] = useState(false)

    const handleQuestionClick = (question: string) => {
        onQuestionSelect(question)
        setIsOpen(false)
    }

    return (
        <div className={`relative ${className}`}>
            {/* Основная кнопка */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
                <span>💬</span>
                <span>Быстрый вопрос</span>
                <svg
                    className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </button>

            {/* Выпадающее меню */}
            {isOpen && (
                <div className="absolute top-full left-0 mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                    <div className="p-2">
                        <h3 className="text-sm font-medium text-gray-700 mb-2 px-2">Выберите вопрос:</h3>
                        {QUICK_QUESTIONS.map((item) => (
                            <button
                                key={item.id}
                                onClick={() => handleQuestionClick(item.question)}
                                className="w-full flex items-center gap-3 px-3 py-2 text-left hover:bg-gray-50 rounded-md transition-colors"
                            >
                                <span className="text-lg">{item.icon}</span>
                                <span className="text-sm text-gray-700">{item.label}</span>
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Оверлей для закрытия */}
            {isOpen && (
                <div
                    className="fixed inset-0 z-40"
                    onClick={() => setIsOpen(false)}
                />
            )}
        </div>
    )
} 