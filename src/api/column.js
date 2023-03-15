import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/vue-element-admin/column/list',
    method: 'get',
    params: query
  })
}

export function createVideo(data) {
  return request({
    url: '/vue-element-admin/column/create',
    method: 'post',
    data
  })
}

export function updateVideo(data) {
  return request({
    url: '/vue-element-admin/column/update',
    method: 'post',
    data
  })
}
