'use client'

import React from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

interface QueryProviderProps {
  children: React.ReactNode
}

// Создаем QueryClient с настройками
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Время жизни кеша (5 минут)
      staleTime: 5 * 60 * 1000,
      // Время кеширования (10 минут)
      gcTime: 10 * 60 * 1000,
      // Количество повторных попыток при ошибке
      retry: 3,
      // Интервал между повторными попытками
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      // Рефетч при фокусе окна
      refetchOnWindowFocus: false,
      // Рефетч при переподключении
      refetchOnReconnect: true,
      // Рефетч при монтировании
      refetchOnMount: true,
    },
    mutations: {
      // Количество повторных попыток для мутаций
      retry: 1,
      // Интервал между повторными попытками для мутаций
      retryDelay: 1000,
    },
  },
})

export const QueryProvider: React.FC<QueryProviderProps> = ({ children }) => {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {/* DevTools только в режиме разработки */}
      {process.env.NODE_ENV === 'development' && (
        <ReactQueryDevtools initialIsOpen={false} />
      )}
    </QueryClientProvider>
  )
}
