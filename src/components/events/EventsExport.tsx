import React, { useState } from 'react'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import { Download, FileText, Calendar, Loader2 } from 'lucide-react'
import { Event, LifeSphere } from '@/types'

interface EventsExportProps {
    events: Event[]
    spheres: LifeSphere[]
    onExport: (format: 'pdf' | 'csv', dateRange: { start: string; end: string }) => void
    loading: boolean
}

export const EventsExport: React.FC<EventsExportProps> = ({
    events,
    spheres,
    onExport,
    loading,
}) => {
    const [exportFormat, setExportFormat] = useState<'pdf' | 'csv'>('pdf')
    const [dateRange, setDateRange] = useState({
        start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 30 дней назад
        end: new Date().toISOString().split('T')[0], // Сегодня
    })

    const handleExport = () => {
        onExport(exportFormat, dateRange)
    }

    const getEmotionColor = (emotion: string) => {
        const colors = {
            positive: '#10B981',
            neutral: '#6B7280',
            negative: '#EF4444',
        }
        return colors[emotion as keyof typeof colors] || '#6B7280'
    }

    const getSphereName = (sphereId: string) => {
        const sphere = spheres.find(s => s.id === sphereId)
        return sphere?.name || 'Неизвестно'
    }

    const formatDate = (date: string) => {
        return new Date(date).toLocaleDateString('ru-RU', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        })
    }

    const filteredEvents = events.filter(event => {
        const eventDate = new Date(event.date)
        const startDate = new Date(dateRange.start)
        const endDate = new Date(dateRange.end)
        return eventDate >= startDate && eventDate <= endDate
    })

    const stats = {
        total: filteredEvents.length,
        positive: filteredEvents.filter(e => e.emotion === 'positive').length,
        neutral: filteredEvents.filter(e => e.emotion === 'neutral').length,
        negative: filteredEvents.filter(e => e.emotion === 'negative').length,
    }

    return (
        <Card>
            <div className="p-6 space-y-6">
                <div className="flex items-center gap-2">
                    <Download size={20} className="text-primary-600" />
                    <h3 className="text-lg font-semibold text-secondary-900">
                        Экспорт истории событий
                    </h3>
                </div>

                {/* Формат экспорта */}
                <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-3">
                        Формат экспорта
                    </label>
                    <div className="flex gap-3">
                        <button
                            onClick={() => setExportFormat('pdf')}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all ${exportFormat === 'pdf'
                                ? 'border-primary-500 bg-primary-50 text-primary-700'
                                : 'border-secondary-300 text-secondary-700 hover:border-secondary-400'
                                }`}
                        >
                            <FileText size={16} />
                            <span>PDF отчет</span>
                        </button>
                        <button
                            onClick={() => setExportFormat('csv')}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all ${exportFormat === 'csv'
                                ? 'border-primary-500 bg-primary-50 text-primary-700'
                                : 'border-secondary-300 text-secondary-700 hover:border-secondary-400'
                                }`}
                        >
                            <FileText size={16} />
                            <span>CSV файл</span>
                        </button>
                    </div>
                </div>

                {/* Диапазон дат */}
                <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-3">
                        Диапазон дат
                    </label>
                    <div className="flex gap-4">
                        <div className="flex-1">
                            <label className="block text-xs text-secondary-600 mb-1">С</label>
                            <input
                                type="date"
                                value={dateRange.start}
                                onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                                className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                            />
                        </div>
                        <div className="flex-1">
                            <label className="block text-xs text-secondary-600 mb-1">По</label>
                            <input
                                type="date"
                                value={dateRange.end}
                                onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                                className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                            />
                        </div>
                    </div>
                </div>

                {/* Статистика */}
                <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-3">
                        Статистика за период
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="text-center p-3 bg-secondary-50 rounded-lg">
                            <div className="text-2xl font-bold text-secondary-900">{stats.total}</div>
                            <div className="text-sm text-secondary-600">Всего событий</div>
                        </div>
                        <div className="text-center p-3 bg-green-50 rounded-lg">
                            <div className="text-2xl font-bold text-green-600">{stats.positive}</div>
                            <div className="text-sm text-green-600">Позитивных</div>
                        </div>
                        <div className="text-center p-3 bg-yellow-50 rounded-lg">
                            <div className="text-2xl font-bold text-yellow-600">{stats.neutral}</div>
                            <div className="text-sm text-yellow-600">Нейтральных</div>
                        </div>
                        <div className="text-center p-3 bg-red-50 rounded-lg">
                            <div className="text-2xl font-bold text-red-600">{stats.negative}</div>
                            <div className="text-sm text-red-600">Негативных</div>
                        </div>
                    </div>
                </div>

                {/* Предварительный просмотр */}
                {filteredEvents.length > 0 && (
                    <div>
                        <label className="block text-sm font-medium text-secondary-700 mb-3">
                            Предварительный просмотр ({filteredEvents.length} событий)
                        </label>
                        <div className="max-h-60 overflow-y-auto space-y-2">
                            {filteredEvents.slice(0, 10).map((event) => (
                                <div key={event.id} className="flex items-center gap-3 p-3 bg-secondary-50 rounded-lg">
                                    <div className="text-xl">{event.emoji}</div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2">
                                            <h4 className="font-medium text-secondary-900 truncate">
                                                {event.title}
                                            </h4>
                                            <div
                                                className="w-2 h-2 rounded-full flex-shrink-0"
                                                style={{ backgroundColor: getEmotionColor(event.emotion) }}
                                            />
                                        </div>
                                        <div className="text-sm text-secondary-600">
                                            {formatDate(event.date)} • {event.spheres.map(getSphereName).join(', ')}
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {filteredEvents.length > 10 && (
                                <div className="text-center text-sm text-secondary-500 py-2">
                                    ... и еще {filteredEvents.length - 10} событий
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Кнопка экспорта */}
                <div className="flex justify-end">
                    <Button
                        onClick={handleExport}
                        disabled={loading || filteredEvents.length === 0}
                        className="flex items-center gap-2"
                    >
                        {loading ? (
                            <>
                                <Loader2 size={16} className="animate-spin" />
                                Экспорт...
                            </>
                        ) : (
                            <>
                                <Download size={16} />
                                Экспортировать
                            </>
                        )}
                    </Button>
                </div>
            </div>
        </Card>
    )
}
