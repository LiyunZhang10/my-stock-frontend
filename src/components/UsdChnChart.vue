<template>
  <div>
    <h1>汇率数据</h1>
    <!-- Add your chart component here -->
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import axios from 'axios';

export default {
  setup() {
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

    const fetchUsdChnData = async () => {
      try {
        const usdchnResponse = await axios.get('http://localhost:8080/api/latest-usdchn-data');
        
        // Console log the received data
        console.log('USD/CHN Data:', usdchnResponse.data);
        
      } catch (error) {
        console.error('Error fetching USD/CHN data:', error);
      }
    };

    onMounted(() => {
      fetchUsdChnData();
      setInterval(fetchUsdChnData, 6000); 
    });

    return {
      usdchnChartData,
      chartOptions
    };
  }
};
</script>