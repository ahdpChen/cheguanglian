/** 创建guid */
let calculatGUID = () => {
  let guid = ''
  for (let i = 1; i <= 32; i++) {
    let n = Math.floor(Math.random() * 16.0).toString(16)
    guid += n
    if ((i === 8) || (i === 12) || (i === 16) || (i === 20)) {
      guid += '-'
    }
  }
  return guid
}

/* 获取当前页url */
let getCurrentPageUrl = () => {
  // eslint-disable-next-line no-undef
  var pages = getCurrentPages() // 获取加载的页面
  var currentPage = pages[pages.length - 1] // 获取当前页面的对象
  var url = currentPage.route // 当前页面url
  return url
}

/* 获取指定页带参数的url */
let getCurrentPageUrlWithArgs = (pageNum) => {
  // eslint-disable-next-line no-undef
  var pages = getCurrentPages() // 获取加载的页面
  pageNum = pageNum ? pageNum + 1 : 1
  if (pageNum <= pages.length) {
    var currentPage = pages[pages.length - pageNum] // 获取当前页面的对象
    var url = currentPage.route // 当前页面url
    var options = currentPage.options // 如果要获取url中所带的参数可以查看options

    // 拼接url的参数
    var urlWithArgs = url + '?'
    for (var key in options) {
      var value = options[key]
      urlWithArgs += key + '=' + value + '&'
    }
    urlWithArgs = urlWithArgs.substring(0, urlWithArgs.length - 1)

    return urlWithArgs
  }
  return ''
}

const removeAccessToken = () => {
  var info = wx.getStorageSync('HMC_USER_LOGIN_INFO')
  delete info.accessToken
  delete info.accessTokenExpiresIn
  wx.setStorageSync('HMC_USER_LOGIN_INFO', info)
}

const removeRefreshToken = () => {
  var info = wx.getStorageSync('HMC_USER_LOGIN_INFO')
  delete info.refreshToken
  delete info.refreshTokenExpiresIn
  wx.setStorageSync('HMC_USER_LOGIN_INFO', info)
}

let checkLoginExpire = () => {
  var loginInfoStr = wx.getStorageSync('HMC_USER_LOGIN_INFO')
  var loginInfo = loginInfoStr || {}
  var CurrentTime = Date.now()
  // 转换成cookie后，采用cookie的统一方法校验
  var HMC_REFRESH_TOKEN = loginInfo.refreshToken
  var AccessTokenExpireDate = loginInfo.accessTokenExpiresIn
  var RefreshTokenExpireDate = loginInfo.refreshTokenExpiresIn

  // accessToken过期(PC端和H5稍有不同,提前5分钟获取新的token)
  if (AccessTokenExpireDate && CurrentTime + 5 * 60 * 1000 > AccessTokenExpireDate) {
    let { ajax } = require('./ajax.js')
    // refresh_toke没有过期
    if (RefreshTokenExpireDate && CurrentTime < RefreshTokenExpireDate) {
      ajax.post({
        url: '/user/member/refresh-token',
        data: {
          refreshToken: HMC_REFRESH_TOKEN
        }
      }).then((res) => {
        var now = Date.now()
        loginInfo = {
          accessToken: res.data.accessToken,
          accessTokenExpiresIn: res.data.accessToken_expires_in * 1000 + now,
          refreshToken: res.data.refreshToken,
          refreshTokenExpiresIn: res.data.refreshToken_expires_in * 1000 + now,
          phoneNumber: loginInfo.phoneNumber,
          userName: loginInfo.userName
        }
        wx.setStorageSync('HMC_USER_LOGIN_INFO', loginInfo)
      }).catch((res) => {
        removeAccessToken()
      })
    } else {
      removeRefreshToken()
      removeAccessToken()
    }
  }
  const { accessToken, accessTokenExpiresIn, refreshToken, refreshTokenExpiresIn } = loginInfo
  return !!(accessToken && refreshToken && accessTokenExpiresIn && refreshTokenExpiresIn)
}

const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

export default {
  calculatGUID,
  getCurrentPageUrl,
  getCurrentPageUrlWithArgs,
  checkLoginExpire,
  formatTime: formatTime
}
