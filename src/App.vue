<template lang="pug">
  #app
    nav
      router-link(to="/") Chart for Joe
      router-link(to="/selections") Selections
      router-link(to="/pie-chart") Pie Chart
      router-link(to="/stacked-bar-chart") Stacked Bar Chart
      <!--router-link(to="/bubble-chart") Bubble Chart-->
      router-link(to="/line-chart") Line Chart
      router-link(to="/multi-line-chart") Multi Line Chart
    router-view
</template>

<script>
export default {
  name: 'App'
}
</script>

<style lang="sass">
a
  margin: 10px

#app
  font-family: 'Avenir', Helvetica, Arial, sans-serif
  -webkit-font-smoothing: antialiased
  -moz-osx-font-smoothing: grayscale
  text-align: center
  color: #2c3e50
  margin-top: 60px
</style>
