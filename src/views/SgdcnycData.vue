<template>
  <div class="min-h-screen bg-gray-100 p-4">
    <el-card class="w-full h-full shadow-lg">
      <template #header>
        <div class="flex justify-between items-center">
          <span class="text-3xl font-bold text-gray-800">
            新加坡元兑人民币 &nbsp;&nbsp;
            <span class="text-2xl">SGDCNYC &nbsp;&nbsp;&nbsp;&nbsp;</span>
            <span class="text-xl">交易币种：人民币</span>
          </span>
          <el-button
            type="primary"
            icon="el-icon-back"
            @click="$router.push('/home')"
            class="bg-blue-500 hover:bg-blue-600"
            >返回首页</el-button>
        </div>
      </template>
      <div class="p-4">
        <div class="data-container flex flex-col items-center justify-center h-96">
          <dv-digital-flop
            :config="digitalFlopConfig"
            class="mb-4 w-full"
          ></dv-digital-flop>
          <dv-charts :option="lineChartOption" class="w-full h-96"></dv-charts>
        </div>
      </div>
      <p class="text-sm text-gray-500 mt-4 text-center">该数据来源自东方财富</p>
    </el-card>
  </div>
</template>

<script>
import axios from 'axios';
import { digitalFlop, charts } from '@jiaminghi/data-view';

export default {
  name: 'SgdcnycData',
  components: {
    'dv-digital-flop': digitalFlop,
    'dv-charts': charts,
  },
  data() {
    return {
      digitalFlopConfig: {
        number: [0],
        content: '{nt}',
        textAlign: 'center',
        style: {
          fill: '#3de7c9',
        },
      },
      lineChartOption: {
        xAxis: {
          type: 'category',
          data: [],
        },
        yAxis: {
          type: 'value',
        },
        series: [
          {
            name: '涨跌额',
            type: 'line',
            smooth: true,
            data: [],
            areaStyle: {
              color: 'rgba(0, 136, 212, 0.2)',
            },
            lineStyle: {
              color: '#0088d4',
            },
          },
          {
            name: '涨跌幅',
            type: 'line',
            smooth: true,
            data: [],
            areaStyle: {
              color: 'rgba(255, 70, 131, 0.2)',
            },
            lineStyle: {
              color: '#ff4683',
            },
          },
          {
            name: '中间价',
            type: 'line',
            smooth: true,
            data: [],
            lineStyle: {
              color: '#00ff00',
            },
          },
        ],
      },
    };
  },
  mounted() {
    this.fetchStockData();
    setInterval(this.fetchStockData, 60000);
  },
  methods: {
    async fetchStockData() {
      try {
        const { data } = await axios.get('http://localhost:8080/api/latest-sgdcnyc-data');
        const openingPrices = data.map(item => parseFloat(item.medianPrice));
        const riseValues = data.map(item => parseFloat(item.changeAmount));
        const sinkValues = data.map(item => parseFloat(item.changeAmplitude.replace('%', '')));

        this.digitalFlopConfig.number = [openingPrices[openingPrices.length - 1]];
        this.lineChartOption.xAxis.data = data.map(item => item.timestamp);
        this.lineChartOption.series[0].data = riseValues;
        this.lineChartOption.series[1].data = sinkValues;
        this.lineChartOption.series[2].data = openingPrices;
      } catch (error) {
        console.error('Error fetching stock data:', error);
      }
    },
  },
};
</script>

<style scoped>
.data-container {
  width: 100%;
  height: 500px;
}
</style>