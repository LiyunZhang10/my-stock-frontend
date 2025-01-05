<template>
  <div class="min-h-screen bg-gray-100 p-4">
    <el-card class="w-full h-full shadow-lg">
      <template #header>
        <div class="flex justify-between items-center ml-20">
          <span class="text-4xl font-bold text-gray-800">
            美元离岸人民币 &nbsp;&nbsp;&nbsp;&nbsp;
            <span class="text-3xl">USDCNH &nbsp;&nbsp;&nbsp;&nbsp;</span>
          </span>
          <el-button
            type="primary"
            icon="el-icon-back"
            @click="$router.push('/home')"
            class="bg-blue-500 hover:bg-blue-600">
            返回首页
          </el-button>
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
import { getApiUrl } from '@/utils/api';

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
        const { data } = await axios.get(getApiUrl('/latest-usdchn-data'));
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

    const calculateAxisRange = (values, isChangeRate = false) => {
      const min = Math.min(...values);
      const max = Math.max(...values);
      let range = max - min;

      const buffer = range * 0.05;
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

      const { prices, changeRates, dates } = usdchnChartData;
      const priceRange = calculateAxisRange(prices);
      const changeRateRange = calculateAxisRange(changeRates, true);

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
        grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
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
            interval: priceRange.interval,
            axisLabel: {
              formatter: (value) => parseFloat(value.toFixed(3)),
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
              formatter: (value) => parseFloat(value.toFixed(3)) + '%',
            },
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
            markLine: {
              silent: true,
              data: [{ type: 'average', name: '平均值' }],
            },
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
            markLine: {
              silent: true,
              data: [{ type: 'average', name: '平均值' }],
            },
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