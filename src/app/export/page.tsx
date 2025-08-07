'use client'

import React, { useState } from 'react'
import Layout from '@/components/layout/Layout'
import { EventsExport } from '@/components/events/EventsExport'
import { useEvents } from '@/hooks/useEvents'
import { useSpheres } from '@/hooks/useSpheres'
import { exportEvents } from '@/utils/exportUtils'
import { Loader2 } from 'lucide-react'

export default function ExportPage() {
    const [exportLoading, setExportLoading] = useState(false)

    const { events, loading: eventsLoading, error: eventsError } = useEvents()
    const { spheres, loading: spheresLoading, error: spheresError } = useSpheres()

    const handleExport = async (format: 'pdf' | 'csv', dateRange: { start: string; end: string }) => {
        try {
            setExportLoading(true)
            await exportEvents({
                format,
                dateRange,
                events,
                spheres,
            })
        } catch (error) {
            console.error('Ошибка экспорта:', error)
            alert('Произошла ошибка при экспорте. Попробуйте еще раз.')
        } finally {
            setExportLoading(false)
        }
    }

    return (
        <Layout title="Экспорт истории" showNavigation={true}>
            <div className="p-4 space-y-6">
                {/* Заголовок */}
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold text-secondary-900">
                        Экспорт истории
                    </h1>
                </div>

                {/* Состояние загрузки */}
                {(eventsLoading || spheresLoading) && (
                    <div className="flex items-center justify-center py-8">
                        <Loader2 className="animate-spin mr-2" />
                        <span>Загрузка данных для экспорта...</span>
                    </div>
                )}

                {/* Ошибки */}
                {(eventsError || spheresError) && (
                    <div className="text-center py-8 text-red-600">
                        <p>Ошибка загрузки данных:</p>
                        <p className="text-sm">{eventsError || spheresError}</p>
                    </div>
                )}

                {/* Компонент экспорта */}
                {!eventsLoading && !spheresLoading && !eventsError && !spheresError && (
                    <EventsExport
                        events={events}
                        spheres={spheres}
                        onExport={handleExport}
                        loading={exportLoading}
                    />
                )}
            </div>
        </Layout>
    )
}
