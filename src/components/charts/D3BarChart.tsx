'use client'

import React, { useRef, useEffect, useMemo } from 'react'
import * as d3 from 'd3'

interface BarData {
  label: string
  value: number
  color?: string
}

interface D3BarChartProps {
  data: BarData[]
  width?: number
  height?: number
  margin?: {
    top: number
    right: number
    bottom: number
    left: number
  }
  className?: string
  onBarClick?: (data: BarData) => void
}

export const D3BarChart: React.FC<D3BarChartProps> = ({
  data,
  width = 600,
  height = 400,
  margin = { top: 20, right: 20, bottom: 60, left: 60 },
  className = '',
  onBarClick
}) => {
  const svgRef = useRef<SVGSVGElement>(null)

  // Мемоизируем вычисления для производительности
  const { xScale, yScale, colorScale } = useMemo(() => {
    if (!data.length) return { xScale: null, yScale: null, colorScale: null }

    // Создаем шкалы
    const xScale = d3.scaleBand()
      .domain(data.map(d => d.label))
      .range([margin.left, width - margin.right])
      .padding(0.1)

    const yScale = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.value) || 0])
      .range([height - margin.bottom, margin.top])

    // Создаем цветовую шкалу
    const colorScale = d3.scaleOrdinal()
      .domain(data.map(d => d.label))
      .range(data.map(d => d.color || d3.schemeCategory10))

    return { xScale, yScale, colorScale }
  }, [data, width, height, margin])

  // Рендерим график
  useEffect(() => {
    if (!svgRef.current || !xScale || !yScale || !colorScale) return

    const svg = d3.select(svgRef.current)

    // Очищаем предыдущий контент
    svg.selectAll('*').remove()

    // Добавляем ось X
    const xAxis = d3.axisBottom(xScale)

    svg.append('g')
      .attr('transform', `translate(0,${height - margin.bottom})`)
      .call(xAxis)
      .selectAll('text')
      .style('text-anchor', 'end')
      .attr('dx', '-.8em')
      .attr('dy', '.15em')
      .attr('transform', 'rotate(-45)')

    // Добавляем ось Y
    const yAxis = d3.axisLeft(yScale)
      .ticks(5)

    svg.append('g')
      .attr('transform', `translate(${margin.left},0)`)
      .call(yAxis)

    // Добавляем столбцы
    svg.selectAll('.bar')
      .data(data)
      .enter()
      .append('rect')
      .attr('class', 'bar')
      .attr('x', d => xScale(d.label)!)
      .attr('y', d => yScale(d.value))
      .attr('width', xScale.bandwidth())
      .attr('height', d => height - margin.bottom - yScale(d.value))
      .attr('fill', d => colorScale(d.label) as string)
      .attr('rx', 4)
      .on('mouseover', function (event, d) {
        d3.select(this)
          .attr('opacity', 0.8)
          .attr('stroke', '#1F2937')
          .attr('stroke-width', 2)

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
          <strong>${d.label}</strong><br/>
          Значение: ${d.value}
        `)

        tooltip.style('left', (event.pageX + 10) + 'px')
          .style('top', (event.pageY - 10) + 'px')
      })
      .on('mouseout', function (event, d) {
        d3.select(this)
          .attr('opacity', 1)
          .attr('stroke', 'none')

        d3.selectAll('.tooltip').remove()
      })
      .on('click', function (event, d) {
        if (onBarClick) {
          onBarClick(d)
        }
      })

    // Добавляем значения на столбцы
    svg.selectAll('.bar-label')
      .data(data)
      .enter()
      .append('text')
      .attr('class', 'bar-label')
      .attr('x', d => xScale(d.label)! + xScale.bandwidth() / 2)
      .attr('y', d => yScale(d.value) - 5)
      .attr('text-anchor', 'middle')
      .style('font-size', '12px')
      .style('font-weight', 'bold')
      .style('fill', '#374151')
      .text(d => d.value)

    // Добавляем сетку
    svg.append('g')
      .attr('class', 'grid')
      .attr('transform', `translate(${margin.left},0)`)
      .call(d3.axisLeft(yScale)
        .tickSize(-width + margin.left + margin.right)
        .tickFormat(() => '')
        .ticks(5)
      )
      .selectAll('line')
      .attr('stroke', '#E5E7EB')
      .attr('stroke-opacity', 0.3)

  }, [data, xScale, yScale, colorScale, width, height, margin, onBarClick])

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
