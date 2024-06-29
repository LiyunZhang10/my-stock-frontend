<template>
  <div>
    <GoldChart />
    <UsdChnChart />
  </div>
</template>

<script>
import GoldChart from '@/components/GoldChart.vue';
import UsdChnChart from '@/components/UsdChnChart.vue';

export default {
  name: 'ChartView',
  components: {
    GoldChart,
    UsdChnChart
  }
};
</script>