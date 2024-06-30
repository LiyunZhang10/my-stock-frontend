<template>
  <div>
    <div ref="usdchnChart" style="width: 100%; height: 600px;"></div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import * as echarts from 'echarts';

export default {
  name: 'UsdChnChart',
  setup() {
    const usdchnChart = ref(null);
    const usdchnChartData = ref([]);

    const fetchUsdChnData = async () => {
      try {
        const usdchnResponse = await axios.get('http://localhost:8080/api/latest-usdchn-data');
        const data = usdchnResponse.data;

        usdchnChartData.value = data.map(item => ({
          name: item.timestamp,
          value: [
            item.timestamp,
            item.price
          ]
        }));

        updateChart();
      } catch (error) {
        console.error('Error fetching USD/CHN data:', error);
      }
    };

    const updateChart = () => {
      if (usdchnChart.value) {
        const chart = echarts.init(usdchnChart.value);
        const option = {
          title: {
            text: 'Dynamic Data & Time Axis',
            left: 'center'
          },
          tooltip: {
            trigger: 'axis',
            formatter: function (params) {
              params = params[0];
              const date = new Date(params.name);
              return (
                date.getDate() +
                '/' +
                (date.getMonth() + 1) +
                '/' +
                date.getFullYear() +
                ' : ' +
                params.value[1]
              );
            },
            axisPointer: {
              animation: false
            }
          },
          xAxis: {
            type: 'time',
            splitLine: {
              show: false
            }
          },
          yAxis: {
            type: 'value',
            boundaryGap: [0, '100%'],
            splitLine: {
              show: false
            }
          },
          series: [
            {
              name: '汇率',
              type: 'line',
              showSymbol: false,
              data: usdchnChartData.value
            }
          ]
        };
        chart.setOption(option);
      }
    };

    onMounted( async () => {
      await fetchUsdChnData();
      setInterval(fetchUsdChnData, 600000);
    });

    return {
      usdchnChart
    };
  }
};
</script>

<style scoped>
#usdchnChart {
  width: 100%;
  height: 600px;
}
</style>