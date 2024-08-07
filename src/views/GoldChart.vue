<template>
  <div class="min-h-screen bg-gray-100 p-4">
    <el-card class="w-full h-full shadow-lg">
      <template #header>
        <div class="flex justify-between items-center ml-20">
          <span class="text-4xl font-bold text-gray-800">
            COMEX黄金 &nbsp;&nbsp;&nbsp;&nbsp;
            <span class="text-3xl">GC00Y &nbsp;&nbsp;&nbsp;&nbsp;</span>
            <span class="text-2xl">交易所：CME金属期货</span>
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
      <div ref="goldChart" style="width: 100%; height: 575px"></div>
      <p class="text-sm text-gray-500 mt-4 text-center">该数据来源自东方财富</p>
    </el-card>
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted, reactive } from 'vue';
import axios from 'axios';
import * as echarts from 'echarts';
import { getApiUrl } from '@/utils/api';

export default {
  name: 'GoldChart',
  setup() {
    const goldChart = ref(null);
    const chart = ref(null);
    const goldChartData = reactive({
      labels: [],
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

    const fetchGoldData = async () => {
      try {
        const { data } = await axios.get(getApiUrl('/latest-gold-data'));
        const reversedData = data.reverse();
        goldChartData.labels = reversedData.map((item) =>
          formatTimestamp(item.timestamp)
        );
        goldChartData.prices = reversedData.map((item) => item.price);
        goldChartData.changeRates = reversedData.map((item) => item.changeRate);
        updateChart();
      } catch (error) {
        console.error('Error fetching gold data:', error);
      }
    };

    const calculateAxisRange = (values, isChangeRate = false) => {
      const min = Math.min(...values);
      const max = Math.max(...values);
      let range = max - min;

      const buffer = 0.05 * range;
      const newMin = min - buffer;
      const newMax = max + buffer;
      range = newMax - newMin;

      if (isChangeRate) {
        const absMax = Math.max(Math.abs(newMin), Math.abs(newMax));
        range = 2 * absMax;
      }

      let interval = range / 10;
      const magnitude = Math.pow(10, Math.floor(Math.log10(interval)));
      interval = Math.ceil(interval / (magnitude / 10)) * (magnitude / 10);
      interval = Math.max(interval, 0.001);

      let axisMin, axisMax;
      if (isChangeRate) {
        axisMin = -Math.ceil(range / (2 * interval)) * interval;
        axisMax = -axisMin;
      } else {
        axisMin = Math.floor(newMin / interval) * interval;
        axisMax = Math.ceil(newMax / interval) * interval;
      }

      return {
        min: parseFloat(axisMin.toFixed(3)),
        max: parseFloat(axisMax.toFixed(3)),
        interval: parseFloat(interval.toFixed(3)),
      };
    };

    const updateChart = () => {
      if (!chart.value) return;

      const { labels, prices, changeRates } = goldChartData;
      const priceRange = calculateAxisRange(prices);
      const changeRateRange = calculateAxisRange(changeRates, true);

      const option = {
        title: {
          text: '黄金价格实时走势(面积图)',
          left: 'center',
          textStyle: { color: '#333', fontSize: 20 },
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: { type: 'cross', label: { backgroundColor: '#6a7985' } },
        },
        legend: {
          data: ['黄金价格', '涨跌幅'],
          top: 30,
        },
        grid: { left: '3%', right: '3%', bottom: '3%', containLabel: true },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: labels,
          axisLabel: {
            margin: 20,
          },
        },
        yAxis: [
          {
            type: 'value',
            name: '黄金价格',
            position: 'left',
            min: priceRange.min,
            max: priceRange.max,
            interval: priceRange.interval,
            axisLabel: { 
              formatter: (value) => parseFloat(value.toFixed(3))
            },
          },
          {
            type: 'value',
            name: '涨跌幅(%)',
            position: 'right',
            min: changeRateRange.min,
            max: changeRateRange.max,
            interval: changeRateRange.interval,
            axisLabel: { 
              formatter: (value) => parseFloat(value.toFixed(3)) + '%'
            },
          },
        ],
        series: [
          {
            name: '黄金价格',
            type: 'line',
            yAxisIndex: 0,
            data: prices,
            smooth: true,
            symbol: 'none',
            lineStyle: { width: 2, color: '#f9d423' },
            itemStyle: { color: '#f9d423' },
            areaStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: 'rgba(249, 212, 35, 0.5)' },
                { offset: 1, color: 'rgba(249, 212, 35, 0)' },
              ]),
            },
          },
          {
            name: '涨跌幅',
            type: 'line',
            yAxisIndex: 1,
            data: changeRates,
            smooth: true,
            symbol: 'none',
            lineStyle: { width: 2, color: '#e14eca' },
            itemStyle: { color: '#e14eca' },
            areaStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: 'rgba(225, 78, 202, 0.5)' },
                { offset: 1, color: 'rgba(225, 78, 202, 0)' },
              ]),
            },
          },
        ],
      };
      chart.value.setOption(option);
    };

    let timer;

    onMounted(() => {
      chart.value = echarts.init(goldChart.value);
      fetchGoldData();
      timer = setInterval(fetchGoldData, 60000);
    });

    onUnmounted(() => {
      clearInterval(timer);
      chart.value?.dispose();
    });

    return { goldChart };
  },
};
</script>