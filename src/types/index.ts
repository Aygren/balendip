// Основные типы для приложения Balendip

export interface User {
    id: string
    email: string
    name?: string
    avatar_url?: string
    created_at: string
    updated_at: string
}

export interface LifeSphere {
    id: string
    user_id: string
    name: string
    color: string
    icon: string
    score: number // 1-10
    is_default: boolean
    created_at: string
    updated_at: string
}

export interface Event {
    id: string
    user_id: string
    title: string
    description?: string
    emoji: string
    emotion: 'positive' | 'neutral' | 'negative'
    spheres: string[] // IDs связанных сфер
    date: string
    created_at: string
    updated_at: string
}

export interface EventWithSpheres extends Event {
    spheres_data: LifeSphere[]
}

export interface BalanceData {
    spheres: LifeSphere[]
    total_score: number
    average_score: number
    last_updated: string
}

export interface OnboardingStep {
    id: number
    title: string
    description: string
    is_completed: boolean
}

export interface AnalyticsData {
    events: EventWithSpheres[]
    balance_history: BalanceData[]
    correlations: CorrelationData[]
}

export interface CorrelationData {
    sphere_id: string
    sphere_name: string
    positive_events: number
    negative_events: number
    correlation_score: number
}

export interface ChartData {
    labels: string[]
    datasets: {
        label: string
        data: number[]
        backgroundColor: string[]
        borderColor: string[]
        borderWidth: number
    }[]
}

// Типы для форм
export interface AddEventForm {
    title: string
    description?: string
    emoji: string
    emotion: 'positive' | 'neutral' | 'negative'
    spheres: string[]
    date: string
}

export interface OnboardingForm {
    spheres: LifeSphere[]
    user_name?: string
}

// Типы для API ответов
export interface ApiResponse<T> {
    data: T
    error?: string
    message?: string
}

export interface PaginatedResponse<T> {
    data: T[]
    count: number
    page: number
    limit: number
    total_pages: number
}

// Типы для фильтров
export interface EventFilters {
    date_from?: string
    date_to?: string
    emotion?: 'positive' | 'neutral' | 'negative'
    spheres?: string[]
    search?: string
}

// Типы для настроек
export interface UserSettings {
    notifications_enabled: boolean
    weekly_reports: boolean
    theme: 'light' | 'dark' | 'auto'
    language: 'ru' | 'en'
}

// Типы для экспорта
export interface ExportData {
    user: User
    spheres: LifeSphere[]
    events: EventWithSpheres[]
    analytics: AnalyticsData
    export_date: string
}

// Типы для анимаций
export interface AnimationProps {
    initial?: any
    animate?: any
    exit?: any
    transition?: any
}

// Типы для компонентов
export interface BaseComponentProps {
    className?: string
    children?: React.ReactNode
}

export interface ButtonProps extends BaseComponentProps {
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost'
    size?: 'sm' | 'md' | 'lg'
    disabled?: boolean
    loading?: boolean
    onClick?: () => void
    type?: 'button' | 'submit' | 'reset'
}

export interface ModalProps extends BaseComponentProps {
    is_open: boolean
    on_close: () => void
    title?: string
    size?: 'sm' | 'md' | 'lg' | 'xl'
}

// Типы для хуков
export interface UseQueryOptions {
    enabled?: boolean
    refetchOnWindowFocus?: boolean
    staleTime?: number
    cacheTime?: number
}

export interface UseMutationOptions {
    onSuccess?: (data: any) => void
    onError?: (error: any) => void
    onSettled?: () => void
} 