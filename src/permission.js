import router from './router'
import store from './store'
import { Message } from 'element-ui'
import NProgress from 'nprogress' // Progress 进度条
import 'nprogress/nprogress.css'// Progress 进度条样式
import { getToken } from '@/utils/auth' // 验权

// permission judge function
function hasPermission(roles, permissionRoles) {
  if (roles.indexOf('*') >= 0) return true
  if (!permissionRoles) return true
  return roles.some(role => permissionRoles.indexOf(role) >= 0)
}

const whiteList = ['/login'] // 不重定向白名单
router.beforeEach((to, from, next) => {
  NProgress.start()
  store.dispatch('GetToken').then(res => { // cong localStorage获取token
    if (res) {
      if (to.path === '/login') {
        next({ path: '/' })
        NProgress.done()
      } else {
        if (getToken() === res && store.getters.permission_routers) { // 如果localStorage的token与cookie的token相等
          if (hasPermission(store.getters.roles, to.meta.roles)) {
            if (to.path === '/government' || to.path === '/office_warning' || store.getters.name) {
              next()
            } else {
              store.dispatch('GetOfficeInfo').then((res) => { // 政务号
                if (res.data) {
                  next()
                } else {
                  next({ path: '/office_warning', replace: true, query: { noGoBack: true }})
                }
              })
            }
          } else {
            next({ path: '/401', replace: true, query: { noGoBack: true }})
          }
        } else { // 如果localStorage的token与cookie的token不同
          store.dispatch('Login', res).then(res => { // 将从localStorage获取的token存在cookie里，模拟登录
            if (res) {
              store.dispatch('GetUserRole').then(res => { // 获取权限
                const roles = res // ['ADMIN','OFFICE']
                store.dispatch('GenerateRoutes', { roles }).then(() => { // 根据roles生成可访问的路由表
                  router.addRoutes(store.getters.addRouters) // 动态添加可访问路由表
                  // next({ ...to, replace: true })
                  if (hasPermission(store.getters.roles, to.meta.roles)) {
                    if (to.path === '/government' || store.getters.name) {
                      next()
                    } else {
                      store.dispatch('GetOfficeInfo').then(() => { // 政务号
                        next({ ...to, replace: true })
                      })
                    }
                  } else {
                    next({ path: '/401', replace: true, query: { noGoBack: true }})
                  }
                })
              }).catch((err) => {
                store.dispatch('FedLogOut').then(() => {
                  Message.error(err || 'Verification failed, please login again')
                })
              })
            }
          })
        }
      }
    } else { // 如果没有token，跳转到登录页
      if (whiteList.indexOf(to.path) !== -1) {
        next()
      } else {
        next(`/login`) // 否则全部重定向到登录页
        NProgress.done()
      }
    }
  })
})

router.afterEach(() => {
  NProgress.done() // 结束Progress
})
