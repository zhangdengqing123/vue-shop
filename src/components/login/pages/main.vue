<template>
  <div class="login">
    <el-form
      :model="loginForm"
      :rules="rules"
      ref="form"
      class="login-form"
      label-width="76px"
    >
      <!--用户名-->
      <el-form-item label="用户名 :" prop="username">
        <el-input
          prefix-icon="el-icon-s-custom"
          v-model="loginForm.username"
        ></el-input>
      </el-form-item>
      <!--密码-->
      <el-form-item label="密码 :" prop="password">
        <el-input
          prefix-icon="fa fa-lock"
          type="password"
          v-model="loginForm.password"
        ></el-input>
      </el-form-item>
      <!--登录和重置按钮-->
      <el-form-item class="rigth">
        <el-button type="primary" @click="submitForm">登录</el-button>
        <el-button type="info" @click="resetForm">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'Main',
  data() {
    const userReg = /^[a-zA-Z][a-zA-Z0-9_]{3,15}$/
    const passReg = /^[a-zA-Z0-9]\w{5,16}$/
    function reg(min, max, reg, val, fn, str) {
      if (!val) {
        return fn(new Error(str))
      } else if (!reg.test(val)) {
        fn(
          new Error(`以字母开头，长度在${min}~${max}之间，含字母、数字和下划线`)
        )
      } else {
        fn()
      }
    }
    const userRule = (rule, value, callback) => {
      reg(4, 16, userReg, value, callback, '请输入用户名')
    }
    const passRule = (rule, value, callback) => {
      reg(6, 18, passReg, value, callback, '请输入密码')
    }
    return {
      // 表单验证
      loginForm: {
        username: 'admin',
        password: '123456'
      },
      // 表单验证规则
      rules: {
        username: [{ required: true, validator: userRule, trigger: 'blur' }],
        password: [{ required: true, validator: passRule, trigger: 'blur' }]
      }
    }
  },
  methods: {
    // 表单提交
    submitForm() {
      this.$refs.form.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$axios({
          method: 'post',
          url: '/login',
          data: this.loginForm,
          responseType: 'json' // 表明返回服务器返回的数据类型
        })
        console.log(res)
        if (res.meta.status === 200) {
          this.$message.success(`恭喜你，${res.meta.msg}`)
          // token存储到会话窗口，关闭会话窗口token丢失
          window.sessionStorage.setItem('token', res.data.token)
          // 登录成功清空表单内容
          this.$refs.form.resetFields()
          this.$router.push('/home')
        } else {
          // 登录失败
          this.$message.error(res.meta.msg)
        }
      })
    },
    // 表单重置
    resetForm() {
      this.$refs.form.resetFields()
    }
  }
}
</script>

<style lang="less" scoped>
.login /deep/ .el-input__icon {
  font-size: 18px;
}
.login {
  width: 450px;
  height: 300px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  border-radius: 4px;
  background: #fff;
  .login-form {
    position: relative;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    padding: 0 20px;
  }
}
</style>
