import {get, post} from './request-common'


export function fetchGroup(data){
  return get('/vue-element-admin/marketing/list', data)
}
