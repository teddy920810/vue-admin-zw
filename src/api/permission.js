import request from '@/utils/request'

export function getPermission() {
  return request({
    url: '/Permission/list',
    method: 'get'
  })
}

export function getPermissionByRole(role_id) {
  return request({
    url: '/Permissionrole/list?role_id=' + role_id,
    method: 'get'
  })
}

export function editRolePermission(data) {
  return request({
    url: '/Permissionrole/edit',
    method: 'post',
    data
  })
}
