'use client'

import React, { useRef, useState, useMemo } from 'react'
import {
    Chart as ChartJS,
    RadialLinearScale,
    PointElement,
    LineElement,
    Filler,
    Tooltip,
    Legend,
} from 'chart.js'
import { Radar } from 'react-chartjs-2'
import { LifeSphere } from '@/types'

ChartJS.register(
    RadialLinearScale,
    PointElement,
    LineElement,
    Filler,
    Tooltip,
    Legend
)

interface WheelChartProps {
    spheres: LifeSphere[]
    onSphereClick?: (sphere: LifeSphere) => void
    className?: string
    size?: 'sm' | 'md' | 'lg'
    interactive?: boolean
}

export default function WheelChart({
    spheres,
    onSphereClick,
    className = '',
    size = 'md',
    interactive = true,
}: WheelChartProps) {
    const chartRef = useRef<ChartJS<'radar'>>(null)
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

    const sizeClasses = {
        sm: 'w-80 h-80 md:w-96 md:h-96',
        md: 'w-96 h-96 md:w-[28rem] md:h-[28rem]',
        lg: 'w-[32rem] h-[32rem] md:w-[40rem] md:h-[40rem] lg:w-[48rem] lg:h-[48rem]',
    }

    const chartData = useMemo(() => {
        const labels = spheres.map((sphere: LifeSphere) => sphere.name)
        const data = spheres.map((sphere: LifeSphere) => sphere.score)
        const colors = spheres.map((sphere: LifeSphere) => sphere.color)

        return {
            labels,
            datasets: [
                {
                    label: 'Баланс жизни',
                    data,
                    backgroundColor: colors.map((color: string) => `${color}20`),
                    borderColor: colors,
                    borderWidth: 2,
                    pointBackgroundColor: colors,
                    pointBorderColor: '#fff',
                    pointBorderWidth: 2,
                    pointRadius: 12,
                    pointHoverRadius: 16,
                    pointHoverBackgroundColor: colors,
                    pointHoverBorderColor: '#fff',
                    pointHoverBorderWidth: 5,
                },
            ],
        }
    }, [spheres])

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        animation: false, // Полностью отключаем анимацию
        scales: {
            r: {
                beginAtZero: true,
                max: 10,
                min: 0,
                ticks: {
                    stepSize: 2,
                    color: '#64748b',
                    font: {
                        size: 24,
                        weight: 500,
                    },
                },
                grid: {
                    color: '#e2e8f0',
                    lineWidth: 2,
                },
                pointLabels: {
                    color: '#475569',
                    font: {
                        size: 32,
                        weight: 600,
                    },
                    padding: 50,
                },
            },
        },
        plugins: {
            legend: {
                display: false,
            },
            tooltip: {
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                titleColor: '#fff',
                bodyColor: '#fff',
                borderColor: 'rgba(255, 255, 255, 0.2)',
                borderWidth: 1,
                cornerRadius: 8,
                displayColors: false,
                callbacks: {
                    title: (context: any) => {
                        return context[0].label
                    },
                    label: (context: any) => {
                        return `Оценка: ${context.parsed.r}/10`
                    },
                },
            },
        },
        interaction: {
            intersect: false,
            mode: 'nearest' as const,
        },
    }

    const handleChartClick = (event: any) => {
        if (!interactive || !onSphereClick) return

        const chart = chartRef.current
        if (!chart) return

        const points = chart.getElementsAtEventForMode(event, 'nearest', { intersect: false }, true)
        if (points.length > 0) {
            const firstPoint = points[0]
            const sphere = spheres[firstPoint.index]
            if (sphere) {
                onSphereClick(sphere)
            }
        }
    }

    const handleMouseMove = (event: any) => {
        if (!interactive) return

        const chart = chartRef.current
        if (!chart) return

        const points = chart.getElementsAtEventForMode(event, 'nearest', { intersect: false }, true)
        if (points.length > 0) {
            setHoveredIndex(points[0].index)
        } else {
            setHoveredIndex(null)
        }
    }

    const averageScore = useMemo(() => {
        if (spheres.length === 0) return 0
        return Math.round(spheres.reduce((sum: number, sphere: LifeSphere) => sum + sphere.score, 0) / spheres.length)
    }, [spheres])

    return (
        <div
            className={`relative ${sizeClasses[size]} ${className}`}
            style={{
                position: 'relative',
                top: 0,
                left: 0,
                transform: 'none',
                overflow: 'hidden'
            }}
        >
            {/* ОТЛАДОЧНАЯ ИНФОРМАЦИЯ */}
            <div className="absolute top-0 left-0 bg-red-500 text-white p-2 text-xs z-50">
                size: {size}<br />
                className: {className}<br />
                sizeClasses: {sizeClasses[size]}
            </div>

            {/* ВРЕМЕННОЕ ПРОСТОЕ КОЛЕСО ВМЕСТО CHART.JS */}
            <div className="w-full h-full flex items-center justify-center">
                <div className="w-[400px] h-[400px] bg-gradient-to-br from-blue-500 to-purple-600 rounded-full border-8 border-white shadow-2xl flex items-center justify-center">
                    <div className="text-center text-white">
                        <h1 className="text-3xl font-bold mb-4">Колесо жизни</h1>
                        <p className="text-xl">8 сфер</p>
                        <p className="text-2xl font-bold mt-2">Средний балл: {averageScore}</p>
                    </div>
                </div>
            </div>

            {/* Индикатор среднего балла */}
            <div
                className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-2xl px-4 py-2 shadow-lg border border-secondary-200"
            >
                <div className="text-center">
                    <div className="text-2xl font-bold text-primary-600">{averageScore}</div>
                    <div className="text-sm text-secondary-600">средний балл</div>
                </div>
            </div>
        </div>
    )
} 