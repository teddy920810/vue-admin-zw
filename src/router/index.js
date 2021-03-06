import Vue from 'vue'
import Router from 'vue-router'

// in development-env not use lazy-loading, because lazy-loading too many pages will cause webpack hot update too slow. so only in production use lazy-loading;
// detail: https://panjiachen.github.io/vue-element-admin-site/#/lazy-loading

Vue.use(Router)

/* Layout */
import Layout from '../views/layout/Layout'

/**
* hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
* alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
*                                if not set alwaysShow, only more than one route under the children
*                                it will becomes nested mode, otherwise not show the root menu
* redirect: noredirect           if `redirect:noredirect` will no redirect in the breadcrumb
* name:'router-name'             the name is used by <keep-alive> (must set!!!)
* meta : {
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar,
  }
**/
export const constantRouterMap = [
  { path: '/login', component: () => import('@/views/login/load'), hidden: true },
  { path: '/404', component: () => import('@/views/404'), hidden: true },
  { path: '/401', component: () => import('@/views/401'), hidden: true },
  { path: '/office_warning', component: () => import('@/views/office_warning'), hidden: true },

  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    name: '首页',
    hidden: true,
    children: [{
      path: 'dashboard',
      component: () => import('@/views/dashboard/index')
    }]
  },
  { path: '*', redirect: '/', hidden: true }
]

export default new Router({
  // mode: 'history', //后端支持可开
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})

export const asyncRouterMap = [
  {
    path: '/role',
    component: Layout,
    redirect: '/role/index',
    meta: { roles: ['PP_ROLE_MANAGE'] },
    children: [
      {
        path: 'index',
        name: '角色管理',
        component: () => import('@/views/role/list'),
        meta: { title: '角色管理', icon: 'form', roles: ['PP_ROLE_MANAGE'] }
      }
    ]
  },
  {
    path: '/question',
    component: Layout,
    redirect: '/question/index',
    meta: { roles: ['PP_QUESTION_MANAGE'] },
    children: [
      {
        path: 'index',
        name: '问答管理',
        component: () => import('@/views/question/list'),
        meta: { title: '问答管理', icon: 'form', roles: ['PP_QUESTION_MANAGE'] }
      },
      {
        path: 'comment/:qu_id',
        name: '问答评论',
        component: () => import('@/views/question/comment-list'),
        meta: { title: '问答评论', icon: 'form', roles: ['PP_COMMENT_QUESTION_MANAGE'] },
        hidden: true
      }
    ]
  },
  {
    path: '/government',
    component: Layout,
    redirect: '/government/index',
    children: [
      {
        path: 'index',
        name: '政务号',
        component: () => import('@/views/government/list'),
        meta: { title: '政务号管理', icon: 'form', roles: ['PP_OFFICE_MANAGE'] }
      }
    ],
    meta: { roles: ['PP_OFFICE_MANAGE'] }
  },
  {
    path: '/category',
    component: Layout,
    redirect: '/category/list',
    children: [
      {
        path: 'list',
        name: '类别管理',
        component: () => import('@/views/category/list'),
        meta: { title: '类别管理', icon: 'form', roles: ['PP_CATEGORY_MANAGE'] }
      }
    ],
    meta: { roles: ['PP_CATEGORY_MANAGE'] }
  },
  {
    path: '/config',
    component: Layout,
    redirect: '/config/index',
    children: [
      {
        path: 'index',
        name: '系统设置',
        component: () => import('@/views/config/index'),
        meta: { title: '系统设置', icon: 'form', roles: ['PP_SYSTEM_SETTING'] }
      }
    ],
    meta: { roles: ['PP_SYSTEM_SETTING'] }
  },
  {
    path: '/picart',
    component: Layout,
    redirect: '/picart/list',
    meta: { roles: ['PP_IMAGE_TEXT_MANAGE'] },
    children: [
      {
        path: 'list',
        name: '图文管理',
        component: () => import('@/views/picture_article/list'),
        meta: { title: '图文管理', icon: 'form', roles: ['PP_IMAGE_TEXT_MANAGE'] }
      },
      {
        path: 'comment/:pa_id',
        name: '图文评论',
        component: () => import('@/views/picture_article/comment-list'),
        meta: { title: '图文评论', icon: 'form', roles: ['PP_COMMENT_IMAGETEXT_MANAGE'] },
        hidden: true
      }
    ]
  }
]
