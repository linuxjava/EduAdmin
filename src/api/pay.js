import {get, post} from './request-common'

export function getOrders(data) {
  return get('/vue-element-admin/pay/order', data)
}

export function orderDel(data) {
  return get('/vue-element-admin/pay/del-order', data)
}

export function fetchCashOut(data){
  return get('/vue-element-admin/pay/assets', data)
}

export function fetchAccounts(data){
  return get('/vue-element-admin/pay/accounts', data)
}

export function cashOut(data) {
  return post('/vue-element-admin/pay/cash-out', data)
}

export function delAccount(data){
  return get('/vue-element-admin/pay/delAccount', data)
}

export function addAccount(data) {
  return post('/vue-element-admin/pay/addAccount', data)
}
