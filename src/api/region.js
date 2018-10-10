import request from '@/utils/request'

export function getRegion() {
  return request({
    url: '/Location/list',
    method: 'get'
  })
}
