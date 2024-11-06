import request from '@/utils/request'

/**
 * 获取用户信息
 */
export async function getUserInfo(): Promise<any> {
  return request({
    url: '/user/info',
    method: 'get'
  })
}

/**
 * 修改用户基础信息
 */
export async function updateUserInfo(avatar, nickName): Promise<any> {
  return request({
    url: '/user/update',
    method: 'post',
    data: {avatar: avatar, nickName: nickName}
  })
}

/**
 * 钱包余额
 */
export async function getUserBalance(): Promise<any> {
  return request({
    url: '/user/balance',
    method: 'get'
  })
}

/**
 * 钱包余额账单
 */
export async function getUserBillsList(type, pageNum, pageSize): Promise<any> {
  return request({
    url: '/user/getBills',
    method: 'get',
    params: {type: type, pageNum: pageNum, pageSize: pageSize}
  })
}

/**
 * 获取用户安全配置信息
 */
export async function getUserSafety(): Promise<any> {
  return request({
    url: '/user/getSafety',
    method: 'get'
  })
}

/**
 * 绑定邀请人
 */
export async function inviterBinding(inviteCode): Promise<any> {
  return request({
    url: '/user/binding',
    method: 'post',
    params: {inviteCode: inviteCode}
  })
}

/**
 * 充值提现订单列表
 */
export async function getUserOrders(type, pageNum, pageSize): Promise<any> {
  return request({
    url: '/user/orders',
    method: 'get',
    params: {type: type, pageNum: pageNum, pageSize: pageSize}
  })
}

/**
 * 充值提现订单详情
 */
export async function getUserOrderInfo(id): Promise<any> {
  return request({
    url: '/user/orderInfo',
    method: 'get',
    params: {id: id}
  })
}

/**
 * 设置支付密码
 */
export async function setWalletPwd(password): Promise<any> {
  return request({
    url: '/user/setWalletPwd',
    method: 'post',
    params: {password: password}
  })
}

/**
 * 修改支付密码
 */
export async function updateWalletPwd(code, password): Promise<any> {
  return request({
    url: '/user/updateWalletPwd',
    method: 'post',
    params: {code: code, password: password}
  })
}

/**
 * 查询绑定邮箱信息
 */
export async function getUserEmail(): Promise<any> {
  return request({
    url: '/user/email',
    method: 'get'
  })
}
