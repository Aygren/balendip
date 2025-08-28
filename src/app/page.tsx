'use client'

import React, { useState, Suspense, lazy, useEffect, useCallback } from 'react'
import Layout from '@/components/layout/Layout'
import ProtectedRoute from '@/components/auth/ProtectedRoute'
import WelcomeOnboarding from '@/components/onboarding/WelcomeOnboarding'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import FabButton from '@/components/ui/FabButton'
import Toast from '@/components/ui/Toast'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { Plus, TrendingUp, Calendar, Settings, Loader2 } from 'lucide-react'
import { LifeSphere, Event } from '@/types'
import { useSpheres } from '@/hooks/useSpheres'
import { useCreateEvent } from '@/hooks/useEvents'
import { checkAndInitializeSpheres } from '@/utils/initSpheres'

// Lazy loading для тяжелых компонентов
const WheelChart = lazy(() => import('@/components/charts/WheelChart'))
const SphereEditor = lazy(() => import('@/components/charts/SphereEditor'))
const AddEventForm = lazy(() => import('@/components/forms/AddEventForm'))

// Loading компонент для Suspense
const LoadingSpinner = () => (
  <div className="flex items-center justify-center p-8">
    <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
  </div>
)

export default function HomePage() {
  const { user, isLoading, isAuthenticated } = useAuth()
  const router = useRouter()
  const [showWheel, setShowWheel] = useState(true)
  const [showEditor, setShowEditor] = useState(false)
  const [showAddEventForm, setShowAddEventForm] = useState(false)
  const [showOnboarding, setShowOnboarding] = useState(false)
  const [toast, setToast] = useState<{
    message: string
    type: 'success' | 'error' | 'info'
    isVisible: boolean
  }>({
    message: '',
    type: 'info',
    isVisible: false,
  })

  // Используем React Query для получения сфер жизни
  const {
    data: spheres = [],
    isLoading: spheresLoading,
    error: spheresError
  } = useSpheres()

  // Хук для создания событий
  const createEventMutation = useCreateEvent()

  // Проверяем, нужно ли показать onboarding
  useEffect(() => {
    if (isAuthenticated && user && spheres.length === 0) {
      setShowOnboarding(true)
    }
  }, [isAuthenticated, user, spheres.length])

  // Инициализация начальных сфер жизни при загрузке
  useEffect(() => {
    if (user) {
      checkAndInitializeSpheres()
    }
  }, [user])

  const mockUser = {
    name: user?.name || 'Пользователь',
    avatar: user?.avatar_url
  }

  const averageScore = spheres.length > 0
    ? Math.round(spheres.reduce((sum: number, sphere: LifeSphere) => sum + sphere.score, 0) / spheres.length)
    : 0

  const handleSphereClick = useCallback((sphere: LifeSphere) => {
    console.log('Clicked sphere:', sphere.name)
  }, [])

  const handleAddEvent = useCallback(() => {
    setShowAddEventForm(true)
  }, [])

  const handleSubmitEvent = useCallback(async (eventData: Omit<Event, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      await createEventMutation.mutateAsync(eventData)
      setShowAddEventForm(false)
      setToast({
        message: 'Событие успешно добавлено!',
        type: 'success',
        isVisible: true,
      })
    } catch (error) {
      console.error('Error adding event:', error)
      setToast({
        message: 'Ошибка при добавлении события',
        type: 'error',
        isVisible: true,
      })
    }
  }, [createEventMutation])

  const handleNavigateToEvents = useCallback(() => {
    router.push('/events')
  }, [router])

  const handleNavigateToAnalytics = useCallback(() => {
    router.push('/analytics')
  }, [router])

  const handleCloseToast = useCallback(() => {
    setToast(prev => ({ ...prev, isVisible: false }))
  }, [])

  const handleCloseAddEventForm = useCallback(() => {
    setShowAddEventForm(false)
  }, [])

  const handleOnboardingComplete = useCallback(() => {
    setShowOnboarding(false)
    window.location.reload()
  }, [])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
          <p className="text-secondary-600">Загрузка...</p>
        </div>
      </div>
    )
  }

  // Для неавторизованных проверяем, нужно ли показать онбординг
  if (!isAuthenticated) {
    const hasCompletedOnboarding = localStorage.getItem('onboardingComplete')

    if (!hasCompletedOnboarding) {
      return <WelcomeOnboarding onComplete={() => router.push('/onboarding/spheres')} />
    } else {
      // Если онбординг уже завершен, перенаправляем на регистрацию
      router.push('/auth/register')
      return null
    }
  }

  if (showOnboarding) {
    return <WelcomeOnboarding onComplete={handleOnboardingComplete} />
  }

  if (spheresError) {
    return (
      <Layout title="Главная" user={mockUser}>
        <div className="p-4">
          <Card>
            <div className="text-center text-red-500 p-8">
              <h3 className="text-lg font-semibold mb-2">Ошибка загрузки данных</h3>
              <p>Не удалось загрузить сферы жизни. Попробуйте обновить страницу.</p>
              <Button
                variant="primary"
                onClick={() => window.location.reload()}
                className="mt-4"
              >
                Обновить страницу
              </Button>
            </div>
          </Card>
        </div>
      </Layout>
    )
  }

  return (
    <Layout title="Главная" user={mockUser}>
      <div className="p-4 space-y-6">
        <Card>
          <div className="text-center">
            <h2 className="text-xl font-semibold text-secondary-900 mb-2">
              Добро пожаловать, {mockUser.name}! 👋
            </h2>
            <p className="text-secondary-600">Ваш текущий баланс жизни</p>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-secondary-900">Колесо жизни</h3>
            <div className="flex space-x-2">
              <Button
                variant={showWheel ? 'primary' : 'secondary'}
                size="sm"
                onClick={() => {
                  setShowWheel(true)
                  setShowEditor(false)
                }}
              >
                Просмотр
              </Button>
              <Button
                variant={showEditor ? 'primary' : 'secondary'}
                size="sm"
                onClick={() => {
                  setShowEditor(true)
                  setShowWheel(false)
                }}
              >
                Редактировать
              </Button>
            </div>
          </div>

          <div className="flex gap-6">
            <div className="flex-1">
              {spheresLoading ? (
                <LoadingSpinner />
              ) : (
                <Suspense fallback={<LoadingSpinner />}>
                  {showWheel && (
                    <WheelChart spheres={spheres} onSphereClick={handleSphereClick} className="w-full h-64" />
                  )}
                  {showEditor && (
                    <SphereEditor spheres={spheres} onSpheresChange={() => { }} className="w-full" />
                  )}
                </Suspense>
              )}
            </div>

            <div className="flex flex-col space-y-3 min-w-[120px]">
              <Button variant="secondary" onClick={handleNavigateToEvents} className="flex items-center justify-center space-x-2 h-12">
                <Calendar className="w-4 h-4" />
                <span>События</span>
              </Button>
              <Button variant="secondary" onClick={handleNavigateToAnalytics} className="flex items-center justify-center space-x-2 h-12">
                <TrendingUp className="w-4 h-4" />
                <span>Аналитика</span>
              </Button>
            </div>
          </div>
        </Card>

        <FabButton onClick={handleAddEvent} className="fixed bottom-6 right-6" />

        {showAddEventForm && (
          <Suspense fallback={<LoadingSpinner />}>
            <AddEventForm onSubmit={handleSubmitEvent} onClose={handleCloseAddEventForm} loading={createEventMutation.isPending} isOpen={showAddEventForm} spheres={spheres} />
          </Suspense>
        )}

        <Toast message={toast.message} type={toast.type} isVisible={toast.isVisible} onClose={handleCloseToast} />
      </div>
    </Layout>
  )
}
