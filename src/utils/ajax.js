import fly from './config'
import qs from 'qs'

import config from '../config/config'
const host = config.host
// eslint-disable-next-line no-unused-vars
const appKey = config.appKey
// eslint-disable-next-line no-unused-vars
const appid = config.appid

/**
 * 接口模版====post
 *
 * export const test = params => {return fly.post(`${root}/xx/xx`, qs.stringify(params))};
 *
 * 接口模版====get
 *
 * export const test1 = function(){return fly.get(`${root}/api/getNewsList`)}
 *
 *
 * 用法：
 * 在 页面用引入 test
 * import {test} from '../../http/api.js'
 *
 * test(params).then(res=>{ console.log(res) })
 */

// 通用的get请求
export const get = (params) => {
  return fly.get(`${host}${params.url}`, qs.stringify(params.data))
}

// 通用的post请求
export const post = (params) => {
  return fly.post(`${host}${params.url}`, qs.stringify(params.data))
}

// 封装的登录请求，根据后台接收方式选择是否加qs.stringify
export const login = params => {
  return fly.post('/login', params)
}
export const carBrand = params => {
  return fly.get('/ware/car/car-brand/310000?&time=1544336972973&source=105')
}
