<template>
  <div class="login-container">
    澎湃管理平台loading
  </div>
</template>

<script>
import { Message } from 'element-ui'
export default {
  name: 'Load',
  data() {
    return {
      token: undefined
    }
  },
  created() {
    this.handleLogin()
  },
  methods: {
    handleLogin() {
      if (location.href.indexOf('token') === -1) {
        Message({
          message: 'token获取失败',
          type: 'error',
          duration: 5 * 1000
        })
      }
      const token = location.href.split('?')[1] && location.href.split('?')[1].split('=')[1]
      console.log(location.href.split('?'))
      this.token = token
      if (this.token) {
        this.$store.dispatch('Login', this.token).then(() => {
          this.$router.push({ path: '/' })
        }).catch(() => {
        })
      } else {
        Message({
          message: 'token获取失败',
          type: 'error',
          duration: 5 * 1000
        })
      }
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
$bg:#2d3a4b;
$light_gray:#eee;
</style>

<style rel="stylesheet/scss" lang="scss" scoped>
$bg:#2d3a4b;
$dark_gray:#889aa4;
$light_gray:#eee;
.login-container {
  position: fixed;
  height: 100%;
  width: 100%;
  background-color: $bg;
}
</style>
