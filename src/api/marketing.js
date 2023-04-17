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

export function fetchSplash(data){
  return get('/vue-element-admin/marketing/splash/list', data)
}

export function splashTakeOff(data) {
  return get('/vue-element-admin/marketing/splash/takeoff', data)
}

export function splashAdd(data) {
  return post('/vue-element-admin/marketing/splash/add', data)
}

export function splashEdit(data) {
  return post('/vue-element-admin/marketing/splash/edit', data)
}
