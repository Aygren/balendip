'use client'

import React, { useEffect, useRef, useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    Chart as ChartJS,
    RadialLinearScale,
    PointElement,
    LineElement,
    Filler,
    Tooltip,
    Legend,
    ChartTypeRegistry,
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

const containerVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
        opacity: 1,
        scale: 1,
        transition: {
            duration: 0.5,
            ease: "easeOut" as const
        }
    },
    exit: {
        opacity: 0,
        scale: 0.8,
        transition: {
            duration: 0.3,
            ease: "easeIn" as const
        }
    }
}

const scoreVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.4,
            ease: "easeOut" as const
        }
    }
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
    const [isAnimating, setIsAnimating] = useState(false)

    const sizeClasses = {
        sm: 'w-64 h-64',
        md: 'w-80 h-80',
        lg: 'w-96 h-96',
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
                    pointRadius: 6,
                    pointHoverRadius: 8,
                    pointHoverBackgroundColor: colors,
                    pointHoverBorderColor: '#fff',
                    pointHoverBorderWidth: 3,
                },
            ],
        }
    }, [spheres])

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        animation: {
            duration: 1000,
            easing: 'easeInOutQuart' as const,
        },
        scales: {
            r: {
                beginAtZero: true,
                max: 10,
                min: 0,
                ticks: {
                    stepSize: 2,
                    color: '#64748b',
                    font: {
                        size: 12,
                        weight: 500,
                    },
                },
                grid: {
                    color: '#e2e8f0',
                    lineWidth: 1,
                },
                pointLabels: {
                    color: '#475569',
                    font: {
                        size: 14,
                        weight: 600,
                    },
                    padding: 20,
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

    // Анимация при изменении данных
    useEffect(() => {
        if (chartRef.current) {
            setIsAnimating(true)
            const timer = setTimeout(() => {
                setIsAnimating(false)
            }, 1000)
            return () => clearTimeout(timer)
        }
    }, [spheres])

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
        <motion.div
            className={`relative ${sizeClasses[size]} ${className}`}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
        >
            {/* График */}
            <div className="relative w-full h-full">
                <Radar
                    ref={chartRef}
                    data={chartData}
                    options={options}
                    onClick={handleChartClick}
                    onMouseMove={handleMouseMove}
                />

                {/* Анимация при обновлении */}
                <AnimatePresence>
                    {isAnimating && (
                        <motion.div
                            className="absolute inset-0 bg-white bg-opacity-50 rounded-full flex items-center justify-center"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Средний балл в центре */}
            <motion.div
                className="absolute inset-0 flex items-center justify-center pointer-events-none"
                variants={scoreVariants}
                initial="hidden"
                animate="visible"
            >
                <div className="text-center">
                    <motion.div
                        className="text-3xl font-bold text-primary-600"
                        key={averageScore}
                        initial={{ scale: 1.2, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.3, ease: "easeOut" }}
                    >
                        {averageScore}
                    </motion.div>
                    <div className="text-sm text-secondary-600 mb-2">средний балл</div>
                </div>
            </motion.div>

            {/* Индикатор сфер */}
            <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2">
                <div className="flex space-x-2">
                    {spheres.map((sphere: LifeSphere, index: number) => (
                        <motion.div
                            key={sphere.id}
                            className={`w-3 h-3 rounded-full cursor-pointer ${hoveredIndex === index ? 'scale-125' : ''
                                }`}
                            style={{ backgroundColor: sphere.color }}
                            whileHover={{ scale: 1.2 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => onSphereClick?.(sphere)}
                            title={sphere.name}
                        />
                    ))}
                </div>
            </div>
        </motion.div>
    )
} 