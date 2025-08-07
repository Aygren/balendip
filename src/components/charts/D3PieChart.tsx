'use client'

import React, { useRef, useEffect, useMemo } from 'react'
import * as d3 from 'd3'

interface PieData {
  label: string
  value: number
  color?: string
}

interface D3PieChartProps {
  data: PieData[]
  width?: number
  height?: number
  className?: string
  onSliceClick?: (data: PieData) => void
}

export const D3PieChart: React.FC<D3PieChartProps> = ({
  data,
  width = 400,
  height = 400,
  className = '',
  onSliceClick
}) => {
  const svgRef = useRef<SVGSVGElement>(null)

  // Мемоизируем вычисления для производительности
  const { pie, arc, colorScale } = useMemo(() => {
    if (!data.length) return { pie: null, arc: null, colorScale: null }

    // Создаем функцию для создания круговой диаграммы
    const pie = d3.pie<PieData>()
      .value(d => d.value)
      .sort(null)

    // Создаем генератор дуг
    const radius = Math.min(width, height) / 2 - 40
    const arc = d3.arc<d3.PieArcDatum<PieData>>()
      .innerRadius(radius * 0.4) // Для кольцевой диаграммы
      .outerRadius(radius)

    // Создаем цветовую шкалу
    const colorScale = d3.scaleOrdinal()
      .domain(data.map(d => d.label))
      .range(data.map(d => d.color || d3.schemeCategory10))

    return { pie, arc, colorScale }
  }, [data, width, height])

  // Рендерим график
  useEffect(() => {
    if (!svgRef.current || !pie || !arc || !colorScale) return

    const svg = d3.select(svgRef.current)
    const pieData = pie(data)

    // Очищаем предыдущий контент
    svg.selectAll('*').remove()

    // Создаем группу для диаграммы
    const g = svg.append('g')
      .attr('transform', `translate(${width / 2},${height / 2})`)

    // Добавляем секции
    const slices = g.selectAll('.slice')
      .data(pieData)
      .enter()
      .append('g')
      .attr('class', 'slice')

    slices.append('path')
      .attr('d', arc)
      .attr('fill', d => colorScale(d.data.label))
      .attr('stroke', 'white')
      .attr('stroke-width', 2)
      .on('mouseover', function(event, d) {
        d3.select(this)
          .attr('stroke-width', 3)
          .attr('stroke', '#1F2937')
        
        // Показываем подсказку
        const tooltip = d3.select('body').append('div')
          .attr('class', 'tooltip')
          .style('position', 'absolute')
          .style('background', 'rgba(0,0,0,0.8)')
          .style('color', 'white')
          .style('padding', '8px')
          .style('border-radius', '4px')
          .style('font-size', '12px')
          .style('pointer-events', 'none')
          .style('z-index', '1000')

        tooltip.html(`
          <strong>${d.data.label}</strong><br/>
          Значение: ${d.data.value}<br/>
          Процент: ${((d.endAngle - d.startAngle) / (2 * Math.PI) * 100).toFixed(1)}%
        `)

        tooltip.style('left', (event.pageX + 10) + 'px')
          .style('top', (event.pageY - 10) + 'px')
      })
      .on('mouseout', function(event, d) {
        d3.select(this)
          .attr('stroke-width', 2)
          .attr('stroke', 'white')
        
        d3.selectAll('.tooltip').remove()
      })
      .on('click', function(event, d) {
        if (onSliceClick) {
          onSliceClick(d.data)
        }
      })

    // Добавляем текст с процентами
    slices.append('text')
      .attr('transform', d => `translate(${arc.centroid(d)})`)
      .attr('text-anchor', 'middle')
      .attr('dy', '0.35em')
      .style('font-size', '12px')
      .style('font-weight', 'bold')
      .style('fill', 'white')
      .style('text-shadow', '1px 1px 2px rgba(0,0,0,0.8)')
      .text(d => {
        const percentage = ((d.endAngle - d.startAngle) / (2 * Math.PI) * 100)
        return percentage > 5 ? `${percentage.toFixed(1)}%` : ''
      })

    // Добавляем легенду
    const legend = svg.append('g')
      .attr('class', 'legend')
      .attr('transform', `translate(${width - 120}, 20)`)

    const legendItems = legend.selectAll('.legend-item')
      .data(data)
      .enter()
      .append('g')
      .attr('class', 'legend-item')
      .attr('transform', (d, i) => `translate(0, ${i * 20})`)

    legendItems.append('rect')
      .attr('width', 12)
      .attr('height', 12)
      .attr('fill', d => colorScale(d.label))
      .attr('rx', 2)

    legendItems.append('text')
      .attr('x', 18)
      .attr('y', 9)
      .attr('dy', '0.35em')
      .style('font-size', '12px')
      .text(d => d.label)

  }, [data, pie, arc, colorScale, width, height, onSliceClick])

  if (!data.length) {
    return (
      <div className={`flex items-center justify-center ${className}`} style={{ width, height }}>
        <p className="text-secondary-500">Нет данных для отображения</p>
      </div>
    )
  }

  return (
    <svg
      ref={svgRef}
      width={width}
      height={height}
      className={className}
    />
  )
}
