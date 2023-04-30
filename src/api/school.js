import {get, post} from "@/api/request-common";

export function fetchSchool(data) {
  return get('/vue-element-admin/school/list', data)
}

export function addSchool(data) {
  return post('/vue-element-admin/school/add', data)
}
