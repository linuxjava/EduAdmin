import Cookies from 'js-cookie'

const TokenKey = 'token'
const SchoolIdKey = 'schoolId'
const IsPlatform = 'IisPlatform'

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

export function getIsPlatform() {
  return Cookies.get(IsPlatform)
}

export function setIsPlatform(isPlatform) {
  return Cookies.set(IsPlatform, isPlatform)
}

export function removeIsPlatform() {
  return Cookies.remove(IsPlatform)
}
