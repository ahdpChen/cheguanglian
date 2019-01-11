const env = process.env.NODE_ENV || 'development'
console.log(env)
const requestConfigs = {
  development: {
    host: 'http://www.cheguanglian.com:8080',
    uploadFileHost: 'api.cheguanglian.com:8080'
  },
  production: {
    host: 'http://api.cheguanglian.com',
    uploadFileHost: 'api.cheguanglian.com'
  }
}
const appid = 'wxa49d31e926e524c7'
const appKey = ''
const config = {
  ...requestConfigs[env],
  appid,
  appKey
}
export default config
