<template>
  <div class="min-h-screen bg-gray-100 p-4">
    <el-card class="w-full h-full shadow-lg">
      <template #header>
        <div class="flex justify-between items-center ml-20">
          <span class="text-4xl font-bold text-gray-800">
            英伟达 &nbsp;&nbsp;
            <span class="text-3xl">NVDA &nbsp;&nbsp;&nbsp;&nbsp;</span>
            <span class="text-2xl">交易币种：美元</span>
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
      <div ref="stockChart" style="width: 100%; height: 575px"></div>
      <p class="text-sm text-gray-500 mt-4 text-center">该数据来源自东方财富</p>
    </el-card>
  </div>
</template>

<script>
import { ref, onMounted, reactive } from 'vue';
import axios from 'axios';
import * as echarts from 'echarts';
import { getApiUrl } from '@/utils/api';

export default {
  name: 'NvdaStock',
  setup() {
    const stockChart = ref(null);
    const chart = ref(null);
    const stockChartData = reactive({
      dates: [],
      prices: [],
    });

    // Helper function to format date
    const formatDate = (timestamp) => {
      const date = new Date(timestamp);
      return date
        .toLocaleDateString('zh-CN', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
        })
        .replace(/\//g, '-');
    };

    // Fetch stock data from the API
    const fetchStockData = async () => {
      try {
        const { data } = await axios.get(getApiUrl('/nvda-stocks'));
        stockChartData.dates = data.map((item) => formatDate(item.date));
        stockChartData.prices = data.map((item) => [
          item.openPrice,
          item.closePrice,
          item.lowPrice,
          item.highPrice,
        ]);
        updateChart();
      } catch (error) {
        console.error('Error fetching stock data:', error);
      }
    };

    // Update the chart with new data
    const updateChart = () => {
      if (!chart.value) return;

      const { dates, prices } = stockChartData;

      const option = {
        title: {
          text: '英伟达[NVDA] (K线图)',
          left: 'center',
          textStyle: { color: '#333', fontSize: 20 },
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: { type: 'cross', label: { backgroundColor: '#6a7985' } },
        },
        grid: {
          left: '3%',
          right: '3%',
          bottom: '3%',
          top: '10%',
          containLabel: true,
        },
        xAxis: {
          type: 'category',
          data: dates,
          boundaryGap: false,
          axisLabel: {
            formatter: (value) => value.split(' ')[0], // Display only date part
            margin: 20,
          },
        },
        yAxis: {
          scale: true,
          axisLabel: {
            margin: 20,
          },
        },
        series: [
          {
            name: 'K线图',
            type: 'candlestick',
            data: prices,
            itemStyle: {
              color: '#ec0000',
              color0: '#00da3c',
              borderColor: '#8A0000',
              borderColor0: '#008F28',
            },
          },
        ],
      };
      chart.value.setOption(option);
    };

    // Initialize the chart on component mount
    onMounted(() => {
      chart.value = echarts.init(stockChart.value);
      fetchStockData();
    });

    return { stockChart };
  },
};
</script>
