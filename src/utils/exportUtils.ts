import { Event, LifeSphere } from '@/types'

interface ExportOptions {
    format: 'pdf' | 'csv'
    dateRange: { start: string; end: string }
    events: Event[]
    spheres: LifeSphere[]
}

export const exportEvents = async (options: ExportOptions) => {
    const { format, dateRange, events, spheres } = options

    const filteredEvents = events.filter(event => {
        const eventDate = new Date(event.date)
        const startDate = new Date(dateRange.start)
        const endDate = new Date(dateRange.end)
        return eventDate >= startDate && eventDate <= endDate
    })

    if (format === 'csv') {
        return exportToCSV(filteredEvents, spheres, dateRange)
    } else {
        return exportToPDF(filteredEvents, spheres, dateRange)
    }
}

const exportToCSV = (events: Event[], spheres: LifeSphere[], dateRange: { start: string; end: string }) => {
    const getSphereName = (sphereId: string) => {
        const sphere = spheres.find(s => s.id === sphereId)
        return sphere?.name || 'Неизвестно'
    }

    const getEmotionLabel = (emotion: string) => {
        const labels = {
            positive: 'Позитивное',
            neutral: 'Нейтральное',
            negative: 'Негативное'
        }
        return labels[emotion as keyof typeof labels] || emotion
    }

    const formatDate = (date: string) => {
        return new Date(date).toLocaleDateString('ru-RU')
    }

    const formatTime = (time: string) => {
        return new Date(time).toLocaleTimeString('ru-RU', {
            hour: '2-digit',
            minute: '2-digit'
        })
    }

    // Заголовки CSV
    const headers = [
        'Дата',
        'Время',
        'Название',
        'Описание',
        'Эмодзи',
        'Эмоция',
        'Сферы жизни',
        'Дата создания'
    ]

    // Данные для CSV
    const csvData = events.map(event => [
        formatDate(event.date),
        formatTime(event.created_at),
        event.title,
        event.description || '',
        event.emoji,
        getEmotionLabel(event.emotion),
        event.spheres.map(getSphereName).join(', '),
        formatDate(event.created_at)
    ])

    // Создаем CSV строку
    const csvContent = [
        headers.join(','),
        ...csvData.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n')

    // Создаем и скачиваем файл
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', `balendip-events-${dateRange.start}-${dateRange.end}.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
}

const exportToPDF = async (events: Event[], spheres: LifeSphere[], dateRange: { start: string; end: string }) => {
    const { jsPDF } = await import('jspdf')
    const doc = new jsPDF()

    // Настройка шрифта для кириллицы
    doc.setFont('helvetica')
    doc.setFontSize(12)

    let yPosition = 20
    const pageHeight = 280
    const margin = 20
    const lineHeight = 7

    // Заголовок
    doc.setFontSize(18)
    doc.text('Отчет событий Balendip', margin, yPosition)
    yPosition += 15

    // Период
    doc.setFontSize(12)
    const startDate = new Date(dateRange.start).toLocaleDateString('ru-RU')
    const endDate = new Date(dateRange.end).toLocaleDateString('ru-RU')
    doc.text(`Период: ${startDate} - ${endDate}`, margin, yPosition)
    yPosition += 10

    // Статистика
    const stats = {
        total: events.length,
        positive: events.filter(e => e.emotion === 'positive').length,
        neutral: events.filter(e => e.emotion === 'neutral').length,
        negative: events.filter(e => e.emotion === 'negative').length,
    }

    doc.text(`Всего событий: ${stats.total}`, margin, yPosition)
    yPosition += lineHeight
    doc.text(`Позитивных: ${stats.positive}`, margin, yPosition)
    yPosition += lineHeight
    doc.text(`Нейтральных: ${stats.neutral}`, margin, yPosition)
    yPosition += lineHeight
    doc.text(`Негативных: ${stats.negative}`, margin, yPosition)
    yPosition += 15

    // Функции для форматирования
    const getSphereName = (sphereId: string) => {
        const sphere = spheres.find(s => s.id === sphereId)
        return sphere?.name || 'Неизвестно'
    }

    const getEmotionLabel = (emotion: string) => {
        const labels = {
            positive: 'Позитивное',
            neutral: 'Нейтральное',
            negative: 'Негативное'
        }
        return labels[emotion as keyof typeof labels] || emotion
    }

    const formatDate = (date: string) => {
        return new Date(date).toLocaleDateString('ru-RU')
    }

    const formatTime = (time: string) => {
        return new Date(time).toLocaleTimeString('ru-RU', {
            hour: '2-digit',
            minute: '2-digit'
        })
    }

    // Группировка событий по датам
    const groupedEvents = groupEventsByDate(events)

    // Добавляем события
    for (const [date, dayEvents] of groupedEvents) {
        // Проверяем, нужна ли новая страница
        if (yPosition > pageHeight) {
            doc.addPage()
            yPosition = 20
        }

        // Дата
        doc.setFontSize(14)
        doc.setFont('helvetica', 'bold')
        doc.text(formatDate(date), margin, yPosition)
        yPosition += lineHeight

        // События за день
        doc.setFontSize(10)
        doc.setFont('helvetica', 'normal')

        for (const event of dayEvents) {
            // Проверяем, нужна ли новая страница
            if (yPosition > pageHeight - 30) {
                doc.addPage()
                yPosition = 20
            }

            // Название события
            doc.setFont('helvetica', 'bold')
            doc.text(`${event.emoji} ${event.title}`, margin, yPosition)
            yPosition += lineHeight

            // Описание
            if (event.description) {
                doc.setFont('helvetica', 'normal')
                const description = event.description.length > 50
                    ? event.description.substring(0, 50) + '...'
                    : event.description
                doc.text(description, margin + 10, yPosition)
                yPosition += lineHeight
            }

            // Метаданные
            doc.setFont('helvetica', 'italic')
            const metadata = [
                `Время: ${formatTime(event.created_at)}`,
                `Эмоция: ${getEmotionLabel(event.emotion)}`,
                `Сферы: ${event.spheres.map(getSphereName).join(', ')}`
            ]

            for (const meta of metadata) {
                doc.text(meta, margin + 10, yPosition)
                yPosition += lineHeight
            }

            yPosition += 5
        }

        yPosition += 5
    }

    // Сохраняем PDF
    doc.save(`balendip-events-${dateRange.start}-${dateRange.end}.pdf`)
}

// Вспомогательные функции
const groupEventsByDate = (events: Event[]) => {
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
}

const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('ru-RU', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    })
}

const getEmotionLabel = (emotion: string) => {
    const labels = {
        positive: 'Позитивное',
        neutral: 'Нейтральное',
        negative: 'Негативное'
    }
    return labels[emotion as keyof typeof labels] || emotion
}
