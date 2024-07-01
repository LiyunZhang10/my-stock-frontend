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
            >返回首页</el-button
          >
        </div>
      </template>

      <div v-if="loading" class="flex justify-center items-center h-96">
        <el-spinner :size="64" />
      </div>
      <div v-else-if="error" class="text-center text-red-500 p-4">
        {{ error }}
      </div>

      <template v-else>
        <div class="grid grid-cols-2 gap-8 mb-6">
          <dv-border-box-13>
            <h3 class="text-xl font-bold mb-4 text-gray-700">最新汇率</h3>
            <dv-decoration-8 style="width: 100%; height: 50px" />
            <dv-digital-flop :config="latestRateConfig" />
          </dv-border-box-13>
          <dv-border-box-13>
            <h3 class="text-xl font-bold mb-4 text-gray-700">变化幅度</h3>
            <dv-decoration-8
              :reverse="true"
              style="width: 100%; height: 50px" />
            <dv-water-level-pond :config="changeAmplitudeConfig" />
          </dv-border-box-13>
          <dv-border-box-13>
            <h3 class="text-xl font-bold mb-4 text-gray-700">变化金额</h3>
            <dv-decoration-10 style="width: 100%; height: 5px" />
            <dv-digital-flop :config="changeAmountConfig" />
          </dv-border-box-13>
          <dv-border-box-13>
              <dv-decoration-2 style="width: 90%; height: 5px" />
              <h3 class="text-xl font-bold mb-4 text-gray-700">汇率趋势</h3>
              <dv-water-level-pond :config="waterLevelConfig" />
          </dv-border-box-13>
        </div>
      </template>
      <p class="text-sm text-gray-500 mt-4 text-center">
        该数据来源自实时汇率API
      </p>
    </el-card>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'SgdcnycData',
  data() {
    return {
      rateData: [],
      loading: true,
      error: null,
      intervalId: null,
    };
  },
  computed: {
    latestData() {
      return this.rateData[0] || {};
    },
    latestRateConfig() {
      const value = parseFloat(this.latestData.medianPrice) || 0;
      return {
        number: [value],
        content: '{nt}',
        style: {
          fontSize: '48px',
          fill: '#3498db',
        },
        toFixed: 4,
      };
    },
    changeAmplitudeConfig() {
      const value = parseFloat(this.latestData.changeAmplitude) || 0;
      return {
        data: [value],
        shape: 'round',
        waveHeight: 0.5,
        waveNum: 3,
        waveOpacity: 0.4,
        formatter: '{value}%',
        borderWidth: 2,
        borderColor: value < 0 ? '#e74c3c' : '#2ecc71',
        textStyle: {
          fontSize: 28,
          fontWeight: 'bold',
          color: value < 0 ? '#e74c3c' : '#2ecc71',
        },
        colors:
          value < 0
            ? ['#e74c3c', '#ec7063', '#f1948a']
            : ['#2ecc71', '#58d68d', '#82e0aa'],
        backgroundColor: '#ecf0f1',
      };
    },
    changeAmountConfig() {
      const value = parseFloat(this.latestData.changeAmount) || 0;
      return {
        number: [value],
        content: '{nt}',
        style: {
          fontSize: '48px',
          fill: value < 0 ? '#e74c3c' : '#2ecc71',
        },
        toFixed: 4,
      };
    },
    waterLevelConfig() {
      if (this.rateData.length === 0) {
        return {
          data: [0],
          shape: 'round',
          waveHeight: 0.6,
          waveNum: 3,
          waveOpacity: 0.4,
          formatter: '{value}',
          borderWidth: 2,
          borderColor: '#3498db',
          textStyle: {
            fontSize: 28,
            fontWeight: 'bold',
            color: '#3498db',
          },
          colors: ['#3498db', '#2980b9', '#1abc9c'],
          backgroundColor: '#ecf0f1',
        };
      }

      const latestPrice = parseFloat(this.latestData.medianPrice) || 0;
      const minPrice = Math.min(
        ...this.rateData.map((d) => parseFloat(d.medianPrice) || 0)
      );
      const maxPrice = Math.max(
        ...this.rateData.map((d) => parseFloat(d.medianPrice) || 0)
      );
      const range = maxPrice - minPrice;
      const percentage =
        range !== 0 ? ((latestPrice - minPrice) / range) * 100 : 0;

      return {
        data: [percentage],
        shape: 'round',
        waveHeight: 0.6,
        waveNum: 3,
        waveOpacity: 0.4,
        toFixed: 2,
        formatter: '{value}',
        borderWidth: 2,
        borderColor: '#3498db',
        textStyle: {
          fontSize: 28,
          fontWeight: 'bold',
          color: '#3498db',
        },
        colors: ['#3498db', '#2980b9', '#1abc9c'],
        backgroundColor: '#ecf0f1',
        value: latestPrice.toFixed(4),
      };
    },
  },
  methods: {
    async fetchData() {
      try {
        this.loading = true;
        this.error = null;
        const response = await axios.get(
          'http://localhost:8080/api/latest-sgdcnyc-data'
        );
        if (Array.isArray(response.data) && response.data.length > 0) {
          this.rateData = response.data.map((item) => ({
            ...item,
            medianPrice: parseFloat(item.medianPrice),
            changeAmount: parseFloat(item.changeAmount),
            changeAmplitude: parseFloat(item.changeAmplitude),
          }));
        } else {
          throw new Error('Invalid data format');
        }
      } catch (err) {
        console.error('Error fetching data:', err);
        this.error = '获取数据失败，请稍后再试。';
      } finally {
        this.loading = false;
      }
    },
  },
  created() {
    this.fetchData();
    this.intervalId = setInterval(this.fetchData, 60000);
  },
  beforeDestroy() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  },
};
</script>
