<template>
  <div>
    <div ref="goldChart" style="width: 100%; height: 600px;"></div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import * as echarts from 'echarts';

export default {
  name: 'GoldChart',
  setup() {
    const goldChart = ref(null);
    const goldChartData = ref({
      labels: [],
      prices: [],
      changeRates: []
    });

    const fetchGoldData = async () => {
      try {
        const goldResponse = await axios.get('http://localhost:8080/api/latest-gold-data');
        const data = goldResponse.data;

        goldChartData.value.labels = data.map(item => item.timestamp);
        goldChartData.value.prices = data.map(item => item.price);
        goldChartData.value.changeRates = data.map(item => item.changeRate);

        updateChart();
      } catch (error) {
        console.error('Error fetching gold data:', error);
      }
    };

    const updateChart = () => {
      if (goldChart.value) {
        const chart = echarts.init(goldChart.value);
        const option = {
          title: {
            text: '金价和变化率',
            left: 'center'
          },
          tooltip: {
            trigger: 'axis'
          },
          legend: {
            data: ['金价', '变化率'],
            left: 'left'
          },
          xAxis: {
            type: 'category',
            data: goldChartData.value.labels
          },
          yAxis: [
            {
              type: 'value',
              name: '金价',
              position: 'left'
            },
            {
              type: 'value',
              name: '变化率',
              position: 'right'
            }
          ],
          series: [
            {
              name: '金价',
              type: 'line',
              data: goldChartData.value.prices,
              yAxisIndex: 0,
              smooth: true,
              lineStyle: {
                color: '#f9d423'
              }
            },
            {
              name: '变化率',
              type: 'line',
              data: goldChartData.value.changeRates,
              yAxisIndex: 1,
              smooth: true,
              lineStyle: {
                color: '#e14eca'
              }
            }
          ]
        };
        chart.setOption(option);
      }
    };

    onMounted(() => {
      fetchGoldData();
      setInterval(fetchGoldData, 6000);
    });

    return {
      goldChart
    };
  }
};
</script>

<style scoped>
#goldChart {
  width: 100%;
  height: 600px;
}
</style>