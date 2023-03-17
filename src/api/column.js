import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/vue-element-admin/column/list',
    method: 'get',
    params: query
  })
}

export function createColumn(data) {
  return request({
    url: '/vue-element-admin/column/create',
    method: 'post',
    data
  })
}

export function updateColumn(data) {
  return request({
    url: '/vue-element-admin/column/update',
    method: 'post',
    data
  })
}

export function fetchDetail(query) {
  return request({
    url: '/vue-element-admin/column/detail',
    method: 'get',
    params: query
  })
}

export function updateStatus(data) {
  return request({
    url: '/vue-element-admin/column/status',
    method: 'post',
    data
  })
}

export function updateIsEnd(data) {
  return request({
    url: '/vue-element-admin/column/is-end',
    method: 'post',
    data
  })
}

export function fetchColumnCourse(query) {
  return get('/vue-element-admin/column/course', query)
}

function get(url, query) {
  return request({
    url: url,
    method: 'get',
    params: query
  })
}

function post(url, data) {
  return request({
    url: url,
    method: 'post',
    data
  })
}
