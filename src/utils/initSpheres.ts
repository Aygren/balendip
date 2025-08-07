import { supabase } from '@/lib/supabase'
import { LifeSphere } from '@/types'

const defaultSpheres: Omit<LifeSphere, 'id' | 'created_at' | 'updated_at'>[] = [
    {
        user_id: '', // Будет установлен при создании
        name: 'Здоровье',
        color: '#10B981',
        icon: 'heart',
        score: 5,
        is_default: true,
    },
    {
        user_id: '',
        name: 'Карьера',
        color: '#3B82F6',
        icon: 'briefcase',
        score: 5,
        is_default: true,
    },
    {
        user_id: '',
        name: 'Отношения',
        color: '#F59E0B',
        icon: 'users',
        score: 5,
        is_default: true,
    },
    {
        user_id: '',
        name: 'Финансы',
        color: '#8B5CF6',
        icon: 'credit-card',
        score: 5,
        is_default: true,
    },
    {
        user_id: '',
        name: 'Саморазвитие',
        color: '#06B6D4',
        icon: 'book-open',
        score: 5,
        is_default: true,
    },
    {
        user_id: '',
        name: 'Духовность',
        color: '#EC4899',
        icon: 'star',
        score: 5,
        is_default: true,
    },
    {
        user_id: '',
        name: 'Отдых',
        color: '#F97316',
        icon: 'coffee',
        score: 5,
        is_default: true,
    },
    {
        user_id: '',
        name: 'Окружение',
        color: '#84CC16',
        icon: 'home',
        score: 5,
        is_default: true,
    },
]

export const initializeDefaultSpheres = async (userId: string) => {
    try {
        // Проверяем, есть ли уже сферы у пользователя
        const { data: existingSpheres, error: checkError } = await supabase
            .from('life_spheres')
            .select('id')
            .eq('user_id', userId)
            .limit(1)

        if (checkError) {
            console.error('Ошибка проверки существующих сфер:', checkError)
            return
        }

        // Если сферы уже есть, не создаем новые
        if (existingSpheres && existingSpheres.length > 0) {
            console.log('Сферы жизни уже существуют для пользователя')
            return
        }

        // Создаем начальные сферы
        const spheresWithUserId = defaultSpheres.map(sphere => ({
            ...sphere,
            user_id: userId,
        }))

        const { data, error } = await supabase
            .from('life_spheres')
            .insert(spheresWithUserId)
            .select()

        if (error) {
            console.error('Ошибка создания начальных сфер:', error)
            throw error
        }

        console.log('Начальные сферы жизни созданы:', data)
        return data
    } catch (error) {
        console.error('Ошибка инициализации сфер жизни:', error)
        throw error
    }
}

export const checkAndInitializeSpheres = async () => {
    try {
        const { data: { user } } = await supabase.auth.getUser()

        if (user) {
            await initializeDefaultSpheres(user.id)
        }
    } catch (error) {
        console.error('Ошибка проверки и инициализации сфер:', error)
    }
}
