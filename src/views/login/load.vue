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
      } else {
        const params = location.href.split('?')[1].split('&')
        for (const item in params) {
          if (params[item].indexOf('token') > -1) {
            this.token = params[item].split('=')[1]
          }
        }
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
