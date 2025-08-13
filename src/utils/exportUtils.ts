import { Event, LifeSphere, ExportOptions } from '@/types'

// ===== УТИЛИТЫ ДЛЯ ЭКСПОРТА ДАННЫХ =====

export const exportUtils = {
    // ===== ЭКСПОРТ В CSV =====
    toCSV: (events: Event[], spheres: LifeSphere[], options: ExportOptions): string => {
        const headers = [
            'Дата',
            'Название',
            'Описание',
            'Эмоция',
            'Сферы жизни',
            'Оценка',
            'Время',
            'Место',
        ]

        const rows = events.map(event => {
            const eventSpheres = event.spheres
                .map(sphereId => {
                    const sphere = spheres.find(s => s.id === sphereId)
                    return sphere?.name || 'Неизвестно'
                })
                .join(', ')

            return [
                formatDate(event.date),
                event.title,
                event.description || '',
                getEmotionLabel(event.emotion),
                eventSpheres,
                event.score?.toString() || '',
                event.time || '',
                event.location || '',
            ]
        })

        const csvContent = [headers, ...rows]
            .map(row => row.map(cell => `"${cell}"`).join(','))
            .join('\n')

        return csvContent
    },

    // ===== ЭКСПОРТ В JSON =====
    toJSON: (events: Event[], spheres: LifeSphere[], options: ExportOptions): string => {
        const exportData = {
            metadata: {
                exportedAt: new Date().toISOString(),
                totalEvents: events.length,
                totalSpheres: spheres.length,
                options,
            },
            spheres,
            events,
        }

        return JSON.stringify(exportData, null, 2)
    },

    // ===== ЭКСПОРТ В PDF =====
    toPDF: async (events: Event[], spheres: LifeSphere[], options: ExportOptions): Promise<Blob> => {
        // Динамический импорт jsPDF для уменьшения размера бандла
        const { jsPDF } = await import('jspdf')

        const doc = new jsPDF()
        const pageWidth = doc.internal.pageSize.width
        const margin = 20
        const contentWidth = pageWidth - (margin * 2)

        let yPosition = margin
        const lineHeight = 7
        const sectionSpacing = 15

        // Заголовок
        doc.setFontSize(20)
        doc.setFont('helvetica', 'bold')
        doc.text('Отчет Balendip', pageWidth / 2, yPosition, { align: 'center' })
        yPosition += lineHeight + sectionSpacing

        // Метаданные
        doc.setFontSize(12)
        doc.setFont('helvetica', 'normal')
        doc.text(`Дата экспорта: ${formatDate(new Date().toISOString())}`, margin, yPosition)
        yPosition += lineHeight
        doc.text(`Всего событий: ${events.length}`, margin, yPosition)
        yPosition += lineHeight
        doc.text(`Всего сфер: ${spheres.length}`, margin, yPosition)
        yPosition += lineHeight + sectionSpacing

        // Сферы жизни
        if (spheres.length > 0) {
            doc.setFontSize(14)
            doc.setFont('helvetica', 'bold')
            doc.text('Сферы жизни:', margin, yPosition)
            yPosition += lineHeight + 5

            doc.setFontSize(10)
            doc.setFont('helvetica', 'normal')

            spheres.forEach(sphere => {
                if (yPosition > doc.internal.pageSize.height - margin) {
                    doc.addPage()
                    yPosition = margin
                }

                doc.text(`${sphere.icon} ${sphere.name} (Оценка: ${sphere.score}/10)`, margin, yPosition)
                yPosition += lineHeight
            })

            yPosition += sectionSpacing
        }

        // События
        if (events.length > 0) {
            doc.setFontSize(14)
            doc.setFont('helvetica', 'bold')
            doc.text('События:', margin, yPosition)
            yPosition += lineHeight + 5

            doc.setFontSize(10)
            doc.setFont('helvetica', 'normal')

            events.forEach((event, index) => {
                if (yPosition > doc.internal.pageSize.height - margin - 30) {
                    doc.addPage()
                    yPosition = margin
                }

                // Заголовок события
                doc.setFont('helvetica', 'bold')
                doc.text(`${index + 1}. ${event.title}`, margin, yPosition)
                yPosition += lineHeight

                // Детали события
                doc.setFont('helvetica', 'normal')
                doc.text(`Дата: ${formatDate(event.date)}`, margin, yPosition)
                yPosition += lineHeight

                if (event.description) {
                    const description = truncateText(event.description, contentWidth - 20)
                    doc.text(`Описание: ${description}`, margin, yPosition)
                    yPosition += lineHeight
                }

                doc.text(`Эмоция: ${getEmotionLabel(event.emotion)}`, margin, yPosition)
                yPosition += lineHeight

                const eventSpheres = event.spheres
                    .map(sphereId => {
                        const sphere = spheres.find(s => s.id === sphereId)
                        return sphere?.name || 'Неизвестно'
                    })
                    .join(', ')

                doc.text(`Сферы: ${eventSpheres}`, margin, yPosition)
                yPosition += lineHeight

                if (event.score) {
                    doc.text(`Оценка: ${event.score}/10`, margin, yPosition)
                    yPosition += lineHeight
                }

                yPosition += 5
            })
        }

        return doc.output('blob')
    },

    // ===== ЭКСПОРТ В EXCEL =====
    toExcel: async (events: Event[], spheres: LifeSphere[], options: ExportOptions): Promise<Blob> => {
        // Динамический импорт xlsx для уменьшения размера бандла
        const XLSX = await import('xlsx')

        // Создаем рабочую книгу
        const workbook = XLSX.utils.book()

        // Лист со сферами жизни
        const spheresData = spheres.map(sphere => ({
            'Название': sphere.name,
            'Иконка': sphere.icon,
            'Цвет': sphere.color,
            'Оценка': sphere.score,
            'По умолчанию': sphere.is_default ? 'Да' : 'Нет',
            'Дата создания': formatDate(sphere.created_at),
        }))

        const spheresSheet = XLSX.utils.json_to_sheet(spheresData)
        XLSX.utils.book_append_sheet(workbook, spheresSheet, 'Сферы жизни')

        // Лист с событиями
        const eventsData = events.map(event => {
            const eventSpheres = event.spheres
                .map(sphereId => {
                    const sphere = spheres.find(s => s.id === sphereId)
                    return sphere?.name || 'Неизвестно'
                })
                .join(', ')

            return {
                'Дата': formatDate(event.date),
                'Название': event.title,
                'Описание': event.description || '',
                'Эмоция': getEmotionLabel(event.emotion),
                'Сферы жизни': eventSpheres,
                'Оценка': event.score || '',
                'Время': event.time || '',
                'Место': event.location || '',
                'Дата создания': formatDate(event.created_at),
            }
        })

        const eventsSheet = XLSX.utils.json_to_sheet(eventsData)
        XLSX.utils.book_append_sheet(workbook, eventsSheet, 'События')

        // Лист со статистикой
        const statsData = [
            { 'Метрика': 'Всего событий', 'Значение': events.length },
            { 'Метрика': 'Всего сфер', 'Значение': spheres.length },
            { 'Метрика': 'Средняя оценка событий', 'Значение': events.length > 0 ? Math.round(events.reduce((sum, e) => sum + (e.score || 0), 0) / events.length) : 0 },
            { 'Метрика': 'Средняя оценка сфер', 'Значение': spheres.length > 0 ? Math.round(spheres.reduce((sum, s) => sum + s.score, 0) / spheres.length) : 0 },
            { 'Метрика': 'Активные сферы (>5)', 'Значение': spheres.filter(s => s.score > 5).length },
            { 'Метрика': 'Дата экспорта', 'Значение': formatDate(new Date().toISOString()) },
        ]

        const statsSheet = XLSX.utils.json_to_sheet(statsData)
        XLSX.utils.book_append_sheet(workbook, statsSheet, 'Статистика')

        // Настройка ширины столбцов
        const sheets = [spheresSheet, eventsSheet, statsSheet]
        sheets.forEach(sheet => {
            const columnWidths = Object.keys(sheet).map(key => {
                const maxLength = Math.max(
                    key.length,
                    ...Object.values(sheet).map(cell => String(cell).length)
                )
                return { wch: Math.min(Math.max(maxLength + 2, 10), 50) }
            })
            sheet['!cols'] = columnWidths
        })

        // Экспорт в blob
        const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' })
        return new Blob([excelBuffer], {
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        })
    },
}

// ===== ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ =====

function formatDate(dateString: string): string {
    try {
        const date = new Date(dateString)
        return date.toLocaleDateString('ru-RU', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
        })
    } catch {
        return dateString
    }
}

function getEmotionLabel(emotion: string): string {
    const emotionLabels: Record<string, string> = {
        positive: 'Позитивная',
        neutral: 'Нейтральная',
        negative: 'Негативная',
    }

    return emotionLabels[emotion] || emotion
}

function truncateText(text: string, maxWidth: number): string {
    if (text.length <= maxWidth / 3) return text

    return text.substring(0, Math.floor(maxWidth / 3)) + '...'
}

// ===== ЭКСПОРТ ПО УМОЛЧАНИЮ =====
export default exportUtils
