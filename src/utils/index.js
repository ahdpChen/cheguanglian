/** josn2Form */
const json2Form = (json) => {
  var str = []
  for (var p in json) {
    str.push(encodeURIComponent(p) + '=' + encodeURIComponent(json[p]))
  }
  return str.join('&')
}

/** 金额格式化 */
const formatNumberWithComma = (input) => {
  var type = typeof input
  var numStr = 0
  if (type === 'number') {
    numStr = parseInt(input).toString()
  } else if (type === 'string') {
    numStr = input
  } else {
    return
  }
  return numStr.replace(/(?=(?!(\b))(\d{3})+$)/g, ',')
}

export default {
  json2Form,
  formatNumberWithComma
}
