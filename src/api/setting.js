import {get, post} from "@/api/request-common";

export function fetchStaff(data){
  return get('/vue-element-admin/setting/staff/list', data)
}

export function staffDel(data) {
  return post('/vue-element-admin/setting/staff/del', data)
}

export function staffAdd(data) {
  return post('/vue-element-admin/setting/staff/add', data)
}

export function setRole(data) {
  return post('/vue-element-admin/setting/staff/setRole', data)
}
