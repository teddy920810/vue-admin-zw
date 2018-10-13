import request from '@/utils/request'

export function getList(params) {
  return request({
    url: '/Imagetext/list',
    method: 'get',
    params
  })
}

export function addData(data) {
  return request({
    url: '/Imagetext/add',
    method: 'post',
    data
  })
}

export function editData(data) {
  return request({
    url: '/Imagetext/edit',
    method: 'post',
    data
  })
}

export function deleteData(data) {
  return request({
    url: '/Imagetext/del',
    method: 'post',
    data
  })
}

export function getImgDetail(params) {
  return request({
    url: '/Imagetext/detail',
    method: 'get',
    params
  })
}

export function getCateList(params) {
  return request({
    url: '/Category/list',
    method: 'get',
    params
  })
}

export function getCommentList(params) {
  return request({
    url: '/Imagetextcomment/list',
    method: 'get',
    params
  })
}

export function deleteComment(data) {
  return request({
    url: '/Imagetextcomment/del',
    method: 'post',
    data
  })
}
