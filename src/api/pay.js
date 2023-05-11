import {get, post} from './request-common'

export function fetchOrders(query){
  return get('/admin/s/order', query)
}

export function removeOrder(data){
  return post('/admin/s/order/delete', data)
}

export function fetchAccounts(query){
  return get('/admin/s/cash', query)
}

export function addAccount(data){
  return post('/admin/s/cash/save', data)
}

export function delAccount(data){
  return post('/admin/s/cash/delete', data)
}

export function updateAccount(data){
  return post('/admin/s/cash/update', data)
}

export function fetchCashOut(data){
  return get('/admin/s/cashconfirm', data)
}
export function cashOut(data) {
  return post('/admin/s/cashconfirm/save', data)
}



// export function getOrders(data) {
//   return get('/vue-element-admin/pay/order', data)
// }
//
// export function orderDel(data) {
//   return get('/vue-element-admin/pay/del-order', data)
// }

