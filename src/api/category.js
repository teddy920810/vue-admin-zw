import request from '@/utils/request'

export function getList(params) {
  return request({
    url: '/Category/list',
    method: 'get',
    params
  })
}

export function addData(data) {
  return request({
    url: '/Category/add',
    method: 'post',
    data
  })
}

export function editData(data) {
  return request({
    url: '/Category/edit',
    method: 'post',
    data
  })
}

export function deleteData(data) {
  return request({
    url: '/Category/del',
    method: 'post',
    data
  })
}
