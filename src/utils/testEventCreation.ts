import { supabase } from '@/lib/supabase'
import { Event } from '@/types'

export const testEventCreation = async () => {
    try {
        // Получаем текущего пользователя
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            console.error('Пользователь не авторизован')
            return false
        }

        // Тестовое событие
        const testEvent = {
            user_id: user.id,
            title: 'Тестовое событие',
            description: 'Это тестовое событие для проверки интеграции',
            emoji: '🧪',
            emotion: 'positive' as const,
            spheres: ['1'], // ID сферы жизни
            date: new Date().toISOString().split('T')[0],
        }

        // Создаем событие
        const { data, error } = await supabase
            .from('events')
            .insert([testEvent])
            .select()
            .single()

        if (error) {
            console.error('Ошибка создания тестового события:', error)
            return false
        }

        console.log('Тестовое событие создано успешно:', data)

        // Удаляем тестовое событие
        await supabase
            .from('events')
            .delete()
            .eq('id', data.id)

        console.log('Тестовое событие удалено')
        return true
    } catch (error) {
        console.error('Ошибка тестирования:', error)
        return false
    }
}
