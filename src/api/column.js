import {get, post} from '@/api/request-common'

export function fetchList(query) {
  return get('/admin/s/column', query)
}

export function create(data) {
  return post('/admin/s/column/save', data)
}

export function update(data) {
  return post('/admin/s/column/update', data)
}

export function updateStatus(data) {
  return post('/admin/s/column/updatestatus', data)
}

export function remove(data) {
  return post('/admin/s/column/delete', data)
}

export function updateColumn(data) {
  // return request({
  //   url: '/vue-element-admin/column/update',
  //   method: 'post',
  //   data
  // })
}

export function fetchDetail(query) {
  // return request({
  //   url: '/vue-element-admin/column/detail',
  //   method: 'get',
  //   params: query
  // })
}



export function updateIsEnd(data) {
  // return request({
  //   url: '/vue-element-admin/column/is-end',
  //   method: 'post',
  //   data
  // })
}

export function fetchColumnCourse(query) {
  return get('/vue-element-admin/column/course', query)
}
