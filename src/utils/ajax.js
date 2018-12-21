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

/**
 * 文件上传
 * @param {*} type为1时扫描
 * @param {*} picture
 */
// const upLoadFile = params => {
//   // return fly.post('/testApi/file/upload', utils.json2Form(params))
//   const loginInfoStr = wx.getStorageSync('LOGIN_INFO')
//   const loginInfo = loginInfoStr ? JSON.parse(loginInfoStr) : null
//   if (loginInfo) {
//     return wx.uploadFile({
//       url: `${host}/testApi/file/upload`,
//       filePath: params.picture,
//       name: 'file',
//       header: {
//         'Content-type': 'multipart/form-data',
//         'Host': 'www.cheguanglian.com:8080',
//         'Authorization': `Bearer ${loginInfo.token}`
//       },
//       formData: {
//         type: params.type
//       },
//       success(res) {
//         const data = res.data
//         console.log(data)
//       }
//     })
//   } else {
//     // 统一处理没有token跳转登陆页
//     const url = '../login/main'
//     wx.redirectTo({ url })
//     return false
//   }
// }

// 获取验证码
const getMsCode = phoneNumber => {
  return fly.get('/testApi/smCode', qs.stringify({ mPhone: phoneNumber }), {
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
  return fly.post('/testApi/auth', qs.stringify({ account: userphone, code, smCode }), {
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
/**
 *{
 * detail:
 *  {
 *    adOrderId,
 *    brand,
 *    region,
 *    carNumber,
 *    carNumberOld
 *  },
 * picList
 * }
 */
export const addConstruction = (params) => {
  return fly.post('/testApi/ad/addConstruction', JSON.stringify(params))
}

// 我的-获取一级权限用户的基本信息
export const getUserBaseInfo = () => {
  return fly.get('/testApi/user/userBaseInfo')
}

// 账户设置-获取一级权限用户下所属的员工列表
export const getEmployees = () => {
  return fly.get('/testApi/user/getEmployees')
}

// 员工账户-删除员工
export const deleteEmployee = (id) => {
  return fly.post('/testApi/user/delete', qs.stringify({ id }))
}

// 员工账户-新增或修改员工
/**
 * params
 * {
 *  id: 新增不传修改传（暂时不考虑）
 *  name
 *  phone
 * }
 */
export const editEmployee = (params) => {
  return fly.post('/testApi/user/addOrUpdte', qs.stringify(params))
}

/**
 * 明细-获取账户明细
 * @param {*} type (0:全部；1:收入；2: 支出)
 * @param {*} offset (当前页起始值)
 * @param {*} limit (一页条数)
 */
export const accountDetail = (type, offset, limit) => {
  return fly.get('/testApi/user/selectPageAccountDetail', qs.stringify({ type, offset, limit }))
}

export default {
  get,
  post,
  // upLoadFile,
  getMsCode,
  login,
  getSelAd,
  addConstruction,
  getUserBaseInfo,
  getEmployees,
  deleteEmployee,
  editEmployee,
  accountDetail
}
