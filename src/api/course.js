import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/vue-element-admin/course/list',
    method: 'get',
    params: query
  })
}

export function createMedia(data) {
  return request({
    url: '/vue-element-admin/course/create',
    method: 'post',
    data
  })
}

export function updateMedia(data) {
  return request({
    url: '/vue-element-admin/course/update',
    method: 'post',
    data
  })
}
