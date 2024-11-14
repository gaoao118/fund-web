import request from '@/utils/request'

export async function queryProse(): Promise<any> {
  return request('/prose')
}

/**
 * 首页轮播图
 * @param type 类型(1新闻，2基金)
 */
export async function carousel(type): Promise<any> {
  return request({
    url: '/common/carousel',
    method: 'get',
    params: {type: type}
  })
}

/**
 * 基金列表
 * @param pageNum 页码
 * @param pageSize 页容量
 * @param cycle 基金周期(0全部，1短期，2中长期，3长期)
 */
export async function getFundList(pageNum, pageSize, cycle): Promise<any> {
  return request({
    url: '/fund/list',
    method: 'get',
    params: {pageNum: pageNum, pageSize: pageSize, cycle: cycle}
  })
}

/**
 * 获取最新的滚动弹窗
 */
export async function getRollNotice(): Promise<any> {
  return request({
    url: '/common/roll',
    method: 'get'
  })
}

/**
 * 经理人推广页数据
 */
export async function getManagerInfo(): Promise<any> {
  return request({
    url: '/common/manager',
    method: 'get'
  })
}

/**
 * 获取新闻列表
 * @param pageNum 页码
 * @param pageSize 页容量
 * @param title 新闻标题
 */
export async function getNewsList(pageNum, pageSize, title): Promise<any> {
  return request({
    url: '/news/list',
    method: 'get',
    params: {pageNum: pageNum, pageSize: pageSize, title: title}
  })
}

/**
 * 获取新闻详情
 * @param id 新闻id
 */
export async function getNewsInfo(id): Promise<any> {
  return request({
    url: '/news/info',
    method: 'get',
    params: {id: id}
  })
}


/**
 * 文件上传-直接上传
 * @param file 文件
 */
export async function uploadFile(file): Promise<any> {
  // 创建一个 FormData 对象来传递文件
  const formData = new FormData();
  formData.append('file', file); // 假设你的文件在 data 对象的 file 属性中

  return request({
    url: '/common/upload',
    method: 'post',
    data: formData,
    // 设置请求头，告诉服务器这是一个文件上传请求
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}