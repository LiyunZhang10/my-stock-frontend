<template>
  <div class="min-h-screen bg-gray-100 p-4">
    <el-card class="w-full h-full shadow-lg">
      <template #header>
        <div class="flex justify-between items-center">
          <span class="text-3xl font-bold text-gray-800"
            >金价和变化率趋势图</span
          >
          <el-button
            type="primary"
            icon="el-icon-back"
            @click="$router.push('/home')"
            class="bg-blue-500 hover:bg-blue-600"
            >返回首页</el-button
          >
        </div>
      </template>
      <div
        ref="goldChart"
        style="width: 100%; height: 600px"
        class="w-full h-[600px]"></div>
      <p class="text-sm text-gray-500 mt-4 text-center">该数据来源自东方财富</p>
    </el-card>
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
      changeRates: [],
    });

    const fetchGoldData = async () => {
      try {
        const goldResponse = await axios.get(
          'http://localhost:8080/api/latest-gold-data'
        );
        const data = goldResponse.data;

        goldChartData.value.labels = data.map((item) => item.timestamp);
        goldChartData.value.prices = data.map((item) => item.price);
        goldChartData.value.changeRates = data.map((item) => item.changeRate);

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
            left: 'center',
          },
          tooltip: {
            trigger: 'axis',
          },
          legend: {
            data: ['金价', '变化率'],
            left: 'left',
          },
          xAxis: {
            type: 'category',
            data: goldChartData.value.labels,
          },
          yAxis: [
            {
              type: 'value',
              name: '金价',
              position: 'left',
            },
            {
              type: 'value',
              name: '变化率',
              position: 'right',
            },
          ],
          series: [
            {
              name: '金价',
              type: 'line',
              data: goldChartData.value.prices,
              yAxisIndex: 0,
              smooth: true,
              lineStyle: {
                color: '#f9d423',
              },
            },
            {
              name: '变化率',
              type: 'line',
              data: goldChartData.value.changeRates,
              yAxisIndex: 1,
              smooth: true,
              lineStyle: {
                color: '#e14eca',
              },
            },
          ],
        };
        chart.setOption(option);
      }
    };

    onMounted(async () => {
      await fetchGoldData();
      setInterval(fetchGoldData, 600000);
    });

    return {
      goldChart,
    };
  },
};
</script>

<style scoped>
#goldChart {
  width: 100%;
  height: 600px;
}
</style>
