import {get, post} from './request-common'


export function fetchGroup(data){
  return get('/vue-element-admin/marketing/group/list', data)
}

export function groupTakeOff(data){
  return get('/vue-element-admin/marketing/group/takeoff', data)
}

export function groupAdd(data) {
  return post('/vue-element-admin/marketing/group/add', data)
}

export function groupEdit(data) {
  return post('/vue-element-admin/marketing/group/edit', data)
}
