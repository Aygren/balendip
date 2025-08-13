import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from '@tanstack/react-query'
import { eventsApi, queryKeys } from '@/lib/api'
import { Event, EventFilters, AddEventForm } from '@/types'

// ===== ХУКИ ДЛЯ СОБЫТИЙ =====

// Получение всех событий
export const useEvents = (filters?: EventFilters) => {
    return useQuery({
        queryKey: queryKeys.events.list(JSON.stringify(filters || {})),
        queryFn: () => eventsApi.getAll(filters),
        staleTime: 2 * 60 * 1000, // 2 минуты
        gcTime: 5 * 60 * 1000, // 5 минут
    })
}

// Получение события по ID
export const useEvent = (id: string) => {
    return useQuery({
        queryKey: queryKeys.events.detail(id),
        queryFn: () => eventsApi.getById(id),
        enabled: !!id,
        staleTime: 5 * 60 * 1000, // 5 минут
        gcTime: 10 * 60 * 1000, // 10 минут
    })
}

// Пагинированное получение событий
export const useEventsPaginated = (filters?: EventFilters, page: number = 1, limit: number = 20) => {
    return useQuery({
        queryKey: [...queryKeys.events.list(JSON.stringify(filters || {})), 'paginated', page, limit],
        queryFn: () => eventsApi.getPaginated(page, limit, filters),
        staleTime: 2 * 60 * 1000, // 2 минуты
        gcTime: 5 * 60 * 1000, // 5 минут
    })
}

// Бесконечная прокрутка событий
export const useEventsInfinite = (filters?: EventFilters, limit: number = 20) => {
    return useInfiniteQuery({
        queryKey: [...queryKeys.events.list(JSON.stringify(filters || {})), 'infinite'],
        queryFn: ({ pageParam = 1 }) => eventsApi.getPaginated(pageParam, limit, filters),
        getNextPageParam: (lastPage) => {
            if (lastPage.page < lastPage.totalPages) {
                return lastPage.page + 1
            }
            return undefined
        },
        initialPageParam: 1,
        staleTime: 2 * 60 * 1000, // 2 минуты
        gcTime: 5 * 60 * 1000, // 5 минут
    })
}

// Создание события
export const useCreateEvent = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: eventsApi.create,
        onSuccess: (newEvent) => {
            // Инвалидируем кеш списка событий
            queryClient.invalidateQueries({ queryKey: queryKeys.events.lists() })

            // Добавляем новое событие в кеш
            queryClient.setQueryData(queryKeys.events.detail(newEvent.id), newEvent)
        },
        onError: (error) => {
            console.error('Ошибка создания события:', error)
        },
    })
}

// Обновление события
export const useUpdateEvent = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({ id, ...updates }: { id: string } & Partial<Event>) =>
            eventsApi.update(id, updates),
        onSuccess: (updatedEvent) => {
            // Инвалидируем кеш списка событий
            queryClient.invalidateQueries({ queryKey: queryKeys.events.lists() })

            // Обновляем событие в кеше
            queryClient.setQueryData(queryKeys.events.detail(updatedEvent.id), updatedEvent)
        },
        onError: (error) => {
            console.error('Ошибка обновления события:', error)
        },
    })
}

// Удаление события
export const useDeleteEvent = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: eventsApi.delete,
        onSuccess: (_, deletedId) => {
            // Инвалидируем кеш списка событий
            queryClient.invalidateQueries({ queryKey: queryKeys.events.lists() })

            // Удаляем событие из кеша
            queryClient.removeQueries({ queryKey: queryKeys.events.detail(deletedId) })
        },
        onError: (error) => {
            console.error('Ошибка удаления события:', error)
        },
    })
}

// ===== УТИЛИТЫ ДЛЯ СОБЫТИЙ =====

// Группировка событий по дате
export const useGroupedEvents = (events: Event[]) => {
    const grouped = events.reduce((acc, event) => {
        const date = event.date
        if (!acc[date]) {
            acc[date] = []
        }
        acc[date].push(event)
        return acc
    }, {} as Record<string, Event[]>)

    return Object.entries(grouped)
        .sort(([a], [b]) => new Date(b).getTime() - new Date(a).getTime())
}

// Статистика по эмоциям
export const useEmotionStats = (events: Event[]) => {
    return events.reduce((acc, event) => {
        acc[event.emotion] = (acc[event.emotion] || 0) + 1
        return acc
    }, {} as Record<string, number>)
}

// Статистика по сферам
export const useSphereStats = (events: Event[]) => {
    return events.reduce((acc, event) => {
        event.spheres.forEach(sphereId => {
            acc[sphereId] = (acc[sphereId] || 0) + 1
        })
        return acc
    }, {} as Record<string, number>)
}

// Фильтрация событий
export const useFilteredEvents = (events: Event[], filters: EventFilters) => {
    return events.filter(event => {
        if (filters.search) {
            const searchLower = filters.search.toLowerCase()
            const matchesSearch = event.title.toLowerCase().includes(searchLower) ||
                (event.description && event.description.toLowerCase().includes(searchLower))
            if (!matchesSearch) return false
        }

        if (filters.date_from && new Date(event.date) < new Date(filters.date_from)) {
            return false
        }

        if (filters.date_to && new Date(event.date) > new Date(filters.date_to)) {
            return false
        }

        if (filters.emotion && event.emotion !== filters.emotion) {
            return false
        }

        if (filters.spheres && filters.spheres.length > 0) {
            const hasMatchingSphere = event.spheres.some(sphereId =>
                filters.spheres!.includes(sphereId)
            )
            if (!hasMatchingSphere) return false
        }

        return true
    })
}
