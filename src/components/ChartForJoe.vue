<template lang="pug">
#chart-for-joe
  svg(width="800", height="800")
</template>

<script>
import * as d3 from 'd3'

function setupCharts (svg, margin, data) {
  const width = svg.attr('width') - margin.left - margin.right
  const height = svg.attr('height') - margin.top - margin.bottom

  const xScale = d3.scaleTime().range([0, width])
  const yScale = d3.scaleLinear().rang([height, 0])
}

export default {
  name: 'ChartForJoe',
  mounted () {
    const svg = d3.select(this.$el).select('svg')
    const margin = { top: 50, right: 50, bottom: 50, left: 50 }

    setupCharts(svg, margin)
  }
}
</script>

<style scoped lang="sass">

</style>
