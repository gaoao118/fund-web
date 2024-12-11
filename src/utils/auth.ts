import {LOGIN_INFO, STORAGE_TOKEN_KEY, STORAGE_USER_ID, USER_INFO, USER_INVITE_CODE} from '@/stores/mutation-type'

function isLogin() {
  return !!localStorage.getItem(STORAGE_TOKEN_KEY)
}

function getToken() {
  return localStorage.getItem(STORAGE_TOKEN_KEY)
}

function getUserId() {
  return localStorage.getItem(STORAGE_USER_ID)
}

function getInviteCode() {
  return localStorage.getItem(USER_INVITE_CODE)
}

function setToken(token: string, userId: string, userInfo: any) {
  localStorage.setItem(STORAGE_TOKEN_KEY, token)
  localStorage.setItem(STORAGE_USER_ID, userId)
  let str = JSON.stringify(userInfo);
  localStorage.setItem(LOGIN_INFO, str)
  localStorage.setItem(USER_INFO, str)
}

function clearToken() {
  localStorage.removeItem(STORAGE_TOKEN_KEY)
  localStorage.removeItem(STORAGE_USER_ID)
  localStorage.removeItem(LOGIN_INFO)
  localStorage.removeItem(USER_INFO)
}

function setInviteCode(code: string) {
  localStorage.setItem(USER_INVITE_CODE, code)
}

function setUserInfo(userInfo: any) {
  localStorage.setItem(USER_INFO, JSON.stringify(userInfo))
}

function getUserInfo() {
  let item = localStorage.getItem(USER_INFO);
  return JSON.parse(item);
}

function getLoginInfo() {
  let item = localStorage.getItem(LOGIN_INFO);
  return JSON.parse(item);
}

export {
  isLogin,
  getToken,
  getUserId,
  setToken,
  clearToken,
  getInviteCode,
  setInviteCode,
  setUserInfo,
  getUserInfo,
  getLoginInfo,
}
