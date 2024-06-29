<template>
  <div>
    <line-chart :chart-data="chartData" :options="options" />
  </div>
</template>

<script>
import { Line, mixins } from 'vue-chartjs'
const { reactiveProp } = mixins

export default {
  extends: Line,
  mixins: [reactiveProp],
  props: ['options'],
  mounted() {
    this.renderChart(this.chartData, this.options)
  }
}
</script>