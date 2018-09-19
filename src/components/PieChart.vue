<!-- Base on the example from http://square.github.io/intro-to-d3/examples/-->

<template lang="pug">
.pie-chart
  svg
</template>

<script>
import * as d3 from 'd3'
export default {
  name: 'PieChart',
  mounted () {
    const sales = [
      {product: 'Hoodie', count: 12},
      {product: 'Jacket', count: 7},
      {product: 'Snuggie', count: 6}
    ]

    const pie = d3.pie()
      .value(function (d) {
        return d.count
      })

    const slices = pie(sales)

    const arc = d3.arc()
      .innerRadius(0)
      .outerRadius(50)

    const color = d3.scaleOrdinal(d3.schemeCategory10)

    const svg = d3.select(this.$el).select('svg')
    const g = svg.append('g')
      .attr('transform', 'translate(200, 50)')

    g.selectAll('path.slice')
      .data(slices)
      .enter()
      .append('path')
      .attr('class', 'slice')
      .attr('d', arc)
      .attr('fill', function (d) {
        return color(d.data.product)
      })

    // build the legend
    svg.append('g')
      .attr('class', 'legend')
      .selectAll('text')
      .data(slices)
      .enter()
      .append('text')
      .text(function (d, i) { return `${i}. ${d.data.product}` })
      .attr('fill', function (d) { return color(d.data.product) })
      .attr('y', function (d, i) { return 20 * (i + 1) })
  }
}
</script>

<style scoped lang="sass">
.pie-chart
  margin: 10px
</style>
