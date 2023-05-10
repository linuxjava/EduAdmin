import request from '@/utils/request'
import {get, post} from '@/api/request-common'

export function login(data) {
  return request({
    url: '/user/login',
    method: 'post',
    data
  })
}

export function register(data) {
  return request({
    url: '/user/reg',
    method: 'post',
    data
  })
}

export function getInfo(token) {
  return request({
    url: '/admin/user/info',
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return request({
    url: '/admin/user/logout',
    method: 'post'
  })
}

export function fetchUserList(query){
  return get('/admin/s/school_user', query)
}

export function updateAccess(data) {
  return post('/admin/s/school_user/updateaccess', data)
}

export function updateComment(data) {
  return post('/admin/s/school_user/updatecomment', data)
}

export function fetchUserDetail(query) {
  return get('/admin/s/school_user/read', query)
}

export function fetchCourseSubscription(query) {
  query.type = 'course'
  return get('/admin/s/order_item', query)
}

export function fetchColumnSubscription(query) {
  query.type = 'column'
  return get('/admin/s/order_item', query)
}

export function fetchOrderRecord(query) {
  return get('/admin/s/order', query)
}

export function fetchHistory(query) {
  return get('/admin/s/user_history', query)
}

export function fetchComment(query) {
  return get('/vue-element-admin/user/comment', query)
}
