import {get, post} from './request-common'


export function fetchGroup(data){
  return get('/admin/s/group', data)
}

export function groupTakeOff(data){
  return get('/admin/s/group/updatestatus', data)
}

export function groupAdd(data) {
  return post('/admin/s/group/save', data)
}

export function groupEdit(data) {
  return post('/admin/s/group/update', data)
}

export function fetchSplash(data){
  return get('/admin/s/flashsale', data)
}

export function splashTakeOff(data) {
  return get('/admin/s/flashsale/updatestatus', data)
}

export function splashAdd(data) {
  return post('/admin/s/flashsale/save', data)
}

export function splashEdit(data) {
  return post('/admin/s/flashsale/update', data)
}

export function fetchCoupon(data){
  return get('/admin/s/coupon', data)
}

export function couponTakeOff(data) {
  return get('/admin/s/coupon/updatestatus', data)
}

export function couponAdd(data) {
  return post('/admin/s/coupon/save', data)
}

export function couponEdit(data) {
  return post('/admin/s/coupon/update', data)
}

