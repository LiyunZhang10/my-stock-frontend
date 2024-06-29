<template>
  <div>
    <div ref="goldPriceChart" style="width: 600px;height:400px;"></div>
    <div ref="goldChangeRateChart" style="width: 600px;height:400px;"></div>
  </div>
</template>

<script>
import axios from 'axios';
import * as echarts from 'echarts';

export default {
  name: 'GoldChart',
  data() {
    return {
      goldPriceData: [],
      goldChangeRateData: []
    };
  },
  mounted() {
    this.fetchGoldData();
  },
  methods: {
    fetchGoldData() {
      axios.get('/api/latest-gold-data')
        .then(response => {
          this.goldPriceData = response.data.map(item => [item.timestamp, item.price]);
          this.goldChangeRateData = response.data.map(item => [item.timestamp, item.changeRate]);
          this.initCharts();
        })
        .catch(error => {
          console.error("There was an error fetching the gold data!", error);
        });
    },
    initCharts() {
      const priceChart = echarts.init(this.$refs.goldPriceChart);
      const changeRateChart = echarts.init(this.$refs.goldChangeRateChart);

      const priceOption = {
        title: { text: 'Gold Price' },
        xAxis: { type: 'time' },
        yAxis: { type: 'value' },
        series: [{ data: this.goldPriceData, type: 'line' }]
      };

      const changeRateOption = {
        title: { text: 'Gold Change Rate' },
        xAxis: { type: 'time' },
        yAxis: { type: 'value' },
        series: [{ data: this.goldChangeRateData, type: 'line' }]
      };

      priceChart.setOption(priceOption);
      changeRateChart.setOption(changeRateOption);
    }
  }
};
</script>