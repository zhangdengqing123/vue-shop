<template>
  <div class="parmas">
    <!-- 商品分类面包屑区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>分类参数</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片区域 -->
    <el-card class="mt20">
      <el-alert title="注意：只允许为第三级分类设置参数！" type="warning" show-icon :closable="false">
      </el-alert>
      <!-- 商品分类区域 -->
      <el-row type="flex">
        <span class="cate">选中商品分类：</span>
        <!-- 选择商品分类的级联选择器 -->
        <el-col :span="20" class="cateParmas" justify="left">
          <el-cascader
            v-model="selectKeys"
            :options="cateList"
            :props="cascaderProps"
            @change="handleCateChange"
            clearable></el-cascader>
        </el-col>
      </el-row>
      <!-- 添加属性区域 -->
       <el-tabs v-model="activeName" @tab-click="handleCateClick">
        <el-tab-pane label="动态参数" name="many">
          <el-button
            type="primary"
            size="mini"
            :disabled="isDisabledBtn"
            @click="addDialogVisible = true">
            动态参数
          </el-button>

          <!-- 动态参数table -->
          <el-table :data="getManyData" border stripe class="table">
            <!-- 展开行 -->
            <el-table-column type="expand" label="↓">
              <template v-slot="scope">
                <el-tag v-for="(tag, i) of scope.row.attr_vals" :key="i" closable @close="handleClose(i, scope.row)" :disable-transitions="true">{{tag}}</el-tag>
                <!-- 输入文本框 -->
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                >
                </el-input>
                <!-- 添加的按钮 -->
                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
              </template>
            </el-table-column>
            <!-- 索引列 -->
            <el-table-column type="index" width="50" label="序号"></el-table-column>
            <el-table-column prop="attr_name" label="参数名称"></el-table-column>
            <el-table-column label="操作" v-slot="scope">
              <el-button type="primary" size="mini" icon="el-icon-edit" @click="editFormData(scope.row)">编辑</el-button>
              <el-button type="danger" size="mini" icon="el-icon-delete" @click="delFormData(scope.row)">删除</el-button>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="静态属性" name="only">
          <el-button
            type="primary"
            size="mini"
            :disabled="isDisabledBtn"
            @click="addDialogVisible = true"
            >静态属性
          </el-button>

          <!-- 静态属性table -->
          <el-table :data="getOnlyData" border stripe class="table">
            <!-- 展开行 -->
            <el-table-column type="expand" label="↓">
              <template v-slot="scope">
                <el-tag v-for="(tag, i) of scope.row.attr_vals" :key="i" closable @close="handleClose(i, scope.row)" :disable-transitions="true">{{tag}}</el-tag>
                <!-- 输入文本框 -->
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                >
                </el-input>
                <!-- 添加的按钮 -->
                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
              </template>
            </el-table-column>
            <!-- 索引列 -->
            <el-table-column type="index" width="50" label="序号"></el-table-column>
            <el-table-column prop="attr_name" label="参数名称"></el-table-column>
            <el-table-column label="操作" v-slot="scope">
              <el-button type="primary" size="mini" icon="el-icon-edit" @click="editFormData(scope.row)">编辑</el-button>
              <el-button type="danger" size="mini" icon="el-icon-delete" @click="delFormData(scope.row)">删除</el-button>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>

    <!-- 添加对话框 -->
    <el-dialog :title="'添加' + titleText" :visible.sync="addDialogVisible" width="50%" @close="dialogCloseVisible">
      <el-form
        :model="addForm"
        :rules="addFormrules"
        ref="addFormRef"
        label-width="100px">
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="addForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addFormData">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 编辑对话框 -->
    <el-dialog :title="'修改' + titleText" :visible.sync="editDialogVisible" width="50%" @close="editCloseVisible">
      <el-form
        :model="editForm"
        :rules="addFormrules"
        ref="editFormRef"
        label-width="100px">
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="editForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitFormDialog(editForm)">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'CateParmas',
  data() {
    return {
      // 获取选中的id
      selectKeys: [],
      // 商品分类数据
      cateList: [],
      // 下拉级联器选中的默认值
      cascaderProps: {
        expandTrigger: 'hover',
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      // Tab标签 激活的页签的名称
      activeName: 'many',
      // 动态参数的数据
      getManyData: [],
      // 静态属性的数据
      getOnlyData: [],
      // 添加对话框显示和隐藏
      addDialogVisible: false,
      // 修改对话框显示和隐藏
      editDialogVisible: false,
      // 添加对话框里的表单
      addForm: {
        attr_name: ''
      },
      // 修改对话框里的表单
      editForm: {},
      // 添加校验对话框里的表单里的规则
      addFormrules: {
        attr_name: [
          { required: true, message: '请输入参数名称', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    // 通过计算属性判断是否选择三级分类来返回按钮是否禁用
    isDisabledBtn() {
      if (this.selectKeys.length !== 3) {
        return true // 禁用
      } else {
        return false // 启用
      }
    },
    // 当前选中的三级分类Id
    cateId() {
      if (this.selectKeys.length === 3) {
        return this.selectKeys[2]
      }
      return null
    },
    // 通过属性获取不同的title
    titleText() {
      if (this.activeName === 'many') {
        return '动态参数'
      }
      return '静态属性'
    }
  },
  created() {
    this.getCateLise()
  },
  methods: {
    // 获取分类参数数据
    async getCateLise() {
      const { data: res } = await this.$axios({
        method: 'get',
        url: 'categories',
        responesType: 'json'
      })
      if (res.meta.status !== 200) return this.$message.error('商品分类数据获取失败！')
      this.cateList = res.data
    },
    handleCateChange() {
      this.getParmasData()
    },
    // tab 切换
    handleCateClick() {
      this.getParmasData()
    },
    // 根据当前的 id，和当前的面板，获取对应的参数
    async getParmasData() {
      // 判断如果不是选中三级分类
      if (this.selectKeys.length !== 3) {
        this.selectKeys = []
        this.getManyData = []
        this.getOnlyData = []
        return false
      }
      // 如果是三级分类
      console.log(this.selectKeys)
      const { data: res } = await this.$axios({
        method: 'get',
        url: `categories/${this.cateId}/attributes`,
        params: {
          sel: this.activeName
        }
      })
      if (res.meta.status !== 200) return this.$message.error('获取参数列表失败')
      // 通过 split 方法把 attr_vals 里面的字符，切割成数组
      res.data.forEach(item => {
        item.attr_vals = item.attr_vals.split(',').filter(i => {
          if (i.length) return i
        })
        item.inputVisible = false
        item.inputValue = ''
      })
      console.log(res.data)
      if (this.activeName === 'many') { // 表示动态属性
        this.getManyData = res.data
      } else {
        this.getOnlyData = res.data
      }
    },
    // 提交表单
    addFormData() {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return false
        const { data: res } = await this.$axios({
          method: 'post',
          url: `categories/${this.cateId}/attributes`,
          data: {
            attr_name: this.addForm.attr_name,
            attr_sel: this.activeName
          }
        })
        if (res.meta.status !== 201) return this.$message.error('添加失败')
        this.getParmasData()
        this.addDialogVisible = false
        this.$message.success('添加成功')
      })
    },
    // 添加关闭对话框
    dialogCloseVisible() {
      this.$refs.addFormRef.resetFields()
    },
    // 修改关闭对话框
    editCloseVisible() {
      this.$refs.editFormRef.resetFields()
    },
    // 编辑对话框里表单
    async editFormData(parameter) {
      console.log(parameter)
      this.editDialogVisible = true
      const { data: res } = await this.$axios({
        method: 'get',
        url: `categories/${parameter.cat_id}/attributes/${parameter.attr_id}`,
        params: {
          attr_sel: this.activeName
        }
      })
      if (res.meta.status !== 200) return this.$message.error('获取参数失败')
      this.editForm = res.data
    },
    // 提交表单修改的对话框
    submitFormDialog(form) {
      console.log(form)
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return false
        const { data: res } = await this.$axios({
          method: 'put',
          url: `categories/${form.cat_id}/attributes/${form.attr_id}`,
          data: {
            attr_name: form.attr_name,
            attr_sel: form.attr_sel,
            attr_vals: form.attr_vals
          }
        })
        if (res.meta.status !== 200) return this.$message.error('修改参数失败')
        this.getParmasData()
        this.editDialogVisible = false
        this.$message.success('修改参数成功')
      })
    },
    // 根据id删除列表参数
    delFormData(item) {
      this.$confirm('此操作将永久删除该' + this.titleText, '是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const { data: res } = await this.$axios({
          method: 'delete',
          url: `categories/${this.cateId}/attributes/${item.attr_id}`
        })
        if (res.meta.status !== 200) return this.$message.error('删除失败')
        this.$message.success(res.meta.msg)
        this.getParmasData()
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    // 点击显示文本框
    showInput(row) {
      row.inputVisible = true
      // nextTick 方法作用是当页面被重新渲染，才指定执行函数里面的代码
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },
    // 删除对应的参数可选项
    handleClose(i, row) {
      const val = row.attr_vals.splice(i, 1)
      this.addInputValue(row, val, i, '删除')
    },
    // 修改参数的提交
    async addInputValue(row, v, i, chg) {
      console.log(row)
      const { data: res } = await this.$axios({
        method: 'put',
        url: `categories/${row.cat_id}/attributes/${row.attr_id}`,
        data: {
          attr_name: row.attr_name,
          attr_sel: row.attr_sel,
          attr_vals: row.attr_vals.join(',')
        }
      })
      if (res.meta.status !== 200) {
        if (v.length) {
          // 服务器删除失败，本地重新添加被删除的项
          row.attr_vals.splice(i, i, v.join(''))
        } else {
          // 服务器添加失败，本地重新移除被添加的项
          row.attr_vals.pop()
        }
        this.$message.error(chg + '参数项失败!')
        return false
      }
      this.$message.success(chg + '参数项成功!')
    },
    // 失去焦点 或 按 enter 键都触发该函数
    handleInputConfirm(row) {
      if (row.inputValue.trim().length === 0) {
        row.inputValue = ''
        row.inputVisible = false
        return false
      }
      const arr = row.attr_vals.push(row.inputValue.trim())
      row.inputValue = ''
      row.inputVisible = false
      this.addInputValue(row, arr, '', '添加')
    }
  }
}
</script>

<style lang="less" scoped>
@import '~assets/varibles.less';
.mt20 {
  margin-top: @mb20px;
  .table {
    margin-top: @mb20px;
    font-size: 12px;
  }
  .cate {
    width: 120px;
    margin-top: @mb20px;
    height: 40px;
    line-height: 40px;
    font-size: 16px;
    color: #333;
  }
}
.cateParmas {
  margin-top: @mb20px;
}
.is-always-shadow {
  box-shadow: @show;
}
.el-cascader {
  width: 300px;
}
.el-tag {
  margin: 8px 16px 8px 0px;
}
.input-new-tag {
  width: 150px;
}
</style>
