<template>
  <div class="min-h-screen bg-gray-100 p-4">
    <el-card class="w-full h-full shadow-lg">
      <template #header>
        <div class="flex justify-between items-center">
          <span class="text-4xl font-bold text-gray-800 ml-20">
            新加坡元人民币中间价 &nbsp;&nbsp;
            <span class="text-3xl">SGDCNYC &nbsp;&nbsp;&nbsp;&nbsp;</span>
          </span>
          <el-button
            type="primary"
            icon="el-icon-back"
            @click="$router.push('/home')"
            class="bg-blue-500 hover:bg-blue-600 mr-20"
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
        <div class="ml-20 mr-20">
          <div class="flex justify-center items-center mb-20">
            <dv-decoration-8 style="width: 500px; height: 50px" />
            <div>
              <dv-decoration-5 style="width: 600px; height: 60px" :dur="5" />
              <div class="flex justify-center mt-5">
                <div class="text-4xl font-bold text-blue-600 mt-2">
                  北京时间： {{ currentTime }}
                </div>
              </div>
            </div>
            <dv-decoration-8
              :reverse="true"
              style="width: 500px; height: 50px" />
          </div>
          <dv-decoration-10 style="width: 100%; height: 5px" />
          <div class="flex justify-between mt-8">
            <div class="w-1/3 flex flex-col items-center">
              <h3 class="text-4xl font-bold mb-10 text-gray-700">
                人民币中间价
              </h3>
              <dv-capsule-chart
                class="font-bold text-indigo-500"
                :config="medianPriceConfig"
                style="width: 300px; height: 300px" />
            </div>

            <div class="w-1/3 flex flex-col items-center">
              <h3 class="text-4xl font-bold mb-10 text-gray-700">
                新加坡人民币实时中间价
              </h3>
              <dv-decoration-9
                class="text-6xl text-blue-500"
                style="width: 300px; height: 300px"
                :dur="5"
                >{{ latestRateConfig.number }}</dv-decoration-9
              >
            </div>

            <div class="w-1/3 flex flex-col items-center">
              <h3 class="text-4xl font-bold mb-10 text-gray-700">涨跌幅</h3>
              <dv-water-level-pond
                :config="changeAmplitudeConfig"
                style="width: 300px; height: 300px" />
            </div>
          </div>
        </div>
      </template>
      <p class="text-sm text-gray-500 mt-20 text-center">
        该数据来源自东方财富
      </p>
    </el-card>
  </div>
</template>

<script>
import axios from 'axios';
import { getApiUrl } from '@/utils/api';

export default {
  name: 'SgdcnycData',
  data() {
    return {
      rateData: [],
      loading: true,
      error: null,
      intervalId: null,
      currentDate: new Date(),
    };
  },
  computed: {
    currentTime() {
      return this.formatDate(this.currentDate);
    },
    latestData() {
      return this.rateData[0] || {};
    },
    latestRateConfig() {
      const value = parseFloat(this.latestData.medianPrice) || 0;
      return {
        number: value.toFixed(4),
      };
    },
    changeAmplitudeConfig() {
      const value = parseFloat(this.latestData.changeAmplitude) || 0;
      return {
        data: [value],
        waveHeight: 150,
        waveNum: 2,
        waveOpacity: 0.4,
        textStyle: {
          fontSize: 25,
          fill: '#fff',
        },
        borderWidth: 3,
        borderGap: 3,
        lineDash: [5, 5],
      };
    },
    medianPriceConfig() {
      return {
        data: [
          {
            name: '加元',
            value: 5.2237,
          },
          {
            name: '欧元',
            value: 7.6892,
          },
          {
            name: '港币',
            value: 0.9127,
          },
          {
            name: '英镑',
            value: 9.0582,
          },
          {
            name: '美元',
            value: 7.1291,
          },
        ],
        showValue: true,
      };
    },
  },
  methods: {
    async fetchData() {
      try {
        this.loading = true;
        this.error = null;
        const response = await axios.get(getApiUrl('/latest-sgdcnyc-data'));
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
    updateCurrentTime() {
      this.currentDate = new Date();
    },
    formatDate(date) {
      const options = {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
      };
      return date.toLocaleString('zh-CN', options).replace(/\//g, '-');
    },
  },
  created() {
    this.fetchData();
    this.intervalId = setInterval(this.fetchData, 60000);
    this.timeIntervalId = setInterval(this.updateCurrentTime, 1000);
  },
  beforeDestroy() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
    if (this.timeIntervalId) {
      clearInterval(this.timeIntervalId);
    }
  },
};
</script>