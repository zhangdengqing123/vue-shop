<template>
  <div class="order">
    <!-- 订单管理面包屑区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片区域 -->
    <el-card class="mt20">
      <!-- 搜索订单列表区域 -->
      <el-row :gutter="20">
        <el-col :span="10">
          <el-input v-model="queryInfo.query" placeholder="请输入内容" clearable>
            <el-button slot="append" icon="el-icon-search" @click="getOrderList"></el-button>
          </el-input>
        </el-col>
      </el-row>

      <!-- 商品列表区域 -->
      <el-table :data="orderList" border stripe class="table">
        <el-table-column label="序号" width="50">
          <template v-slot="scope">
            <!-- 设置表格分页排序 -->
            {{ scope.$index + 1 + (queryInfo.pagenum - 1) * queryInfo.pagesize }}<br />
          </template>
        </el-table-column>
        <el-table-column prop="order_number" label="订单编号"></el-table-column>
        <el-table-column prop="order_price" label="订单价格" width="120"></el-table-column>
        <el-table-column label="是否付款" width="100">
          <template v-slot="scope">
            <el-tag type="danger" v-if="scope.row.pay_status === '0'">未付款</el-tag>
            <el-tag type="success" v-else>已付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="is_send" label="是否发货" width="80"></el-table-column>
        <el-table-column label="下单时间">
          <template v-slot="scope">
            {{ scope.row.create_time | formatDateY }}
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template v-slot="scope">
            <el-button type="primary" icon="el-icon-edit" size="mini" @click="editOrderItme(scope.row)">编辑</el-button>
            <el-button
              type="success"
              icon="el-icon-location"
              size="mini"
              @click="inspectAddress">查看
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
    <!-- 订单修改对话框 -->
    <el-dialog title="修改订单" :visible.sync="dialogVisible" width="50%" @close="editCloseVisible">
      <el-form :model="editForm" :rules="editRules" ref="editFormRefs" label-width="100px">
        <el-form-item label="省市区/县" prop="city">
          <el-cascader
            v-model="editForm.city"
            :options="cityList"
            @change="handleChangeCity">
          </el-cascader>
        </el-form-item>
        <el-form-item label="详细地址" prop="address">
          <el-input v-model="editForm.address"></el-input>
        </el-form-item>
        <el-form-item label="订单价格" prop="order_price">
          <el-input v-model="editForm.order_price"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editOrderContent">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 查看订单地址对话框 -->
    <el-dialog title="查看物流进度" :visible.sync="dialogAddress" width="50%" @close="closeInspect">
      <el-timeline :reverse="reverse">
        <el-timeline-item
          v-for="(activity, index) in activities"
          :key="index"
          :timestamp="activity.timestamp">
          {{activity.content}}
        </el-timeline-item>
      </el-timeline>
    </el-dialog>
  </div>
</template>

<script>
import { formatDate } from '@/plugins/date'
import cityData from '@/plugins/cityData'
export default {
  name: 'Orders',
  data() {
    return {
      orderList: [],
      orderId: 0,
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 5
      },
      total: 0,
      // 城市列表
      cityList: cityData,
      // form表单
      editForm: {
        address: '',
        city: '',
        order_price: ''
      },
      // 表单校验规则
      editRules: {
        city: [{ required: true, message: '请选择省市区县', trigger: 'blur' }],
        address: [{ required: true, message: '请输入详细地址', trigger: 'blur' }]
      },
      // 显示隐藏对话框
      dialogVisible: false,
      // 查看物流
      dialogAddress: false,
      // 查看订单物流列表
      reverse: true,
      activities: [{
        content: '活动按期开始',
        timestamp: '2018-04-15'
      }, {
        content: '通过审核',
        timestamp: '2018-04-13'
      }, {
        content: '创建成功',
        timestamp: '2018-04-11'
      }]
    }
  },
  filters: {
    // 过滤器日期格式化
    formatDateY(time) {
      const date = new Date(time)
      return formatDate(date, 'yyyy-MM-dd hh:mm:ss')
    }
  },
  created() {
    this.getOrderList()
  },
  methods: {
    async getOrderList() {
      const { data: res } = await this.$axios({
        method: 'get',
        url: 'orders',
        params: this.queryInfo,
        responseType: 'json'
      })
      if (res.meta.status !== 200) return this.$message.error('获取订单列表失败')
      console.log(res)
      this.orderList = res.data.goods
      // 总页数数据
      this.total = res.data.total
    },
    // 当前页显示多少条数数据
    handleSizeChange(page) {
      this.queryInfo.pagesize = page
      this.getOrderList(this.queryInfo.pagesize)
    },
    // 当前第几页
    handleCurrentChange(num) {
      this.queryInfo.pagenum = num
      this.getOrderList()
      console.log(this.queryInfo.pagesize)
    },
    // 订单列表修改
    async editOrderItme(row) {
      this.dialogVisible = true
      const id = row.order_id
      this.orderId = id
      const { data: res } = await this.$axios({
        method: 'get',
        url: `orders/${id}`,
        responseType: 'json'
      })
      if (res.meta.status !== 200) return this.$message.error('获取当前列表失败!')
      this.editForm.order_price = res.data.order_price
      console.log(res)
    },
    // 级联选择器改变城市
    handleChangeCity(city) {
      console.log(city)
    },
    // 提交修改完成的订单项
    editOrderContent() {
      console.log(this.orderId)
      this.$refs.editFormRefs.validate(async valid => {
        if (!valid) return false
        const { data: res } = await this.$axios({
          method: 'put',
          url: `orders/${this.orderId}`,
          data: {
            order_price: this.editForm.order_price
          },
          responseType: 'json'
        })
        if (res.meta.status !== 201) return this.$message.error('修改订单失败!')
        console.log(res)
        this.dialogVisible = false
        this.$message.success('修改订单成功')
        this.getOrderList()
      })
    },
    // 关闭对话框，重置表单项
    editCloseVisible() {
      this.$refs.editFormRefs.resetFields()
    },
    // 查看物流
    async inspectAddress() {
      const { data: res } = await this.$axios({
        method: 'get',
        url: '/kuaidi', // 需要带物流参数，参数么有，所有获取数据失败。
        responseType: 'json'
      })
      if (res.meta.status !== 200) return this.$message.error('获取物流信息失败')
      console.log(res)
      this.dialogAddress = true
    },
    // 关闭查看物流对话框
    closeInspect() {
      this.dialogAddress = false
    }
  }
}
</script>

<style lang="less" scoped>
@import '~assets/varibles.less';

.mt20,
.table,
.el-pagination {
  margin-top: @mb20px;
}
.is-always-shadow {
  box-shadow: @show;
}
.el-cascader {
  width: 100%;
}
</style>
