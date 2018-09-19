import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import BubbleChart from '@/components/BubbleChart'
import Selections from '@/components/Selections'
import PieChart from '@/components/PieChart'
import StackedBarChart from '@/components/StackedBarChart'
import LineChart from '@/components/LineChart'
import MultiLineChart from '@/components/MultiLineChart'
import ChartForJoe from '@/components/ChartForJoe'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'HelloWorld',
      component: HelloWorld
    },
    {
      path: '/bubble-chart',
      name: 'BubbleChart',
      component: BubbleChart
    },
    {
      path: '/pie-chart',
      name: 'PieChart',
      component: PieChart
    },
    {
      path: '/selections',
      name: 'Selections',
      component: Selections
    },
    {
      path: '/stacked-bar-chart',
      name: 'StackedBarChart',
      component: StackedBarChart
    },
    {
      path: '/line-chart',
      name: 'LineChart',
      component: LineChart
    },
    {
      path: '/multi-line-chart',
      name: 'MultiLineChart',
      component: MultiLineChart
    },
    {
      path: '/chart-for-joe',
      name: 'ChartForJoe',
      component: ChartForJoe
    }
  ]
})
