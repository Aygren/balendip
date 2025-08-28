// Основные типы для приложения Balendip

// ===== БАЗОВЫЕ ТИПЫ =====
export interface BaseEntity {
    id: string
    created_at: string
    updated_at: string
}

export interface BaseComponentProps {
    className?: string
    children?: React.ReactNode
}

// ===== ПОЛЬЗОВАТЕЛИ =====
export interface User extends BaseEntity {
    email: string
    name?: string
    avatar_url?: string
}

// ===== СФЕРЫ ЖИЗНИ =====
export interface LifeSphere extends BaseEntity {
    user_id: string
    name: string
    color: string
    icon: string
    score: number // 1-10
    is_default: boolean
}

// ===== СОБЫТИЯ =====
export interface Event extends BaseEntity {
    user_id: string
    title: string
    description?: string
    emoji: string
    emotion: 'positive' | 'neutral' | 'negative'
    spheres: string[] // IDs связанных сфер
    date: string
    time?: string
    score?: number // Добавляем score для событий
    location?: string // Добавляем location для событий
}

export interface EventWithSpheres extends Event {
    spheres_data: LifeSphere[]
}

// ===== АНАЛИТИКА =====
export interface BalanceData {
    spheres: LifeSphere[]
    total_score: number
    average_score: number
    last_updated: string
}

export interface CorrelationData {
    sphere_id: string
    sphere_name: string
    positive_events: number
    negative_events: number
    correlation_score: number
}

export interface AnalyticsData {
    events: EventWithSpheres[]
    balance_history: BalanceData[]
    correlations: CorrelationData[]
}

// ===== ФОРМЫ =====
export interface AddEventForm {
    title: string
    description?: string
    emoji: string
    emotion: 'positive' | 'neutral' | 'negative'
    spheres: string[]
    date: string
    time?: string
}

export interface OnboardingForm {
    spheres: LifeSphere[]
    user_name?: string
}

// ===== API =====
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

// ===== ФИЛЬТРЫ =====
export interface EventFilters {
    date_from?: string
    date_to?: string
    emotion?: 'positive' | 'neutral' | 'negative'
    spheres?: string[]
    search?: string
}

// ===== НАСТРОЙКИ =====
export interface UserSettings {
    notifications_enabled: boolean
    weekly_reports: boolean
    theme: 'light' | 'dark' | 'auto'
    language: 'ru' | 'en'
}

// ===== ЭКСПОРТ =====
export interface ExportData {
    user: User
    spheres: LifeSphere[]
    events: EventWithSpheres[]
    analytics: AnalyticsData
    export_date: string
}

export interface ExportFormat {
    type: 'pdf' | 'excel' | 'csv' | 'json'
    filename: string
}

export interface ExportOptions {
    format: ExportFormat
    dateRange?: {
        from: string
        to: string
    }
    includeSpheres?: boolean
    includeAnalytics?: boolean
}

// ===== UI КОМПОНЕНТЫ =====
export interface ModalProps extends BaseComponentProps {
    is_open: boolean
    on_close: () => void
    title?: string
    size?: 'sm' | 'md' | 'lg' | 'xl'
}

export interface InputProps extends BaseComponentProps {
    label?: string
    error?: string
    helperText?: string
    leftIcon?: React.ComponentType<{ size?: number }>
    rightIcon?: React.ComponentType<{ size?: number }>
    onLeftIconClick?: () => void
    onRightIconClick?: () => void
}

// ===== ХУКИ =====
export interface UseQueryOptions {
    enabled?: boolean
    refetchOnWindowFocus?: boolean
    staleTime?: number
    gcTime?: number
}

export interface UseMutationOptions {
    onSuccess?: (data: any) => void
    onError?: (error: any) => void
    onSettled?: () => void
}

// ===== ОНБОРДИНГ =====
export interface OnboardingStep {
    id: number
    title: string
    description: string
    is_completed: boolean
}

// ===== АНИМАЦИИ =====
export interface AnimationProps {
    initial?: any
    animate?: any
    exit?: any
    transition?: any
}

// ===== КОНСТАНТЫ =====
export const EMOTION_OPTIONS = [
    { value: 'positive', label: 'Позитивное', emoji: '😊', color: '#10B981' },
    { value: 'neutral', label: 'Нейтральное', emoji: '😐', color: '#6B7280' },
    { value: 'negative', label: 'Негативное', emoji: '😔', color: '#EF4444' },
] as const

export const DEFAULT_SPHERES = [
    { name: 'Здоровье', color: '#10B981', icon: '🏥', score: 5 },
    { name: 'Карьера', color: '#3B82F6', icon: '💼', score: 5 },
    { name: 'Отношения', color: '#F59E0B', icon: '❤️', score: 5 },
    { name: 'Финансы', color: '#8B5CF6', icon: '💰', score: 5 },
    { name: 'Саморазвитие', color: '#06B6D4', icon: '📚', score: 5 },
    { name: 'Духовность', color: '#EC4899', icon: '🧘', score: 5 },
    { name: 'Отдых', color: '#F97316', icon: '🏖️', score: 5 },
    { name: 'Окружение', color: '#84CC16', icon: '👥', score: 5 },
] as const

export const EMOJI_OPTIONS = [
    '😊', '😄', '😍', '🥰', '😎', '🤩', '😌', '😇',
    '😢', '😭', '😤', '😡', '😠', '😞', '😔', '😟',
    '😐', '😑', '😶', '🤔', '😕', '🙁', '☹️', '😣',
    '🎉', '🎊', '🎈', '🎁', '🎯', '🏆', '💪', '🔥',
    '💔', '💀', '👻', '🤖', '👾', '🎮', '🎲', '🎸',
    '🏃', '🚴', '🏊', '🏋️', '🧘', '🎨', '📚', '✍️',
    '💼', '💰', '💳', '🏠', '🚗', '✈️', '🌍', '🌙',
    '☀️', '🌺', '🌸', '🌻', '🌹', '🍀', '🌳', '🌴'
] as const 