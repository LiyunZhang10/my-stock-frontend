<template>
  <div class="content">
    <dv-full-screen-container>
      <dv-border-box-3>
        <h1>最新数据</h1>
        <div v-if="data">
          <p>今开: {{ data.opening }}</p>
          <p>昨收: {{ data.closed }}</p>
          <p>最高: {{ data.highest }}</p>
          <p>最低: {{ data.lowest }}</p>
          <p>涨幅: {{ data.rise }}</p>
          <p>涨跌: {{ data.sink }}</p>
          <p>买入: {{ data.buy }}</p>
          <p>卖出: {{ data.sale }}</p>
          <p>时间: {{ data.timestamp }}</p>
        </div>
      </dv-border-box-3>
    </dv-full-screen-container>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      data: null
    };
  },
  created() {
    this.fetchData();
    setInterval(this.fetchData, 5000); // 每5秒刷新一次数据
  },
  methods: {
    async fetchData() {
      try {
        const response = await axios.get('http://localhost:8080/api/latest-data');
        this.data = response.data;
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }
  }
};
</script>