import {get, post} from "@/api/request-common";

export function fetchStaff(data){
  return get('/admin/s/schoolstaff', data)
}

export function staffDel(data) {
  return post('/admin/s/schoolstaff/delete', data)
}

export function staffAdd(data) {
  return post('/admin/s/schoolstaff/save', data)
}

export function setRole(data) {
  return post('/admin/s/schoolstaff/setroles', data)
}

export function fetchRole(data){
  return get('/admin/role', data)
}

export function fetchRoleAuth(data){
  return get('/admin/role/read', data)
}
