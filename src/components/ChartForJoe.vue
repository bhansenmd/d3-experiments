<template lang="pug">
#chart-for-joe
  svg(width="800", height="400")
</template>

<script>
import * as d3 from 'd3'
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
    const implementationStart = moment().add(5, 'week')
    const testStart = moment().add(6, 'week')

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
          id: 'treatmentIndex',
          values: data.map((d) => { return { date: d.date, value: d.treatment_index } })
        },
        {
          id: 'controlIndex',
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
        .attr('class', 'preTestBackground')
        .attr('x', 0)
        .attr('y', 0)
        .attr('width', xScale(testStart))
        .attr('height', height)

      g.append('g')
        .attr('class', 'x-axis')
        .attr('transform', `translate(0,${height})`)
        .call(d3.axisBottom(xScale))

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
        .attr('class', 'implementationStart')
        .attr('x1', xScale(implementationStart))
        .attr('y1', 0)
        .attr('x2', xScale(implementationStart))
        .attr('y2', height)

      g.append('line')
        .attr('class', 'testStart')
        .attr('x1', xScale(testStart))
        .attr('y1', 0)
        .attr('x2', xScale(testStart))
        .attr('y2', height)
    })
  }
}
</script>

<style lang="sass">
.line
  fill: none
  stroke: steelblue
  stroke-width: 1.5px

.implementationStart
  stroke-width: 1.5px
  stroke: #444444
  stroke-dasharray: 4px
  fill: none

.testStart
  stroke-width: 1.5px
  stroke: #444444
  fill: none

.preTestBackground
  fill: #444444
  opacity: 0.25
</style>
