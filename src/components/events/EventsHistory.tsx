import React, { useState, useMemo } from 'react'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import { Calendar, Clock, Tag, Trash2, Edit, Loader2 } from 'lucide-react'
import { Event, LifeSphere } from '@/types'

interface EventsHistoryProps {
    events: Event[]
    spheres: LifeSphere[]
    loading: boolean
    onDeleteEvent: (eventId: string) => void
    onEditEvent: (eventId: string) => void
}

export const EventsHistory: React.FC<EventsHistoryProps> = ({
    events,
    spheres,
    loading,
    onDeleteEvent,
    onEditEvent,
}) => {
    const [expandedEvent, setExpandedEvent] = useState<string | null>(null)

    // Группировка событий по дате
    const groupedEvents = useMemo(() => {
        const groups: Record<string, Event[]> = {}

        events.forEach(event => {
            const date = event.date
            if (!groups[date]) {
                groups[date] = []
            }
            groups[date].push(event)
        })

        return Object.entries(groups)
            .sort(([a], [b]) => new Date(b).getTime() - new Date(a).getTime())
    }, [events])

    const formatDate = (date: string) => {
        const today = new Date()
        const eventDate = new Date(date)
        const diffTime = Math.abs(today.getTime() - eventDate.getTime())
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

        if (diffDays === 0) return 'Сегодня'
        if (diffDays === 1) return 'Вчера'
        if (diffDays <= 7) return `${diffDays} дней назад`

        return eventDate.toLocaleDateString('ru-RU', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        })
    }

    const formatTime = (time: string) => {
        return new Date(time).toLocaleTimeString('ru-RU', {
            hour: '2-digit',
            minute: '2-digit'
        })
    }

    const getEmotionColor = (emotion: string) => {
        const colors = {
            positive: '#10B981',
            neutral: '#6B7280',
            negative: '#EF4444',
        }
        return colors[emotion as keyof typeof colors] || '#6B7280'
    }

    const getEventSpheres = (event: Event) => {
        return event.spheres.map(sphereId => {
            const sphere = spheres.find(s => s.id === sphereId)
            return sphere
        }).filter(Boolean) as LifeSphere[]
    }

    const handleDeleteEvent = (eventId: string) => {
        if (confirm('Вы уверены, что хотите удалить это событие?')) {
            onDeleteEvent(eventId)
        }
    }

    if (loading) {
        return (
            <Card>
                <div className="flex items-center justify-center py-8">
                    <Loader2 className="animate-spin mr-2" />
                    <span>Загрузка истории событий...</span>
                </div>
            </Card>
        )
    }

    if (events.length === 0) {
        return (
            <Card>
                <div className="text-center py-8">
                    <div className="text-4xl mb-4">📝</div>
                    <h3 className="text-lg font-semibold text-secondary-900 mb-2">
                        История пуста
                    </h3>
                    <p className="text-secondary-600">
                        Добавьте первое событие, чтобы начать отслеживать свою жизнь
                    </p>
                </div>
            </Card>
        )
    }

    return (
        <div className="space-y-6">
            {groupedEvents.map(([date, dayEvents]) => (
                <div key={date} className="space-y-4">
                    <div className="flex items-center gap-2">
                        <Calendar size={16} className="text-secondary-500" />
                        <h3 className="text-lg font-semibold text-secondary-900">
                            {formatDate(date)}
                        </h3>
                        <span className="text-sm text-secondary-500">
                            ({dayEvents.length} событий)
                        </span>
                    </div>

                    <div className="space-y-3">
                        {dayEvents.map((event) => (
                            <Card key={event.id} className="hover:shadow-md transition-shadow">
                                <div className="p-4">
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-start gap-3 flex-1">
                                            <div className="text-2xl">{event.emoji}</div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <h4 className="font-semibold text-secondary-900 truncate">
                                                        {event.title}
                                                    </h4>
                                                    <div
                                                        className="w-3 h-3 rounded-full"
                                                        style={{ backgroundColor: getEmotionColor(event.emotion) }}
                                                    />
                                                </div>

                                                {event.description && (
                                                    <div className="mb-3">
                                                        <p className={`text-secondary-600 ${expandedEvent === event.id ? '' : 'line-clamp-2'}`}>
                                                            {event.description}
                                                        </p>
                                                        {event.description.length > 100 && (
                                                            <button
                                                                onClick={() => setExpandedEvent(expandedEvent === event.id ? null : event.id)}
                                                                className="text-sm text-primary-600 hover:text-primary-700 mt-1"
                                                            >
                                                                {expandedEvent === event.id ? 'Скрыть' : 'Показать больше'}
                                                            </button>
                                                        )}
                                                    </div>
                                                )}

                                                <div className="flex items-center gap-4 text-sm text-secondary-500">
                                                    <div className="flex items-center gap-1">
                                                        <Clock size={14} />
                                                        <span>{formatTime(event.created_at)}</span>
                                                    </div>

                                                    {getEventSpheres(event).length > 0 && (
                                                        <div className="flex items-center gap-1">
                                                            <Tag size={14} />
                                                            <div className="flex gap-1">
                                                                {getEventSpheres(event).map((sphere) => (
                                                                    <span
                                                                        key={sphere.id}
                                                                        className="px-2 py-1 rounded-full text-xs"
                                                                        style={{
                                                                            backgroundColor: sphere.color + '20',
                                                                            color: sphere.color
                                                                        }}
                                                                    >
                                                                        {sphere.icon} {sphere.name}
                                                                    </span>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2 ml-4">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => onEditEvent(event.id)}
                                                className="text-secondary-600 hover:text-secondary-900"
                                            >
                                                <Edit size={16} />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleDeleteEvent(event.id)}
                                                className="text-red-600 hover:text-red-700"
                                            >
                                                <Trash2 size={16} />
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    )
}
