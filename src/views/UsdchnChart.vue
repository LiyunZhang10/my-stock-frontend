<template>
  <div>
    <div ref="usdchnPriceChart" style="width: 600px;height:400px;"></div>
    <div ref="usdchnChangeRateChart" style="width: 600px;height:400px;"></div>
  </div>
</template>

<script>
import axios from 'axios';
import * as echarts from 'echarts';

export default {
  name: 'UsdchnChart',
  data() {
    return {
      usdchnPriceData: [],
      usdchnChangeRateData: []
    };
  },
  mounted() {
    this.fetchUsdchnData();
  },
  methods: {
    fetchUsdchnData() {
      axios.get('/api/latest-usdchn-data')
        .then(response => {
          this.usdchnPriceData = response.data.map(item => [item.timestamp, item.price]);
          this.usdchnChangeRateData = response.data.map(item => [item.timestamp, item.changeRate]);
          this.initCharts();
        })
        .catch(error => {
          console.error("There was an error fetching the USD/CNH data!", error);
        });
    },
    initCharts() {
      const priceChart = echarts.init(this.$refs.usdchnPriceChart);
      const changeRateChart = echarts.init(this.$refs.usdchnChangeRateChart);

      const priceOption = {
        title: { text: 'USD/CNH Price' },
        xAxis: { type: 'time' },
        yAxis: { type: 'value' },
        series: [{ data: this.usdchnPriceData, type: 'line' }]
      };

      const changeRateOption = {
        title: { text: 'USD/CNH Change Rate' },
        xAxis: { type: 'time' },
        yAxis: { type: 'value' },
        series: [{ data: this.usdchnChangeRateData, type: 'line' }]
      };

      priceChart.setOption(priceOption);
      changeRateChart.setOption(changeRateOption);
    }
  }
};
</script>