import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Event } from '@/types'

export const useEvents = () => {
    const [events, setEvents] = useState<Event[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    // Загрузка всех событий пользователя
    const loadEvents = async () => {
        try {
            setLoading(true)
            setError(null)

            const { data: { user } } = await supabase.auth.getUser()

            if (!user) {
                setError('Пользователь не авторизован')
                setLoading(false)
                return
            }

            const { data, error: fetchError } = await supabase
                .from('events')
                .select('*')
                .eq('user_id', user.id)
                .order('date', { ascending: false })
                .order('created_at', { ascending: false })

            if (fetchError) {
                throw fetchError
            }

            // Преобразуем данные в формат Event
            const formattedEvents: Event[] = (data || []).map(event => ({
                id: event.id,
                user_id: event.user_id,
                title: event.title,
                description: event.description || '',
                date: event.date,
                emotion: event.emotion,
                emoji: event.emoji,
                spheres: event.spheres,
                created_at: event.created_at,
                updated_at: event.updated_at,
            }))

            setEvents(formattedEvents)
        } catch (err) {
            console.error('Ошибка загрузки событий:', err)
            setError(err instanceof Error ? err.message : 'Неизвестная ошибка')
        } finally {
            setLoading(false)
        }
    }

    // Добавление нового события
    const addEvent = async (eventData: Omit<Event, 'id' | 'created_at' | 'updated_at'>) => {
        try {
            const { data: { user } } = await supabase.auth.getUser()

            if (!user) {
                throw new Error('Пользователь не авторизован')
            }

            const { data, error: insertError } = await supabase
                .from('events')
                .insert({
                    user_id: user.id,
                    title: eventData.title,
                    description: eventData.description,
                    emoji: eventData.emoji,
                    emotion: eventData.emotion,
                    spheres: eventData.spheres,
                    date: eventData.date,
                })
                .select()
                .single()

            if (insertError) {
                throw insertError
            }

            // Добавляем новое событие в список
            const newEvent: Event = {
                id: data.id,
                user_id: data.user_id,
                title: data.title,
                description: data.description || '',
                date: data.date,
                emotion: data.emotion,
                emoji: data.emoji,
                spheres: data.spheres,
                created_at: data.created_at,
                updated_at: data.updated_at,
            }

            setEvents(prev => [newEvent, ...prev])
            return newEvent
        } catch (err) {
            console.error('Ошибка добавления события:', err)
            throw err
        }
    }

    // Обновление события
    const updateEvent = async (eventId: string, updates: Partial<Event>) => {
        try {
            const { data, error: updateError } = await supabase
                .from('events')
                .update({
                    title: updates.title,
                    description: updates.description,
                    emoji: updates.emoji,
                    emotion: updates.emotion,
                    spheres: updates.spheres,
                    date: updates.date,
                })
                .eq('id', eventId)
                .select()
                .single()

            if (updateError) {
                throw updateError
            }

            // Обновляем событие в списке
            const updatedEvent: Event = {
                id: data.id,
                user_id: data.user_id,
                title: data.title,
                description: data.description || '',
                date: data.date,
                emotion: data.emotion,
                emoji: data.emoji,
                spheres: data.spheres,
                created_at: data.created_at,
                updated_at: data.updated_at,
            }

            setEvents(prev => prev.map(event =>
                event.id === eventId ? updatedEvent : event
            ))

            return updatedEvent
        } catch (err) {
            console.error('Ошибка обновления события:', err)
            throw err
        }
    }

    // Удаление события
    const deleteEvent = async (eventId: string) => {
        try {
            const { error: deleteError } = await supabase
                .from('events')
                .delete()
                .eq('id', eventId)

            if (deleteError) {
                throw deleteError
            }

            // Удаляем событие из списка
            setEvents(prev => prev.filter(event => event.id !== eventId))
        } catch (err) {
            console.error('Ошибка удаления события:', err)
            throw err
        }
    }

    // Загрузка событий при монтировании компонента
    useEffect(() => {
        loadEvents()
    }, [])

    return {
        events,
        loading,
        error,
        loadEvents,
        addEvent,
        updateEvent,
        deleteEvent,
    }
}
