import fly from './config'
import qs from 'qs'

import config from '../config/config'

const host = config.host
// const appKey = config.appKey
// const appid = config.appid

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
const get = (params) => {
  return fly.get(`${host}${params.url}`, qs.stringify(params.data))
}

// 通用的post请求
const post = (params) => {
  return fly.post(`${host}${params.url}`, qs.stringify(params.data))
}

// 校验手机号是否在系统登记
const checkPhone = phoneNumber => {
  return fly.get(`/testApi/smCode?mPhone=${phoneNumber}`)
}

// 文件上传
const upLoadFile = picture => {
  return fly.post('/file/upload', { picture })
}

// 获取验证码
const getMsCode = phoneNumber => {
  return fly.get(`/testApi/smCode?mPhone=${phoneNumber}`)
}

/**
 * 登录
 * @param {*} code wx.login()返回code
 * @param {*} userphone 手机号用户输入
 * @param {*} smCode 后台根据手机号获取
 */
export const login = (userphone, smCode, code) => {
  return fly.post(`/testApi/auth?username=${userphone}&code=${code}&smCode=${smCode}`)
}

export default {
  get,
  post,
  upLoadFile,
  checkPhone,
  getMsCode,
  login
}
