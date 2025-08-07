'use client'

import { useState, useEffect } from 'react'

interface QuickAction {
    id: string
    label: string
    question: string
    icon: string
    shortcut?: string
}

const QUICK_ACTIONS: QuickAction[] = [
    {
        id: 'supabase-status',
        label: 'Статус Supabase',
        question: 'Проверь статус конфигурации Supabase и что нужно настроить',
        icon: '⚙️',
        shortcut: 'Ctrl+S'
    },
    {
        id: 'project-progress',
        label: 'Прогресс проекта',
        question: 'Покажи текущий прогресс проекта и что сделано',
        icon: '📊',
        shortcut: 'Ctrl+P'
    },
    {
        id: 'code-quality',
        label: 'Качество кода',
        question: 'Проверь качество кода и предложи улучшения',
        icon: '🔍',
        shortcut: 'Ctrl+Q'
    },
    {
        id: 'next-features',
        label: 'Следующие функции',
        question: 'Какие функции нужно реализовать в первую очередь?',
        icon: '🎯',
        shortcut: 'Ctrl+N'
    }
]

interface FloatingActionButtonProps {
    onActionSelect: (action: QuickAction) => void
    className?: string
}

export const FloatingActionButton = ({ onActionSelect, className = '' }: FloatingActionButtonProps) => {
    const [isExpanded, setIsExpanded] = useState(false)
    const [selectedAction, setSelectedAction] = useState<QuickAction | null>(null)

    // Обработка горячих клавиш
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.ctrlKey) {
                switch (event.key.toLowerCase()) {
                    case 's':
                        event.preventDefault()
                        const supabaseAction = QUICK_ACTIONS.find(a => a.id === 'supabase-status')
                        if (supabaseAction) onActionSelect(supabaseAction)
                        break
                    case 'p':
                        event.preventDefault()
                        const progressAction = QUICK_ACTIONS.find(a => a.id === 'project-progress')
                        if (progressAction) onActionSelect(progressAction)
                        break
                    case 'q':
                        event.preventDefault()
                        const qualityAction = QUICK_ACTIONS.find(a => a.id === 'code-quality')
                        if (qualityAction) onActionSelect(qualityAction)
                        break
                    case 'n':
                        event.preventDefault()
                        const nextAction = QUICK_ACTIONS.find(a => a.id === 'next-features')
                        if (nextAction) onActionSelect(nextAction)
                        break
                }
            }
        }

        window.addEventListener('keydown', handleKeyDown)
        return () => window.removeEventListener('keydown', handleKeyDown)
    }, [onActionSelect])

    const handleActionClick = (action: QuickAction) => {
        setSelectedAction(action)
        onActionSelect(action)
        setIsExpanded(false)
    }

    return (
        <div className={`fixed bottom-6 right-6 z-50 ${className}`}>
            {/* Действия */}
            {isExpanded && (
                <div className="mb-4 space-y-2">
                    {QUICK_ACTIONS.map((action, index) => (
                        <div
                            key={action.id}
                            className="flex items-center justify-end"
                            style={{ animationDelay: `${index * 100}ms` }}
                        >
                            <button
                                onClick={() => handleActionClick(action)}
                                className="flex items-center gap-2 px-3 py-2 bg-white text-gray-700 rounded-lg shadow-lg hover:bg-gray-50 transition-all duration-200 transform hover:scale-105"
                                style={{ animation: 'slideInRight 0.3s ease-out forwards' }}
                            >
                                <span className="text-sm">{action.label}</span>
                                <span className="text-lg">{action.icon}</span>
                                {action.shortcut && (
                                    <span className="text-xs bg-gray-100 px-1 py-0.5 rounded text-gray-500">
                                        {action.shortcut}
                                    </span>
                                )}
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {/* Основная кнопка */}
            <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="w-14 h-14 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-all duration-200 transform hover:scale-110 flex items-center justify-center"
            >
                <svg
                    className={`w-6 h-6 transition-transform duration-200 ${isExpanded ? 'rotate-45' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
            </button>

            {/* Оверлей */}
            {isExpanded && (
                <div
                    className="fixed inset-0 z-40"
                    onClick={() => setIsExpanded(false)}
                />
            )}

            <style jsx>{`
        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>
        </div>
    )
} 