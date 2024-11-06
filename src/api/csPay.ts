import request from '@/utils/request'

/**
 * 基金购买-预下单
 */
export async function fundBuy(id, amount): Promise<any> {
  return request({
    url: '/pay/fund',
    method: 'post',
    params: {id: id, amount: amount}
  })
}

/**
 * 基金购买-余额支付
 */
export async function fundPayByBalance(token, password): Promise<any> {
  return request({
    url: '/pay/fundBalance',
    method: 'post',
    params: {token: token, password: password}
  })
}

/**
 * 获取配置信息(充值/提现)
 */
export async function getPayConfig(type, currency): Promise<any> {
  return request({
    url: '/pay/payConfig',
    method: 'get',
    params: {type: type, currency: currency}
  })
}

/**
 * 充值申请
 */
export async function recharge(id, amount, proof): Promise<any> {
  return request({
    url: '/pay/recharge',
    method: 'post',
    params: {id: id, amount: amount, proof: proof}
  })
}

/**
 * 提现申请-预订单
 */
export async function withdrawApply(id, amount, address): Promise<any> {
  return request({
    url: '/pay/witApply',
    method: 'post',
    params: {id: id, amount: amount, address: address}
  })
}

/**
 * 提现申请-确认
 */
export async function withdrawConfirm(id, password): Promise<any> {
  return request({
    url: '/pay/withdraw',
    method: 'post',
    params: {id: id, password: password}
  })
}