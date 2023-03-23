import request from '@/utils/request'

export function fetchList(query) {
  return get('/vue-element-admin/user/list', query)
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
