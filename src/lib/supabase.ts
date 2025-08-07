import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://your-project.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'your-anon-key'

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true
    },
    db: {
        schema: 'public'
    }
})

// Типы для Supabase
export type Database = {
    public: {
        Tables: {
            users: {
                Row: {
                    id: string
                    email: string
                    name: string | null
                    avatar_url: string | null
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    email: string
                    name?: string | null
                    avatar_url?: string | null
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    email?: string
                    name?: string | null
                    avatar_url?: string | null
                    created_at?: string
                    updated_at?: string
                }
            }
            life_spheres: {
                Row: {
                    id: string
                    user_id: string
                    name: string
                    color: string
                    icon: string
                    score: number
                    is_default: boolean
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    user_id: string
                    name: string
                    color: string
                    icon: string
                    score?: number
                    is_default?: boolean
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    user_id?: string
                    name?: string
                    color?: string
                    icon?: string
                    score?: number
                    is_default?: boolean
                    created_at?: string
                    updated_at?: string
                }
            }
            events: {
                Row: {
                    id: string
                    user_id: string
                    title: string
                    description: string | null
                    emoji: string
                    emotion: 'positive' | 'neutral' | 'negative'
                    spheres: string[]
                    date: string
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    user_id: string
                    title: string
                    description?: string | null
                    emoji: string
                    emotion: 'positive' | 'neutral' | 'negative'
                    spheres: string[]
                    date: string
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    user_id?: string
                    title?: string
                    description?: string | null
                    emoji?: string
                    emotion?: 'positive' | 'neutral' | 'negative'
                    spheres?: string[]
                    date?: string
                    created_at?: string
                    updated_at?: string
                }
            }
            user_settings: {
                Row: {
                    id: string
                    user_id: string
                    notifications_enabled: boolean
                    weekly_reports: boolean
                    theme: 'light' | 'dark' | 'auto'
                    language: 'ru' | 'en'
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    user_id: string
                    notifications_enabled?: boolean
                    weekly_reports?: boolean
                    theme?: 'light' | 'dark' | 'auto'
                    language?: 'ru' | 'en'
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    user_id?: string
                    notifications_enabled?: boolean
                    weekly_reports?: boolean
                    theme?: 'light' | 'dark' | 'auto'
                    language?: 'ru' | 'en'
                    created_at?: string
                    updated_at?: string
                }
            }
        }
        Views: {
            [_ in never]: never
        }
        Functions: {
            [_ in never]: never
        }
        Enums: {
            [_ in never]: never
        }
    }
}

// Хуки для работы с Supabase
export const useSupabase = () => {
    return { supabase }
}

// Утилиты для работы с данными
export const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('ru-RU', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    })
}

export const formatDateTime = (date: string) => {
    return new Date(date).toLocaleString('ru-RU', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    })
}

// Константы для приложения
export const DEFAULT_SPHERES = [
    {
        name: 'Здоровье',
        color: '#10B981',
        icon: '🏥',
        score: 5
    },
    {
        name: 'Карьера',
        color: '#3B82F6',
        icon: '💼',
        score: 5
    },
    {
        name: 'Отношения',
        color: '#F59E0B',
        icon: '❤️',
        score: 5
    },
    {
        name: 'Финансы',
        color: '#8B5CF6',
        icon: '💰',
        score: 5
    },
    {
        name: 'Саморазвитие',
        color: '#06B6D4',
        icon: '📚',
        score: 5
    },
    {
        name: 'Духовность',
        color: '#EC4899',
        icon: '🧘',
        score: 5
    },
    {
        name: 'Отдых',
        color: '#F97316',
        icon: '🏖️',
        score: 5
    },
    {
        name: 'Окружение',
        color: '#84CC16',
        icon: '👥',
        score: 5
    }
]

export const EMOJI_OPTIONS = [
    '😊', '😄', '😍', '🥰', '😎', '🤩', '😌', '😇',
    '😢', '😭', '😤', '😡', '😠', '😞', '😔', '😟',
    '😐', '😑', '😶', '🤔', '😕', '🙁', '☹️', '😣',
    '🎉', '🎊', '🎈', '🎁', '🎯', '🏆', '💪', '🔥',
    '💔', '💀', '👻', '🤖', '👾', '🎮', '🎲', '🎸',
    '🏃', '🚴', '🏊', '🏋️', '🧘', '🎨', '📚', '✍️',
    '💼', '💰', '💳', '🏠', '🚗', '✈️', '🌍', '🌙',
    '☀️', '🌺', '🌸', '🌻', '🌹', '🍀', '🌳', '🌴'
]

export const EMOTION_OPTIONS = [
    { value: 'positive', label: 'Позитивное', color: '#10B981' },
    { value: 'neutral', label: 'Нейтральное', color: '#6B7280' },
    { value: 'negative', label: 'Негативное', color: '#EF4444' }
] 