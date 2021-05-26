<template>
  <div class="report">
    <!-- 数据统计面包屑区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>数据统计</el-breadcrumb-item>
      <el-breadcrumb-item>数据报表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片区域 -->
    <el-card class="mt20">
      <div id="ecah" style="width:700px; height:400px;"></div>
    </el-card>
  </div>
</template>

<script>
import { cloneDeep } from '@/plugins/cloneDeep'
import * as echarts from 'echarts'
export default {
  name: 'Report',
  data() {
    return {
      options: {
        title: {
          text: 'ECharts 数据报表'
        },
        tooltip: {},
        legend: {
          data: ['销量']
        },
        xAxis: {
          data: ['衬衫', '羊毛衫', '雪纺衫', '裤子', '高跟鞋', '袜子']
        },
        yAxis: {},
        series: [
          {
            name: '销量',
            type: 'bar',
            data: [5, 20, 36, 10, 10, 20]
          }
        ]
      }
    }
  },
  async mounted() {
    // 基于准备好的dom，初始化echarts实例
    const myChart = echarts.init(document.getElementById('ecah'))
    // 获取图表数据
    const { data: res } = await this.$axios({
      method: 'get',
      url: 'reports/type/1',
      responseType: 'json'
    })
    if (res.meta.status !== 200) return this.$message.error('获取图表数据失败!')
    this.options = cloneDeep(this.options, res.data)
    // 绘制图表
    myChart.setOption(this.options)
  }
}
</script>

<style lang="less" scoped>
@import '~assets/varibles.less';
.mt20 {
  margin-top: @mb20px;
}
.is-always-shadow {
  box-shadow: @show;
}
</style>
