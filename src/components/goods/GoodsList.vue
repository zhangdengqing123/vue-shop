<template>
  <div class="good-list">
    <!-- 商品分类面包屑区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片区域 -->
    <el-card class="mt20">
      <!-- 搜索商品和添加商品区域 -->
      <el-row :gutter="20">
        <el-col :span="10">
          <el-input v-model="queryInfo.query" placeholder="请输入内容" clearable @clear="getGoods">
            <el-button slot="append" icon="el-icon-search" @click="getGoodsList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="3">
          <el-button type="primary" @click="goAddPage">添加商品</el-button>
        </el-col>
      </el-row>

      <!-- 商品列表区域 -->
      <el-table :data="goodsList" border stripe class="table">
        <el-table-column type="index" label="序号"></el-table-column>
        <el-table-column label="商品名称">
          <template v-slot="scope">
            <el-tooltip
              class="item"
              effect="light"
              :content="scope.row.goods_name"
              placement="top-start"
              :enterable="false">
              <div class="column">{{ scope.row.goods_name }}</div>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column prop="goods_price" label="商品价格(元)" width="100"></el-table-column>
        <el-table-column prop="goods_weight" label="商品重量" width="100"></el-table-column>
        <el-table-column label="创建时间" width="140">
          <!-- 显示日期格式 -->
          <template v-slot="scope">{{ (scope.row.add_time * 1000) | formatDateY }}</template>
        </el-table-column>
        <el-table-column label="操作" width="130">
          <template v-slot="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="editGoodsItem(scope.row.goods_id)">编辑
            </el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="delGoodsItem(scope.row.goods_id)">删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 用户分页区域 -->
      <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[5, 10, 15, 20]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
import { formatDate } from '@/plugins/date'
export default {
  name: 'GoodsList',
  data() {
    return {
      // 商品列表数据
      goodsList: [],
      // 获取商品列表参数
      queryInfo: {
        query: '',
        // 当前第几页
        pagenum: 1,
        // 每页显示多少条
        pagesize: 10
      },
      // 页面数据总条数
      total: 0
    }
  },
  // 过滤器日期格式化
  filters: {
    formatDateY(time) {
      const date = new Date(time)
      return formatDate(date, 'yyyy-MM-dd hh:mm:ss')
    }
  },
  created() {
    this.getGoodsList()
  },
  methods: {
    // 清除文本框重新获取数据
    getGoods() {
      this.getGoodsList()
    },
    // 获取商品列表数据
    async getGoodsList() {
      const { data: res } = await this.$axios({
        method: 'get',
        url: 'goods',
        params: this.queryInfo,
        responseType: 'json'
      })
      if (res.meta.status !== 200) return this.$message('获取商品列表失败!')
      this.goodsList = res.data.goods
      this.total = res.data.total
    },
    // 点击跳转第几页
    handleCurrentChange(num) {
      this.queryInfo.pagenum = num
      this.getGoodsList()
    },
    // 当前显示显示多少数据
    handleSizeChange(size) {
      this.queryInfo.pagesize = size
      this.getGoodsList()
    },
    // 根据id删除商品当前列
    delGoodsItem(id) {
      this.$confirm('此操作将永久删除该商品, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const { data: res } = await this.$axios({
          method: 'delete',
          url: 'goods/' + id,
          responseType: 'json'
        })
        console.log(res)
        if (res.meta.status !== 200) return this.$message.error('商品删除失败')
        this.$message.success('商品删除成功')
        this.getGoodsList()
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    // 根据 id 编辑当前商品
    editGoodsItem(id) {
      this.$router.push(`/goods/edit/${id}`)
    },
    // 添加商品
    goAddPage() {
      this.$router.push('/goods/add')
    }
  }
}
</script>

<style lang="less" scoped>
@import '~assets/varibles.less';
.mt20 {
  margin-top: @mb20px;
  .el-row {
    margin-bottom: @mb20px;
  }
  .table {
    font-size: 12px;
    .column {
      min-width: 160px;
      max-width: auto;
      overflow: hidden;
      white-space: nowrap; /*不换行*/
      text-overflow: ellipsis; /*超出部分文字以...显示*/
    }
  }
}
.is-always-shadow {
  box-shadow: @show;
}
.el-pagination {
  margin-top: @mb20px;
}
</style>
