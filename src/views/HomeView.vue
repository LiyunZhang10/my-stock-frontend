<template>
  <div class="min-h-screen" style="background-color: #f3f4f6">
    <el-container>
      <el-header class="bg-blue-500 text-white text-center py-6">
        <h1 class="text-4xl font-bold">欢迎来到数据可视化平台</h1>
      </el-header>
      <el-main>
        <div class="container mx-auto py-10">
          <el-row :gutter="20">
            <el-col :span="12">
              <el-card class="box-card">
                <div slot="header" class="clearfix">
                  <span class="text-2xl font-semibold">金价数据</span>
                </div>
                <div class="text-center">
                  <p class="mb-4">查看最新的金价数据和趋势。</p>
                  <el-button type="primary" @click="navigateTo('GoldChart')"
                    >查看金价数据</el-button
                  >
                </div>
              </el-card>
            </el-col>
            <el-col :span="12">
              <el-card class="box-card">
                <div slot="header" class="clearfix">
                  <span class="text-2xl font-semibold">汇率数据</span>
                </div>
                <div class="text-center">
                  <p class="mb-4">查看最新的汇率数据和趋势。</p>
                  <el-button type="primary" @click="navigateTo('UsdChnChart')"
                    >查看汇率数据</el-button
                  >
                </div>
              </el-card>
            </el-col>
            <el-col :span="12">
              <el-card class="box-card">
                <div slot="header" class="clearfix">
                  <span class="text-2xl font-semibold">NVDA 股票数据</span>
                </div>
                <div class="text-center">
                  <p class="mb-4">查看最新的 NVDA 股票数据和趋势。</p>
                  <el-button type="primary" @click="navigateTo('NvdaStock')"
                    >查看 NVDA 股票数据</el-button
                  >
                </div>
              </el-card>
            </el-col>
          </el-row>
        </div>
      </el-main>
    </el-container>
  </div>
</template>

<script>
export default {
  name: 'HomeView',
  methods: {
    navigateTo(routeName) {
      this.$router.push({ name: routeName });
    },
  },
};
</script>
