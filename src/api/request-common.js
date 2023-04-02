import request from '@/utils/request'

export function get(url, query) {
  return request({
    url: url,
    method: 'get',
    params: query
  })
}

export function post(url, data) {
  return request({
    url: url,
    method: 'post',
    data
  })
}
