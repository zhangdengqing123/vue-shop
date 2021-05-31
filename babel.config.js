// 项目发布的时候用的bable插件
const prodPlugins = []

if (process.env.NODE_ENV !== 'development') {
  prodPlugins.push('transform-remove-console')
}

module.exports = {
  presets: [
    '@vue/cli-plugin-babel/preset'
  ],
  plugins: [...prodPlugins]
}
