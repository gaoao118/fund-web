import type {AxiosError, InternalAxiosRequestConfig} from 'axios'
import axios from 'axios'
import {showFailToast, showNotify} from 'vant'
import {langFormat, STORAGE_TOKEN_KEY} from '@/stores/mutation-type'
import router from "@/router";
import {locale} from "@/utils/i18n";

// 这里是用于设定请求后端时，所用的 Token KEY
// 可以根据自己的需要修改，常见的如 Access-Token，Authorization
// 需要注意的是，请尽量保证使用中横线`-` 来作为分隔符，
// 避免被 nginx 等负载均衡器丢弃了自定义的请求头
export const REQUEST_TOKEN_KEY = 'token'
export const REQUEST_LANGUAGE_KEY = 'Accept-Language'

// 创建 axios 实例
const request = axios.create({
  // API 请求的默认前缀
  baseURL: import.meta.env.VITE_APP_API_BASE_URL,
  timeout: 6000, // 请求超时时间
})

export type RequestError = AxiosError<{
  message?: string
  result?: any
  errorMessage?: string
}>

// 异常拦截处理器
function errorHandler(error: RequestError): Promise<any> {
  if (error.response) {
    const {data = {}, status, statusText} = error.response
    // 403 无权限
    if (status === 403) {
      showNotify({
        type: 'danger',
        message: (data && data.message) || statusText,
      })
    }
    // 401 未登录/未授权
    if (status === 401 && data.result && data.result.isLogin) {
      showNotify({
        type: 'danger',
        message: 'Authorization verification failed',
      })
      // 如果你需要直接跳转登录页面
      // location.replace(loginRoutePath)
    }
  }
  return Promise.reject(error)
}

// 请求拦截器
function requestHandler(config: InternalAxiosRequestConfig): InternalAxiosRequestConfig | Promise<InternalAxiosRequestConfig> {
  //当前语言
  config.headers[REQUEST_LANGUAGE_KEY] = langFormat(locale.value)
  const savedToken = localStorage.getItem(STORAGE_TOKEN_KEY)
  // 如果 token 存在
  // 让每个请求携带自定义 token, 请根据实际情况修改
  if (savedToken)
    config.headers[REQUEST_TOKEN_KEY] = savedToken
  return config
}

// Add a request interceptor
request.interceptors.request.use(requestHandler, errorHandler)

const whiteList = ['/user/info']

// 响应拦截器
function responseHandler(res: { data: any }) {
  // 未设置状态码则默认成功状态
  const code = res.data.code || 200;
  // 获取错误信息
  const msg = res.data.msg;
  // 二进制数据则直接返回
  if (res.request.responseType === 'blob' || res.request.responseType === 'arraybuffer') {
    return res.data
  }
  if (code === 401) {
    let val = whiteList.includes(res.config.url);
    if (val) {
      return res.data;
    }
    router.push({name: 'login'})
    showFailToast('未登录，请登录！');
  } else if (code === 500) {
    showFailToast(msg);
    return res.data;
  } else if (code !== 200) {
    showFailToast(msg);
    return res.data;
  } else {
    return res.data
  }
}

// Add a response interceptor
request.interceptors.response.use(responseHandler, errorHandler)

export default request
