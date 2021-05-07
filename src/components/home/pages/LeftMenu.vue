<template>
  <!-- 一级导航 -->
  <el-menu
    :default-active="$route.path"
    class="el-menu-vertical-demo"
    background-color="#333744"
    text-color="#fff"
    active-text-color="#409eff"
    unique-opened
    :collapse="isCollapse"
    :collapse-transition="false"
    router
  >
    <div class="toggleBtn" @click="handleClickShow">|||</div>
    <el-submenu :index="item.id + ''" v-for="item of list" :key="item.id">
      <!-- 一级导航模板区域 -->
      <template slot="title">
        <!-- 图标 -->
        <i class="icon" :class="icons[item.id]"></i>
        <!-- 标题 -->
        <span>{{ item.authName }}</span>
      </template>
      <!-- 二级导航区域 -->
      <div v-if="item.children">
        <el-menu-item
          :index="'/'+subItem.path"
          v-for="subItem of item.children"
          :key="subItem.id"
        >
          <!-- 图标 -->
          <i class="el-icon-menu"></i>
          <!-- 标题 -->
          <span>{{ subItem.authName }}</span>
        </el-menu-item>
      </div>
    </el-submenu>
  </el-menu>
</template>

<script>
export default {
  name: 'HomeLeft',
  props: {
    list: Array
  },
  data() {
    return {
      isCollapse: false,
      icons: {
        125: 'fa fa-user-plus',
        101: 'fa fa-shopping-basket',
        102: 'fa fa-file-text-o',
        103: 'fa fa-cogs',
        145: 'fa fa-line-chart'
      }
    }
  },
  computed: {
    showMenu() {
      return this.isCollapse ? '64px' : '200px'
    }
  },
  methods: {
    // 点击左侧菜单折叠或展开
    handleClickShow() {
      this.isCollapse = !this.isCollapse
      this.$emit('isShow', this.showMenu)
    }
  }
}
</script>

<style lang="less" scoped>
.el-menu {
  border: none;
  .toggleBtn {
    line-height: 24px;
    text-align: center;
    letter-spacing: .2em;
    font-size: 10px;
    background-color: #4a5064;
    color: #fff;
    cursor: pointer;
  }
}
.el-submenu__title {
  color: red;
}
.icon {
  padding-right: 10px;
}
</style>
