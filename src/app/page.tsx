'use client'

import React, { useState, Suspense, lazy, useEffect } from 'react'
import Layout from '@/components/layout/Layout'
import ProtectedRoute from '@/components/auth/ProtectedRoute'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import FabButton from '@/components/ui/FabButton'
import Toast from '@/components/ui/Toast'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { Plus, TrendingUp, Calendar, Settings, Loader2 } from 'lucide-react'
import { LifeSphere, Event } from '@/types'
import { useSpheres } from '@/hooks/useSpheresQuery'
import { useCreateEvent } from '@/hooks/useEventsQuery'
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
  const { user } = useAuth()
  const router = useRouter()
  const [showWheel, setShowWheel] = useState(true)
  const [showEditor, setShowEditor] = useState(false)
  const [showAddEventForm, setShowAddEventForm] = useState(false)
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
  const { data: spheres = [], isLoading: spheresLoading, error: spheresError } = useSpheres()

  // Хук для создания событий
  const createEventMutation = useCreateEvent()

  // Инициализация начальных сфер жизни при загрузке
  useEffect(() => {
    if (user) {
      checkAndInitializeSpheres()
    }
  }, [user])

  const mockUser = {
    name: user?.user_metadata?.name || 'Пользователь',
    avatar: user?.user_metadata?.avatar_url
  }

  const averageScore = spheres.length > 0
    ? Math.round(spheres.reduce((sum, sphere) => sum + sphere.score, 0) / spheres.length)
    : 0

  const handleSphereClick = (sphere: LifeSphere) => {
    console.log('Clicked sphere:', sphere.name)
    // Здесь можно добавить логику для редактирования сферы
  }

  const handleAddEvent = () => {
    setShowAddEventForm(true)
  }

  const handleSubmitEvent = async (eventData: Omit<Event, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      await createEventMutation.mutateAsync(eventData)

      // Закрываем форму
      setShowAddEventForm(false)

      // Показываем уведомление об успехе
      setToast({
        message: 'Событие успешно добавлено!',
        type: 'success',
        isVisible: true,
      })
    } catch (error) {
      console.error('Error adding event:', error)

      // Показываем ошибку пользователю
      setToast({
        message: 'Ошибка при добавлении события',
        type: 'error',
        isVisible: true,
      })
    }
  }

  const handleNavigateToEvents = () => {
    router.push('/events')
  }

  const handleNavigateToAnalytics = () => {
    router.push('/analytics')
  }

  return (
    <Layout title="Главная" user={mockUser}>
      <div className="p-4 space-y-6">
        {/* Приветствие */}
        <Card>
          <div className="text-center">
            <h2 className="text-xl font-semibold text-secondary-900 mb-2">
              Добро пожаловать, {mockUser.name}! 👋
            </h2>
            <p className="text-secondary-600">
              Ваш текущий баланс жизни
            </p>
          </div>
        </Card>

        {/* Колесо жизни с быстрыми действиями */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-secondary-900">
              Колесо жизни
            </h3>
            <div className="flex space-x-2">
              <Button
                variant={showWheel ? 'primary' : 'secondary'}
                size="sm"
                onClick={() => setShowWheel(true)}
              >
                Просмотр
              </Button>
              <Button
                variant={showEditor ? 'primary' : 'secondary'}
                size="sm"
                onClick={() => setShowEditor(true)}
              >
                Редактировать
              </Button>
            </div>
          </div>

          <div className="flex gap-6">
            {/* Колесо жизни */}
            <div className="flex-1">
              {spheresLoading ? (
                <LoadingSpinner />
              ) : spheresError ? (
                <div className="text-center text-red-500 p-4">
                  Ошибка загрузки сфер жизни
                </div>
              ) : (
                <Suspense fallback={<LoadingSpinner />}>
                  {showWheel && (
                    <WheelChart
                      spheres={spheres}
                      onSphereClick={handleSphereClick}
                      className="w-full h-64"
                    />
                  )}
                  {showEditor && (
                    <SphereEditor
                      spheres={spheres}
                      onSpheresChange={() => { }} // TODO: Добавить обновление через React Query
                      className="w-full"
                    />
                  )}
                </Suspense>
              )}
            </div>

            {/* Быстрые действия справа */}
            <div className="flex flex-col space-y-3 min-w-[120px]">
              <Button
                variant="secondary"
                onClick={handleNavigateToEvents}
                className="flex items-center justify-center space-x-2 h-12"
              >
                <Calendar className="w-4 h-4" />
                <span>События</span>
              </Button>
              <Button
                variant="secondary"
                onClick={handleNavigateToAnalytics}
                className="flex items-center justify-center space-x-2 h-12"
              >
                <TrendingUp className="w-4 h-4" />
                <span>Аналитика</span>
              </Button>
            </div>
          </div>
        </Card>

        {/* FAB кнопка для добавления события */}
        <FabButton
          icon={Plus}
          onClick={handleAddEvent}
          className="fixed bottom-6 right-6"
        />

        {/* Модальное окно для добавления события с lazy loading */}
        {showAddEventForm && (
          <Suspense fallback={<LoadingSpinner />}>
            <AddEventForm
              onSubmit={handleSubmitEvent}
              onClose={() => setShowAddEventForm(false)}
              isSubmitting={createEventMutation.isPending}
            />
          </Suspense>
        )}

        {/* Toast уведомления */}
        <Toast
          message={toast.message}
          type={toast.type}
          isVisible={toast.isVisible}
          onClose={() => setToast(prev => ({ ...prev, isVisible: false }))}
        />
      </div>
    </Layout>
  )
}
