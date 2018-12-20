import fly from './config'
import qs from 'qs'

import config from '../config/config'
import utils from '../utils'

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

/**
 * 文件上传
 * @param {*} type为1时扫描
 * @param {*} picture
 */
const upLoadFile = params => {
  // return fly.post('/testApi/file/upload', utils.json2Form(params))
  const loginInfoStr = wx.getStorageSync('LOGIN_INFO')
  const loginInfo = loginInfoStr ? JSON.parse(loginInfoStr) : null
  if (loginInfo) {
    return wx.uploadFile({
      url: `${host}/testApi/file/upload`,
      filePath: params.picture,
      name: 'file',
      header: {
        'Content-type': 'multipart/form-data',
        'Host': 'www.cheguanglian.com:8080',
        'Authorization': `Bearer ${loginInfo.token}`
      },
      formData: {
        type: params.type
      },
      success (res) {
        const data = res.data
        console.log(data)
      }
    })
  } else {
    // 统一处理没有token跳转登陆页
    const url = '../login/main'
    wx.redirectTo({url})
    return false
  }
}

// 获取验证码
const getMsCode = phoneNumber => {
  return fly.get(`/testApi/smCode?mPhone=${phoneNumber}`, null, {
    extra: {
      auth: false
    }
  })
}

/**
 * 登录
 * @param {*} code wx.login()返回code
 * @param {*} userphone 手机号用户输入
 * @param {*} smCode 后台根据手机号获取
 */
export const login = (userphone, smCode, code) => {
  return fly.post('/testApi/auth', utils.json2Form({account: userphone, code, smCode}), {
    extra: {
      auth: false
    }
  })
}

// 首页-获取广告下拉列表
export const getSelAd = () => {
  return fly.get('/testApi/ad/getSelAd')
}

// 首页-添加广告施工
export const addConstruction = (carWashId, adOrderId, brand, region, carNumber, carNumberOld, picList) => {
  return fly.post('/testApi/ad/addConstruction', {
    detail: {
      carWashId,
      adOrderId,
      brand,
      region,
      carNumber,
      carNumberOld
    },
    picList
  })
}

// 我的-获取一级权限用户的基本信息
export const getUserBaseInfo = () => {
  return fly.get('/testApi/user/userBaseInfo')
}

export default {
  get,
  post,
  upLoadFile,
  checkPhone,
  getMsCode,
  login,
  getSelAd,
  addConstruction,
  getUserBaseInfo
}
