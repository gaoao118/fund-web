import {STORAGE_TOKEN_KEY, STORAGE_USER_ID} from '@/stores/mutation-type'

function isLogin() {
  return !!localStorage.getItem(STORAGE_TOKEN_KEY)
}

function getToken() {
  return localStorage.getItem(STORAGE_TOKEN_KEY)
}

function getUserId() {
  return localStorage.getItem(STORAGE_USER_ID)
}

function setToken(token: string, userId: string) {
  localStorage.setItem(STORAGE_TOKEN_KEY, token)
  localStorage.setItem(STORAGE_USER_ID, userId)
}

function clearToken() {
  localStorage.removeItem(STORAGE_TOKEN_KEY)
  localStorage.removeItem(STORAGE_USER_ID)
}

export {isLogin, getToken, getUserId, setToken, clearToken}
