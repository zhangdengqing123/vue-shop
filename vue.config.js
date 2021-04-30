const path = require('path')


module.exports = {
  devServer: {
    proxy: {
      '/api': {
        target: 'http://localhost:8888/',
        changeOrigin: true,
        pathRewrite: { // 路径更改
          '^/api': 'api/private/v1' // 指定mock目录下文件
        }
      }
    }
  },
  chainWebpack: config => {
    config.resolve.alias
      .set('components', path.join(__dirname, './src/components'))
      .set('assets', path.join(__dirname, './src/assets'))
  }
}