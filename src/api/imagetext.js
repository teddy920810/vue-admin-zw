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

export function getImageCategoryList(params) {
  return request({
    url: '/Category/imageCategory',
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

export function auditComment(data) {
  return request({
    url: '/Imagetextcomment/audit',
    method: 'post',
    data
  })
}
