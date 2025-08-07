'use client'

import { useState, useCallback } from 'react'
import { useInfiniteQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { Event } from '@/types'

interface EventsFilters {
  search?: string
  date?: string
  emotion?: string
  spheres?: string[]
}

interface EventsResponse {
  data: Event[]
  hasMore: boolean
  nextCursor?: string
}

const ITEMS_PER_PAGE = 20

const fetchEventsPage = async (
  pageParam: string | undefined,
  filters: EventsFilters
): Promise<EventsResponse> => {
  let query = supabase
    .from('events')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(ITEMS_PER_PAGE)

  // Применяем фильтры
  if (filters.search) {
    query = query.or(`title.ilike.%${filters.search}%,description.ilike.%${filters.search}%`)
  }

  if (filters.date) {
    query = query.eq('date', filters.date)
  }

  if (filters.emotion) {
    query = query.eq('emotion', filters.emotion)
  }

  if (filters.spheres && filters.spheres.length > 0) {
    query = query.overlaps('spheres', filters.spheres)
  }

  // Пагинация
  if (pageParam) {
    query = query.lt('created_at', pageParam)
  }

  const { data, error } = await query

  if (error) {
    throw new Error(`Ошибка загрузки событий: ${error.message}`)
  }

  const events = data || []
  const hasMore = events.length === ITEMS_PER_PAGE
  const nextCursor = hasMore ? events[events.length - 1].created_at : undefined

  return {
    data: events,
    hasMore,
    nextCursor,
  }
}

export const useEventsPagination = (filters: EventsFilters = {}) => {
  const [isLoadingMore, setIsLoadingMore] = useState(false)

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    error,
    refetch,
  } = useInfiniteQuery({
    queryKey: ['events', 'pagination', filters],
    queryFn: ({ pageParam }) => fetchEventsPage(pageParam, filters),
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    initialPageParam: undefined as string | undefined,
    staleTime: 2 * 60 * 1000, // 2 минуты
    gcTime: 5 * 60 * 1000, // 5 минут
  })

  const events = data?.pages.flatMap(page => page.data) || []
  const hasMore = hasNextPage || false

  const loadMore = useCallback(async () => {
    if (isLoadingMore || !hasMore) return

    setIsLoadingMore(true)
    try {
      await fetchNextPage()
    } finally {
      setIsLoadingMore(false)
    }
  }, [fetchNextPage, hasMore, isLoadingMore])

  const refresh = useCallback(async () => {
    await refetch()
  }, [refetch])

  return {
    events,
    hasMore,
    isLoading,
    isLoadingMore: isLoadingMore || isFetchingNextPage,
    error,
    loadMore,
    refresh,
  }
}
