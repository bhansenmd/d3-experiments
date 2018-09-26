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
    const chartContainer = d3.select(this.$el)
    const svg = chartContainer.select('svg')
    const margin = { top: 50, right: 50, bottom: 50, left: 50 }

    const svgWidth = svg.attr('width')
    const width = svgWidth - margin.left - margin.right
    const svgHeight = svg.attr('height')
    const height = svgHeight - margin.top - margin.bottom

    const g = svg.append('g')
      .attr('class', 'chart')
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

      const xAxisMaker = d3.axisBottom(xScale)
        .tickValues([preStart, implementationStart, testStart, testEnd])
        .tickFormat(d3.timeFormat('%b %d'))

      const indexChart = g.append('g').attr('class', 'indexChart')

      indexChart.append('rect')
        .attr('class', 'pre-test-background')
        .attr('x', 0)
        .attr('y', 0)
        .attr('width', xScale(testStart))
        .attr('height', height)

      // first chart
      const xAxis = g.append('g')
        .attr('class', 'xAxis')
        .attr('transform', `translate(0,${height})`)
        .call(xAxisMaker)

      const dimension = indexChart.selectAll('.dimension')
        .attr('class', 'dimension')
        .data(dimensions)
        .enter()
        .append('g')

      dimension.append('path')
        .attr('class', 'line')
        .attr('d', (d) => { return line(d.values) })
        .style('stroke', (d) => { return colorScale(d.id) })

      indexChart.append('line')
        .attr('class', 'implementation-start line-dashed')
        .attr('x1', xScale(implementationStart))
        .attr('y1', 0)
        .attr('x2', xScale(implementationStart))
        .attr('y2', height)

      indexChart.append('line')
        .attr('class', 'test-start line')
        .attr('x1', xScale(testStart))
        .attr('y1', 0)
        .attr('x2', xScale(testStart))
        .attr('y2', height)

      const averageLinesData = [
        {
          name: 'treatment-pre',
          stroke: 'treatment-index',
          x1: 0,
          x2: xScale(implementationStart),
          y1: yScale(50),
          y2: yScale(50)
        },
        {
          name: 'treatment-post',
          stroke: 'treatment-index',
          x1: xScale(testStart),
          y1: yScale(55),
          x2: xScale(testEnd),
          y2: yScale(55)
        },
        {
          name: 'control-pre',
          stroke: 'control-index',
          x1: 0,
          y1: yScale(40),
          x2: xScale(implementationStart),
          y2: yScale(40)
        },
        {
          name: 'control-post',
          stroke: 'control-index',
          x1: xScale(testStart),
          y1: yScale(45),
          x2: xScale(testEnd),
          y2: yScale(45)
        }
      ]

      const averageLinesGroup = g.append('g')
        .attr('class', 'averageLinesGroup')

      const averageLines = averageLinesGroup.selectAll('line')
        .data(averageLinesData)

      averageLines.enter()
        .append('line')
        .attr('class', (d) => { return d.name })
        .attr('x1', (d) => { return d.x1 })
        .attr('x2', (d) => { return d.x2 })
        .attr('y1', (d) => { return d.y1 })
        .attr('y2', (d) => { return d.y2 })
        .style('stroke', (d) => { return colorScale(d.stroke) })

      averageLines.exit().remove()

      const xPadding = 10
      const measureData = [
        {
          name: 'treatment-diff-measure',
          text: 'Treatment Diff',
          x: xScale(implementationStart) + xPadding,
          y: Math.min(yScale(55), yScale(50)),
          width: 10,
          height: Math.abs(yScale(55) - yScale(50))
        },
        {
          name: 'control-diff-measure',
          text: 'Control Diff',
          x: xScale(implementationStart) + xPadding,
          y: Math.min(yScale(45), yScale(40)),
          width: 10,
          height: Math.abs(yScale(45) - yScale(40))
        }
      ]
      const measureGroup = g.append('g').attr('class', 'measureGroup')
      const measures = measureGroup.selectAll('.measure')
        .data(measureData)

      const newMeasures = measures.enter()
        .append('g')
        .attr('class', (d) => { return `measure ${d.name}` })
        .attr('transform', (d) => { return `translate(${d.x},${d.y})` })

      newMeasures.append('line')
        .attr('class', 'line-dashed')
        .attr('x1', 0)
        .attr('x2', 0)
        .attr('y1', 0)
        .attr('y1', (d) => { return d.height })

      newMeasures.append('line')
        .attr('class', 'line')
        .attr('x1', (d) => { return -d.width / 2 })
        .attr('x2', (d) => { return +d.width / 2 })
        .attr('y1', 0)
        .attr('y2', 0)

      newMeasures.append('line')
        .attr('class', 'line')
        .attr('x1', (d) => { return -d.width / 2 })
        .attr('x2', (d) => { return +d.width / 2 })
        .attr('y1', (d) => { return d.height })
        .attr('y2', (d) => { return d.height })

      newMeasures.append('text')
        .attr('x', (d) => { return d.width / 2 })
        .attr('y', (d) => { return d.height / 2 })
        .text((d) => { return d.text })
        .style('font-size', '10')
        .style('alignment-baseline', 'central')

      const liftText = g.append('text')
        .attr('x', width / 2)
        .attr('y', height / 2)
        .attr('class', 'liftText')
        .attr('text-anchor', 'middle')
        .attr('font-size', '30')
        .text('+3.0%')

      // animation

      function hideAll (duration) {
        const transition = d3.transition()
          .duration(duration || 0)
          .ease(d3.easeLinear)

        indexChart.transition(transition).style('opacity', 0)
        xAxis.transition(transition).style('opacity', 0)
        averageLinesGroup.transition(transition).style('opacity', 0)
        measureGroup.transition(transition).style('opacity', 0)
        liftText.transition(transition).style('opacity', 0)
      }
      hideAll()
      chartContainer.append('button')
        .on('click', () => { hideAll(1250) })
        .text('Hide All')

      const transition = d3.transition()
        .duration(1250)
        .ease(d3.easeLinear)

      function showIndexChart () {
        indexChart.transition(transition).style('opacity', 1)
        xAxis.transition(transition).style('opacity', 1)
        averageLinesGroup.transition(transition).style('opacity', 0)
        measureGroup.transition(transition).style('opacity', 0)
        liftText.transition(transition).style('opacity', 0)
      }
      showIndexChart()
      chartContainer.append('button')
        .text('Show Index Chart')
        .on('click', showIndexChart)

      function showAverageLines () {
        indexChart.transition(transition).style('opacity', 1)
        xAxis.transition(transition).style('opacity', 1)
        averageLinesGroup.transition(transition).style('opacity', 1)
        measureGroup.transition(transition).style('opacity', 0)
        liftText.transition(transition).style('opacity', 0)
      }
      chartContainer.append('button')
        .text('Show Average Lines')
        .on('click', showAverageLines)

      function showDiffMeasures () {
        indexChart.transition(transition).style('opacity', 0)
        xAxis.transition(transition).style('opacity', 1)
        averageLinesGroup.transition(transition).style('opacity', 1)
        measureGroup.transition(transition).style('opacity', 1)
        liftText.transition(transition).style('opacity', 0)
      }
      chartContainer.append('button')
        .text('Show Diff Measures')
        .on('click', showDiffMeasures)

      function showLift () {
        indexChart.transition(transition).style('opacity', 0)
        xAxis.transition(transition).style('opacity', 0)
        averageLinesGroup.transition(transition).style('opacity', 0)
        measureGroup.transition(transition).style('opacity', 0)
        liftText.transition(transition).style('opacity', 1)
      }
      chartContainer.append('button')
        .text('Show Lift')
        .on('click', showLift)
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
