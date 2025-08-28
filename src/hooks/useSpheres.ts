import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { spheresApi, queryKeys } from '@/lib/api'
import { LifeSphere } from '@/types'

// ===== ХУКИ ДЛЯ СФЕР ЖИЗНИ =====

// Получение всех сфер жизни
export const useSpheres = () => {
    return useQuery({
        queryKey: queryKeys.spheres.lists(),
        queryFn: spheresApi.getAll,
        staleTime: 10 * 60 * 1000, // 10 минут (сферы редко изменяются)
        gcTime: 30 * 60 * 1000, // 30 минут
        retry: (failureCount, error) => {
            // Не повторяем для ошибок аутентификации
            if (error?.message?.includes('auth') || error?.message?.includes('unauthorized')) {
                return false
            }
            return failureCount < 3
        },
        retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
        refetchOnWindowFocus: false, // Не рефетчим при фокусе окна
        refetchOnMount: true, // Рефетчим при монтировании
    })
}

// Получение сферы по ID
export const useSphere = (id: string) => {
    return useQuery({
        queryKey: queryKeys.spheres.detail(id),
        queryFn: () => spheresApi.getById(id),
        enabled: !!id,
        staleTime: 15 * 60 * 1000, // 15 минут
        gcTime: 60 * 60 * 1000, // 1 час
        retry: (failureCount, error) => {
            if (error?.message?.includes('auth') || error?.message?.includes('unauthorized')) {
                return false
            }
            return failureCount < 2
        },
    })
}

// Создание сферы жизни
export const useCreateSphere = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: spheresApi.create,
        onSuccess: (newSphere) => {
            // Инвалидируем кеш списка сфер
            queryClient.invalidateQueries({ queryKey: queryKeys.spheres.lists() })

            // Добавляем новую сферу в кеш
            queryClient.setQueryData(queryKeys.spheres.detail(newSphere.id), newSphere)
        },
        onError: (error) => {
            console.error('Ошибка создания сферы жизни:', error)
        },
    })
}

// Обновление сферы жизни
export const useUpdateSphere = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({ id, ...updates }: { id: string } & Partial<LifeSphere>) =>
            spheresApi.update(id, updates),
        onSuccess: (updatedSphere) => {
            // Инвалидируем кеш списка сфер
            queryClient.invalidateQueries({ queryKey: queryKeys.spheres.lists() })

            // Обновляем сферу в кеше
            queryClient.setQueryData(queryKeys.spheres.detail(updatedSphere.id), updatedSphere)
        },
        onError: (error) => {
            console.error('Ошибка обновления сферы жизни:', error)
        },
    })
}

// Удаление сферы жизни
export const useDeleteSphere = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: spheresApi.delete,
        onSuccess: (_, deletedId) => {
            // Инвалидируем кеш списка сфер
            queryClient.invalidateQueries({ queryKey: queryKeys.spheres.lists() })

            // Удаляем сферу из кеша
            queryClient.removeQueries({ queryKey: queryKeys.spheres.detail(deletedId) })
        },
        onError: (error) => {
            console.error('Ошибка удаления сферы жизни:', error)
        },
    })
}

// Инициализация начальных сфер
export const useInitializeSpheres = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: spheresApi.initializeDefaultSpheres,
        onSuccess: (spheres) => {
            // Инвалидируем кеш списка сфер
            queryClient.invalidateQueries({ queryKey: queryKeys.spheres.lists() })

            // Добавляем новые сферы в кеш
            spheres.forEach(sphere => {
                queryClient.setQueryData(queryKeys.spheres.detail(sphere.id), sphere)
            })
        },
        onError: (error) => {
            console.error('Ошибка инициализации сфер жизни:', error)
        },
    })
}

// ===== УТИЛИТЫ ДЛЯ СФЕР =====

// Получение названия сферы по ID
export const useSphereName = (sphereId: string, spheres: LifeSphere[]): string => {
    const sphere = spheres.find(s => s.id === sphereId)
    return sphere?.name || 'Неизвестно'
}

// Получение цвета сферы по ID
export const useSphereColor = (sphereId: string, spheres: LifeSphere[]): string => {
    const sphere = spheres.find(s => s.id === sphereId)
    return sphere?.color || '#6B7280'
}

// Получение иконки сферы по ID
export const useSphereIcon = (sphereId: string, spheres: LifeSphere[]): string => {
    const sphere = spheres.find(s => s.id === sphereId)
    return sphere?.icon || '❓'
}

// Фильтрация сфер по поиску
export const useFilteredSpheres = (spheres: LifeSphere[], search: string): LifeSphere[] => {
    if (!search.trim()) return spheres

    const searchLower = search.toLowerCase()
    return spheres.filter(sphere =>
        sphere.name.toLowerCase().includes(searchLower) ||
        sphere.icon.includes(searchLower)
    )
}

// Сортировка сфер по различным критериям
export const useSortedSpheres = (
    spheres: LifeSphere[], 
    sortBy: 'name' | 'score' | 'created_at' = 'name'
): LifeSphere[] => {
    return [...spheres].sort((a, b) => {
        switch (sortBy) {
            case 'name':
                return a.name.localeCompare(b.name)
            case 'score':
                return b.score - a.score
            case 'created_at':
                return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
            default:
                return 0
        }
    })
}

// Статистика по сферам
export const useSpheresStats = (spheres: LifeSphere[]) => {
    if (spheres.length === 0) {
        return {
            total: 0,
            averageScore: 0,
            highestScore: 0,
            lowestScore: 0,
            activeSpheres: 0,
        }
    }

    const scores = spheres.map(s => s.score)
    const total = spheres.length
    const averageScore = Math.round(scores.reduce((sum, score) => sum + score, 0) / total)
    const highestScore = Math.max(...scores)
    const lowestScore = Math.min(...scores)
    const activeSpheres = spheres.filter(s => s.score > 5).length

    return {
        total,
        averageScore,
        highestScore,
        lowestScore,
        activeSpheres,
    }
}
