<template>
  <div class="login-container">
    <login-main></login-main>
  </div>
</template>

<script>
import Main from './pages/main'
export default {
  name: 'Login',
  components: {
    'login-main': Main
  }
}
</script>

<style lang="less" scoped>
@import '~assets/varibles.less';
.login-container {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: @bgColor;
}
</style>
