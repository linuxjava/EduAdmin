import request from '@/utils/request'
import {get, post} from "@/api/request-common";

export function fetchList(query) {
  return get('/admin/s/course', query)
}

export function create(data) {
  return post('/admin/s/course/save', data)
}

export function updateMedia(data) {
  return request({
    url: '/vue-element-admin/media/update',
    method: 'post',
    data
  })
}

export function deleteCourse(data) {
  return post('/admin/s/course/delete', data)
}
