import request from '@/utils/request'

export function getSysUserList(params) {
  return request({
    url: '/User/list',
    method: 'get',
    params
  })
}

export function getGovernmentList(params) {
  return request({
    url: '/Office/list',
    method: 'get',
    params
  })
}

export function addGovernment(data) {
  return request({
    url: '/Office/add',
    method: 'post',
    data
  })
}

export function editGovernment(data) {
  return request({
    url: '/Office/edit',
    method: 'post',
    data
  })
}

export function deleteGovernment(data) {
  return request({
    url: '/Office/del',
    method: 'post',
    data
  })
}

export function bindGovernment(data) {
  return request({
    url: '/Office/edit',
    method: 'post',
    data
  })
}

export function initGovernment(data) {
  return request({
    url: '/Office/init',
    method: 'post',
    data
  })
}
