<template>
  <div>
    <h1>金价数据</h1>
    <!-- Add your chart component here -->
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import axios from 'axios';

export default {
  setup() {
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

    const chartOptions = {
      responsive: true,
      maintainAspectRatio: false
    };

    const fetchGoldData = async () => {
      try {
        const goldResponse = await axios.get('http://localhost:8080/api/latest-gold-data');
        
        // Console log the received data
        console.log('Gold Data:', goldResponse.data);
        
      } catch (error) {
        console.error('Error fetching gold data:', error);
      }
    };

    onMounted(() => {
      fetchGoldData();
      setInterval(fetchGoldData, 6000); 
    });

    return {
      goldChartData,
      chartOptions
    };
  }
};
</script>