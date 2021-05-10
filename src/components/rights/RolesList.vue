<template>
  <div class="roles">
    <!-- 权限列表面包屑区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 角色列表卡片视图区域 -->
    <el-card class="box-card">
      <el-row>
        <el-col>
          <el-button type="primary" @click="addDialogVisible = true">添加角色</el-button>
        </el-col>
      </el-row>
      <el-table :data="list" border stripe class="table">
        <!-- 展开图标 -->
        <el-table-column type="expand">
          <template v-slot="scope">
            <!-- 一级权限遍历 -->
            <el-row  v-for="(item, i) of scope.row.children" :key="item.id" :class="['row', i === 0 ? 'top1' : '']">
              <el-col :span="5">
                <el-tag closable @close="clickDelRole(scope.row, item.id)">{{item.authName}}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 二级和三级权限 -->
              <el-col :span="19">
                <!-- 遍历嵌套二级权限 -->
                <el-row v-for="(item2, i2) of item.children"
                  :key="item2.id"
                  :class="[i2 === 0 ? '' : 'top1']"
                  class="mt20">
                  <el-col :span="6">
                    <el-tag type="success" closable @close="clickDelRole(scope.row, item2.id)">{{item2.authName}}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <!-- 遍历嵌套三级权限 -->
                  <el-col :span="18">
                    <el-tag type="warning"
                      v-for="item3 of item2.children"
                      :key="item3.id"
                      closable
                      class="tag-18"
                      @close="clickDelRole(scope.row, item3.id)"
                    >
                      {{item3.authName}}
                    </el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
            <!-- <pre style="text-align:left">{{scope.row}}</pre> -->
          </template>
        </el-table-column>
        <!-- 序号 -->
        <el-table-column label="序号" type="index"></el-table-column>
        <!-- 角色名称 -->
        <el-table-column label="角色名称" prop="roleName"></el-table-column>
        <!-- 角色描述 -->
        <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
        <!-- 操作 -->
        <el-table-column label="操作" width="350">
          <template v-slot="scope">
            <el-button size="mini"
              type="primary"
              icon="el-icon-edit"
              @click="editRoles(scope.row.id)"
            > 编辑
            </el-button>
            <el-button
              size="mini"
              type="danger"
              icon="el-icon-delete"
              @click="delRoles(scope.row.id)"
            > 删除
            </el-button>
            <el-button size="mini" type="warning" icon="el-icon-setting" @click="setRoles(scope.row)">分配角色</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 添加角色话框 -->
      <el-dialog title="添加角色" :visible.sync="addDialogVisible" width="50%" @close="addDialogClosed">
        <el-form :model="addRolesForm" :rules="addFromRules" ref="addFormRef" label-width="100px">
          <el-form-item label="角色名称" prop="roleName">
            <el-input v-model="addRolesForm.roleName"></el-input>
          </el-form-item>
          <el-form-item label="角色描述" prop="roleDesc">
            <el-input v-model="addRolesForm.roleDesc"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="addDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="handleClickAddRoles">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 编辑角色话框 -->
      <el-dialog title="添加角色" :visible.sync="editDialogVisible" width="50%" @close="editDialogClosed">
        <el-form :model="editRolesForm" :rules="addFromRules" ref="editFormRef" label-width="100px">
          <el-form-item label="角色名称" prop="roleName">
            <el-input v-model="editRolesForm.roleName"></el-input>
          </el-form-item>
          <el-form-item label="角色描述" prop="roleDesc">
            <el-input v-model="editRolesForm.roleDesc"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="editDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="handleClickEditRoles">确 定</el-button>
        </span>
      </el-dialog>
    </el-card>
    <set-roles
      :list="roleList"
      :def= "defKeys"
      :roleId="roleId"
      :setRoleShow="setDialogVisible"
      @close="setRoleDialogClosed"
      :getData="getRolesListInfo"
    ></set-roles>
  </div>
</template>

<script>
import SetRoles from './SetRolesDialog'
export default {
  name: 'RolesList',
  components: {
    SetRoles
  },
  data() {
    return {
      list: [],
      // 添加弹窗
      addDialogVisible: false,
      // 编辑弹窗
      editDialogVisible: false,
      // 添加角色
      addRolesForm: {
        roleName: '',
        roleDesc: ''
      },
      // 编辑角色
      editRolesForm: {
        id: 0,
        roleName: '',
        roleDesc: ''
      },
      // 角色校验规则
      addFromRules: {
        roleName: [
          { required: true, message: '请输入角色名称', trigger: 'blur' }
        ]
      },
      // 显示分配角色对话框
      setDialogVisible: false,
      // 获取树结构的角色权限数据
      roleList: [],
      // 获取默认选中的权限
      defKeys: [],
      // 分配当前权限 Id
      roleId: 0
    }
  },
  computed: {
    // 获取默认角色权限为选中，使用递归获取所有三级权限 id，并保存到 defKyes 数组中
    getRoleListKyes() {
      return function(node, arr) {
        if (!node.children) {
          return arr.push(node.id)
        }
        node.children.forEach(item => {
          this.getRoleListKyes(item, arr)
        })
      }
    }
  },
  created() {
    this.getRolesListInfo()
  },
  methods: {
    // 获取角色列表数据
    async getRolesListInfo() {
      const { data: res } = await this.$axios({
        method: 'get',
        url: 'roles',
        responseType: 'json'
      })
      if (res.meta.status !== 200) return this.$message.error('获取角色列表失败')
      this.list = res.data
    },
    // 点击添加角色
    handleClickAddRoles() {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return false
        // 提交数据
        const { data: res } = await this.$axios({
          method: 'post',
          url: 'roles',
          data: this.addRolesForm,
          responseType: 'json'
        })
        console.log(res)
        if (res.meta.status !== 201) return this.$message.error('添加角色失败')
        this.$message.success(res.meta.msg)
        this.getRolesListInfo()
        this.addDialogVisible = false
      })
    },
    // 编辑当前角色数据获取
    async editRoles(id) {
      this.editDialogVisible = true
      const { data: res } = await this.$axios({
        method: 'get',
        url: 'roles/' + id,
        responseType: 'json'
      })
      if (res.meta.status !== 200) return this.$message.error('获取角色失败')
      this.editRolesForm.id = res.data.roleId
      this.editRolesForm.roleName = res.data.roleName
      this.editRolesForm.roleDesc = res.data.roleDesc
    },
    // 编辑当前角色提交
    handleClickEditRoles() {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return false
        // 提交数据
        const { data: res } = await this.$axios({
          method: 'put',
          url: 'roles/' + this.editRolesForm.id,
          data: {
            roleName: this.editRolesForm.roleName,
            roleDesc: this.editRolesForm.roleDesc
          },
          responseType: 'json'
        })
        if (res.meta.status !== 200) return this.$message.error('编辑角色失败')
        this.$message.success(res.meta.msg)
        this.editDialogVisible = false
        this.getRolesListInfo()
      })
    },
    // 删除当前角色
    delRoles(id) {
      this.$confirm('此操作将永久删除该角色, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const { data: res } = await this.$axios({ // 获取当前数据
          method: 'delete',
          url: 'roles/' + id
        })
        if (res.meta.status !== 200) return this.$message.error('删除失败')
        this.$message.success(res.meta.msg)
        this.getRolesListInfo()
      }).catch(() => {
        this.$message.info('已取消删除')
      })
    },
    // 删除角色指定权限
    clickDelRole(role, id) {
      this.$confirm('此操作将永久删除该权限, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const { data: res } = await this.$axios({ // 获取当前数据
          method: 'delete',
          url: `roles/${role.id}/rights/${id}`
        })
        console.log(res)
        if (res.meta.status !== 200) return this.$message.error('删除权限失败')
        // 把服务器返回的数据重新赋值给当前的 role.children，避免刷新关闭角色权限窗口
        role.children = res.data
      }).catch(() => {
        this.$message.info('取消权限成功')
      })
    },
    // 对话框关闭
    addDialogClosed() {
      this.$refs.addFormRef.resetFields()
    },
    // 编辑对话关闭
    editDialogClosed() {
      this.$refs.editFormRef.resetFields()
    },
    // 获取分配角色数据
    async setRoles(role) {
      this.roleId = role.id
      const { data: res } = await this.$axios({
        method: 'get',
        url: 'rights/tree',
        responseType: 'json'
      })
      if (res.meta.status !== 200) return this.$message.error('获取权限列表失败')
      this.roleList = res.data
      // 递归调用
      this.getRoleListKyes(role, this.defKeys)
      this.setDialogVisible = true
    },
    // 分配角色对话框关闭
    setRoleDialogClosed(flag) {
      this.defKeys = []
      this.setDialogVisible = flag
    }
  }
}
</script>

<style lang="less" scoped>
@import '~assets/varibles.less';
.row{
  display: flex;
  align-items: center;
  text-align: left;
  border-bottom: 1px solid #eee;
}
.el-tag {
  margin-right: 5px;
}
.top1 {
  border-top: 1px solid #eee;
}
.mt20 {
  display: flex;
  align-items: center;
  height: auto;
  padding: 10px 0;
}
.tag-18 {
  margin: 5px 10px 5px 0;
}
.roles /deep/ .el-table td, /deep/ .el-table th {
  text-align: center !important;
}
.table {
  margin-top: @mb20px;
  font-size: 12px;
}
.is-always-shadow {
  box-shadow: 1px 1px 3px rgba(0, 0, 0, 0.15) !important;
}
.box-card {
  margin-top: @mb20px;
}
</style>
