<template lang="pug">
.selections
  #click-me Click Me!
  .hover-me Hover Me!
</template>

<script>
import * as d3 from 'd3'

export default {
  name: 'Selections',
  mounted () {
    const root = this.$el
    d3.select(root).select('#click-me')
      .on('mousedown', function () {
        this.style.backgroundColor = '#fedcba'
      })
      .on('mouseup', function () {
        this.style.backgroundColor = ''
      })

    d3.selectAll('.hover-me')
      .on('mouseover', function () {
        this.style.backgroundColor = '#abcdef'
      })
      .on('mouseleave', function () {
        this.style.backgroundColor = ''
      })
  }
}
</script>

<style scoped lang="sass">
div
  margin: 10px
</style>
