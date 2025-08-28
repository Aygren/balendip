'use client'

import React, { useRef, useEffect, useMemo } from 'react'
import * as d3 from 'd3'

interface DataPoint {
  date: string
  value: number
}

interface D3LineChartProps {
  data: DataPoint[]
  width?: number
  height?: number
  margin?: {
    top: number
    right: number
    bottom: number
    left: number
  }
  className?: string
}

export const D3LineChart: React.FC<D3LineChartProps> = ({
  data,
  width = 640,
  height = 400,
  margin = { top: 20, right: 20, bottom: 30, left: 40 },
  className = ''
}) => {
  const svgRef = useRef<SVGSVGElement>(null)

  // Мемоизируем вычисления для производительности
  const { xScale, yScale, line } = useMemo(() => {
    if (!data.length) return { xScale: null, yScale: null, line: null }

    // Создаем шкалы
    const xScale = d3.scaleTime()
      .domain(d3.extent(data, d => new Date(d.date)) as [Date, Date])
      .range([margin.left, width - margin.right])

    const yScale = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.value) || 0])
      .range([height - margin.bottom, margin.top])

    // Создаем генератор линии
    const line = d3.line<DataPoint>()
      .x(d => xScale(new Date(d.date)))
      .y(d => yScale(d.value))
      .curve(d3.curveMonotoneX) // Плавная кривая

    return { xScale, yScale, line }
  }, [data, width, height, margin])

  // Рендерим график
  useEffect(() => {
    if (!svgRef.current || !xScale || !yScale || !line) return

    const svg = d3.select(svgRef.current)

    // Очищаем предыдущий контент
    svg.selectAll('*').remove()

    // Добавляем ось X
    const xAxis = d3.axisBottom(xScale)
      .tickFormat((d: Date | d3.NumberValue) => {
        if (d instanceof Date) {
          return d3.timeFormat('%b %d')(d)
        }
        return String(d)
      })
      .ticks(5)

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

    // Добавляем линию
    svg.append('path')
      .datum(data)
      .attr('fill', 'none')
      .attr('stroke', '#3B82F6')
      .attr('stroke-width', 2)
      .attr('d', line)

    // Добавляем точки
    svg.selectAll('.point')
      .data(data)
      .enter()
      .append('circle')
      .attr('class', 'point')
      .attr('cx', d => xScale(new Date(d.date)))
      .attr('cy', d => yScale(d.value))
      .attr('r', 4)
      .attr('fill', '#3B82F6')
      .attr('stroke', 'white')
      .attr('stroke-width', 2)
      .on('mouseover', function (event, d) {
        d3.select(this)
          .attr('r', 6)
          .attr('fill', '#1D4ED8')
      })
      .on('mouseout', function (event, d) {
        d3.select(this)
          .attr('r', 4)
          .attr('fill', '#3B82F6')
      })

    // Добавляем сетку
    svg.append('g')
      .attr('class', 'grid')
      .attr('transform', `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(xScale)
        .tickSize(-height + margin.top + margin.bottom)
        .tickFormat(() => '')
        .ticks(5)
      )
      .selectAll('line')
      .attr('stroke', '#E5E7EB')
      .attr('stroke-opacity', 0.3)

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

  }, [data, xScale, yScale, line, width, height, margin])

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
