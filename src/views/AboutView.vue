<template>
  <div>
    <h1>股票价格和涨跌幅</h1>
    <line-chart :chart-data="chartData" :options="chartOptions"></line-chart>
  </div>
</template>

<script>
import axios from 'axios';
import { Line } from 'vue-chartjs';

export default {
  components: {
    LineChart: {
      extends: Line,
      props: ['chartData', 'options'],
      mounted() {
        this.renderChart(this.chartData, this.options);
      },
      watch: {
        chartData(newData) {
          this.renderChart(newData, this.options);
        }
      }
    }
  },
  data() {
    return {
      chartData: {
        labels: [],
        datasets: [
          {
            label: '股票价格',
            backgroundColor: '#f87979',
            data: []
          },
          {
            label: '涨跌幅',
            backgroundColor: '#7acbf9',
            data: []
          }
        ]
      },
      chartOptions: {
        responsive: true,
        maintainAspectRatio: false
      }
    };
  },
  created() {
    this.fetchData();
    setInterval(this.fetchData, 6000); // 每6秒刷新一次数据
  },
  methods: {
    async fetchData() {
      try {
        const response = await axios.get('http://localhost:8080/api/latest-data');
        const data = response.data;

        this.chartData.labels.push(new Date(data.timestamp).toLocaleTimeString());
        this.chartData.datasets[0].data.push(data.price);
        this.chartData.datasets[1].data.push(data.change_rate);

        // 保持数据点数量不超过20个
        if (this.chartData.labels.length > 20) {
          this.chartData.labels.shift();
          this.chartData.datasets[0].data.shift();
          this.chartData.datasets[1].data.shift();
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }
  }
};
</script>

<style scoped>
h1 {
  text-align: center;
}
</style>