<template>
  <el-container class="min-h-screen bg-gray-100 flex flex-col">
    <el-header class="bg-blue-500 text-white text-center py-8">
      <h1 class="text-4xl font-bold">欢迎来到数据可视化平台</h1>
    </el-header>
    <el-main class="flex-grow p-8 md:p-12 flex items-center justify-center">
      <div class="w-full max-w-8xl">
        <el-row :gutter="40" class="justify-center">
          <el-col
            :xs="24"
            :sm="22"
            :md="12"
            v-for="(card, index) in cards"
            :key="index"
            class="mb-20">
            <el-card
              class="min-h-[300px] flex flex-col shadow-lg hover:shadow-2xl transition-shadow duration-300">
              <h2 slot="header" class="text-3xl font-semibold">
                {{ card.title }}
              </h2>
              <div class="flex-grow flex flex-col justify-between">
                <p class="text-gray-600 mb-6 text-xl">{{ card.description }}</p>
                <el-button
                  type="primary"
                  @click="navigateTo(card.route)"
                  class="w-full mt-auto text-lg py-4">
                  {{ card.buttonText }}
                </el-button>
              </div>
            </el-card>
          </el-col>
        </el-row>
      </div>
    </el-main>
    <el-footer class="text-center text-gray-500 text-base p-6">
      这是一个用于展示各种金融数据的数据可视化平台。
    </el-footer>
  </el-container>
</template>

<script>
export default {
  name: 'HomeView',
  data() {
    return {
      cards: [
        {
          title: '新加坡元人民币中间价',
          description: '查看最新的新加坡元兑人民币汇率数据。',
          buttonText: '点击以查看',
          route: 'SgdcnycData',
        },
        {
          title: '美元离岸人民币',
          description: '查看最新的汇率及涨跌幅数据。',
          buttonText: '点击以查看',
          route: 'UsdChnChart',
        },
        {
          title: 'COMEX黄金',
          description: '查看最新的黄金价格及涨跌幅数据。',
          buttonText: '点击以查看',
          route: 'GoldChart',
        },
        {
          title: '英伟达NVDA',
          description: '查看英伟达NVDA一月以来的K线图。',
          buttonText: '点击以查看',
          route: 'NvdaStock',
        },
      ],
    };
  },
  methods: {
    navigateTo(routeName) {
      this.$router.push({ name: routeName });
    },
  },
};
</script>
