<template lang="pug">
#chart-for-joe
  svg(width="800", height="400")
</template>

<script>
import * as d3 from 'd3'
import 'd3-selection-multi'
import * as moment from 'moment'

export default {
  name: 'ChartForJoe',
  mounted () {
    const svg = d3.select(this.$el).select('svg')
    const margin = { top: 50, right: 50, bottom: 50, left: 50 }

    const width = svg.attr('width') - margin.left - margin.right
    const height = svg.attr('height') - margin.top - margin.bottom

    const g = svg.append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`)

    const xScale = d3.scaleTime().range([0, width])
    const yScale = d3.scaleLinear().range([height, 0])
    const colorScale = d3.scaleOrdinal(d3.schemeCategory10)

    const line = d3.line()
      .curve(d3.curveBasis)
      .x((d) => { return xScale(d.date) })
      .y((d) => { return yScale(d.value) })

    const n = 14
    const preStart = moment()
    const implementationStart = moment().add(4, 'week')
    const testStart = moment().add(6, 'week')
    const testEnd = moment().add(n - 1, 'week')

    // const parseTime = d3.timeParse('%Y-%m-%d')
    //
    // d3.csv('/static/chart-for-joe.csv', (d) => {
    //   d.date_week = parseTime(d.date_week)
    //   return d
    // }).then((data) => {
    // })

    new Promise((resolve) => {
      const randomUniform = d3.randomUniform(100)
      const data = d3.range(n).map((d) => {
        return {
          'date': moment().add(d, 'week').valueOf(),
          'treatment_index': randomUniform(),
          'control_index': randomUniform()
        }
      })

      resolve(data)
    }).then((data) => {
      const dimensions = [
        {
          id: 'treatment-index',
          values: data.map((d) => { return { date: d.date, value: d.treatment_index } })
        },
        {
          id: 'control-index',
          values: data.map((d) => { return { date: d.date, value: d.control_index } })
        }
      ]

      xScale.domain(d3.extent(data, (d) => { return d.date }))
      yScale.domain([
        d3.min(dimensions, (dim) => { return d3.min(dim.values, (d) => { return d.value }) }),
        d3.max(dimensions, (dim) => { return d3.max(dim.values, (d) => { return d.value }) })
      ])

      colorScale.domain(dimensions.map((dim) => { return dim.id }))

      g.append('rect')
        .attr('class', 'pre-test-background')
        .attr('x', 0)
        .attr('y', 0)
        .attr('width', xScale(testStart))
        .attr('height', height)

      const xAxis = d3.axisBottom(xScale)
        .tickValues([preStart, implementationStart, testStart, testEnd])
        .tickFormat(d3.timeFormat('%b %d'))

      // first chart
      g.append('g')
        .attr('class', 'x-axis')
        .attr('transform', `translate(0,${height})`)
        .call(xAxis)

      const dimension = g.selectAll('.dimension')
        .attr('class', 'dimension')
        .data(dimensions)
        .enter()
        .append('g')

      dimension.append('path')
        .attr('class', 'line')
        .attr('d', (d) => { return line(d.values) })
        .style('stroke', (d) => { return colorScale(d.id) })

      g.append('line')
        .attr('class', 'implementation-start line-dashed')
        .attr('x1', xScale(implementationStart))
        .attr('y1', 0)
        .attr('x2', xScale(implementationStart))
        .attr('y2', height)

      g.append('line')
        .attr('class', 'test-start line')
        .attr('x1', xScale(testStart))
        .attr('y1', 0)
        .attr('x2', xScale(testStart))
        .attr('y2', height)

      // pre/post lines

      const lineData = {
        treatment: {
          pre: {
            x1: 0,
            y1: yScale(50),
            x2: xScale(implementationStart),
            y2: yScale(50)
          },
          post: {
            x1: xScale(testStart),
            y1: yScale(55),
            x2: xScale(testEnd),
            y2: yScale(55)
          }
        },
        control: {
          pre: {
            x1: 0,
            y1: yScale(40),
            x2: xScale(implementationStart),
            y2: yScale(40)
          },
          post: {
            x1: xScale(testStart),
            y1: yScale(45),
            x2: xScale(testEnd),
            y2: yScale(45)
          }
        }
      }

      function appendAverageLine (g, data, pClass, pStroke) {
        g.append('line')
          .attr('class', pClass)
          .attr('x1', data.x1)
          .attr('y1', data.y1)
          .attr('x2', data.x2)
          .attr('y2', data.y2)
          .style('stroke', colorScale(pStroke))
      }
      appendAverageLine(g, lineData.treatment.pre, 'treatment-pre', 'treatment-index')
      appendAverageLine(g, lineData.treatment.post, 'treatment-post', 'treatment-index')
      appendAverageLine(g, lineData.control.pre, 'control-pre', 'control-index')
      appendAverageLine(g, lineData.control.post, 'control-post', 'control-index')

      function appendMeasureLine (g, className, x, y1, y2, width) {
        const container = g.append('g').attr('class', className)
        const halfWidth = width * 0.5

        // main line
        container.append('line')
          .attr('class', 'line-dashed')
          .attr('x1', x)
          .attr('x2', x)
          .attr('y1', y1)
          .attr('y2', y2)

        // caps
        container.append('line')
          .attr('class', 'line')
          .attr('x1', x - halfWidth)
          .attr('x2', x + halfWidth)
          .attr('y1', y1)
          .attr('y2', y1)
        container.append('line')
          .attr('class', 'line')
          .attr('x1', x - halfWidth)
          .attr('x2', x + halfWidth)
          .attr('y1', y2)
          .attr('y2', y2)
      }
      appendMeasureLine(g, 'test', 50, 10, 100, 10)
    })
  }
}
</script>

<style lang="sass">
.line
  fill: none
  stroke: #444444
  stroke-width: 1.5px

.line-dashed
  @extend .line
  stroke-dasharray: 4px

.pre-test-background
  fill: #444444
  opacity: 0.10

</style>
