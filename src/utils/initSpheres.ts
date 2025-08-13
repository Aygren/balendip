import { supabase } from '@/lib/supabase'
import { LifeSphere } from '@/types'

// ===== УТИЛИТЫ ДЛЯ ИНИЦИАЛИЗАЦИИ СФЕР ЖИЗНИ =====

// Стандартные сферы жизни по умолчанию
export const DEFAULT_SPHERES: Omit<LifeSphere, 'id' | 'user_id' | 'created_at' | 'updated_at'>[] = [
    {
        name: 'Здоровье',
        color: '#10B981', // Зеленый
        icon: '🏃‍♂️',
        score: 7,
        is_default: true,
    },
    {
        name: 'Работа',
        color: '#3B82F6', // Синий
        icon: '💼',
        score: 6,
        is_default: true,
    },
    {
        name: 'Отношения',
        color: '#EC4899', // Розовый
        icon: '❤️',
        score: 8,
        is_default: true,
    },
    {
        name: 'Финансы',
        color: '#F59E0B', // Желтый
        icon: '💰',
        score: 5,
        is_default: true,
    },
    {
        name: 'Образование',
        color: '#8B5CF6', // Фиолетовый
        icon: '📚',
        score: 6,
        is_default: true,
    },
    {
        name: 'Духовность',
        color: '#06B6D4', // Голубой
        icon: '🧘‍♀️',
        score: 4,
        is_default: true,
    },
    {
        name: 'Отдых',
        color: '#F97316', // Оранжевый
        icon: '🎮',
        score: 7,
        is_default: true,
    },
    {
        name: 'Социальная жизнь',
        color: '#84CC16', // Лаймовый
        icon: '👥',
        score: 6,
        is_default: true,
    },
]

// Дополнительные сферы для выбора
export const ADDITIONAL_SPHERES: Omit<LifeSphere, 'id' | 'user_id' | 'created_at' | 'updated_at'>[] = [
    {
        name: 'Творчество',
        color: '#EF4444', // Красный
        icon: '🎨',
        score: 5,
        is_default: false,
    },
    {
        name: 'Путешествия',
        color: '#06B6D4', // Голубой
        icon: '✈️',
        score: 4,
        is_default: false,
    },
    {
        name: 'Спорт',
        color: '#10B981', // Зеленый
        icon: '⚽',
        score: 6,
        is_default: false,
    },
    {
        name: 'Музыка',
        color: '#8B5CF6', // Фиолетовый
        icon: '🎵',
        score: 5,
        is_default: false,
    },
    {
        name: 'Кулинария',
        color: '#F59E0B', // Желтый
        icon: '👨‍🍳',
        score: 4,
        is_default: false,
    },
    {
        name: 'Саморазвитие',
        color: '#3B82F6', // Синий
        icon: '🚀',
        score: 7,
        is_default: false,
    },
    {
        name: 'Природа',
        color: '#059669', // Темно-зеленый
        icon: '🌲',
        score: 5,
        is_default: false,
    },
    {
        name: 'Технологии',
        color: '#6366F1', // Индиго
        icon: '💻',
        score: 6,
        is_default: false,
    },
]

// Все доступные сферы
export const ALL_AVAILABLE_SPHERES = [...DEFAULT_SPHERES, ...ADDITIONAL_SPHERES]

// Функция для получения случайного цвета
export const getRandomColor = (): string => {
    const colors = [
        '#EF4444', // Красный
        '#F97316', // Оранжевый
        '#F59E0B', // Желтый
        '#84CC16', // Лаймовый
        '#10B981', // Зеленый
        '#059669', // Темно-зеленый
        '#06B6D4', // Голубой
        '#3B82F6', // Синий
        '#6366F1', // Индиго
        '#8B5CF6', // Фиолетовый
        '#EC4899', // Розовый
        '#F43F5E', // Розово-красный
    ]

    return colors[Math.floor(Math.random() * colors.length)]
}

// Функция для получения случайной иконки
export const getRandomIcon = (): string => {
    const icons = [
        '🌟', '💫', '✨', '🔥', '💎', '🎯', '🎪', '🎭', '🎨', '🎵',
        '🎬', '📚', '💡', '🚀', '⚡', '🌈', '🎉', '🎊', '🎁', '🎈',
        '🌺', '🌸', '🌼', '🌻', '🌹', '🌷', '🍀', '🌿', '🌱', '🌳',
        '🏔️', '🌊', '🌅', '🌄', '🌇', '🌆', '🏙️', '🌃', '🌌', '⭐',
    ]

    return icons[Math.floor(Math.random() * icons.length)]
}

// Функция для создания пользовательской сферы
export const createCustomSphere = (
    name: string,
    color?: string,
    icon?: string,
    score: number = 5
): Omit<LifeSphere, 'id' | 'user_id' | 'created_at' | 'updated_at'> => {
    return {
        name,
        color: color || getRandomColor(),
        icon: icon || getRandomIcon(),
        score: Math.max(1, Math.min(10, score)), // Ограничиваем от 1 до 10
        is_default: false,
    }
}

// Функция для валидации сферы
export const validateSphere = (sphere: Partial<LifeSphere>): string[] => {
    const errors: string[] = []

    if (!sphere.name || sphere.name.trim().length === 0) {
        errors.push('Название сферы обязательно')
    }

    if (sphere.name && sphere.name.trim().length > 50) {
        errors.push('Название сферы не может быть длиннее 50 символов')
    }

    if (sphere.score !== undefined && (sphere.score < 1 || sphere.score > 10)) {
        errors.push('Оценка должна быть от 1 до 10')
    }

    if (sphere.color && !/^#[0-9A-F]{6}$/i.test(sphere.color)) {
        errors.push('Неверный формат цвета')
    }

    return errors
}

// Функция для получения рекомендаций по сферам
export const getSphereRecommendations = (existingSpheres: LifeSphere[]): string[] => {
    const recommendations: string[] = []

    // Проверяем, есть ли сферы здоровья
    const hasHealth = existingSpheres.some(s =>
        s.name.toLowerCase().includes('здоров') ||
        s.name.toLowerCase().includes('спорт') ||
        s.name.toLowerCase().includes('фитнес')
    )

    if (!hasHealth) {
        recommendations.push('Добавьте сферу здоровья для баланса жизни')
    }

    // Проверяем, есть ли сферы работы/карьеры
    const hasWork = existingSpheres.some(s =>
        s.name.toLowerCase().includes('работ') ||
        s.name.toLowerCase().includes('карьер') ||
        s.name.toLowerCase().includes('бизнес')
    )

    if (!hasWork) {
        recommendations.push('Добавьте сферу работы для профессионального роста')
    }

    // Проверяем, есть ли сферы отношений
    const hasRelationships = existingSpheres.some(s =>
        s.name.toLowerCase().includes('отношен') ||
        s.name.toLowerCase().includes('семь') ||
        s.name.toLowerCase().includes('друз')
    )

    if (!hasRelationships) {
        recommendations.push('Добавьте сферу отношений для социального благополучия')
    }

    // Проверяем, есть ли сферы отдыха
    const hasLeisure = existingSpheres.some(s =>
        s.name.toLowerCase().includes('отдых') ||
        s.name.toLowerCase().includes('хобби') ||
        s.name.toLowerCase().includes('развлеч')
    )

    if (!hasLeisure) {
        recommendations.push('Добавьте сферу отдыха для баланса работы и жизни')
    }

    return recommendations
}

// Функция для анализа баланса сфер
export const analyzeSpheresBalance = (spheres: LifeSphere[]) => {
    if (spheres.length === 0) {
        return {
            isBalanced: false,
            score: 0,
            recommendations: ['Добавьте хотя бы одну сферу жизни'],
        }
    }

    const scores = spheres.map(s => s.score)
    const averageScore = scores.reduce((sum, score) => sum + score, 0) / scores.length
    const variance = scores.reduce((sum, score) => sum + Math.pow(score - averageScore, 2), 0) / scores.length
    const standardDeviation = Math.sqrt(variance)

    // Считаем сферы с низким баллом (меньше 5)
    const lowScoreSpheres = spheres.filter(s => s.score < 5)
    const highScoreSpheres = spheres.filter(s => s.score > 7)

    let isBalanced = true
    const recommendations: string[] = []

    // Проверяем баланс
    if (standardDeviation > 2) {
        isBalanced = false
        recommendations.push('У вас есть сферы с очень разными оценками. Попробуйте выровнять баланс')
    }

    if (lowScoreSpheres.length > spheres.length / 2) {
        isBalanced = false
        recommendations.push('Большинство сфер имеют низкие оценки. Сосредоточьтесь на улучшении')
    }

    if (highScoreSpheres.length === 0) {
        recommendations.push('Попробуйте найти сферы, которые у вас получаются хорошо')
    }

    // Рассчитываем общий балл баланса (0-100)
    const balanceScore = Math.max(0, Math.min(100,
        100 - (standardDeviation * 10) - (lowScoreSpheres.length * 5)
    ))

    return {
        isBalanced,
        score: Math.round(balanceScore),
        recommendations,
        stats: {
            total: spheres.length,
            averageScore: Math.round(averageScore),
            standardDeviation: Math.round(standardDeviation * 100) / 100,
            lowScoreCount: lowScoreSpheres.length,
            highScoreCount: highScoreSpheres.length,
        },
    }
}

// Экспорт по умолчанию
export default {
    DEFAULT_SPHERES,
    ADDITIONAL_SPHERES,
    ALL_AVAILABLE_SPHERES,
    getRandomColor,
    getRandomIcon,
    createCustomSphere,
    validateSphere,
    getSphereRecommendations,
    analyzeSpheresBalance,
}
