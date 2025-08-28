'use client'

import React, { useCallback, useMemo } from 'react'
import { Virtuoso } from 'react-virtuoso'
import { Event, LifeSphere } from '@/types'
import { format } from 'date-fns'
import { ru } from 'date-fns/locale'
import { Calendar, Clock, Tag, Trash2, Edit } from 'lucide-react'

interface VirtualizedEventsListProps {
  events: Event[]
  spheres: LifeSphere[]
  loading?: boolean
  onDeleteEvent?: (eventId: string) => void
  onEditEvent?: (eventId: string) => void
  onLoadMore?: () => void
  hasMore?: boolean
}

const EventItem: React.FC<{
  event: Event
  spheres: LifeSphere[]
  onDelete?: (eventId: string) => void
  onEdit?: (eventId: string) => void
}> = ({ event, spheres, onDelete, onEdit }) => {
  const getEmotionColor = (emotion: string) => {
    const colors = {
      positive: '#10B981',
      neutral: '#6B7280',
      negative: '#EF4444',
    }
    return colors[emotion as keyof typeof colors] || '#6B7280'
  }

  const getEmotionIcon = (emotion: string) => {
    const icons = {
      positive: '😊',
      neutral: '😐',
      negative: '😢',
    }
    return icons[emotion as keyof typeof icons] || '😐'
  }

  const getSphereName = (sphereId: string) => {
    const sphere = spheres.find(s => s.id === sphereId)
    return sphere?.name || 'Неизвестно'
  }

  const getSphereColor = (sphereId: string) => {
    const sphere = spheres.find(s => s.id === sphereId)
    return sphere?.color || '#6B7280'
  }

  const eventSpheres = event.spheres.map(sphereId => {
    const sphere = spheres.find(s => s.id === sphereId)
    return sphere
  }).filter(Boolean) as LifeSphere[]

  return (
    <div className="bg-white rounded-lg border border-secondary-200 p-4 mb-4 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span
              className="text-lg"
              style={{ color: getEmotionColor(event.emotion) }}
            >
              {getEmotionIcon(event.emotion)}
            </span>
            <h3 className="text-lg font-semibold text-secondary-900">
              {event.title}
            </h3>
          </div>
          
          {event.description && (
            <p className="text-secondary-600 mb-3 line-clamp-2">
              {event.description}
            </p>
          )}

          <div className="flex items-center gap-4 text-sm text-secondary-500 mb-3">
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              <span>
                {format(new Date(event.date), 'dd MMMM yyyy', { locale: ru })}
              </span>
            </div>
            {event.time && (
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>{event.time}</span>
              </div>
            )}
          </div>

          {eventSpheres.length > 0 && (
            <div className="flex items-center gap-2 mb-3">
              <Tag className="w-4 h-4 text-secondary-400" />
              <div className="flex flex-wrap gap-1">
                {eventSpheres.map(sphere => (
                  <span
                    key={sphere.id}
                    className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium"
                    style={{
                      backgroundColor: `${sphere.color}20`,
                      color: sphere.color,
                    }}
                  >
                    <span>{sphere.icon}</span>
                    {sphere.name}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 ml-4">
          {onEdit && (
            <button
              onClick={() => onEdit(event.id)}
              className="p-2 text-secondary-400 hover:text-primary-600 transition-colors"
              title="Редактировать"
            >
              <Edit className="w-4 h-4" />
            </button>
          )}
          {onDelete && (
            <button
              onClick={() => onDelete(event.id)}
              className="p-2 text-secondary-400 hover:text-red-600 transition-colors"
              title="Удалить"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

const LoadingFooter: React.FC = () => (
  <div className="flex items-center justify-center py-8">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
    <span className="ml-3 text-secondary-600">Загрузка...</span>
  </div>
)

const EmptyState: React.FC = () => (
  <div className="text-center py-12">
    <div className="text-secondary-400 mb-4">
      <Calendar className="w-16 h-16 mx-auto" />
    </div>
    <h3 className="text-lg font-semibold text-secondary-900 mb-2">
      Нет событий
    </h3>
    <p className="text-secondary-600">
      Добавьте первое событие, чтобы начать отслеживать свою жизнь
    </p>
  </div>
)

export const VirtualizedEventsList: React.FC<VirtualizedEventsListProps> = ({
  events,
  spheres,
  loading = false,
  onDeleteEvent,
  onEditEvent,
  onLoadMore,
  hasMore = false,
}) => {
  const handleEndReached = useCallback(() => {
    if (hasMore && onLoadMore) {
      onLoadMore()
    }
  }, [hasMore, onLoadMore])

  const itemContent = useCallback((index: number) => {
    const event = events[index]
    return (
      <EventItem
        event={event}
        spheres={spheres}
        onDelete={onDeleteEvent}
        onEdit={onEditEvent}
      />
    )
  }, [events, spheres, onDeleteEvent, onEditEvent])

  if (loading && events.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        <span className="ml-3 text-secondary-600">Загрузка событий...</span>
      </div>
    )
  }

  if (events.length === 0) {
    return <EmptyState />
  }

  return (
    <div className="h-full">
      <Virtuoso
        style={{ height: '100%' }}
        data={events}
        itemContent={(index: number) => itemContent(index)}
        endReached={handleEndReached}
        increaseViewportBy={200}
        components={{
          Footer: hasMore ? LoadingFooter : undefined,
        }}
      />
    </div>
  )
}
