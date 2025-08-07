'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { Event } from '@/types'

// Ключи для кеширования
export const eventKeys = {
  all: ['events'] as const,
  lists: () => [...eventKeys.all, 'list'] as const,
  list: (filters: string) => [...eventKeys.lists(), { filters }] as const,
  details: () => [...eventKeys.all, 'detail'] as const,
  detail: (id: string) => [...eventKeys.details(), id] as const,
}

import { mockEvents } from '@/utils/mockData'

// Функции для работы с API
const fetchEvents = async (): Promise<Event[]> => {
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    throw new Error(`Ошибка загрузки событий: ${error.message}`)
  }

  return data || []
}

const fetchEvent = async (id: string): Promise<Event> => {
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    throw new Error(`Ошибка загрузки события: ${error.message}`)
  }

  return data
}

const createEvent = async (event: Omit<Event, 'id' | 'created_at' | 'updated_at'>): Promise<Event> => {
  // Получаем текущего пользователя
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('Пользователь не авторизован')
  }

  // Добавляем user_id к событию
  const eventWithUserId = {
    ...event,
    user_id: user.id,
  }

  const { data, error } = await supabase
    .from('events')
    .insert([eventWithUserId])
    .select()
    .single()

  if (error) {
    throw new Error(`Ошибка создания события: ${error.message}`)
  }

  return data
}

const updateEvent = async ({ id, ...event }: Partial<Event> & { id: string }): Promise<Event> => {
  const { data, error } = await supabase
    .from('events')
    .update(event)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    throw new Error(`Ошибка обновления события: ${error.message}`)
  }

  return data
}

const deleteEvent = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('events')
    .delete()
    .eq('id', id)

  if (error) {
    throw new Error(`Ошибка удаления события: ${error.message}`)
  }
}

// Хук для получения всех событий
export const useEvents = () => {
  return useQuery({
    queryKey: eventKeys.lists(),
    queryFn: fetchEvents,
    staleTime: 2 * 60 * 1000, // 2 минуты
    gcTime: 5 * 60 * 1000, // 5 минут
  })
}

// Хук для получения конкретного события
export const useEvent = (id: string) => {
  return useQuery({
    queryKey: eventKeys.detail(id),
    queryFn: () => fetchEvent(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 минут
    gcTime: 10 * 60 * 1000, // 10 минут
  })
}

// Хук для создания события
export const useCreateEvent = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createEvent,
    onSuccess: (newEvent) => {
      // Инвалидируем кеш списка событий
      queryClient.invalidateQueries({ queryKey: eventKeys.lists() })

      // Добавляем новое событие в кеш
      queryClient.setQueryData(eventKeys.detail(newEvent.id), newEvent)
    },
    onError: (error) => {
      console.error('Ошибка создания события:', error)
    },
  })
}

// Хук для обновления события
export const useUpdateEvent = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: updateEvent,
    onSuccess: (updatedEvent) => {
      // Инвалидируем кеш списка событий
      queryClient.invalidateQueries({ queryKey: eventKeys.lists() })

      // Обновляем событие в кеше
      queryClient.setQueryData(eventKeys.detail(updatedEvent.id), updatedEvent)
    },
    onError: (error) => {
      console.error('Ошибка обновления события:', error)
    },
  })
}

// Хук для удаления события
export const useDeleteEvent = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteEvent,
    onSuccess: (_, deletedId) => {
      // Инвалидируем кеш списка событий
      queryClient.invalidateQueries({ queryKey: eventKeys.lists() })

      // Удаляем событие из кеша
      queryClient.removeQueries({ queryKey: eventKeys.detail(deletedId) })
    },
    onError: (error) => {
      console.error('Ошибка удаления события:', error)
    },
  })
}
