// vue.config.js
const { defineConfig } = require('@vue/cli-service');
module.exports = defineConfig({
  transpileDependencies: true,
  css: {
    loaderOptions: {
      postcss: {
        postcssOptions: {
          plugins: [require('tailwindcss'), require('autoprefixer')],
        },
      },
    },
  },
  devServer: {
    port: 8083,
    allowedHosts: 'all',
    proxy: {
      '/api': {
        // target: 'http://localhost:8080', // 后端 API 地址
        target: 'http://zhangliyun10.gnway.cc:8000',
        changeOrigin: true, // 修改请求头中的来源字段
        secure: false, // 如果使用 https，请设置为 true
        logLevel: 'debug', // 输出代理请求的详细日志，帮助调试
      },
    },
  },
});
