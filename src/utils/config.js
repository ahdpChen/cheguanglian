/*
    fly配置文件
*/
// 引入 fly
import config from '../config/config'
var Fly = require('flyio/dist/npm/wx')
// eslint-disable-next-line new-parens
var fly = new Fly

// //定义公共headers
// fly.config.headers={xx:5,bb:6,dd:7}
// //设置超时
fly.config.timeout = 20000
// //设置请求基地址
fly.config.baseURL = config.host

// 添加请求拦截器
fly.interceptors.request.use((request) => {
  // 给所有请求添加自定义header
  const token = wx.getStorageSync('token') || ''
  request.headers = {
    token
  }
  // 打印出请求体
  console.log(request)
  // 终止请求
  // var err=new Error("xxx")
  // err.request=request
  // return Promise.reject(new Error(""))

  // 可以显式返回request, 也可以不返回，没有返回值时拦截器中默认返回request
  return request
})

// 添加响应拦截器，响应拦截器会在then/catch处理之前执行
fly.interceptors.response.use(
  (response) => {
    // 只将请求结果的data字段返回
    return response.data
  },
  // eslint-disable-next-line handle-callback-err
  (err) => {
    // 发生网络错误后会走到这里
    // return Promise.resolve("ssss")
  }
)

export default fly
