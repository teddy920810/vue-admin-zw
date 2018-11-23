import request from '@/utils/request'

export function getRoleList(params) {
  return request({
    url: '/Role/list',
    method: 'get',
    params
  })
}

export function addRole(data) {
  return request({
    url: '/Role/add',
    method: 'post',
    data
  })
}

export function editRole(data) {
  return request({
    url: '/Role/edit',
    method: 'post',
    data
  })
}

export function deleteRole(data) {
  return request({
    url: '/Role/del',
    method: 'post',
    data
  })
}

export function getRoleAll() {
  return request({
    url: '/Role/all',
    method: 'get'
  })
}

export function editUserRole(data) {
  return request({
    url: '/Userrole/edit',
    method: 'post',
    data
  })
}

export function getUserRoleInfoByUsername(user_name) {
  return request({
    url: '/Userrole/list?page=1&page_size=1&user_name=' + user_name,
    method: 'get'
  })
}

