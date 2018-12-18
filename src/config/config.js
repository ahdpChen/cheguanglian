let host = 'http://www.cheguanglian-test.com'
console.log(process.env.NODE_ENV)
if (process.env.NODE_ENV === 'production') {
  host = 'http://www.cheguanglian.com'
}
const appid = 'wx641d418964519abb'
const appKey = ''
const config = {
  host,
  appid,
  appKey
}
export default config
