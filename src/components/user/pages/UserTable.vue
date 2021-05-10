<template>
  <div class="table-container">
    <el-table :data="tableData" border class="table" stripe>
      <el-table-column width="50" align="center" label="序号">
        <template v-slot="scope">
          <!-- 设置表格分页排序 -->
          {{ (scope.$index + 1 + ((index.pagenum || 1) - 1) * index.pagesize) }}
        </template>
      </el-table-column>
      <el-table-column label="日期" width="120">
        <!-- 显示日期格式 -->
        <template v-slot="scope">{{ (scope.row.create_time * 1000) | formatDateY }}</template>
      </el-table-column>
      <el-table-column prop="username" label="姓名" width="130"></el-table-column>
      <el-table-column prop="email" label="邮箱" width="180"> </el-table-column>
      <el-table-column prop="mobile" label="电话" width="150"></el-table-column>
      <el-table-column prop="role_name" label="角色" width="180">
      </el-table-column>
      <el-table-column label="状态" width="150">
        <template v-slot="scope">
          <el-switch v-model="scope.row.mg_state" @change="mgState(scope.row)"></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template v-slot="scope">
          <!-- 编辑按钮 -->
          <el-button type="primary" icon="el-icon-edit" size="mini" @click="handleEdit(scope.row.id)"></el-button>
          <!-- 删除按钮 -->
          <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeUserById(scope.row.id)"></el-button>
          <!-- 分配角色按钮 -->
          <el-tooltip effect="dark" content="分配角色" placement="top" :enterable="false">
            <el-button type="warning" icon="el-icon-setting" size="mini" @click="setRole(scope.row)"></el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <!-- 编辑对话框 -->
    <el-dialog title="编辑用户" :visible.sync="editDialogVisible" width="50%" @close="editDialogClosed">
      <el-form :model="editForm" :rules="editFromRules" ref="editFormRef" label-width="100px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="editForm.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="editForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUserInfo">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 分配角色的对话框 -->
    <el-dialog
      title="分配角色"
      :visible.sync="isRolevisible"
      width="50%"
      @close="handleClickCloseRole">
      <ul class="roleList">
        <li>当前的用户：<span>{{queryInfo.username}}</span></li>
        <li>当前的角色：<span>{{queryInfo.role_name}}</span></li>
      </ul>
      <div class="setRole">
        <span>分配新角色：</span>
        <el-select v-model="roleNameId" placeholder="请选择">
          <el-option
            v-for="item in rolesOptions"
            :key="item.id"
            :label="item.roleName"
            :value="item.id">
          </el-option>
        </el-select>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="isRolevisible = false">取 消</el-button>
        <el-button type="primary" @click="saveRoleList">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 当前用户、当前角色、分配新角色 -->
  </div>
</template>

<script>
import { formatDate } from '@/plugins/date'
export default {
  name: 'UsersTable',
  data() {
    // 用户名
    const checkUserReg = /^[a-zA-Z]\w{3,9}$/
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
    const addEmail = function(rule, value, callback) {
      reg('邮箱格式有误', checkEmailReg, value, callback, '邮箱不能为空')
    }
    const addMobile = function(rule, value, callback) {
      reg('手机格式错误', checkMobileReg, value, callback, '手机不能为空')
    }
    return {
      // 编辑对话框展开与隐藏
      editDialogVisible: false,
      // 编辑用户表单
      editForm: {
        id: '',
        username: '',
        email: '',
        mobile: ''
      },
      // 编辑用户表单校验规则
      editFromRules: {
        username: [
          { required: true, validator: addUser, trigger: 'blur' }
        ],
        email: [
          { required: true, validator: addEmail, trigger: 'blur' }
        ],
        mobile: [
          { required: true, validator: addMobile, trigger: 'blur' }
        ]
      },
      // 分配角色对话框显示隐藏
      isRolevisible: false,
      // 角色信息
      queryInfo: {},
      // 分配的角色Id
      roleNameId: '',
      // 需要分配的角色列表
      rolesOptions: [],
      // 根据 Id 分配新角色
      newRoleId: ''
    }
  },
  props: {
    tableData: Array,
    index: Object,
    getListFn: Function
  },
  // 过滤器日期格式化
  filters: {
    formatDateY(time) {
      const date = new Date(time)
      return formatDate(date, 'yyyy-MM-dd')
    }
  },
  methods: {
    // 修改用户状态
    async editType(user) {
      const { data: res } = await this.$axios({
        method: 'put',
        url: `users/${user.id}/state/${user.mg_state}`,
        responseType: 'json'
      })
      console.log(res)
      // 状态设置失败
      if (res.meta.status !== 200) {
        user.mg_state = !user.mg_state
        return this.$message.error(res.meta.msg)
      }
      // 状态设置成功
      if (res.data) return this.$message.success(res.meta.msg)
    },
    // 监听 switch 用户列表状态的改变
    mgState(state) {
      this.editType(state)
    },
    // 编辑当前用户信息
    async handleEdit(id) {
      this.editDialogVisible = true
      const { data: res } = await this.$axios({ // 获取当前数据
        method: 'get',
        url: 'users/' + id,
        responseType: 'json'
      })
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      if (res.data) {
        this.editForm.id = res.data.id
        this.editForm.username = res.data.username
        this.editForm.email = res.data.email
        this.editForm.mobile = res.data.mobile
      }
    },
    // 删除当前用户
    removeUserById(id) {
      this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const { data: res } = await this.$axios({ // 获取当前数据
          method: 'delete',
          url: 'users/' + id
        })
        if (res.meta.status !== 200) return this.$message.error('删除失败')
        this.$message.success(res.meta.msg)
        this.getListFn()
      }).catch(() => {
        this.$message.info('已取消删除')
      })
    },
    // 编辑当前用户确定按钮
    editUserInfo() {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return false
        const { data: res } = await this.$axios({ // 获取当前数据
          method: 'put',
          url: 'users/' + this.editForm.id,
          data: {
            email: this.editForm.email,
            mobile: this.editForm.mobile
          },
          responseType: 'json'
        })
        if (res.meta.status !== 200) return this.$message.error('更新用户信息失败')
        console.log(res)
        if (res.data) {
          // 关闭编辑对话框
          this.editDialogVisible = false
          // 重新更新数据
          this.getListFn()
          // 提示编辑成功
          this.$message.success(res.meta.msg)
        }
      })
    },
    // 关闭编辑对话框
    editDialogClosed() {
      this.$refs.editFormRef.resetFields()
    },
    // 分配角色按钮
    async setRole(role) {
      this.queryInfo = role
      // 保存当前需要分配的id
      this.newRoleId = role.id
      const { data: res } = await this.$axios({
        method: 'get',
        url: 'roles',
        responseType: 'json'
      })
      if (res.meta.status !== 200) return this.$message.error('获取角色失败')
      this.rolesOptions = res.data
      this.isRolevisible = true
    },
    // 把分配的新角色保存到列表中
    async saveRoleList() {
      console.log(this.roleNameId)
      const { data: res } = await this.$axios({
        method: 'put',
        url: `users/${this.newRoleId}/role`,
        data: {
          rid: this.roleNameId
        }
      })
      if (res.meta.status !== 200) return this.$message.error('更新角色失败')
      this.$message.success('更新角色成功')
      this.getListFn()
      this.isRolevisible = false
    },
    // 关闭分配角色对话框清空数据
    handleClickCloseRole() {
      this.roleNameId = ''
      this.queryInfo = {}
    }
  }
}
</script>

<style lang="less" scoped>
.table-container {
  width: 100%;
  margin-bottom: 20px;
  font-size: 12px;
}
.roleList {
  line-height: 28px;
  font-size: 14px;
}
.setRole {
  margin-top: 10px;
}
</style>
