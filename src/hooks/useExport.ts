import { useMutation } from '@tanstack/react-query'
import { Event, LifeSphere, ExportFormat, ExportOptions } from '@/types'
import { exportUtils } from '@/utils/exportUtils'

// ===== ХУК ДЛЯ ЭКСПОРТА ДАННЫХ =====

export interface ExportData {
    events: Event[]
    spheres: LifeSphere[]
    options: ExportOptions
}

export interface ExportResult {
    data: string | Blob
    filename: string
    mimeType: string
}

// Экспорт в CSV
export const useExportToCSV = () => {
    return useMutation({
        mutationFn: async (data: ExportData): Promise<ExportResult> => {
            const csvContent = exportUtils.toCSV(data.events, data.spheres, data.options)
            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })

            return {
                data: blob,
                filename: `balendip-events-${new Date().toISOString().split('T')[0]}.csv`,
                mimeType: 'text/csv',
            }
        },
        onError: (error) => {
            console.error('Ошибка экспорта в CSV:', error)
        },
    })
}

// Экспорт в JSON
export const useExportToJSON = () => {
    return useMutation({
        mutationFn: async (data: ExportData): Promise<ExportResult> => {
            const jsonContent = exportUtils.toJSON(data.events, data.spheres, data.options)
            const blob = new Blob([jsonContent], { type: 'application/json' })

            return {
                data: blob,
                filename: `balendip-data-${new Date().toISOString().split('T')[0]}.json`,
                mimeType: 'application/json',
            }
        },
        onError: (error) => {
            console.error('Ошибка экспорта в JSON:', error)
        },
    })
}

// Экспорт в PDF
export const useExportToPDF = () => {
    return useMutation({
        mutationFn: async (data: ExportData): Promise<ExportResult> => {
            const pdfBlob = await exportUtils.toPDF(data.events, data.spheres, data.options)

            return {
                data: pdfBlob,
                filename: `balendip-report-${new Date().toISOString().split('T')[0]}.pdf`,
                mimeType: 'application/pdf',
            }
        },
        onError: (error) => {
            console.error('Ошибка экспорта в PDF:', error)
        },
    })
}

// Экспорт в Excel
export const useExportToExcel = () => {
    return useMutation({
        mutationFn: async (data: ExportData): Promise<ExportResult> => {
            const excelBlob = await exportUtils.toExcel(data.events, data.spheres, data.options)

            return {
                data: excelBlob,
                filename: `balendip-events-${new Date().toISOString().split('T')[0]}.xlsx`,
                mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            }
        },
        onError: (error) => {
            console.error('Ошибка экспорта в Excel:', error)
        },
    })
}

// Универсальный экспорт
export const useExport = () => {
    const exportToCSV = useExportToCSV()
    const exportToJSON = useExportToJSON()
    const exportToPDF = useExportToPDF()
    const exportToExcel = useExportToExcel()

    const exportData = async (
        data: ExportData,
        format: ExportFormat
    ): Promise<ExportResult> => {
        switch (format.type) {
            case 'csv':
                return exportToCSV.mutateAsync(data)
            case 'json':
                return exportToJSON.mutateAsync(data)
            case 'pdf':
                return exportToPDF.mutateAsync(data)
            case 'excel':
                return exportToExcel.mutateAsync(data)
            default:
                throw new Error(`Неподдерживаемый формат экспорта: ${format.type}`)
        }
    }

    const downloadFile = (result: ExportResult) => {
        const url = URL.createObjectURL(result.data as Blob)
        const link = document.createElement('a')
        link.href = url
        link.download = result.filename
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        URL.revokeObjectURL(url)
    }

    const exportAndDownload = async (
        data: ExportData,
        format: ExportFormat
    ) => {
        try {
            const result = await exportData(data, format)
            downloadFile(result)
            return result
        } catch (error) {
            console.error('Ошибка экспорта и скачивания:', error)
            throw error
        }
    }

    return {
        // Действия
        exportData,
        exportAndDownload,
        downloadFile,

        // Состояния загрузки
        isExportingCSV: exportToCSV.isPending,
        isExportingJSON: exportToJSON.isPending,
        isExportingPDF: exportToPDF.isPending,
        isExportingExcel: exportToExcel.isPending,

        // Проверка, идет ли экспорт в любом формате
        isExporting: exportToCSV.isPending || exportToJSON.isPending ||
            exportToPDF.isPending || exportToExcel.isPending,

        // Ошибки
        csvError: exportToCSV.error,
        jsonError: exportToJSON.error,
        pdfError: exportToPDF.error,
        excelError: exportToExcel.error,
    }
}

// ===== УТИЛИТЫ ДЛЯ ЭКСПОРТА =====

// Фильтрация данных для экспорта
export const useExportDataFilter = () => {
    const filterEventsByDateRange = (
        events: Event[],
        startDate: string,
        endDate: string
    ): Event[] => {
        const start = new Date(startDate)
        const end = new Date(endDate)

        return events.filter((event: Event) => {
            const eventDate = new Date(event.date)
            return eventDate >= start && eventDate <= end
        })
    }

    const filterEventsBySpheres = (
        events: Event[],
        sphereIds: string[]
    ): Event[] => {
        if (sphereIds.length === 0) return events

        return events.filter((event: Event) =>
            event.spheres.some((sphereId: string) => sphereIds.includes(sphereId))
        )
    }

    const filterEventsByEmotion = (
        events: Event[],
        emotions: string[]
    ): Event[] => {
        if (emotions.length === 0) return events

        return events.filter((event: Event) => emotions.includes(event.emotion))
    }

    const sortEventsForExport = (
        events: Event[],
        sortBy: 'date' | 'title' | 'emotion' | 'spheres' = 'date',
        sortOrder: 'asc' | 'desc' = 'desc'
    ): Event[] => {
        const sorted = [...events].sort((a, b) => {
            let comparison = 0

            switch (sortBy) {
                case 'date':
                    comparison = new Date(a.date).getTime() - new Date(b.date).getTime()
                    break
                case 'title':
                    comparison = a.title.localeCompare(b.title)
                    break
                case 'emotion':
                    comparison = a.emotion.localeCompare(b.emotion)
                    break
                case 'spheres':
                    comparison = a.spheres.length - b.spheres.length
                    break
            }

            return sortOrder === 'asc' ? comparison : -comparison
        })

        return sorted
    }

    return {
        filterEventsByDateRange,
        filterEventsBySpheres,
        filterEventsByEmotion,
        sortEventsForExport,
    }
}

// Статистика для экспорта
export const useExportStats = () => {
    const calculateEventStats = (events: Event[]) => {
        if (events.length === 0) {
            return {
                total: 0,
                byEmotion: {},
                bySphere: {},
                byDate: {},
                averageScore: 0,
            }
        }

        const byEmotion: Record<string, number> = {}
        const bySphere: Record<string, number> = {}
        const byDate: Record<string, number> = {}
        let totalScore = 0

        events.forEach(event => {
            // Подсчет по эмоциям
            byEmotion[event.emotion] = (byEmotion[event.emotion] || 0) + 1

            // Подсчет по сферам
            event.spheres.forEach(sphereId => {
                bySphere[sphereId] = (bySphere[sphereId] || 0) + 1
            })

            // Подсчет по датам
            const dateKey = event.date.split('T')[0]
            byDate[dateKey] = (byDate[dateKey] || 0) + 1

            // Общий счет
            totalScore += (event.score || 0)
        })

        return {
            total: events.length,
            byEmotion,
            bySphere,
            byDate,
            averageScore: Math.round(totalScore / events.length),
        }
    }

    const calculateSphereStats = (spheres: LifeSphere[]) => {
        if (spheres.length === 0) {
            return {
                total: 0,
                averageScore: 0,
                highestScore: 0,
                lowestScore: 0,
                activeSpheres: 0,
            }
        }

        const scores = spheres.map(s => s.score)
        const total = spheres.length
        const averageScore = Math.round(scores.reduce((sum, score) => sum + score, 0) / total)
        const highestScore = Math.max(...scores)
        const lowestScore = Math.min(...scores)
        const activeSpheres = spheres.filter(s => s.score > 5).length

        return {
            total,
            averageScore,
            highestScore,
            lowestScore,
            activeSpheres,
        }
    }

    return {
        calculateEventStats,
        calculateSphereStats,
    }
}
