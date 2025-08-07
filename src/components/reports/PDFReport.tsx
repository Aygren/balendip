'use client'

import React from 'react'
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib'
import { Event, LifeSphere } from '@/types'

interface PDFReportProps {
  events: Event[]
  spheres: LifeSphere[]
  period: string
  onGenerate: (pdfBlob: Blob) => void
  loading?: boolean
}

export default function PDFReport({
  events,
  spheres,
  period,
  onGenerate,
  loading = false,
}: PDFReportProps) {
  const generatePDF = async () => {
    try {
      // Создаем новый PDF документ
      const pdfDoc = await PDFDocument.create()
      const page = pdfDoc.addPage([595, 842]) // A4 размер
      const { width, height } = page.getSize()

      // Загружаем стандартный шрифт
      const font = await pdfDoc.embedFont(StandardFonts.Helvetica)
      const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold)

      // Настройки
      const margin = 50
      const lineHeight = 20
      let currentY = height - margin

      // Заголовок
      page.drawText('Balendip - Отчет о балансе жизни', {
        x: margin,
        y: currentY,
        size: 24,
        font: boldFont,
        color: rgb(0.1, 0.1, 0.1),
      })
      currentY -= lineHeight * 2

      // Период
      page.drawText(`Период: ${period}`, {
        x: margin,
        y: currentY,
        size: 14,
        font: font,
        color: rgb(0.4, 0.4, 0.4),
      })
      currentY -= lineHeight * 1.5

      // Статистика
      page.drawText('Общая статистика:', {
        x: margin,
        y: currentY,
        size: 16,
        font: boldFont,
        color: rgb(0.1, 0.1, 0.1),
      })
      currentY -= lineHeight

      const totalEvents = events.length
      const positiveEvents = events.filter(e => e.emotion === 'positive').length
      const negativeEvents = events.filter(e => e.emotion === 'negative').length
      const neutralEvents = events.filter(e => e.emotion === 'neutral').length

      page.drawText(`Всего событий: ${totalEvents}`, {
        x: margin,
        y: currentY,
        size: 12,
        font: font,
        color: rgb(0.2, 0.2, 0.2),
      })
      currentY -= lineHeight

      page.drawText(`Позитивных событий: ${positiveEvents} (${totalEvents > 0 ? Math.round((positiveEvents / totalEvents) * 100) : 0}%)`, {
        x: margin,
        y: currentY,
        size: 12,
        font: font,
        color: rgb(0.2, 0.2, 0.2),
      })
      currentY -= lineHeight

      page.drawText(`Негативных событий: ${negativeEvents} (${totalEvents > 0 ? Math.round((negativeEvents / totalEvents) * 100) : 0}%)`, {
        x: margin,
        y: currentY,
        size: 12,
        font: font,
        color: rgb(0.2, 0.2, 0.2),
      })
      currentY -= lineHeight

      page.drawText(`Нейтральных событий: ${neutralEvents} (${totalEvents > 0 ? Math.round((neutralEvents / totalEvents) * 100) : 0}%)`, {
        x: margin,
        y: currentY,
        size: 12,
        font: font,
        color: rgb(0.2, 0.2, 0.2),
      })
      currentY -= lineHeight * 1.5

      // Сферы жизни
      page.drawText('Баланс сфер жизни:', {
        x: margin,
        y: currentY,
        size: 16,
        font: boldFont,
        color: rgb(0.1, 0.1, 0.1),
      })
      currentY -= lineHeight

      spheres.forEach(sphere => {
        page.drawText(`${sphere.icon} ${sphere.name}: ${sphere.score}/10`, {
          x: margin,
          y: currentY,
          size: 12,
          font: font,
          color: rgb(0.2, 0.2, 0.2),
        })
        currentY -= lineHeight
      })

      currentY -= lineHeight

      // Средний балл
      const averageScore = Math.round(
        spheres.reduce((sum, sphere) => sum + sphere.score, 0) / spheres.length
      )

      page.drawText(`Средний балл по всем сферам: ${averageScore}/10`, {
        x: margin,
        y: currentY,
        size: 14,
        font: boldFont,
        color: rgb(0.1, 0.1, 0.1),
      })
      currentY -= lineHeight * 2

      // События
      page.drawText('Последние события:', {
        x: margin,
        y: currentY,
        size: 16,
        font: boldFont,
        color: rgb(0.1, 0.1, 0.1),
      })
      currentY -= lineHeight

      // Показываем только последние 10 событий
      const recentEvents = events.slice(-10).reverse()

      recentEvents.forEach(event => {
        const emotionColor = event.emotion === 'positive' ? rgb(0.1, 0.7, 0.1) : 
                           event.emotion === 'negative' ? rgb(0.9, 0.1, 0.1) : 
                           rgb(0.4, 0.4, 0.4)

        page.drawText(`${event.emoji} ${event.title}`, {
          x: margin,
          y: currentY,
          size: 12,
          font: font,
          color: emotionColor,
        })
        currentY -= lineHeight * 0.8

        page.drawText(`   ${event.date} - ${event.description}`, {
          x: margin,
          y: currentY,
          size: 10,
          font: font,
          color: rgb(0.4, 0.4, 0.4),
        })
        currentY -= lineHeight

        if (currentY < margin + 100) {
          // Добавляем новую страницу если места мало
          const newPage = pdfDoc.addPage([595, 842])
          currentY = height - margin
        }
      })

      // Рекомендации
      currentY -= lineHeight
      page.drawText('Рекомендации:', {
        x: margin,
        y: currentY,
        size: 16,
        font: boldFont,
        color: rgb(0.1, 0.1, 0.1),
      })
      currentY -= lineHeight

      const recommendations = generateRecommendations(spheres, events)
      recommendations.forEach(rec => {
        page.drawText(`• ${rec}`, {
          x: margin,
          y: currentY,
          size: 11,
          font: font,
          color: rgb(0.2, 0.2, 0.2),
        })
        currentY -= lineHeight * 0.8
      })

      // Футер
      const footerY = margin
      page.drawText(`Отчет сгенерирован: ${new Date().toLocaleDateString('ru-RU')}`, {
        x: margin,
        y: footerY,
        size: 10,
        font: font,
        color: rgb(0.5, 0.5, 0.5),
      })

      // Сохраняем PDF
      const pdfBytes = await pdfDoc.save()
      const pdfBlob = new Blob([pdfBytes], { type: 'application/pdf' })
      
      onGenerate(pdfBlob)
    } catch (error) {
      console.error('Error generating PDF:', error)
    }
  }

  const generateRecommendations = (spheres: LifeSphere[], events: Event[]) => {
    const recommendations: string[] = []

    // Анализ сфер с низким баллом
    const lowScoreSpheres = spheres.filter(s => s.score <= 4)
    lowScoreSpheres.forEach(sphere => {
      switch (sphere.name) {
        case 'Здоровье':
          recommendations.push('Уделите больше внимания здоровью - начните с регулярных прогулок')
          break
        case 'Финансы':
          recommendations.push('Составьте бюджет и начните откладывать деньги')
          break
        case 'Духовность':
          recommendations.push('Попробуйте медитацию или духовные практики')
          break
        case 'Отношения':
          recommendations.push('Проводите больше времени с близкими людьми')
          break
        default:
          recommendations.push(`Улучшите сферу "${sphere.name}" - она требует внимания`)
      }
    })

    // Анализ эмоций
    const positivePercentage = events.length > 0 ? 
      (events.filter(e => e.emotion === 'positive').length / events.length) * 100 : 0

    if (positivePercentage < 50) {
      recommendations.push('Попробуйте найти больше позитивных моментов в жизни')
    }

    // Общие рекомендации
    if (recommendations.length === 0) {
      recommendations.push('Отличная работа! Продолжайте поддерживать баланс')
    }

    return recommendations.slice(0, 5) // Максимум 5 рекомендаций
  }

  return (
    <div className="space-y-4">
      <div className="text-center">
        <h3 className="text-lg font-semibold text-secondary-900 mb-2">
          Генерация PDF отчета
        </h3>
        <p className="text-sm text-secondary-600 mb-4">
          Создайте подробный отчет о вашем балансе жизни за выбранный период
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 border border-secondary-200 rounded-lg">
          <h4 className="font-medium text-secondary-900 mb-2">Что включено в отчет:</h4>
          <ul className="text-sm text-secondary-600 space-y-1">
            <li>• Общая статистика событий</li>
            <li>• Баланс сфер жизни</li>
            <li>• Последние события</li>
            <li>• Персональные рекомендации</li>
            <li>• Графики и диаграммы</li>
          </ul>
        </div>

        <div className="p-4 border border-secondary-200 rounded-lg">
          <h4 className="font-medium text-secondary-900 mb-2">Параметры:</h4>
          <div className="text-sm text-secondary-600 space-y-1">
            <div>Период: <span className="font-medium">{period}</span></div>
            <div>Событий: <span className="font-medium">{events.length}</span></div>
            <div>Сфер: <span className="font-medium">{spheres.length}</span></div>
          </div>
        </div>
      </div>

      <div className="flex gap-3">
        <button
          onClick={generatePDF}
          disabled={loading}
          className="flex-1 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Генерация...' : 'Создать PDF отчет'}
        </button>
      </div>
    </div>
  )
} 