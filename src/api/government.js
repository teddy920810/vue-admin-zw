import request from '@/utils/request'

export function getSysUserList(params) {
  return request({
    url: '/User/list',
    method: 'get',
    params
  })
}

export function bindGovernment(data) {
  return request({
    url: '/Office/edit',
    method: 'post',
    data
  })
}
