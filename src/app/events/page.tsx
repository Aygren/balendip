'use client'

import React, { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import Layout from '@/components/layout/Layout'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import { Search, Filter, Calendar, Clock, Tag, Loader2 } from 'lucide-react'
import { Event, LifeSphere } from '@/types'
import { useDeleteEvent } from '@/hooks/useEvents'
import { useSpheres } from '@/hooks/useSpheres'
import { VirtualizedEventsList } from '@/components/events/VirtualizedEventsList'
import { useEventsPaginated } from '@/hooks/useEvents'
import EditEventForm from '@/components/forms/EditEventForm'

export default function EventsPage() {
    const router = useRouter()
    const [searchQuery, setSearchQuery] = useState('')
    const [selectedDate, setSelectedDate] = useState('')
    const [selectedEmotion, setSelectedEmotion] = useState('')
    const [selectedSpheres, setSelectedSpheres] = useState<string[]>([])
    const [currentPage, setCurrentPage] = useState(1)
    const [editingEvent, setEditingEvent] = useState<Event | null>(null)
    const [showEditForm, setShowEditForm] = useState(false)

    // Используем React Query хуки для загрузки данных
    const { data: spheres = [], isLoading: spheresLoading, error: spheresError } = useSpheres()
    const deleteEventMutation = useDeleteEvent()

    // Используем пагинацию с фильтрами
    const filters = {
        search: searchQuery,
        date_from: selectedDate,
        date_to: selectedDate,
        emotion: selectedEmotion as 'positive' | 'neutral' | 'negative' | undefined,
        spheres: selectedSpheres.length > 0 ? selectedSpheres : undefined,
    }

    const {
        data: paginatedData,
        isLoading: eventsLoading,
        error: eventsError,
    } = useEventsPaginated(filters, currentPage, 20)

    const events = paginatedData?.data || []
    const hasMore = paginatedData ? currentPage < paginatedData.totalPages : false

    const loadMore = () => {
        if (hasMore) {
            setCurrentPage(prev => prev + 1)
        }
    }

    const refresh = () => {
        setCurrentPage(1)
    }

    const emotionOptions = [
        { value: 'positive', label: 'Позитивные', emoji: '😊', color: '#10B981' },
        { value: 'neutral', label: 'Нейтральные', emoji: '😐', color: '#6B7280' },
        { value: 'negative', label: 'Негативные', emoji: '😔', color: '#EF4444' },
    ]

    // Обновляем данные при изменении фильтров
    React.useEffect(() => {
        refresh()
    }, [searchQuery, selectedDate, selectedEmotion, selectedSpheres, refresh])

    const handleSphereFilterToggle = (sphereId: string) => {
        setSelectedSpheres(prev =>
            prev.includes(sphereId)
                ? prev.filter(id => id !== sphereId)
                : [...prev, sphereId]
        )
    }

    const handleEditEvent = (eventId: string) => {
        const event = events.find(e => e.id === eventId)
        if (event) {
            setEditingEvent(event)
            setShowEditForm(true)
        }
    }

    const handleUpdateEvent = async (eventId: string, eventData: Partial<Event>) => {
        try {
            // TODO: Добавить вызов API для обновления события
            console.log('Updating event:', eventId, eventData)
            // Обновляем локальное состояние
            // refresh()
        } catch (error) {
            console.error('Error updating event:', error)
        }
    }

    const clearFilters = () => {
        setSearchQuery('')
        setSelectedDate('')
        setSelectedEmotion('')
        setSelectedSpheres([])
    }

    const formatDate = (date: string) => {
        return new Date(date).toLocaleDateString('ru-RU', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        })
    }

    const formatTime = (time: string) => {
        return time
    }

    const getEmotionColor = (emotion: string) => {
        const emotionOption = emotionOptions.find(e => e.value === emotion)
        return emotionOption?.color || '#6B7280'
    }

    const getEventSpheres = (event: Event) => {
        return event.spheres.map(sphereId => {
            const sphere = spheres.find((s: LifeSphere) => s.id === sphereId)
            return sphere
        }).filter(Boolean) as LifeSphere[]
    }

    return (
        <Layout title="События" showNavigation={true}>
            <div className="p-4 space-y-6">
                {/* Заголовок */}
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold text-secondary-900">
                        События
                    </h1>
                    <Button
                        variant="primary"
                        size="sm"
                        onClick={() => router.push('/')}
                    >
                        Добавить
                    </Button>
                </div>

                {/* Состояние загрузки */}
                {(eventsLoading || spheresLoading) && (
                    <Card>
                        <div className="flex items-center justify-center py-8">
                            <Loader2 className="animate-spin mr-2" />
                            <span>Загрузка истории событий...</span>
                        </div>
                    </Card>
                )}

                {/* Ошибки */}
                {(eventsError || spheresError) && (
                    <Card>
                        <div className="text-center py-8 text-red-600">
                            <p>Ошибка загрузки данных:</p>
                            <p className="text-sm">{(eventsError || spheresError)?.toString() || 'Неизвестная ошибка'}</p>
                        </div>
                    </Card>
                )}

                {/* Фильтры */}
                <Card>
                    <div className="space-y-4">
                        {/* Поиск */}
                        <Input
                            placeholder="Поиск событий..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            leftIcon={Search}
                        />

                        {/* Фильтры */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {/* Дата */}
                            <Input
                                type="date"
                                placeholder="Выберите дату"
                                value={selectedDate}
                                onChange={(e) => setSelectedDate(e.target.value)}
                                leftIcon={Calendar}
                            />

                            {/* Эмоция */}
                            <div>
                                <label className="block text-sm font-medium text-secondary-700 mb-2">
                                    Эмоция
                                </label>
                                <select
                                    value={selectedEmotion}
                                    onChange={(e) => setSelectedEmotion(e.target.value)}
                                    className="w-full rounded-lg border border-secondary-300 bg-white px-3 py-2 text-secondary-900 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                                >
                                    <option value="">Все эмоции</option>
                                    {emotionOptions.map(emotion => (
                                        <option key={emotion.value} value={emotion.value}>
                                            {emotion.emoji} {emotion.label}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Сферы */}
                            <div>
                                <label className="block text-sm font-medium text-secondary-700 mb-2">
                                    Сферы жизни
                                </label>
                                <div className="flex flex-wrap gap-2">
                                    {spheres.map((sphere: LifeSphere) => (
                                        <button
                                            key={sphere.id}
                                            onClick={() => handleSphereFilterToggle(sphere.id)}
                                            className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs transition-all ${selectedSpheres.includes(sphere.id)
                                                ? 'bg-primary-500 text-white'
                                                : 'bg-secondary-100 text-secondary-700 hover:bg-secondary-200'
                                                }`}
                                        >
                                            <span>{sphere.icon}</span>
                                            <span>{sphere.name}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Очистить фильтры */}
                        {(searchQuery || selectedDate || selectedEmotion || selectedSpheres.length > 0) && (
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={clearFilters}
                                className="w-full"
                            >
                                Очистить фильтры
                            </Button>
                        )}
                    </div>
                </Card>

                {/* Список событий */}
                <div className="h-96">
                    <VirtualizedEventsList
                        events={events}
                        spheres={spheres}
                        loading={eventsLoading || spheresLoading}
                        onDeleteEvent={(eventId) => deleteEventMutation.mutate(eventId)}
                        onEditEvent={handleEditEvent}
                        onLoadMore={loadMore}
                        hasMore={hasMore}
                    />
                </div>

                {/* Статистика */}
                <Card>
                    <div className="grid grid-cols-3 gap-4 text-center">
                        <div>
                            <div className="text-2xl font-bold text-primary-600">
                                {events.length}
                            </div>
                            <div className="text-sm text-secondary-600">Всего событий</div>
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-green-600">
                                {events.filter((e: Event) => e.emotion === 'positive').length}
                            </div>
                            <div className="text-sm text-secondary-600">Позитивных</div>
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-red-600">
                                {events.filter((e: Event) => e.emotion === 'negative').length}
                            </div>
                            <div className="text-sm text-secondary-600">Негативных</div>
                        </div>
                    </div>
                </Card>
            </div>

            {/* Форма редактирования события */}
            {showEditForm && editingEvent && (
                <EditEventForm
                    isOpen={showEditForm}
                    onClose={() => {
                        setShowEditForm(false)
                        setEditingEvent(null)
                    }}
                    onSubmit={handleUpdateEvent}
                    event={editingEvent}
                    spheres={spheres}
                    loading={false}
                />
            )}
        </Layout>
    )
} 