<template>
  <div class="rights">
    <!-- 权限列表面包屑区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 权限列表卡片视图区域 -->
    <el-card class="box-card">
      <el-table :data="list" border stripe class="table">
        <el-table-column label="序号" type="index"></el-table-column>
        <el-table-column label="权限名称" prop="authName"></el-table-column>
        <el-table-column label="权限路径" prop="path"></el-table-column>
        <el-table-column label="权限等级">
          <template v-slot="scope">
            <el-tag v-if="scope.row.level === '0'">一级</el-tag>
            <el-tag type="success" v-else-if="scope.row.level === '1'">二级</el-tag>
            <el-tag type="warning" v-else>三级</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'RightsList',
  data() {
    return {
      list: []
    }
  },
  created() {
    this.getRightsInfo()
  },
  methods: {
    // 获取权利列表数据
    async getRightsInfo() {
      const { data: res } = await this.$axios({
        method: 'get',
        url: 'rights/list',
        responseType: 'json'
      })
      if (res.meta.status !== 200) return this.$message.error('获取权限列表错误')
      this.list = res.data
    }
  }
}
</script>

<style lang="less" scoped>
@import '~assets/varibles.less';
.box-card {
  margin-top: @mb20px;
}
.is-always-shadow {
  box-shadow: 1px 1px 3px rgba(0, 0, 0, 0.15) !important;
}
.table {
  font-size: 12px;
}
.rights /deep/ .el-table td, /deep/ .el-table th {
  text-align: center !important;
}
</style>
