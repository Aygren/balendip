import { supabase } from './supabase'
import { Event, LifeSphere, EventFilters, AddEventForm } from '@/types'

// ===== КЛЮЧИ ДЛЯ КЕШИРОВАНИЯ =====
export const queryKeys = {
    events: {
        all: ['events'] as const,
        lists: () => [...queryKeys.events.all, 'list'] as const,
        list: (filters: string) => [...queryKeys.events.lists(), { filters }] as const,
        details: () => [...queryKeys.events.all, 'detail'] as const,
        detail: (id: string) => [...queryKeys.events.details(), id] as const,
    },
    spheres: {
        all: ['spheres'] as const,
        lists: () => [...queryKeys.spheres.all, 'list'] as const,
        list: (filters: string) => [...queryKeys.spheres.lists(), { filters }] as const,
        details: () => [...queryKeys.spheres.all, 'detail'] as const,
        detail: (id: string) => [...queryKeys.spheres.details(), id] as const,
    },
} as const

// ===== API ФУНКЦИИ ДЛЯ СОБЫТИЙ =====
export const eventsApi = {
    // Получение всех событий
    async getAll(filters?: EventFilters): Promise<Event[]> {
        let query = supabase
            .from('events')
            .select('*')
            .order('created_at', { ascending: false })

        if (filters?.search) {
            query = query.or(`title.ilike.%${filters.search}%,description.ilike.%${filters.search}%`)
        }

        if (filters?.date_from) {
            query = query.gte('date', filters.date_from)
        }

        if (filters?.date_to) {
            query = query.lte('date', filters.date_to)
        }

        if (filters?.emotion) {
            query = query.eq('emotion', filters.emotion)
        }

        if (filters?.spheres && filters.spheres.length > 0) {
            query = query.overlaps('spheres', filters.spheres)
        }

        const { data, error } = await query

        if (error) {
            throw new Error(`Ошибка загрузки событий: ${error.message}`)
        }

        return data || []
    },

    // Получение события по ID
    async getById(id: string): Promise<Event> {
        const { data, error } = await supabase
            .from('events')
            .select('*')
            .eq('id', id)
            .single()

        if (error) {
            throw new Error(`Ошибка загрузки события: ${error.message}`)
        }

        return data
    },

    // Создание события
    async create(eventData: AddEventForm): Promise<Event> {
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            throw new Error('Пользователь не авторизован')
        }

        const { data, error } = await supabase
            .from('events')
            .insert([{
                ...eventData,
                user_id: user.id,
            }])
            .select()
            .single()

        if (error) {
            throw new Error(`Ошибка создания события: ${error.message}`)
        }

        return data
    },

    // Обновление события
    async update(id: string, updates: Partial<Event>): Promise<Event> {
        const { data, error } = await supabase
            .from('events')
            .update(updates)
            .eq('id', id)
            .select()
            .single()

        if (error) {
            throw new Error(`Ошибка обновления события: ${error.message}`)
        }

        return data
    },

    // Удаление события
    async delete(id: string): Promise<void> {
        const { error } = await supabase
            .from('events')
            .delete()
            .eq('id', id)

        if (error) {
            throw new Error(`Ошибка удаления события: ${error.message}`)
        }
    },

    // Пагинированное получение событий
    async getPaginated(
        page: number = 1,
        limit: number = 20,
        filters?: EventFilters
    ): Promise<{ data: Event[]; count: number; totalPages: number }> {
        let query = supabase
            .from('events')
            .select('*', { count: 'exact' })
            .order('created_at', { ascending: false })

        if (filters?.search) {
            query = query.or(`title.ilike.%${filters.search}%,description.ilike.%${filters.search}%`)
        }

        if (filters?.date_from) {
            query = query.gte('date', filters.date_from)
        }

        if (filters?.date_to) {
            query = query.lte('date', filters.date_to)
        }

        if (filters?.emotion) {
            query = query.eq('emotion', filters.emotion)
        }

        if (filters?.spheres && filters.spheres.length > 0) {
            query = query.overlaps('spheres', filters.spheres)
        }

        const offset = (page - 1) * limit
        query = query.range(offset, offset + limit - 1)

        const { data, error, count } = await query

        if (error) {
            throw new Error(`Ошибка загрузки событий: ${error.message}`)
        }

        const totalPages = Math.ceil((count || 0) / limit)

        return {
            data: data || [],
            count: count || 0,
            totalPages,
        }
    },
}

// ===== API ФУНКЦИИ ДЛЯ СФЕР ЖИЗНИ =====
export const spheresApi = {
    // Получение всех сфер жизни
    async getAll(): Promise<LifeSphere[]> {
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            throw new Error('Пользователь не авторизован')
        }

        const { data, error } = await supabase
            .from('life_spheres')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: true })

        if (error) {
            throw new Error(`Ошибка загрузки сфер жизни: ${error.message}`)
        }

        return data || []
    },

    // Получение сферы по ID
    async getById(id: string): Promise<LifeSphere> {
        const { data, error } = await supabase
            .from('life_spheres')
            .select('*')
            .eq('id', id)
            .single()

        if (error) {
            throw new Error(`Ошибка загрузки сферы жизни: ${error.message}`)
        }

        return data
    },

    // Создание сферы жизни
    async create(sphereData: Omit<LifeSphere, 'id' | 'created_at' | 'updated_at'>): Promise<LifeSphere> {
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            throw new Error('Пользователь не авторизован')
        }

        const { data, error } = await supabase
            .from('life_spheres')
            .insert([{
                ...sphereData,
                user_id: user.id,
            }])
            .select()
            .single()

        if (error) {
            throw new Error(`Ошибка создания сферы жизни: ${error.message}`)
        }

        return data
    },

    // Обновление сферы жизни
    async update(id: string, updates: Partial<LifeSphere>): Promise<LifeSphere> {
        const { data, error } = await supabase
            .from('life_spheres')
            .update(updates)
            .eq('id', id)
            .select()
            .single()

        if (error) {
            throw new Error(`Ошибка обновления сферы жизни: ${error.message}`)
        }

        return data
    },

    // Удаление сферы жизни
    async delete(id: string): Promise<void> {
        const { error } = await supabase
            .from('life_spheres')
            .delete()
            .eq('id', id)

        if (error) {
            throw new Error(`Ошибка удаления сферы жизни: ${error.message}`)
        }
    },

    // Инициализация начальных сфер
    async initializeDefaultSpheres(): Promise<LifeSphere[]> {
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            throw new Error('Пользователь не авторизован')
        }

        // Проверяем, есть ли уже сферы у пользователя
        const { data: existingSpheres } = await supabase
            .from('life_spheres')
            .select('id')
            .eq('user_id', user.id)
            .limit(1)

        if (existingSpheres && existingSpheres.length > 0) {
            return this.getAll()
        }

        // Создаем начальные сферы
        const { DEFAULT_SPHERES } = await import('@/types')
        const spheresToInsert = DEFAULT_SPHERES.map(sphere => ({
            ...sphere,
            user_id: user.id,
            is_default: true,
        }))

        const { data, error } = await supabase
            .from('life_spheres')
            .insert(spheresToInsert)
            .select()

        if (error) {
            throw new Error(`Ошибка создания начальных сфер: ${error.message}`)
        }

        return data || []
    },
}

// ===== УТИЛИТЫ =====
export const formatDate = (date: string): string => {
    return new Date(date).toLocaleDateString('ru-RU', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    })
}

export const formatDateTime = (date: string): string => {
    return new Date(date).toLocaleString('ru-RU', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    })
}

export const getEmotionColor = (emotion: string): string => {
    const colors = {
        positive: '#10B981',
        neutral: '#6B7280',
        negative: '#EF4444',
    }
    return colors[emotion as keyof typeof colors] || '#6B7280'
}

export const getEmotionIcon = (emotion: string): string => {
    const icons = {
        positive: '😊',
        neutral: '😐',
        negative: '😔',
    }
    return icons[emotion as keyof typeof icons] || '😐'
}
