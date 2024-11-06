import request from '@/utils/request'

/**
 * 基金详情
 */
export async function getFundInfo(id): Promise<any> {
  return request({
    url: '/fund/info',
    method: 'get',
    params: {id: id}
  })
}

/**
 * 基金收益计算
 * @param id 基金id
 * @param amount 购买金额
 */
export async function getFundPredict(id, amount): Promise<any> {
  return request({
    url: '/fund/predict',
    method: 'get',
    params: {id: id, amount: amount}
  })
}

/**
 * 业绩走势
 * @param id 基金id
 */
export async function getFundTrend(id): Promise<any> {
  return request({
    url: '/fund/trend',
    method: 'get',
    params: {id: id}
  })
}

/**
 * 单位净值
 * @param id 基金id
 */
export async function getFundNewWorth(id): Promise<any> {
  return request({
    url: '/fund/netValue',
    method: 'get',
    params: {id: id}
  })
}

/**
 * 历史业绩
 * @param id 基金id
 */
export async function getTrendHistory(id): Promise<any> {
  return request({
    url: '/fund/trendHist',
    method: 'get',
    params: {id: id}
  })
}

/**
 * 历史净值
 * @param id 基金id
 * @param pageNum 页码
 * @param pageSize 页容量
 */
export async function getFundNewWorthHistory(id, pageNum, pageSize): Promise<any> {
  return request({
    url: '/fund/netValueHist',
    method: 'get',
    params: {id: id, pageNum: pageNum, pageSize: pageSize}
  })
}

/**
 * 下单详情页数据
 * @param id 基金id
 */
export async function getBuyInfo(id): Promise<any> {
  return request({
    url: '/fund/buyInfo',
    method: 'post',
    params: {id: id}
  })
}

/**
 * 我的投资-列表数据
 * @param pageNum 页码
 * @param pageSize 页容量
 */
export async function userAssetList(pageNum, pageSize): Promise<any> {
  return request({
    url: '/fund/asset',
    method: 'get',
    params: {pageNum: pageNum, pageSize: pageSize}
  })
}

/**
 * 基金赎回/续期
 * @param orderId 订单号
 */
export async function fundRedeem(orderId): Promise<any> {
  return request({
    url: '/fund/redeem',
    method: 'post',
    params: {orderId: orderId}
  })
}
