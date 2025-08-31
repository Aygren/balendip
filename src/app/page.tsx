'use client'

import React, { useState, Suspense } from 'react'
import { Eye, Edit3, Target, Settings, Sparkles, TrendingUp, User, Calendar } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { useSpheres } from '@/hooks/useSpheres'
import { useOnboarding } from '@/contexts/OnboardingContext'
import Navigation from '@/components/layout/Navigation'
import FabButton from '@/components/ui/FabButton'
import Toast from '@/components/ui/Toast'
import { OnboardingFlow } from '@/components/onboarding/OnboardingFlow'
import { LifeSphere } from '@/types'

// Простой компонент загрузки
const LoadingSpinner = () => (
  <div className="flex items-center justify-center p-8">
    <div className="w-8 h-8 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
  </div>
)

// Красивое колесо жизни с использованием SVG
const LifeWheel = ({
  spheres,
  averageScore,
  isEditing,
  onSphereUpdate
}: {
  spheres: LifeSphere[]
  averageScore: number
  isEditing: boolean
  onSphereUpdate: (sphere: LifeSphere) => void
}) => {
  const wheelSize = 400
  const center = wheelSize / 2
  const radius = 150
  const innerRadius = 80

  const handleSphereClick = (sphere: LifeSphere) => {
    if (!isEditing) return

    // В режиме редактирования показываем модальное окно для изменения балла
    const newScore = prompt(`Измените балл для сферы "${sphere.name}" (от 1 до 10):`, sphere.score.toString())

    if (newScore !== null) {
      const score = parseInt(newScore)
      if (score >= 1 && score <= 10) {
        const updatedSphere = { ...sphere, score }
        onSphereUpdate(updatedSphere)
      } else {
        alert('Балл должен быть от 1 до 10!')
      }
    }
  }

  return (
    <div className="w-[300px] h-[300px] md:w-[400px] md:h-[400px] mx-auto relative">
      <svg width={wheelSize} height={wheelSize} className="drop-shadow-2xl" style={{ width: '100%', height: '100%' }}>
        {/* Фон колеса */}
        <defs>
          <radialGradient id="wheelGradient" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#f0f9ff" />
            <stop offset="50%" stopColor="#e0e7ff" />
            <stop offset="100%" stopColor="#fdf2f8" />
          </radialGradient>
        </defs>

        {/* Основной круг */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="url(#wheelGradient)"
          stroke="#3b82f6"
          strokeWidth="3"
          className="drop-shadow-lg"
        />

        {/* Внутренний круг */}
        <circle
          cx={center}
          cy={center}
          r={innerRadius}
          fill="white"
          stroke="#3b82f6"
          strokeWidth="2"
          className="drop-shadow-md"
        />

        {/* Секторы для каждой сферы */}
        {spheres.map((sphere, index) => {
          const startAngle = (index * 360) / spheres.length
          const endAngle = ((index + 1) * 360) / spheres.length
          const startRad = (startAngle - 90) * Math.PI / 180
          const endRad = (endAngle - 90) * Math.PI / 180

          // Вычисляем точки дуги
          const x1 = center + radius * Math.cos(startRad)
          const y1 = center + radius * Math.sin(startRad)
          const x2 = center + radius * Math.cos(endRad)
          const y2 = center + radius * Math.sin(endRad)

          // Флаг для больших дуг
          const largeArcFlag = endAngle - startAngle <= 180 ? 0 : 1

          // Создаем путь для сектора
          const pathData = [
            `M ${center} ${center}`,
            `L ${x1} ${y1}`,
            `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
            'Z'
          ].join(' ')

          return (
            <g key={`sector-${sphere.id}`}>
              {/* Сектор */}
              <path
                d={pathData}
                fill={sphere.color}
                fillOpacity="0.3"
                stroke={sphere.color}
                strokeWidth="2"
                className="transition-all duration-300 hover:fill-opacity-50"
              />

              {/* Луч */}
              <line
                x1={center}
                y1={center}
                x2={center + radius * Math.cos(startRad)}
                y2={center + radius * Math.sin(startRad)}
                stroke={sphere.color}
                strokeWidth="3"
                strokeLinecap="round"
                className="drop-shadow-sm"
              />
            </g>
          )
        })}

        {/* Сферы на концах лучей */}
        {spheres.map((sphere, index) => {
          const angle = (index * 360) / spheres.length
          const rad = (angle - 90) * Math.PI / 180
          const x = center + radius * Math.cos(rad)
          const y = center + radius * Math.sin(rad)

          return (
            <g key={`sphere-${sphere.id}`}>
              {/* Тень сферы */}
              <circle
                cx={x + 2}
                cy={y + 2}
                r="20"
                fill="rgba(0,0,0,0.2)"
                className="drop-shadow-lg"
              />

              {/* Сфера */}
              <circle
                cx={x}
                cy={y}
                r="20"
                fill={sphere.color}
                stroke="white"
                strokeWidth="3"
                className={`drop-shadow-lg transition-all duration-200 ${isEditing ? 'cursor-pointer hover:r-24 hover:stroke-2' : ''
                  }`}
                onClick={() => handleSphereClick(sphere)}
              />

              {/* Балл в сфере */}
              <text
                x={x}
                y={y + 5}
                textAnchor="middle"
                fill="white"
                fontSize="16"
                fontWeight="bold"
                className="drop-shadow-sm pointer-events-none"
              >
                {sphere.score}
              </text>

              {/* Название сферы */}
              <text
                x={x}
                y={y + 35}
                textAnchor="middle"
                fill={sphere.color}
                fontSize="12"
                fontWeight="600"
                className="drop-shadow-sm pointer-events-none"
              >
                {sphere.name}
              </text>

              {/* Индикатор редактирования */}
              {isEditing && (
                <text
                  x={x}
                  y={y - 25}
                  textAnchor="middle"
                  fill="#ef4444"
                  fontSize="10"
                  fontWeight="bold"
                  className="drop-shadow-sm pointer-events-none"
                >
                  ✏️
                </text>
              )}
            </g>
          )
        })}

        {/* Центральный круг с баллом */}
        <circle
          cx={center}
          cy={center}
          r="60"
          fill="white"
          stroke="#3b82f6"
          strokeWidth="3"
          className="drop-shadow-lg"
        />

        <text
          x={center}
          y={center - 10}
          textAnchor="middle"
          fill="#3b82f6"
          fontSize="32"
          fontWeight="bold"
          className="drop-shadow-sm"
        >
          {averageScore}
        </text>

        <text
          x={center}
          y={center + 15}
          textAnchor="middle"
          fill="#6b7280"
          fontSize="14"
          className="drop-shadow-sm"
        >
          средний
        </text>

        <text
          x={center}
          y={center + 30}
          textAnchor="middle"
          fill="#6b7280"
          fontSize="14"
          className="drop-shadow-sm"
        >
          балл
        </text>
      </svg>

      {/* Индикатор режима редактирования */}
      {isEditing && (
        <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium shadow-lg">
          ✏️ Редактирование
        </div>
      )}

      {/* Инструкция по редактированию */}
      {isEditing && (
        <div className="absolute bottom-4 left-4 bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-medium shadow-lg">
          💡 Кликните по сфере для изменения балла
        </div>
      )}
    </div>
  )
}

export default function HomePage() {
  const router = useRouter()
  const { user } = useAuth()
  const { spheres, isLoading: spheresLoading } = useSpheres()
  const { isCompleted: isOnboardingCompleted } = useOnboarding()
  const [showEditor, setShowEditor] = useState(false)
  const [toast, setToast] = useState({ message: '', type: 'success' as const, isVisible: false })
  const [randomEvent, setRandomEvent] = useState('')
  const [localSpheres, setLocalSpheres] = useState<LifeSphere[]>([])
  const [hasChanges, setHasChanges] = useState(false)

  // Используем fallback сферы если API не загрузился
  const defaultSpheres = [
    { id: 1, name: 'Здоровье', score: 7, color: '#10B981' },
    { id: 2, name: 'Карьера', score: 6, color: '#3B82F6' },
    { id: 3, name: 'Финансы', score: 5, color: '#F59E0B' },
    { id: 4, name: 'Отношения', score: 8, color: '#EF4444' },
    { id: 5, name: 'Саморазвитие', score: 7, color: '#8B5CF6' },
    { id: 6, name: 'Досуг', score: 6, color: '#EC4899' },
    { id: 7, name: 'Духовность', score: 5, color: '#06B6D4' },
    { id: 8, name: 'Окружение', score: 7, color: '#84CC16' }
  ] as LifeSphere[]

  // Инициализируем локальные сферы
  React.useEffect(() => {
    // Пытаемся загрузить сохраненные сферы из localStorage
    const savedSpheres = localStorage.getItem('balendip-spheres')
    if (savedSpheres) {
      try {
        const parsed = JSON.parse(savedSpheres)
        setLocalSpheres(parsed)
        setHasChanges(true)
      } catch (e) {
        console.error('Ошибка загрузки сохраненных сфер:', e)
        const spheresToUse = spheres && spheres.length > 0 ? spheres : defaultSpheres
        setLocalSpheres(spheresToUse)
      }
    } else {
      const spheresToUse = spheres && spheres.length > 0 ? spheres : defaultSpheres
      setLocalSpheres(spheresToUse)
    }
  }, [spheres])

  const displaySpheres = localSpheres.length > 0 ? localSpheres : defaultSpheres
  const averageScore = Math.round(displaySpheres.reduce((sum, sphere) => sum + sphere.score, 0) / displaySpheres.length)

  // Сохраняем изменения в localStorage
  const saveChanges = () => {
    localStorage.setItem('balendip-spheres', JSON.stringify(localSpheres))
    setHasChanges(false)
    setToast({
      message: 'Изменения сохранены!',
      type: 'success',
      isVisible: true
    })
    setTimeout(() => setToast(prev => ({ ...prev, isVisible: false })), 3000)
  }

  // Сбрасываем к исходным значениям
  const resetToDefault = () => {
    if (confirm('Вы уверены, что хотите сбросить все изменения к исходным значениям?')) {
      const spheresToUse = spheres && spheres.length > 0 ? spheres : defaultSpheres
      setLocalSpheres(spheresToUse)
      localStorage.removeItem('balendip-spheres')
      setHasChanges(false)
      setToast({
        message: 'Сброшено к исходным значениям',
        type: 'success',
        isVisible: true
      })
      setTimeout(() => setToast(prev => ({ ...prev, isVisible: false })), 3000)
    }
  }

  const handleAddEvent = () => {
    router.push('/events')
  }

  const generateRandomEvent = () => {
    const events = [
      'Встреча с другом',
      'Новый проект на работе',
      'Поход в спортзал',
      'Чтение книги',
      'Медитация',
      'Планирование бюджета',
      'Изучение нового навыка',
      'Время с семьей'
    ]
    setRandomEvent(events[Math.floor(Math.random() * events.length)])
  }

  // Если онбординг не завершен, показываем его
  if (!isOnboardingCompleted) {
    return <OnboardingFlow />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50">
      {/* Верхняя панель - информация по аккаунту */}
      <div className="bg-white/90 backdrop-blur-sm border-b border-secondary-200 px-4 md:px-6 py-3 md:py-4 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 md:gap-4">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-lg md:text-xl">B</span>
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-secondary-900">Balendip</h1>
              <p className="text-sm md:text-base text-secondary-600">Баланс жизни</p>
            </div>
          </div>

          <div className="flex items-center gap-2 md:gap-3">
            <div className="text-right hidden sm:block">
              <p className="font-medium text-secondary-900">{user?.name || 'Пользователь'}</p>
              <p className="text-sm text-secondary-600">Добро пожаловать!</p>
            </div>
            <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br from-secondary-400 to-secondary-500 rounded-full flex items-center justify-center">
              <span className="text-white font-semibold text-xs md:text-sm">
                {user?.name?.charAt(0).toUpperCase() || 'П'}
              </span>
            </div>
            <button onClick={() => router.push('/settings')} className="p-2 hover:bg-secondary-100 rounded-lg transition-colors">
              <Settings className="w-4 h-4 md:w-5 md:h-5 text-secondary-600" />
            </button>
            <button onClick={() => router.push('/onboarding/reset')} className="p-2 md:p-3 hover:bg-secondary-100 rounded-lg transition-colors">
              <span className="text-base md:text-lg text-secondary-600">🔄</span>
            </button>
          </div>
        </div>
      </div>

      {/* Основной контент - по центру */}
      <div className="main-page-content min-h-[calc(100vh-200px)] py-8 md:py-12 px-4 md:px-6">
        <div className="w-full max-w-6xl text-center">
          {/* Приветствие */}
          <div className="mb-8 md:mb-12">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-secondary-900 mb-4">
              Добро пожаловать в Balendip
            </h2>
            <p className="text-lg md:text-xl text-secondary-600 max-w-2xl mx-auto">
              Отслеживайте баланс своей жизни и анализируйте, как события влияют на различные сферы
            </p>
          </div>

          {/* Колесо жизни - по центру */}
          <div className="w-full max-w-4xl mb-12 md:mb-16 px-4">
            <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl border border-secondary-200 p-6 md:p-8">
              {/* Заголовок и кнопки */}
              <div className="text-center mb-8">
                <h3 className="text-2xl md:text-3xl font-bold text-secondary-900 mb-6 flex items-center justify-center gap-3">
                  <Target className="w-6 h-6 md:w-8 md:h-8 text-primary-500" />
                  Колесо жизни
                </h3>
                <div className="flex justify-center items-center gap-2 md:gap-4 flex-wrap">
                  <button
                    onClick={() => { setShowEditor(false); }}
                    className={`px-4 md:px-6 py-2 md:py-3 rounded-xl font-semibold transition-all duration-200 flex items-center gap-2 text-sm md:text-base ${!showEditor
                      ? 'bg-primary-600 text-white shadow-lg'
                      : 'bg-secondary-200 text-secondary-700 hover:bg-secondary-300'
                      }`}
                  >
                    <Eye className="w-4 h-4" />
                    <span className="hidden sm:inline">Просмотр</span>
                    <span className="sm:hidden">👁️</span>
                  </button>
                  <button
                    onClick={() => { setShowEditor(true); }}
                    className={`px-4 md:px-6 py-2 md:py-3 rounded-xl font-semibold transition-all duration-200 flex items-center gap-2 text-sm md:text-base ${showEditor
                      ? 'bg-primary-600 text-white shadow-lg'
                      : 'bg-secondary-200 text-secondary-700 hover:bg-secondary-300'
                      }`}
                  >
                    <Edit3 className="w-4 h-4" />
                    <span className="hidden sm:inline">{showEditor ? 'Редактирование активно' : 'Редактировать'}</span>
                    <span className="sm:hidden">✏️</span>
                  </button>

                  {showEditor && hasChanges && (
                    <>
                      <button
                        onClick={saveChanges}
                        className="px-4 md:px-6 py-2 md:py-3 rounded-xl font-semibold transition-all duration-200 flex items-center gap-2 bg-primary-600 text-white shadow-lg hover:bg-primary-700 text-sm md:text-base"
                      >
                        <span className="hidden sm:inline">💾 Сохранить</span>
                        <span className="sm:hidden">💾</span>
                      </button>
                      <button
                        onClick={resetToDefault}
                        className="px-4 md:px-6 py-2 md:py-3 rounded-xl font-semibold transition-all duration-200 flex items-center gap-2 bg-secondary-600 text-white shadow-lg hover:bg-secondary-700 text-sm md:text-base"
                      >
                        <span className="hidden sm:inline">🔄 Сбросить</span>
                        <span className="sm:hidden">🔄</span>
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* Колесо жизни */}
              <div className="flex justify-center">
                {spheresLoading ? (
                  <LoadingSpinner />
                ) : (
                  <Suspense fallback={<LoadingSpinner />}>
                    <LifeWheel
                      spheres={displaySpheres}
                      averageScore={averageScore}
                      isEditing={showEditor}
                      onSphereUpdate={(updatedSphere) => {
                        // Обновляем сферу в локальном состоянии
                        const updatedSpheres = localSpheres.map(sphere =>
                          sphere.id === updatedSphere.id ? updatedSphere : sphere
                        )
                        // Показываем уведомление
                        setToast({
                          message: `Балл для "${updatedSphere.name}" обновлен на ${updatedSphere.score}`,
                          type: 'success',
                          isVisible: true
                        })
                        // Обновляем состояние
                        setLocalSpheres(updatedSpheres)
                        // Отмечаем, что есть изменения
                        setHasChanges(true)
                        // Автоматически скрываем toast через 3 секунды
                        setTimeout(() => setToast(prev => ({ ...prev, isVisible: false })), 3000)
                      }}
                    />
                  </Suspense>
                )}
              </div>
            </div>
          </div>

          {/* Случайное событие и анализ - по центру */}
          <div className="w-full max-w-4xl mb-12 md:mb-16 px-4">
            <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl border border-secondary-200 p-6 md:p-8">
              <h3 className="text-xl md:text-2xl font-bold text-secondary-900 mb-6 text-center flex items-center justify-center gap-3">
                <Sparkles className="w-5 h-5 md:w-6 md:h-6 text-primary-500" />
                Анализ событий
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                {/* Генерация случайного события */}
                <div className="text-center">
                  <h4 className="text-base md:text-lg font-semibold text-secondary-800 mb-4">Случайное событие</h4>
                  <button
                    onClick={generateRandomEvent}
                    className="px-4 md:px-6 py-2 md:py-3 rounded-xl font-semibold transition-all duration-200 flex items-center gap-2 mx-auto bg-primary-600 text-white shadow-lg hover:bg-primary-700 text-sm md:text-base"
                  >
                    <Calendar className="w-4 h-4" />
                    <span className="hidden sm:inline">Сгенерировать</span>
                    <span className="sm:hidden">🎲</span>
                  </button>
                  {randomEvent && (
                    <div className="mt-4 p-3 md:p-4 bg-primary-50 rounded-xl border border-primary-200">
                      <p className="text-primary-800 font-medium text-sm md:text-base">{randomEvent}</p>
                    </div>
                  )}
                </div>

                {/* Анализ воздействия */}
                <div className="text-center">
                  <h4 className="text-base md:text-lg font-semibold text-secondary-800 mb-4">Воздействие на сферы</h4>
                  <div className="p-3 md:p-4 bg-secondary-50 rounded-xl border border-secondary-200">
                    <TrendingUp className="w-6 h-6 md:w-8 md:h-8 text-secondary-600 mx-auto mb-2" />
                    <p className="text-secondary-700 text-sm md:text-base">
                      {randomEvent
                        ? 'Анализируем влияние события на ваши сферы жизни...'
                        : 'Сгенерируйте событие для анализа'
                      }
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Средний балл - по центру */}
          <div className="text-center px-4">
            <div className="inline-flex items-center justify-center bg-white/90 backdrop-blur-sm rounded-2xl px-6 md:px-8 py-4 shadow-lg border border-secondary-200">
              <Target className="w-6 h-6 md:w-8 md:h-8 text-primary-500 mr-2 md:mr-3" />
              <span className="text-2xl md:text-3xl font-bold text-primary-600">{averageScore}</span>
              <span className="text-lg md:text-xl text-secondary-600 ml-2 md:ml-3">средний балл</span>
            </div>
          </div>
        </div>
      </div>

      {/* Навигация внизу */}
      <Navigation />

      {/* Кнопка добавления события */}
      <FabButton onClick={handleAddEvent} className="fixed bottom-28 right-6" />

      {/* Toast уведомления */}
      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={() => setToast(prev => ({ ...prev, isVisible: false }))}
      />
    </div>
  )
}
