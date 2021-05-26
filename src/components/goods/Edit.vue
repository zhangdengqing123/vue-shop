<template>
  <div class="goods-add">
    <!-- 商品分类面包屑区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品 {{this.$route.params.id}}</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片区域 -->
    <el-card class="mt20">
      <!-- 提示区域 -->
      <el-alert title="添加商品信息" type="info" center show-icon :closable="false"></el-alert>
      <!-- 步骤条区域 -->
      <el-steps :space="200" :active="Number(activeIndex)" align-center finish-status="success">
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>
      <!-- tags 标签区域 -->
      <el-form :model="addForm" :rules="addrules" ref="addFormRef" label-width="100px" label-position="top">
        <el-tabs tab-position="left"
          :before-leave="beforeTabLeave"
          @tab-click="handleClicked"
          v-model="activeIndex">
          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="addForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input v-model="addForm.goods_price" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input v-model="addForm.goods_weight" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input v-model="addForm.goods_number" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品分类" prop="goods_cat">
              <el-cascader
                v-model="addForm.goods_cat"
                :options="selectList"
                :props="cascaderProps"
                @change="handleChange">
              </el-cascader>
            </el-form-item>
          </el-tab-pane>

          <!-- 商品参数区域 -->
          <el-tab-pane label="商品参数" name="1">
            <el-form-item v-for="item of manyDataList" :key="item.attr_id" :label="item.attr_name">
              <!-- 复选框组件 -->
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox border :label="at" v-for="(at, i) of item.attr_vals" :key="i">
                </el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>

          <!-- 商品属性区域 -->
          <el-tab-pane label="商品属性" name="2">
            <el-form-item v-for="item of onlyDataList"
            :key="item.attr_id" :label="item.attr_name">
              <el-input v-model="item.attr_vals" @change="addAttrVals(item)"></el-input>
            </el-form-item>
          </el-tab-pane>

          <!-- 图片上传 -->
          <el-tab-pane label="商品图片" name="3">
            <el-form-item>
               <el-upload
                :action="uploadURL"
                :on-preview="handlePreview"
                :on-remove="handleRemove"
                :on-success="uploadFinish"
                :headers="headers"
                list-type="picture">
                  <el-button size="small" type="primary">点击上传</el-button>
              </el-upload>
              <ul class="el-upload-list el-upload-list--picture">
                <li tabindex="0"
                  class="el-upload-list__item is-success"
                  v-for="(item, i) of addForm.pics"
                  :key="item.pics_id">
                  <img :src="item.pics_sma_url" class="el-upload-list__item-thumbnail">
                  <a class="el-upload-list__item-name">
                    <i class="el-icon-document"></i>
                    <div @click="clickPreview(item.pics_big_url)">查看原图</div>
                  </a>
                  <label class="el-upload-list__item-status-label">
                    <i class="el-icon-upload-success el-icon-check"></i>
                  </label>
                  <i class="el-icon-close" @click="delImg(i)"></i>
                  <i class="el-icon-close-tip">按 delete 键可删除</i>
                </li>
              </ul>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品内容" name="4">
            <!-- 富文本编辑器 -->
            <quill-editor v-model="addForm.goods_introduce"></quill-editor>
            <!-- 提交商品按钮 -->
            <el-button type="primary" class="addBtn" @click="editBtn">添加商品</el-button>
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>
    <el-dialog
      title="图片预览"
      :visible.sync="imgDialogVisible"
      width="30%">
      <img :src="imgPreview" class="img"/>
    </el-dialog>
  </div>
</template>

<script>
import { cloneDeep } from '@/plugins/cloneDeep'
export default {
  name: 'Add',
  data() {
    return {
      // 步骤条起始位置
      activeIndex: 0,
      // 级联选择器的数据
      selectList: [],
      // 动态参数数据
      manyDataList: [],
      // 静态属性数据
      onlyDataList: [],
      // 上传图片URL地址
      uploadURL: 'http://localhost:8888/api/private/v1/upload',
      // 上传图片到服务端需要带上token
      headers: {
        Authorization: window.sessionStorage.getItem('token')
      },
      imgDialogVisible: false,
      // 图片预览路径
      imgPreview: '',
      // form表单
      addForm: {
        goods_name: '',
        goods_price: 0,
        goods_weight: 0,
        goods_number: 0,
        // 商品详情
        goods_introduce: '',
        // 商品所属分类数组
        goods_cat: [],
        // 商品参数的属性值
        attrs: [],
        // 上传的图片
        pics: []
      },
      // form表单校验规则
      addrules: {
        goods_name: [
          { required: true, message: '请输入商品名称', trigger: 'blur' }
        ],
        goods_price: [
          { required: true, message: '请输入商品价格', trigger: 'blur' }
        ],
        goods_weight: [
          { required: true, message: '请输入商品重量', trigger: 'blur' }
        ],
        goods_number: [
          { required: true, message: '请输入商品数量', trigger: 'blur' }
        ],
        goods_cat: [
          { required: true, message: '请选择商品分类', trigger: 'blur' }
        ]
      },
      // 级联器下拉框的默认属性
      cascaderProps: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      }
    }
  },
  computed: {
    // 当前选中的三级分类Id
    cateId() {
      if (this.addForm.goods_cat.length === 3) {
        return this.addForm.goods_cat[2]
      }
      return null
    }
  },
  created() {
    this.getSelectInfo()
    // 获取修改数据方法
    this.getIdDataList()
  },
  methods: {
    // 获取级联选择器的数据
    async getSelectInfo() {
      const { data: res } = await this.$axios({
        method: 'get',
        url: 'categories',
        responseType: 'json'
      })
      if (res.meta.status !== 200) return this.$message.error('获取商品分类失败')
      this.selectList = res.data
    },
    // tags 标签页进入下个标签页之前的方法
    beforeTabLeave(activeName, oldActiveName) {
      if (oldActiveName === '0' && this.addForm.goods_cat.length !== 3) {
        this.$message.error('请选择商品分类')
        return false
      }
    },
    // 如果选中的商品分类不是三级分类就清空数组
    handleChange() {
      if (this.addForm.goods_cat.length !== 3) {
        this.addForm.goods_cat = []
        return false
      }
    },
    // 获取商品参数和属性
    async getList(strType, txt) {
      const { data: res } = await this.$axios({
        method: 'get',
        url: `categories/${this.cateId}/attributes`,
        params: {
          sel: strType
        },
        responseType: 'json'
      })
      if (res.meta.status !== 200) return this.$message.error(`获取${txt}列表失败!`)
      if (strType === 'many') {
        res.data.forEach(item => {
          item.attr_vals = item.attr_vals.split(',').filter(i => {
            if (i.length) return i
          })
        })
        this.manyDataList = res.data
      } else {
        this.onlyDataList = res.data
      }
    },
    // 触发当前tab
    handleClicked() {
      // 获取动态参数面板
      if (this.activeIndex === '1') {
        this.getList('many', '动态参数')
      // 获取静态属性面板
      } else if (this.activeIndex === '2') {
        this.getList('only', '静态属性')
      }
    },
    // 图片预览
    handlePreview(file) {
      if (!file.response.data) {
        return this.$message.error('查看失败')
      }
      this.imgPreview = file.response.data.url
      this.imgDialogVisible = true
    },
    // 移除图片
    handleRemove(file) {
      // 获取响应的临时图片路径
      const img = file.response.data.tmp_path
      this.addForm.pics = this.addForm.pics.filter(item => {
        return item.pic !== img
      })
    },
    // 图片上传成功
    uploadFinish(res, file) {
      if (res.meta.status !== 200) return this.$message.error('图片上传失败')
      this.$message.success('图片上传成功')
      // 拼接得到一个图片信息对象
      const picInfo = { pic: res.data.tmp_path }
      this.addForm.pics.push(picInfo)
      file.name = '查看原图'
      console.log(this.addForm)
    },
    // 编辑查看预览图片
    clickPreview(img) {
      this.imgPreview = img
      this.imgDialogVisible = true
    },
    // 编辑里删除图片
    delImg(index) {
      this.addForm.pics.splice(index, 1)
    },
    // 根据id获取当前修改的项
    async getIdDataList() {
      const { data: res } = await this.$axios({
        method: 'get',
        url: `goods/${this.$route.params.id}`,
        responseType: 'json'
      })
      if (res.meta.status !== 200) return this.$message.error('获取失败')
      console.log(res)
      const data = res.data
      // 修改基本信息
      this.addForm = {
        goods_name: data.goods_name,
        goods_price: data.goods_price,
        goods_weight: data.goods_weight,
        goods_number: data.goods_number,
        // 商品详情
        goods_introduce: data.goods_introduce,
        // 商品所属分类数组
        goods_cat: data.goods_cat.split(',').map(item => {
          return item - 0 // 字符串转换数字
        }),
        // 商品参数的属性值
        attrs: data.attrs,
        // 上传的图片
        pics: data.pics
      }
    },
    // 编辑提交商品参数
    async addAttrVals(item) {
      const { data: res } = await this.$axios({
        method: 'put',
        url: `goods/${this.$route.params.id}/attributes`,
        data: [{
          attr_id: item.attr_id,
          attr_value: item.attr_vals
        }],
        responseType: 'json'
      })
      console.log(res)
      if (res.meta.status !== 200) return this.$message.error('更新失败')
      this.getIdDataList()
    },
    // 提交商品
    editBtn() {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return this.$message.error('请填写带有 * 号的表单项!')
        // 执行添加处理 addForm.goods_cat 转换字符串
        const form = cloneDeep(null, this.addForm)
        form.goods_cat = form.goods_cat.join(',')
        // 处理动态参数
        this.manyDataList.forEach(item => {
          const newInfo = {
            attr_id: item.attr_id,
            attr_value: item.attr_vals.join(',')
          }
          this.addForm.attrs.push(newInfo)
        })
        // 处理静态属性//////////////////有问题待解决////////////////////////////////////
        this.onlyDataList.forEach(item => {
          const newInfo = {
            attr_id: item.attr_id,
            attr_value: item.attr_vals
          }
          this.addForm.attrs.push(newInfo)
        })
        form.attrs = this.addForm.attrs
        // 发起 put 请求
        const { data: res } = await this.$axios({
          method: 'put',
          url: 'goods/' + this.$route.params.id,
          data: form
        })
        console.log(res)
        if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
        console.log(res)
        this.$message.success(res.meta.msg)
        this.$router.push('/goods')
      })
    }
  }
}
</script>

<style lang="less" scoped>
@import '~assets/varibles.less';
.mt20 {
  margin-top: @mb20px;
}
.el-steps {
  margin-top: @mb20px;
  margin-bottom: @mb20px;
}
// 样式穿插
.goods-add /deep/ .el-step__title {
  font-size: 13px;
}
.is-always-shadow {
  box-shadow: @show;
}
.el-checkbox {
  margin: 0 10px 10px 0px;
}
.el-checkbox.is-bordered+.el-checkbox.is-bordered {
  margin-left: 0
}
.img {
  width: 100%;
}
.addBtn {
  margin-top: 20px;
}
.goods-add /deep/ .el-dialog__body {
  padding: 10px 20px 20px 20px !important;
}
.goods-add /deep/ .ql-editor {
  height: 300px;
}
</style>
