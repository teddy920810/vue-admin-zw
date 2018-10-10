import request from '@/utils/request'

export function getList(params) {
  return request({
    url: '/Question/list',
    method: 'get',
    params
  })
}

export function audit(data) {
  return request({
    url: '/Question/audit',
    method: 'post',
    data
  })
}

export function answerQ(data) {
  return request({
    url: '/Question/answer',
    method: 'post',
    data
  })
}

export function deleteQuestion(data) {
  return request({
    url: '/Question/del',
    method: 'post',
    data
  })
}

export function getCommentList(params) {
  return request({
    url: '/Questioncomment/list',
    method: 'get',
    params
  })
}

export function deleteComment(data) {
  return request({
    url: '/Questioncomment/del',
    method: 'post',
    data
  })
}
