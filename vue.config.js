const path = require('path')
console.log(process.env.NODE_ENV === 'development') // 判断是否是开发模式

module.exports = {
  devServer: {
    proxy: {
      '/api': {
        target: 'http://localhost:8888/',
        changeOrigin: true,
        pathRewrite: { // 路径更改
          '^/api': 'api/private/v1' // 指定目录下文件
        }
      }
    }
  },
  // 配置导入文件指定路径入口
  chainWebpack: config => {
    config.resolve.alias
      .set('components', path.join(__dirname, './src/components'))
      .set('assets', path.join(__dirname, './src/assets'))
  }
}