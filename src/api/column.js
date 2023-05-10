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

export function updateEnd(data) {
  return post('/admin/s/column/updateend', data)
}

export function remove(data) {
  return post('/admin/s/column/delete', data)
}

export function getDetail(query) {
  return get('/admin/s/column/read', query)
}

export function addColumnCourse(data){
  return post('/admin/s/column_course/save', data)
}


export function updateIsEnd(data) {
  // return request({
  //   url: '/vue-element-admin/column/is-end',
  //   method: 'post',
  //   data
  // })
}

export function fetchColumnCourse(query) {
  return get('/admin/s/column_course', query)
}

export function removeColumnCourse(data) {
  return post('/admin/s/column_course/delete', data)
}
