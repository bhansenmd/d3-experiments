<template lang="pug">
.line-chart
  svg(width="960", height="500")
</template>

<script>
import * as d3 from 'd3'
export default {
  name: 'LineChart',
  mounted () {
    let margin = { top: 50, right: 50, bottom: 50, left: 50 }
    let width = 960 - margin.left - margin.right
    let height = 500 - margin.top - margin.bottom

    let n = 21

    let xScale = d3.scaleLinear()
      .domain([0, n - 1])
      .range([0, width])

    let yScale = d3.scaleLinear()
      .domain([0, 1])
      .range([height, 0])

    let line = d3.line()
      .x((d, i) => { return xScale(i) })
      .y((d) => { return yScale(d.y) })
      .curve(d3.curveMonotoneX) // smooth the line

    // this can be any type of iterable
    let dataset = d3.range(n).map((d) => { return { 'y': d3.randomUniform(1)() } })

    let svg = d3.select(this.$el).select('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)

    let g = svg.append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`)

    g.append('g')
      .attr('class', 'x axis')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(xScale))

    g.append('g')
      .attr('class', 'y axis')
      .call(d3.axisLeft(yScale))

    let t = d3.transition()
      .duration(750)
      .ease(d3.easeLinear)

    g.append('path')
      .datum(dataset)
      .attr('class', 'line')
      .attr('d', line)
      .transition(t)

    g.selectAll('.dot')
      .data(dataset)
      .enter()
      .append('circle')
      .attr('class', 'dot')
      .attr('cx', (d, i) => { return xScale(i) })
      .attr('cy', (d) => { return yScale(d.y) })
      .attr('r', 5)
      .on('mouseover', function (a, b, c) {
        console.log(a)
        this.attr('class', 'focus')
      })
      .on('mouseout', function () {})
      .transition(t)
  }
}
</script>

<style lang="sass">
.line
  fill: none
  stroke: #ffab00
  stroke-width: 3

.overlay
  fill: none
  pointer-events: all

.dot
  fill: #ffab00
  stroke: #fff

.focus circle
  fill: none
  stroke: steelblue
</style>
