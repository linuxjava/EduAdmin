import Cookies from 'js-cookie'

const TokenKey = 'token'
const SchoolIdKey = 'schoolId'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}

export function getSchoolId() {
  return Cookies.get(SchoolIdKey)
}

export function setSchoolId(schoolId) {
  return Cookies.set(SchoolIdKey, schoolId)
}

export function removeSchoolId() {
  return Cookies.remove(SchoolIdKey)
}
