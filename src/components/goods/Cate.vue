<template>
  <div class="cate-gory">
    <!-- 商品分类面包屑区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片区域 -->
    <el-card class="mt20">
      <el-row>
        <el-col>
          <el-button type="primary" @click="addCategorieList">添加分类</el-button>
        </el-col>
        <el-col class="table-tree">
          <!-- table树是全局组件在 main.js 注册 -->
          <zk-table
            :data="categoriesList"
            :columns="columns"
            border
            show-index
            index-text="序号"
            :expand-type="false"
            :selection-type="false">
            <!-- 是否有效 -->
            <template slot="isok" slot-scope="scope">
              <i class="el-icon-success" v-if="scope.row.cat_deleted === false"></i>
              <i class="el-icon-error" v-else></i>
            </template>
            <!-- 排序 -->
            <template slot="order" slot-scope="scope">
              <el-tag v-if="scope.row.cat_level === 0">一级</el-tag>
              <el-tag type="success" v-else-if="scope.row.cat_level === 1">二级</el-tag>
              <el-tag type="warning" v-else>三级</el-tag>
            </template>
            <!-- 操作 -->
            <template slot="operate" slot-scope="scope">
              <el-button
                type="primary"
                icon="el-icon-edit" size="mini"
                @click="editCate(scope.row)">
                编辑
              </el-button>
              <el-button
                type="danger"
                icon="el-icon-delete"
                size="mini"
                @click="removeCate(scope.row, scope)">
                删除
              </el-button>
            </template>
          </zk-table>
        </el-col>
      </el-row>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[4, 6, 10]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
    </el-pagination>
    </el-card>

    <!-- 添加分类对话框 -->
    <el-dialog title="添加分类" :visible.sync="addCateDialogVisible" width="50%" @close="cateClose">
    <el-form :model="addCateForm" :rules="addCateRules" ref="ruleFormRef" label-width="100px">
      <el-form-item label="分类名称：" prop="cat_name">
        <el-input type="cat_name" v-model="addCateForm.cat_name"></el-input>
      </el-form-item>
      <el-form-item label="父级分类">
        <!-- props 用来指定配置对象 -->
        <el-cascader
          v-model="selectKeys"
          :options="parentCateInfo"
          :props="cascaderProps"
          @change="parentCateChanged"
          clearable>
        </el-cascader>
      </el-form-item>
    </el-form>
    <span slot="footer">
      <el-button @click="addCateDialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="postCategorieList">确 定</el-button>
    </span>
  </el-dialog>

  <!-- 编辑分类对话框 -->
    <el-dialog title="修改分类" :visible.sync="editCateDialog" width="50%" @close="editCateClose">
    <el-form :model="editCateForm" :rules="addCateRules" ref="ruleFormRef" label-width="100px">
      <el-form-item label="修改分类" prop="cat_name">
        <el-input type="cat_name" v-model="editCateForm.cat_name"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer">
      <el-button @click="editCateDialog = false">取 消</el-button>
      <el-button type="primary" @click="editCateSubmit">确 定</el-button>
    </span>
  </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'Cate',
  data() {
    return {
      // 添加分对话框显示与隐藏
      addCateDialogVisible: false,
      // 获取get数据的默认参数
      queryInfo: {
        type: 3, // 获取1-3级所有数据
        pagenum: 1,
        pagesize: 4
      },
      // 数据总条数
      total: 0,
      // 商品分类数据
      categoriesList: [],
      // 为 table 指定列的定义，这个必传，且数据不能为空，否则报错！！！
      columns: [
        { label: '分类名称', prop: 'cat_name' },
        {
          label: '是否有效',
          // 定义当前的模板
          type: 'template',
          // 定义当前的模板名称
          template: 'isok'
        },
        { label: '排序', type: 'template', template: 'order' },
        { label: '操作', type: 'template', template: 'operate' }
      ],
      // 对话框的form表单数据
      addCateForm: {
        // 父级分类Id
        cat_pid: 0,
        // 分类名称
        cat_name: '',
        // 分类等级，默认添加一级分类
        cat_level: 0
      },
      // 对话框验证规则
      addCateRules: {
        cat_name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' }
        ]
      },
      // 父级分类数据
      parentCateInfo: [],
      // 级联器下拉框的默认属性
      cascaderProps: {
        checkStrictly: 'true',
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      selectKeys: [], // 父级分类的选中的 Id
      // 编辑对话框显示和隐藏
      editCateDialog: false,
      // 编辑表单
      editCateForm: {
        cat_name: ''
      },
      // 编辑分类 id
      editId: 0
    }
  },
  created() {
    this.getCateListInfo() // 获取商品分类数据
  },
  methods: {
    async getCateListInfo() {
      const { data: res } = await this.$axios({
        method: 'get',
        url: 'categories',
        params: this.queryInfo
      })
      if (res.meta.status !== 200) return this.$message.error('获取商品分类失败')
      this.categoriesList = res.data.result
      this.total = res.data.total
    },
    // 下拉选框显示当前选择多少条数据
    handleSizeChange(num) {
      this.queryInfo.pagesize = num
      this.getCateListInfo()
    },
    // 点击按钮显示当前第几页
    handleCurrentChange(currentPage) {
      this.queryInfo.pagenum = currentPage
      this.getCateListInfo()
    },
    // 添加分类按钮
    addCategorieList() {
      // 获取父级分类数据
      this.getParentCateList()
      this.addCateDialogVisible = true
    },
    // 获取父级分类列表数据
    async getParentCateList() {
      const { data: res } = await this.$axios({
        method: 'get',
        url: 'categories',
        params: {
          type: 2
        }
      })
      console.log(res)
      if (res.meta.status !== 200) return this.$message.error('获取父级分类数据失败')
      this.parentCateInfo = res.data
    },
    // 获取选中的父级的 Id
    parentCateChanged() {
      console.log(this.selectKeys)
      // 判断 selectKeys 数组中的长度大于0，说明有选中父级分类
      if (this.selectKeys.length > 0) {
        // cat_pid 等于 selectKeys数组中的最后一项，表示分类父 ID
        this.addCateForm.cat_pid = this.selectKeys[this.selectKeys.length - 1]
        // 把selectKeys数组中长度赋值给 cat_leval 表示等级分类
        this.addCateForm.cat_level = this.selectKeys.length
      } else {
        // 反之默认等级分类
        this.addCateForm.cat_pid = 0
        this.addCateForm.cat_level = 0
      }
    },
    // 提交商品分类数据
    postCategorieList() {
      console.log(this.addCateForm)
      this.$refs.ruleFormRef.validate(async (valid) => {
        if (!valid) return false
        const { data: res } = await this.$axios({
          method: 'post',
          url: 'categories',
          data: this.addCateForm
        })
        console.log(res)
        if (res.meta.status !== 201) return this.$message.error('添加分类失败！')
        this.$message.success(res.meta.msg)
        // 重新获取商品分类列表数据
        this.getCateListInfo()
        this.addCateDialogVisible = false
      })
    },
    // 关闭添加分类对话框
    cateClose() {
      this.$refs.ruleFormRef.resetFields()
      this.selectKeys = []
      this.addCateForm.cat_pid = 0
      this.addCateForm.cat_level = 0
    },
    // 编辑商品分类
    async editCate(cate) {
      this.editCateDialog = true
      this.editId = cate.cat_id
      // 发起get请求
      const { data: res } = await this.$axios({
        method: 'get',
        url: `categories/${cate.cat_id}`,
        responseType: 'json'
      })
      if (res.meta.status !== 200) return this.$message.error('数据获取失败')
      this.editCateForm.cat_name = res.data.cat_name
    },
    // 提交修改分类
    editCateSubmit() {
      this.$refs.ruleFormRef.validate(async (valid) => {
        if (!valid) return false
        const { data: res } = await this.$axios({
          method: 'put',
          url: 'categories/' + this.editId,
          data: {
            cat_name: this.editCateForm.cat_name
          }
        })
        if (res.meta.status !== 200) return this.$message.error('修改分类失败！')
        this.$message.success(res.meta.msg)
        // 重新获取商品分类列表数据
        this.getCateListInfo()
        this.editCateDialog = false
      })
    },
    // 关闭编辑对话框
    editCateClose() {
      this.$refs.ruleFormRef.resetFields()
    },
    // 根据 id 删除商品分类
    removeCate(delCat, i) {
      console.log(i)
      this.$confirm('此操作将永久删除该分类, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        // 发起删除请求
        const { data: res } = await this.$axios({
          method: 'delete',
          url: `categories/${delCat.cat_id}`
        })
        if (res.meta.status !== 200) return this.$message.error('删除失败')
        this.$message.success(res.meta.msg)
        // 重新获取商品分类列表数据
        this.getCateListInfo()
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    }
  }
}
</script>

<style lang="less" scoped>
@import '~assets/varibles.less';
.mt20 {
  margin-top: @mb20px;
  .table-tree {
    padding-top: @mb20px;
  }
}
.is-always-shadow {
  box-shadow: @show;
}
.mt20 /deep/ .zk-table--row-hover {
  background: #efefef;
}
.el-icon-success {
  font-size: @sz14;
  color: lightgreen;
}
.el-icon-error {
  font-size: @sz14;
  color: red;
}
.el-pagination{
  margin-top: @mb20px;
}
.el-cascader {
  width: 100%;
}
</style>
