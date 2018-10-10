import request from '@/utils/request'

export function getList(params) {
  return request({
    url: '/Imagetextcomment/list',
    method: 'get',
    params
  })
}
