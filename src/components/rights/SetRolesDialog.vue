<template>
  <el-dialog title="分配角色" :visible.sync="setDialog" width="50%">
    <el-tree
      :data="list"
      show-checkbox
      node-key="id"
      :default-checked-keys="def"
      :props="getRolsList"
      default-expand-all
      ref="setRoleRef"
    >
    </el-tree>
    <span slot="footer" class="dialog-footer">
      <el-button @click="setDialog = false">取 消</el-button>
      <el-button type="primary" @click="setRolesKey">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  name: 'SetRoles',
  props: {
    list: Array,
    setRoleShow: Boolean,
    // 默认选中权限
    def: Array,
    roleId: Number,
    // 更新所有角色
    getData: Function
  },
  data() {
    return {
      // 默认设置角色权限全部选中
      checkedAll: [],
      // 对话框显示
      setRolesVisible: true,
      // 设置角色名字
      getRolsList: {
        children: 'children',
        label: 'authName'
      }
    }
  },
  computed: {
    // 对话框展开与关闭
    setDialog: {
      get() {
        return this.setRoleShow
      },
      set(val) {
        this.$emit('close', val)
      }
    }
  },
  methods: {
    // 获取默认角色权限为选中，使用递归
    async setRolesKey() {
      console.log(this.roleId)
      // 获取选中的id合并到数组，通过join方法拼接字符串。通过参数发送给后台
      const arr = [
        ...this.$refs.setRoleRef.getCheckedKeys(), // 返回被选中的节点的 key 所组成的数组
        ...this.$refs.setRoleRef.getHalfCheckedKeys() // 返回目前半选中的节点的 key 所组成的数组
      ]
      const rids = arr.join(',')
      const { data: res } = await this.$axios({
        method: 'post',
        url: `roles/${this.roleId}/rights`,
        data: {
          rids
        }
      })
      if (res.meta.status !== 200) return this.$message.error('更新失败')
      this.$message.success(res.meta.msg)
      this.getData()
      this.setDialog = false
    }
  }
}
</script>

<style lang="less" scoped></style>
