import request from '@/utils/request'

export function getList(params) {
  return request({
    url: '/Config/list',
    method: 'get',
    params
  })
}

export function saveData(data) {
  return request({
    url: '/Config/edit',
    method: 'post',
    data
  })
}
