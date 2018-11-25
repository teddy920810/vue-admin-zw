import Cookies from 'js-cookie'

const TokenKey = 'Admin-Token-zx02fppxwwz_mttai'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}
