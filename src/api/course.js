import request from '@/utils/request'
import {get, post} from "@/api/request-common";

export function fetchList(query) {
  return get('/admin/s/course', query)
}

export function create(data) {
  return post('/admin/s/course/save', data)
}

export function update(data) {
  return post('/admin/s/course/update', data)
}

export function remove(data) {
  return post('/admin/s/course/delete', data)
}

export function updateStatus(data){
  return post("/admin/s/course/updatestatus", data)
}
