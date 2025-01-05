<template>
  <div class="min-h-screen bg-gray-100 p-4">
    <el-card class="w-full h-full shadow-lg">
      <template #header>
        <div class="flex justify-between items-center ml-20">
          <span class="text-4xl font-bold text-gray-800">
            谷歌股价 &nbsp;&nbsp;&nbsp;&nbsp;
            <span class="text-3xl">谷歌 &nbsp;&nbsp;&nbsp;&nbsp;</span>
            <span class="text-2xl">google</span>
          </span>
          <el-button
            type="primary"
            icon="el-icon-back"
            @click="$router.push('/home')"
            class="bg-blue-500 hover:bg-blue-600"
          >
            返回首页
          </el-button>
        </div>
      </template>
      <div class="predict-page">
        <!-- 主内容区 -->
        <div class="main-content">
          <!-- 原有K线 -->
          <div class="kline original-kline">
            <div id="original-kline-chart" class="chart"></div>
          </div>

          <!-- 预测K线 -->
          <div class="kline predict-kline">
            <div id="predict-kline-chart" class="chart"></div>
          </div>

          <!-- 短期预测和长期预测 -->
          <div class="forecast">
            <div class="block-border">
              <p class="text-lg font-bold">短期预测： {{ removeEmTags(shortTermPredict) }}</p>
              <br/>
              <p>{{ removeEmTags(reasonShort) }}</p>
            </div>
            <div class="block-border">
              <p class="text-lg font-bold">长期预测： {{ removeEmTags(longTermPredict) }}</p>
              <br/>
              <p>{{ removeEmTags(reasonLong) }}</p>
            </div>
          </div>
        </div>

        <!-- 功能待实现 -->
        <div class="functionality">
          <!-- 利好 -->
          <div class="block">
            <h2 class=" positive-news font-bold text-6xl">利好新闻</h2>
            <br />
            <ul class="news-list">
              <li
                v-for="(item) in positiveNews"
                :key="item.url"
                class="news-item"
              >
                <a
                  :href="ensureHtmlSuffix(item.url)"
                  target="_blank"
                  class="news-link underline text-3xl"
                >
                  <strong>{{ item.title }}</strong>
                </a>
                <br />
                <p>{{ removeEmTags(item.content) }}</p>
                <p>原因：{{ removeEmTags(item.reason) }}</p>
              </li>
            </ul>
            <br />
            <h2 class="text-center  text-2xl font-bold">
              {{ removeEmTags(newsStatus) }}
            </h2>
          </div>

          <!-- 利空 -->
          <div class="block">
            <h2 class="font-bold text-6xl negitive-news">利空新闻</h2>
            <br />
            <ul class="news-list">
              <li
                v-for="(item) in negitiveNews"
                :key="item.url"
                class="news-item"
              >
                <a
                  :href="ensureHtmlSuffix(item.url)"
                  target="_blank"
                  class="news-link underline text-3xl"
                >
                  <strong>{{ item.title }}</strong>
                </a>
                <br />
                <p>{{ removeEmTags(item.content) }}</p>
                <p>原因：{{ removeEmTags(item.reason) }}</p>
              </li>
            </ul>
            <br />
            <h2 class="text-center  text-2xl font-bold">
              {{ removeEmTags(negitive_newsStatus) }}
            </h2>
          </div>
        </div>

        <!-- 风险提示 -->
        <div class="risk-warning">
          <h3 class="font-bold text-4xl">风险提示</h3>
          <br/>
          <p>{{ removeEmTags(risksComment) }}</p>
        </div>
      </div>
      <p class="text-sm text-gray-500 mt-4 text-center">
        该数据来源自东方财富
      </p>
    </el-card>
  </div>
</template>


<script>
import { onMounted } from "vue";
import axios from "axios";
import * as echarts from "echarts";

export default {
  name: "Predict",
  data() {
    return {
      apiUrl: "http://zhangliyun10.gnway.cc:8000/api/google-stock-prediction", // API 地址
      pastTime: [], // past-time
      pastPrice: [], // past-price
      predictTime: [], // predict-time
      predictPrice: [], // predict-price
      yAxisRange: null, // 新增：用于存储统一的 Y 轴范围

      positiveApiUrl: "http://fancywu.gnway.cc:24434/prospect/positive?stock=谷歌", // 新增：利好新闻API地址
      positiveNews: [], // 新增：用于存储从API接收到的利好新闻数据
      newsStatus: "", // 新增：用于存储新闻状态

      negitiveApiUrl: "http://fancywu.gnway.cc:24434/prospect/negative?stock=%E8%B0%B7%E6%AD%8C", // 新增：利好新闻API地址
      negitiveNews: [], // 新增：用于存储从API接收到的利好新闻数据
      negitive_newsStatus: "", // 新增：用于存储新闻状态

      // 短期预测、长期预测和风险提示
      predictApiUrl:"http://fancywu.gnway.cc:24434/llm/predict?stock=%E8%B0%B7%E6%AD%8C",
      shortTermPredict: "",
      reasonShort: "",
      longTermPredict: "",
      reasonLong: "",
      risksComment: "",
    };
  },
  mounted() {
    this.fetchData();
    this.fetchPositiveNews(); // 新增：调用新方法获取利好新闻
    this.fetchNegitiveNews()
    this.fetchPredictionData(); // 调用新方法获取预测数据
  },
  methods: {

    removeEmTags(str) {
      // 定义一个正则表达式来匹配<em>标签及其内容
      const emTagPattern = /<em>(.*?)<\/em>/g;

      // 测试字符串中是否存在<em>标签
      if (emTagPattern.test(str)) {
        // 如果存在<em>标签，则用其内容替换整个<em>标签
        return str.replace(emTagPattern, '$1');
      } else {
        // 如果不存在<em>标签，则返回原字符串
        return str;
      }
    },

   ensureHtmlSuffix(url) {
    // 创建一个 URL 对象来安全地解析传入的 URL 字符串
    const parsedUrl = new URL(url);
    
    // 获取路径部分，并检查其是否以 .html 结尾（不区分大小写）
    if (!parsedUrl.pathname.toLowerCase().endsWith('.html')) {
      // 如果不是，添加 .html 到路径部分
      parsedUrl.pathname += '.html';
    }

    // 返回修改后的完整 URL 字符串
    return parsedUrl.toString();
  },

   async fetchPositiveNews() {
      try {
        const response = await axios.get(this.positiveApiUrl);
        const data = response.data;

        this.newsStatus = data.status || "利好新闻"; // 设置标题为返回数据中的status字段
        this.positiveNews = data.news || []; // 设置利好新闻列表
      } catch (error) {
        console.error("利好新闻数据获取失败：", error);
      }
    },

    async fetchNegitiveNews() {
      try {
        const response = await axios.get(this.negitiveApiUrl);
        const data = response.data;

        this.negitive_newsStatus = data.status || "利好新闻"; // 设置标题为返回数据中的status字段
        this.negitiveNews = data.news || []; // 设置利好新闻列表
      } catch (error) {
        console.error("利好新闻数据获取失败：", error);
      }
    },

    // 获取短期预测、长期预测和风险提示
    async fetchPredictionData() {
      try {
        const response = await axios.get(this.predictApiUrl);
        const data = response.data;
        this.shortTermPredict = data.short_term_predict || "暂无预测";
        this.reasonShort = data.reason_short || "暂无原因";
        this.longTermPredict = data.long_term_predict || "暂无预测";
        this.reasonLong = data.reason_long || "暂无原因";
        this.risksComment = data.risks_comment || "暂无风险提示";
      } catch (error) {
        console.error("预测数据获取失败：", error);
      }
    },

    async fetchData() {
      try {
        const response = await axios.get(this.apiUrl);
        const data = response.data;

        // 根据 type 分类数据并排序
        this.pastTime = this.getTimeByType(data, "past").sort();
        this.pastPrice = this.getPriceByType(data, "past");
        this.predictTime = this.getTimeByType(data, "predict").sort();
        this.predictPrice = this.getPriceByType(data, "predict");

        // 计算统一的 Y 轴范围
        const allPrices = [...this.pastPrice, ...this.predictPrice];
        this.yAxisRange = this.calculateYAxisRange(allPrices);

        // 初始化图表
        this.initOriginalKlineChart();
        this.initPredictKlineChart();
      } catch (error) {
        console.error("数据获取失败：", error);
      }
    },

    getTimeByType(data, type) {
      return data
        .filter((item) => item.type === type)
        .map((item) => item.timestamp.split("T")[0]);
    },

    getPriceByType(data, type) {
      return data
        .filter((item) => item.type === type)
        .map((item) => item.price);
    },

    calculateYAxisRange(data) {
      if (!data.length) return { min: 0, max: 0 };

      const min = Math.min(...data); // 找到数据中的最小值
      const max = Math.max(...data); // 找到数据中的最大值

      // 确保最大值+10后取整，最小值-10后取整
      return {
        min: Math.floor(min - 10),
        max: Math.ceil(max + 10),
      };
    },

    initOriginalKlineChart() {
      const chartDom = document.getElementById("original-kline-chart");
      const myChart = echarts.init(chartDom);

      const option = {
        title: {
          text: "原有股价",
        },
        tooltip: {
          trigger: "axis",
        },
        xAxis: {
          type: "category",
          data: this.pastTime, // 使用 past-time 作为 x 轴数据，已经排序
        },
        yAxis: {
          type: "value",
          min: this.yAxisRange.min, // 设置统一的 Y 轴最小值
          max: this.yAxisRange.max, // 设置统一的 Y 轴最大值
        },
        series: [
          {
            name: "Past Price",
            type: "line",
            data: this.pastPrice, // 使用 past-price 作为 y 轴数据
          },
        ],
      };

      myChart.setOption(option);
    },

    initPredictKlineChart() {
      const chartDom = document.getElementById("predict-kline-chart");
      const myChart = echarts.init(chartDom);

      const option = {
        title: {
          text: "预测股价",
        },
        tooltip: {
          trigger: "axis",
        },
        xAxis: {
          type: "category",
          data: this.predictTime, // 使用 predict-time 作为 x 轴数据，已经排序
        },
        yAxis: {
          type: "value",
          min: this.yAxisRange.min, // 设置统一的 Y 轴最小值
          max: this.yAxisRange.max, // 设置统一的 Y 轴最大值
        },
        series: [
          {
            name: "Predict Price",
            type: "line",
            data: this.predictPrice, // 使用 predict-price 作为 y 轴数据
          },
        ],
      };

      myChart.setOption(option);
    },
  },
};
</script>


<style scoped>
/* 添加或修改样式 */
.predict-page {
  display: flex;
  flex-direction: column;
  padding: 20px;
  font-family: Arial, sans-serif;
}

.positive-news {
  color: green; /* 字体颜色为绿色 */
  flex-direction: column;
}

.negitive-news {
  color: red; /* 字体颜色为绿色 */
  flex-direction: column;
}

.news-list {
  list-style-type: none; /* 移除默认列表样式 */
  padding: 0;
}

.news-item {
  margin-bottom: 1em;
  display: block; /* 确保每个新闻条目是一个块级元素 */
}

.news-index {
  color: green; /* 标号颜色为绿色 */
}

.news-link {
  color: black;
  text-decoration: underline;
}

/* 主内容区：原有K线图、预测K线图、短期预测和长期预测 */
.main-content {
  display: grid;
  grid-template-columns: 3fr 2fr 1fr;
  gap: 0px; /* 减少间距以让元素更靠近 */
  margin-bottom: 5px;
  align-items: start;
}

/* 原有K线图和预测K线图 */
.kline {
  border: none; /* 移除边框 */
  position: relative;
  height: 600px; /* K线图统一高度 */
}

.chart {
  width: 100%;
  height: 100%;
}

/* 短期预测和长期预测 */
.forecast {
  display: flex;
  flex-direction: column;
  gap: 10px;
  height: 600px; /* 总高度与K线图一致 */
}

.block-border {
  text-align: center;
  flex-direction: column;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 5px;
  flex: 1; /* 各占一半高度 */
}

/* 使用Grid布局确保两个块高度一致 */
.functionality {
  display: grid;
  grid-template-columns: 1fr 1fr; /* 两列等宽 */
  gap: 10px; /* 列之间的间距 */
  margin-bottom: 5px;
}

.block {
  text-align: left;
  display: flex;
  flex-direction: column;
  align-items: flex-start; /* 内容左对齐 */
  justify-content: flex-start; /* 内容从顶部开始 */
  padding: 25px;
  overflow-y: auto; /* 如果内容超出，允许滚动 */
}

/* 风险提示 */
.risk-warning {
  text-align: center;
  padding: 10px;
  font-size: 16px;
}
</style>