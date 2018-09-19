<template lang="pug">
  .multi-line-chart
    svg(width="960", height="500")
</template>

<script>
import * as d3 from 'd3'
export default {
  name: 'MultiLineChart',
  mounted () {
    const svg = d3.select(this.$el).select('svg')
    const margin = { top: 20, right: 80, bottom: 30, left: 50 }
    const width = svg.attr('width') - margin.left - margin.right
    const height = svg.attr('height') - margin.top - margin.bottom

    const g = svg.append('g')
      .attr('transform', `translate(${margin.left}, ${margin.top})`)

    const parseTime = d3.timeParse('%Y%m%d')

    function type (d, _, columns) {
      d.date = parseTime(d.date)
      let i = 1
      let c = 0
      let n = columns.length
      for (; i < n; ++i) d[c = columns[i]] = +d[c]
      return d
    }

    const xScale = d3.scaleTime().range([0, width])
    const yScale = d3.scaleLinear().range([height, 0])
    const colorScale = d3.scaleOrdinal(d3.schemeCategory10)

    const lineMaker = d3.line()
      .curve(d3.curveBasis)
      .x((d) => { return xScale(d.date) })
      .y((d) => { return yScale(d.temperature) })

    d3.tsv('/static/multi-line-chart.tsv', type).then(function (data) {
      const cities = data.columns.slice(1).map((id) => {
        return {
          id: id,
          values: data.map((d) => { return { date: d.date, temperature: d[id] } })
        }
      })

      xScale.domain(d3.extent(data, (d) => { return d.date }))

      yScale.domain([
        d3.min(cities, (c) => { return d3.min(c.values, (d) => { return d.temperature }) }),
        d3.max(cities, (c) => { return d3.max(c.values, (d) => { return d.temperature }) })
      ])

      colorScale.domain(cities.map((c) => { return c.id }))

      // x-axis
      g.append('g')
        .attr('class', 'axis axis--x')
        .attr('transform', `translate(0,${height})`)
        .call(d3.axisBottom(xScale))

      // y-axis
      g.append('g')
        .attr('class', 'axis axis--y')
        .call(d3.axisLeft(yScale))
        .append('text')
        .attr('transform', 'rotate(-90)')
        .attr('y', 6)
        .attr('dy', '0.71em')
        .attr('fill', '#000')
        .text('Temperature, ºF')

      const city = g.selectAll('.city')
        .data(cities)
        .enter().append('g')
        .attr('class', 'city')

      city.append('path')
        .attr('class', 'line')
        .attr('d', (d) => { return lineMaker(d.values) })
        .style('stroke', (d) => { return colorScale(d.id) })

      city.append('text')
        .datum((d) => { return { id: d.id, value: d.values[d.values.length - 1] } })
        .attr('transform', (d) => { return `translate(${xScale(d.value.date)},${yScale(d.value.temperature)})` })
        .attr('x', 3)
        .attr('dy', '0.35em')
        .style('font', '10px sans-serif')
        .text((d) => { return d.id })
    })
  }
}
</script>

<style lang="sass">
.axis--x path
  display: none

.line
  fill: none
  stroke: steelblue
  stroke-width: 1.5px
</style>
