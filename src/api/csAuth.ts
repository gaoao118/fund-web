import request from '@/utils/request'

/**
 * 用户注册
 */
export async function register(account, password, inviterCode): Promise<any> {
  return request({
    url: '/auth/register',
    method: 'post',
    params: {account: account, password: password, inviterCode: inviterCode}
  })
}

/**
 * 账号密码登录
 */
export async function userLogin(account, password): Promise<any> {
  return request({
    url: '/auth/login',
    method: 'post',
    params: {account: account, password: password}
  })
}

/**
 * 获取图形验证码
 */
export async function captcha(): Promise<any> {
  return request({
    url: '/auth/captcha',
    method: 'get'
  })
}

/**
 * 发送验证码
 */
export async function sendSmsCode(account, uuid, code): Promise<any> {
  return request({
    url: '/auth/sendSmsCode',
    method: 'get',
    params: {account: account, uuid: uuid, code: code}
  })
}

/**
 * 发送验证码(本账号)
 */
export async function sendSmsUser(uuid, code): Promise<any> {
  return request({
    url: '/auth/sendSmsUser',
    method: 'get',
    params: {type: 2, uuid: uuid, code: code}
  })
}


/**
 * 验证码登录
 */
export async function smsLogin(account, code): Promise<any> {
  return request({
    url: '/auth/phone',
    method: 'post',
    params: {account: account, code: code}
  })
}

/**
 * 忘记登录密码
 */
export async function forgetPassword(account, code, password): Promise<any> {
  return request({
    url: '/auth/forgetPassword',
    method: 'post',
    params: {account: account, code: code, password: password}
  })
}

/**
 * 修改登录密码
 */
export async function updatePassword(password, newPwd): Promise<any> {
  return request({
    url: '/auth/updatePassword',
    method: 'post',
    params: {password: password, newPwd: newPwd}
  })
}

/**
 * 绑定邮箱
 */
export async function bindingEmail(email, code): Promise<any> {
  return request({
    url: '/auth/bindEmail',
    method: 'post',
    params: {email: email, code: code},
  })
}

/**
 * 账号注销
 */
export async function unsubscribe(): Promise<any> {
  return request({
    url: '/auth/unsubscribe',
    method: 'post',
  })
}
