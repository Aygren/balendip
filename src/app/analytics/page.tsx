'use client'

import React, { useState, useMemo, Suspense, lazy } from 'react'
import Layout from '@/components/layout/Layout'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import { TrendingUp, Calendar, BarChart3, PieChart, Activity, Loader2 } from 'lucide-react'
import { Event, LifeSphere } from '@/types'
import { useEvents } from '@/hooks/useEvents'
import { useSpheres } from '@/hooks/useSpheres'
import { D3LineChart } from '@/components/charts/D3LineChart'
import { D3PieChart } from '@/components/charts/D3PieChart'
import { D3BarChart } from '@/components/charts/D3BarChart'

// Lazy loading для тяжелых компонентов графиков
const WheelChart = lazy(() => import('@/components/charts/WheelChart'))

// Loading компонент для Suspense
const LoadingSpinner = () => (
  <div className="flex items-center justify-center p-8">
    <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
  </div>
)

export default function AnalyticsPage() {
  const [selectedPeriod, setSelectedPeriod] = useState('week')
  const [selectedView, setSelectedView] = useState('overview')

  // Используем React Query хуки для загрузки данных
  const { data: events = [], isLoading: eventsLoading, error: eventsError } = useEvents()
  const { data: spheres = [], isLoading: spheresLoading, error: spheresError } = useSpheres()

  const periodOptions = [
    { value: 'week', label: 'Неделя' },
    { value: 'month', label: 'Месяц' },
    { value: 'quarter', label: 'Квартал' },
    { value: 'year', label: 'Год' },
  ]

  const viewOptions = [
    { value: 'overview', label: 'Обзор', icon: Activity },
    { value: 'emotions', label: 'Эмоции', icon: PieChart },
    { value: 'spheres', label: 'Сферы', icon: BarChart3 },
    { value: 'trends', label: 'Тренды', icon: TrendingUp },
  ]

  // Статистика по эмоциям
  const emotionStats = useMemo(() => {
    const stats = {
      positive: 0,
      neutral: 0,
      negative: 0,
    }

    events.forEach((event: Event) => {
      stats[event.emotion as keyof typeof stats]++
    })

    return stats
  }, [events])

  // Статистика по сферам
  const sphereStats = useMemo(() => {
    const stats: Record<string, number> = {}

    events.forEach((event: Event) => {
      event.spheres.forEach((sphereId: string) => {
        stats[sphereId] = (stats[sphereId] || 0) + 1
      })
    })

    return stats
  }, [events])

  // Тренды по дням
  const dailyTrends = useMemo(() => {
    const trends: Record<string, { positive: number; neutral: number; negative: number }> = {}

    events.forEach((event: Event) => {
      if (!trends[event.date]) {
        trends[event.date] = { positive: 0, neutral: 0, negative: 0 }
      }
      const emotion = event.emotion as 'positive' | 'neutral' | 'negative'
      trends[event.date][emotion]++
    })

    return Object.entries(trends)
      .sort(([a], [b]) => new Date(a).getTime() - new Date(b).getTime())
      .slice(-7) // Последние 7 дней
  }, [events])

  // Данные для D3 графиков
  const emotionChartData = useMemo(() => [
    { label: 'Позитивные', value: emotionStats.positive, color: '#10B981' },
    { label: 'Нейтральные', value: emotionStats.neutral, color: '#6B7280' },
    { label: 'Негативные', value: emotionStats.negative, color: '#EF4444' },
  ], [emotionStats])

  const sphereChartData = useMemo(() => {
    return Object.entries(sphereStats)
      .map(([sphereId, count]) => ({
        label: getSphereName(sphereId),
        value: count,
        color: getSphereColor(sphereId)
      }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 8) // Топ 8 сфер
  }, [sphereStats])

  const trendChartData = useMemo(() => {
    return dailyTrends.map(([date, trends]) => ({
      date,
      value: trends.positive - trends.negative // Чистый настрой
    }))
  }, [dailyTrends])

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'short',
    })
  }

  const getSphereName = (sphereId: string) => {
    const sphere = spheres.find((s: LifeSphere) => s.id === sphereId)
    return sphere?.name || 'Неизвестно'
  }

  const getSphereColor = (sphereId: string) => {
    const sphere = spheres.find((s: LifeSphere) => s.id === sphereId)
    return sphere?.color || '#6B7280'
  }

  const getEmotionColor = (emotion: string) => {
    const colors = {
      positive: '#10B981',
      neutral: '#6B7280',
      negative: '#EF4444',
    }
    return colors[emotion as keyof typeof colors] || '#6B7280'
  }

  // Общая статистика
  const totalEvents = events.length
  const averageEmotion = useMemo(() => {
    if (totalEvents === 0) return 0
    const emotionScores = { positive: 1, neutral: 0, negative: -1 }
    const totalScore = events.reduce((sum: number, event: Event) => {
      return sum + (emotionScores[event.emotion as keyof typeof emotionScores] || 0)
    }, 0)
    return Math.round((totalScore / totalEvents + 1) * 50) // 0-100 шкала
  }, [events, totalEvents])

  // Loading состояние
  if (eventsLoading || spheresLoading) {
    return (
      <Layout title="Аналитика">
        <div className="flex items-center justify-center min-h-screen">
          <LoadingSpinner />
        </div>
      </Layout>
    )
  }

  // Error состояние
  if (eventsError || spheresError) {
    return (
      <Layout title="Аналитика">
        <div className="p-4">
          <Card>
            <div className="text-center text-error-600">
              <p>Ошибка загрузки данных</p>
              <p className="text-sm mt-2">{(eventsError || spheresError)?.toString() || 'Неизвестная ошибка'}</p>
            </div>
          </Card>
        </div>
      </Layout>
    )
  }

  return (
    <Layout title="Аналитика">
      <div className="p-4 space-y-6">
        {/* Фильтры */}
        <Card>
          <div className="flex flex-wrap gap-4">
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-1">
                Период
              </label>
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="border border-secondary-300 rounded-lg px-3 py-2 text-sm"
              >
                {periodOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-1">
                Вид
              </label>
              <select
                value={selectedView}
                onChange={(e) => setSelectedView(e.target.value)}
                className="border border-secondary-300 rounded-lg px-3 py-2 text-sm"
              >
                {viewOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </Card>

        {/* Общая статистика */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary-600">{totalEvents}</div>
              <p className="text-sm text-secondary-600">Всего событий</p>
            </div>
          </Card>
          <Card>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary-600">{averageEmotion}%</div>
              <p className="text-sm text-secondary-600">Средний настрой</p>
            </div>
          </Card>
          <Card>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary-600">{spheres.length}</div>
              <p className="text-sm text-secondary-600">Активных сфер</p>
            </div>
          </Card>
        </div>

        {/* Колесо жизни с lazy loading */}
        <Card>
          <h3 className="text-lg font-semibold text-secondary-900 mb-4">
            Текущий баланс
          </h3>
          <Suspense fallback={<LoadingSpinner />}>
            <WheelChart
              spheres={spheres}
              className="w-full h-64"
            />
          </Suspense>
        </Card>

        {/* Статистика по эмоциям */}
        <Card>
          <h3 className="text-lg font-semibold text-secondary-900 mb-4">
            Статистика по эмоциям
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <D3PieChart
                data={emotionChartData}
                width={300}
                height={300}
                onSliceClick={(data) => console.log('Clicked emotion:', data)}
              />
            </div>
            <div className="flex flex-col justify-center">
              {Object.entries(emotionStats).map(([emotion, count]) => (
                <div key={emotion} className="flex items-center space-x-3 mb-3">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm"
                    style={{ backgroundColor: getEmotionColor(emotion) }}
                  >
                    {emotion === 'positive' && '😊'}
                    {emotion === 'neutral' && '😐'}
                    {emotion === 'negative' && '😢'}
                  </div>
                  <div className="flex-1">
                    <div className="text-lg font-bold text-secondary-900">{count}</div>
                    <p className="text-sm text-secondary-600 capitalize">
                      {emotion === 'positive' && 'Позитивные'}
                      {emotion === 'neutral' && 'Нейтральные'}
                      {emotion === 'negative' && 'Негативные'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* Статистика по сферам */}
        <Card>
          <h3 className="text-lg font-semibold text-secondary-900 mb-4">
            События по сферам
          </h3>
          <D3BarChart
            data={sphereChartData}
            width={600}
            height={300}
            onBarClick={(data) => console.log('Clicked sphere:', data)}
          />
        </Card>

        {/* Тренды по дням */}
        <Card>
          <h3 className="text-lg font-semibold text-secondary-900 mb-4">
            Тренды за неделю
          </h3>
          <D3LineChart
            data={trendChartData}
            width={600}
            height={300}
          />
        </Card>
      </div>
    </Layout>
  )
} 