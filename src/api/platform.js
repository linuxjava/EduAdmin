import {get, post} from './request-common'


export function fetchRoles(data) {
  return get('/platform/role', data)
}

export function createRole(data) {
  return post('/platform/role/save', data)
}

export function updateRole(data) {
  return post('/platform/role/update', data)
}

export function removeRole(data) {
  return post('/platform/role/delete', data)
}

export function fetchRoleAuth(data){
  return get('/platform/role/read', data)
}

export function fetchAllMenu(){
  return get('/platform/access', {type: 'menu'})
}

export function fetchAllAccess(){
  return get('/platform/access', {type: 'rule'})
}

export function setMenuAccess(data){
  return post('/platform/role/setrules', data)
}
