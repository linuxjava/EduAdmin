import request from '@/utils/request'

export function fetchList(query) {
  return get('/vue-element-admin/user/list', query)
}

export function getUserDetail(query) {
  return get('/vue-element-admin/user_detail', query)
}

export function fetchCourseSubscription(query) {
  return get('/vue-element-admin/user/course-subscription', query)
}

export function fetchColumnSubscription(query) {
  return get('/vue-element-admin/user/column-subscription', query)
}

export function fetchOrderRecord(query) {
  return get('/vue-element-admin/user/order-record', query)
}

export function fetchHistory(query) {
  return get('/vue-element-admin/user/history', query)
}

export function fetchComment(query) {
  return get('/vue-element-admin/user/comment', query)
}

export function changeComment(query) {
  return get('/vue-element-admin/user/change-comment', query)
}

export function changeAccess(query) {
  return get('/vue-element-admin/user/change-access', query)
}

export function disableComment(query) {
  return post('/vue-element-admin/user/disable-comment', query)
}

export function disableAccess(data) {
  return post('/vue-element-admin/user/disable-access', data)
}


function get(url, query) {
  return request({
    url: url,
    method: 'get',
    params: query
  })
}

function post(url, data) {
  return request({
    url: url,
    method: 'post',
    data
  })
}
