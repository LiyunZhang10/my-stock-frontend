<template>
  <div class="min-h-screen bg-gray-100 p-4">
    <el-card class="w-full h-full shadow-lg">
      <template #header>
        <div class="flex justify-between items-center">
          <span class="text-3xl font-bold text-gray-800">
            美元离岸人民币 &nbsp;&nbsp;&nbsp;&nbsp;
            <span class="text-2xl">USDCNH &nbsp;&nbsp;&nbsp;&nbsp;</span>
          </span>
          <el-button
            type="primary"
            icon="el-icon-back"
            @click="$router.push('/home')"
            class="bg-blue-500 hover:bg-blue-600"
            >返回首页</el-button
          >
        </div>
      </template>
      <div ref="usdchnChart" style="width: 100%; height: 575px"></div>
      <p class="text-sm text-gray-500 mt-4 text-center">该数据来源自东方财富</p>
    </el-card>
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted, reactive } from 'vue';
import axios from 'axios';
import * as echarts from 'echarts';

export default {
  name: 'UsdChnChart',
  setup() {
    const usdchnChart = ref(null);
    const chart = ref(null);
    const usdchnChartData = reactive({
      dates: [],
      prices: [],
      changeRates: [],
    });

    const formatTimestamp = (timestamp) => {
      const date = new Date(timestamp);
      return date
        .toLocaleString('zh-CN', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          hour12: false,
        })
        .replace(/\//g, '-');
    };

    const fetchUsdChnData = async () => {
      try {
        const { data } = await axios.get(
          'http://localhost:8080/api/latest-usdchn-data'
        );
        const reversedData = data.reverse();
        usdchnChartData.dates = reversedData.map((item) =>
          formatTimestamp(item.timestamp)
        );
        usdchnChartData.prices = reversedData.map((item) => item.price);
        usdchnChartData.changeRates = reversedData.map(
          (item) => item.changeRate
        );
        updateChart();
      } catch (error) {
        console.error('Error fetching USD/CNH data:', error);
      }
    };

    const calculateAxisRange = (values, minBase, maxBase) => {
      const min = Math.min(...values);
      const max = Math.max(...values);
      const padding = (max - min) * 0.1;
      return {
        min: Math.max(minBase, Math.floor((min - padding) * 2) / 2),
        max: Math.min(maxBase, Math.ceil((max + padding) * 2) / 2),
      };
    };

    const updateChart = () => {
      if (!chart.value) return;

      const { prices, changeRates, dates } = usdchnChartData;
      const priceRange = calculateAxisRange(prices, 6, 9);
      const changeRateRange = calculateAxisRange(
        changeRates,
        -Infinity,
        Infinity
      );

      const option = {
        title: {
          text: '美元离岸人民币实时走势(折线图)',
          left: 'center',
          textStyle: { color: '#333', fontSize: 20 },
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: { type: 'cross', label: { backgroundColor: '#6a7985' } },
        },
        legend: { data: ['汇率', '涨跌幅'], top: 30 },
        grid: { left: '3%', right: '3%', bottom: '3%', containLabel: true },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: dates,
          axisLabel: {
            margin: 20,
          },
        },
        yAxis: [
          {
            type: 'value',
            name: '汇率',
            position: 'left',
            min: priceRange.min,
            max: priceRange.max,
            interval: 0.1,
            axisLabel: { formatter: '{value}' },
          },
          {
            type: 'value',
            name: '涨跌幅(%)',
            position: 'right',
            min: changeRateRange.min,
            max: changeRateRange.max,
            interval: 0.5,
            axisLabel: { formatter: '{value}%' },
          },
        ],
        series: [
          {
            name: '汇率',
            type: 'line',
            yAxisIndex: 0,
            data: prices,
            smooth: true,
            symbol: 'none',
            lineStyle: { width: 2, color: '#5470C6' },
            itemStyle: { color: '#5470C6' },
          },
          {
            name: '涨跌幅',
            type: 'line',
            yAxisIndex: 1,
            data: changeRates,
            smooth: true,
            symbol: 'none',
            lineStyle: { width: 2, color: '#91CC75' },
            itemStyle: { color: '#91CC75' },
          },
        ],
      };
      chart.value.setOption(option);
    };

    let timer;

    onMounted(() => {
      chart.value = echarts.init(usdchnChart.value);
      fetchUsdChnData();
      timer = setInterval(fetchUsdChnData, 60000);
    });

    onUnmounted(() => {
      clearInterval(timer);
      chart.value?.dispose();
    });

    return { usdchnChart };
  },
};
</script>
