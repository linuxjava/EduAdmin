import {get, post} from './request-common'


export function fetchGroup(data){
  return get('/vue-element-admin/marketing/group-list', data)
}

export function groupTakeOff(data){
  return get('/vue-element-admin/marketing/group-take-off', data)
}
