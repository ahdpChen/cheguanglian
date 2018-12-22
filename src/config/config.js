let host = 'http://www.cheguanglian.com:8080'
let uploadFileHost = 'www.cheguanglian.com:8080'
console.log(process.env.NODE_ENV)
if (process.env.NODE_ENV === 'production') {
  host = 'http://www.cheguanglian.com'
  uploadFileHost = 'www.cheguanglian.com'
}
const appid = 'wx641d418964519abb'
const appKey = ''
const config = {
  host,
  uploadFileHost,
  appid,
  appKey
}
export default config
