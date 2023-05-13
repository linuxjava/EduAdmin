import {get, post} from "@/api/request-common";
import {getSchoolId} from '@/utils/auth'

export function fetchSchool(data) {
  return get('/admin/school', data)
}

export function addSchool(data) {
  return post('/admin/school/save', data)
}

export function fetchSchoolDetail(data) {
  return get('/admin/s/school/read', {id: getSchoolId()})
}

export function updateSchool(data) {
  return post('/admin/s/school/update', data)
}
