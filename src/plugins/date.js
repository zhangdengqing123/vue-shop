// 日期转换公共方法
export function formatDate (date, fmt) {
  if (/(y+)/.test(fmt)) { // 获取年份
    fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
  }
  const o = { // 定义时间日期
    'M+': date.getMonth() + 1,
    'd+': date.getDate(),
    'h+': date.getHours(),
    'm+': date.getMinutes(),
    's+': date.getSeconds()
  }
  for (const k in o) {
    const str = o[k] + ''
    if (new RegExp(`(${k})`).test(fmt)) {
      // console.log(RegExp.$1.length === 1, str)
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? str : padLeftZero(str))
    }
  }
  return fmt
}
function padLeftZero (str) { // 左侧补零
  return ('00' + str).substr(str.length)
}
