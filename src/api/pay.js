import {get, post} from './request-common'

export function getOrders(data) {
  return get('/vue-element-admin/pay/order', data)
}

export function orderDel(data) {
  return get('/vue-element-admin/pay/del-order', data)
}
