'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { LifeSphere } from '@/types'

// Ключи для кеширования
export const sphereKeys = {
  all: ['spheres'] as const,
  lists: () => [...sphereKeys.all, 'list'] as const,
  list: (filters: string) => [...sphereKeys.lists(), { filters }] as const,
  details: () => [...sphereKeys.all, 'detail'] as const,
  detail: (id: string) => [...sphereKeys.details(), id] as const,
}

import { mockSpheres } from '@/utils/mockData'

// Функции для работы с API
const fetchSpheres = async (): Promise<LifeSphere[]> => {
  // Используем мок-данные вместо Supabase
  return mockSpheres
}

const fetchSphere = async (id: string): Promise<LifeSphere> => {
  const { data, error } = await supabase
    .from('life_spheres')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    throw new Error(`Ошибка загрузки сферы жизни: ${error.message}`)
  }

  return data
}

const createSphere = async (sphere: Omit<LifeSphere, 'id' | 'created_at' | 'updated_at'>): Promise<LifeSphere> => {
  const { data, error } = await supabase
    .from('life_spheres')
    .insert([sphere])
    .select()
    .single()

  if (error) {
    throw new Error(`Ошибка создания сферы жизни: ${error.message}`)
  }

  return data
}

const updateSphere = async ({ id, ...sphere }: Partial<LifeSphere> & { id: string }): Promise<LifeSphere> => {
  const { data, error } = await supabase
    .from('life_spheres')
    .update(sphere)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    throw new Error(`Ошибка обновления сферы жизни: ${error.message}`)
  }

  return data
}

const deleteSphere = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('life_spheres')
    .delete()
    .eq('id', id)

  if (error) {
    throw new Error(`Ошибка удаления сферы жизни: ${error.message}`)
  }
}

// Хук для получения всех сфер жизни
export const useSpheres = () => {
  return useQuery({
    queryKey: sphereKeys.lists(),
    queryFn: fetchSpheres,
    staleTime: 10 * 60 * 1000, // 10 минут (сферы редко изменяются)
    gcTime: 30 * 60 * 1000, // 30 минут
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  })
}

// Хук для получения конкретной сферы жизни
export const useSphere = (id: string) => {
  return useQuery({
    queryKey: sphereKeys.detail(id),
    queryFn: () => fetchSphere(id),
    enabled: !!id,
    staleTime: 15 * 60 * 1000, // 15 минут
    gcTime: 60 * 60 * 1000, // 1 час
  })
}

// Хук для создания сферы жизни
export const useCreateSphere = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createSphere,
    onSuccess: (newSphere) => {
      // Инвалидируем кеш списка сфер
      queryClient.invalidateQueries({ queryKey: sphereKeys.lists() })

      // Добавляем новую сферу в кеш
      queryClient.setQueryData(sphereKeys.detail(newSphere.id), newSphere)
    },
    onError: (error) => {
      console.error('Ошибка создания сферы жизни:', error)
    },
  })
}

// Хук для обновления сферы жизни
export const useUpdateSphere = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: updateSphere,
    onSuccess: (updatedSphere) => {
      // Инвалидируем кеш списка сфер
      queryClient.invalidateQueries({ queryKey: sphereKeys.lists() })

      // Обновляем сферу в кеше
      queryClient.setQueryData(sphereKeys.detail(updatedSphere.id), updatedSphere)
    },
    onError: (error) => {
      console.error('Ошибка обновления сферы жизни:', error)
    },
  })
}

// Хук для удаления сферы жизни
export const useDeleteSphere = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteSphere,
    onSuccess: (_, deletedId) => {
      // Инвалидируем кеш списка сфер
      queryClient.invalidateQueries({ queryKey: sphereKeys.lists() })

      // Удаляем сферу из кеша
      queryClient.removeQueries({ queryKey: sphereKeys.detail(deletedId) })
    },
    onError: (error) => {
      console.error('Ошибка удаления сферы жизни:', error)
    },
  })
}
