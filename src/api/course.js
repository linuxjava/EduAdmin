import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/admin/s/course',
    method: 'get',
    params: query
  })
}

export function create(data) {
  return request({
    url: '/admin/s/course/save',
    method: 'post',
    data
  })
}

export function updateMedia(data) {
  return request({
    url: '/vue-element-admin/media/update',
    method: 'post',
    data
  })
}
