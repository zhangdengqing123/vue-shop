<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 用户列表区域 -->
    <el-card class="box-card">
      <el-row :gutter="20">
        <el-col :span="10">
          <el-input v-model="queryInfo.query" placeholder="请输入姓名" clearable @clear="getUsersList" class="input-with-select">
            <el-button slot="append" icon="el-icon-search" @click="getUsersList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="3">
          <el-button type="primary" @click="addDialogVisible = true">添加用户</el-button>
        </el-col>
        <!-- 添加用户列表弹窗 -->
        <el-dialog title="添加用户" :visible.sync="addDialogVisible" width="50%" @close="addDialogCos">
          <el-form :model="addForm" :rules="addFromRules" ref="addFormRef" label-width="100px">
            <el-form-item label="用户名" prop="username">
              <el-input v-model="addForm.username"></el-input>
            </el-form-item>
            <el-form-item label="密码" prop="password">
              <el-input type="password" v-model="addForm.password"></el-input>
            </el-form-item>
            <el-form-item label="邮箱" prop="email">
              <el-input v-model="addForm.email"></el-input>
            </el-form-item>
            <el-form-item label="手机" prop="mobile">
              <el-input v-model="addForm.mobile"></el-input>
            </el-form-item>
          </el-form>
          <span slot="footer" class="dialog-footer">
            <el-button @click="addDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="submitForm">确 定</el-button>
          </span>
      </el-dialog>
      </el-row>
      <!-- 用户列表区域 -->
      <users-table :tableData="tableData" :index="queryInfo" :getListFn="getUsersList"></users-table>
      <!-- 用户分页区域 -->
      <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="queryInfo.pagenum"
      :page-sizes="[1, 2, 3, 10]"
      :page-size="queryInfo.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
    </el-card>
  </div>
</template>

<script>
import UsersTable from './pages/UserTable'
export default {
  name: 'Users',
  data() {
    // 用户名
    const checkUserReg = /^[a-zA-Z]\w{3,9}$/
    // 密码
    const checkPassReg = /^[0-9a-zA-Z]\w{5,15}$/
    // 邮箱
    const checkEmailReg = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/
    // 手机号
    const checkMobileReg = /^(13[0-9]|14[5|7]|15[0|1|2|3|4|5|6|7|8|9]|18[0|1|2|3|5|6|7|8|9])\d{8}$/
    // 公共校验函数
    function reg(msg, reg, val, fn, input) {
      if (!val) {
        return fn(new Error(input))
      } else if (!reg.test(val)) {
        fn(new Error(msg))
      } else {
        fn()
      }
    }
    const addUser = function(rule, value, callback) {
      reg('以字母开头，长度在4~10之间，含字母、数字和下划线', checkUserReg, value, callback, '用户名不能为空')
    }
    const addPass = function(rule, value, callback) {
      reg('长度在4~10之间，含字母、数字和下划线', checkPassReg, value, callback, '密码不能为空')
    }
    const addEmail = function(rule, value, callback) {
      reg('邮箱格式有误', checkEmailReg, value, callback, '邮箱不能为空')
    }
    const addMobile = function(rule, value, callback) {
      reg('手机格式错误', checkMobileReg, value, callback, '手机不能为空')
    }
    return {
      tableData: [],
      // 请求参数
      queryInfo: {
        // 用户查询
        query: '',
        // 当前第几页
        pagenum: 1,
        // 每页显示多少条
        pagesize: 2
      },
      // 总条数
      total: 0,
      // 添加用户列表弹框
      addDialogVisible: false,
      // 添加用户表单
      addForm: {
        username: 'zhang123',
        password: '12345678',
        email: '463747748@qq.com',
        mobile: '13868687989'
      },
      // 表单校验规则
      addFromRules: {
        username: [
          { required: true, validator: addUser, trigger: 'blur' }
        ],
        password: [
          { required: true, validator: addPass, trigger: 'blur' }
        ],
        email: [
          { required: true, validator: addEmail, trigger: 'blur' }
        ],
        mobile: [
          { required: true, validator: addMobile, trigger: 'blur' }
        ]
      }
    }
  },
  components: {
    UsersTable
  },
  created() {
    this.getUsersList()
  },
  methods: {
    // 关闭用户弹框
    addDialogCos() {
      this.$refs.addFormRef.resetFields()
    },
    // 添加用户列表
    async postUsersList() {
      const { data: res } = await this.$axios({
        method: 'post',
        url: 'users',
        data: this.addForm,
        responseType: 'json'
      })
      if (res.meta.status !== 201) return this.$message.error(res.meta.msg)
      if (res.data) {
        this.$message.success(res.meta.msg)
        // 重新获取用户列表数据
        this.getUsersList()
      }
    },
    // 添加用户提交
    submitForm() {
      this.$refs.addFormRef.validate(valid => {
        if (!valid) return false
        this.postUsersList()
        this.addDialogVisible = false
      })
    },
    // 监听当前显示多少条数据
    handleSizeChange(newPage) {
      this.queryInfo.pagesize = newPage
      this.getUsersList()
    },
    // 监听当前第几页
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage
      this.getUsersList()
    },
    // 获取用户列表数据
    async getUsersList() {
      const { data: res } = await this.$axios({
        method: 'get',
        url: 'users',
        params: this.queryInfo,
        responseType: 'json'
      })
      console.log(res)
      // 判断删除后暂无数据
      if (res.meta.status !== 200) return this.$message.error('获取用户列表失败!')
      if (res.data) {
        this.tableData = res.data.users
        this.total = res.data.total
      }
    }
  }
}
</script>

<style lang="less" scoped>
@import '~assets/varibles.less';
.el-breadcrumb {
  margin-bottom: @mb20px;
}
.is-always-shadow {
  box-shadow: 1px 1px 3px rgba(0, 0, 0, 0.15) !important;
}
.el-row {
  margin-bottom: @mb20px;
}
</style>
