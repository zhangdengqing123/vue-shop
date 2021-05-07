<template>
  <el-container class="home-container">
    <!-- 头部区域 -->
    <el-header>
      <!-- 左侧 log、标题 -->
      <div class="top">
        <img src="../../assets/log.jpeg" alt="" class="log">
        <span class="title">电商后台管理</span>
      </div>
      <!-- 右侧退出登录 -->
      <el-button type="info" @click="logout" class="btn">退出</el-button>
    </el-header>
    <!-- 页面主体区域 -->
    <el-container>
      <!-- 左侧栏 -->
      <el-aside :width="w">
        <home-left :list="menuList" @isShow="asideShow"></home-left>
      </el-aside>
      <!-- 右侧主体栏 -->
      <el-main>
        <!-- 路由占位符 -->
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import HomeLeft from './pages/LeftMenu'
export default {
  name: 'Home',
  data() {
    return {
      menuList: [],
      w: '200px'
    }
  },
  components: {
    HomeLeft
  },
  created() {
    this.getLeftMenuList()
  },
  methods: {
    // 左侧菜单显示与隐藏
    asideShow(w) {
      this.w = w
    },
    // 退出登录
    logout() {
      console.log(this.$route)
      window.sessionStorage.clear()
      this.$router.push('/')
    },
    // 首页里面左侧导航方法
    async getLeftMenuList() {
      const { data: res } = await this.$axios({
        method: 'get',
        url: '/menus',
        responseType: 'json'
      })
      if (res.meta.status !== 200) {
        res.meta.msg = res.meta.msg === 'Not Found' ? '页面不存在' : res.meta.msg
        return this.$message.error(res.meta.msg)
      }
      if (res.data.length) {
        this.menuList = res.data
      }
    }
  }
}
</script>

<style lang="less" scoped>
.home-container {
  height: 100%;
  .el-header {
    background-color:#373d41;
    display: flex;
    padding-left: 10px;
    justify-content: space-between; // 两端对齐，中间空白
    align-items: center; // 垂直居中
    .top {
      display: flex;
      align-items: center;
      font-size: 20px;
      color: #fff;
      .log {
        width: 50px;
        height: 50px;
        border-radius: 50%;
        box-shadow: 3px 2px 5px #000;
      }
      .title {
        padding-left: 10px;
      }
    }
  }
  .el-aside {
    background-color: #333744;
  }
  .el-main {
    background-color:#eaedf1;
  }
}
</style>
