import {get, post} from "@/api/request-common";

export function fetchSchool(data) {
  return get('/admin/school', data)
}

export function addSchool(data) {
  return post('/admin/school/save', data)
}
