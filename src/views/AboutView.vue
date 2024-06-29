<template>
  <div>
    <h1>金价和汇率数据</h1>
    <line-chart :chart-data="goldChartData" :options="chartOptions"></line-chart>
    <line-chart :chart-data="usdchnChartData" :options="chartOptions"></line-chart>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { Line } from 'vue-chartjs';

const goldChartData = ref({
  labels: [],
  datasets: [
    {
      label: '金价',
      backgroundColor: '#f9d423',
      data: []
    },
    {
      label: '金价涨跌幅',
      backgroundColor: '#e14eca',
      data: []
    }
  ]
});

const usdchnChartData = ref({
  labels: [],
  datasets: [
    {
      label: '汇率',
      backgroundColor: '#1f78b4',
      data: []
    },
    {
      label: '汇率涨跌幅',
      backgroundColor: '#b2df8a',
      data: []
    }
  ]
});

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false
};

const fetchData = async () => {
  try {
    const goldResponse = await axios.get('http://localhost:8080/api/latest-gold-data');
    const usdchnResponse = await axios.get('http://localhost:8080/api/latest-usdchn-data');
    updateChartData(goldChartData.value, goldResponse.data);
    updateChartData(usdchnChartData.value, usdchnResponse.data);
  } catch (error) {
    console.error('Error fetching data:', error);
  }
};

const updateChartData = (chartData, data) => {
  chartData.labels.push(new Date(data.timestamp).toLocaleTimeString());
  chartData.datasets[0].data.push(data.price);
  chartData.datasets[1].data.push(data.changeRate);

  if (chartData.labels.length > 50) {
    chartData.labels.shift();
    chartData.datasets[0].data.shift();
    chartData.datasets[1].data.shift();
  }
};

onMounted(() => {
  fetchData();
  setInterval(fetchData, 6000); // 每6秒刷新一次数据
});
</script>