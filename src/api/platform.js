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
