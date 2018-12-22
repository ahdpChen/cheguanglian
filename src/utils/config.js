/*
    fly配置文件
*/
// 引入 fly
import config from '../config/config'
var Fly = require('flyio/dist/npm/wx')
// eslint-disable-next-line new-parens
var fly = new Fly

// //设置超时
fly.config.timeout = 20000
// //设置请求基地址
fly.config.baseURL = config.host

// 添加请求拦截器
fly.interceptors.request.use((request) => {
  wx.showLoading({
    title: '加载中'
  })
  let auth = true
  if (request.extra) {
    auth = request.extra.auth
  }

  // 打印出请求体
  // console.log(auth, request)

  // 给所有需要token的接口请求添加token
  if (auth) {
    const loginInfoStr = wx.getStorageSync('LOGIN_INFO')
    const loginInfo = loginInfoStr ? JSON.parse(loginInfoStr) : null
    if (loginInfo) {
      request.headers = {
        Authorization: `Bearer ${loginInfo.token}`
      }
    } else {
      // 统一处理没有token跳转登陆页
      const url = '../login/main'
      wx.redirectTo({url})
    }
  }

  // 终止请求
  // var err = new Error("xxx")
  // err.request = request
  // return Promise.reject(new Error(""))

  // 可以显式返回request, 也可以不返回，没有返回值时拦截器中默认返回request
  return request
})

// 添加响应拦截器，响应拦截器会在then/catch处理之前执行
fly.interceptors.response.use(
  (response) => {
    wx.hideLoading()
    // 只将请求结果的data字段返回
    return response.data
  },
  // eslint-disable-next-line handle-callback-err
  (err) => {
    // wx.hideLoading()
    // 发生网络错误
    console.log(err)
    if (err && err.message) {
      wx.showToast({
        title: err.message || '网络错误',
        icon: 'none',
        duration: 2000
      })
    }
    return Promise.reject(err)
  }
)

export default fly
