/** josn2Form */
const json2Form = (json) => {
  var str = []
  for (var p in json) {
    str.push(encodeURIComponent(p) + '=' + encodeURIComponent(json[p]))
  }
  return str.join('&')
}

/** 金额格式化 */
const formatNumberWithComma = function (val) {
  // 金额转换 元 保留2位小数 并每隔3位用逗号分开 1,234.56
  var type = typeof val

  if (type === 'number') {
    var str = val.toFixed(2) + ''
    var intSum = str.substring(0, str.indexOf('.')).replace(/\B(?=(?:\d{3})+$)/g, ',')// 取到整数部分
    var dot = str.substring(str.length, str.indexOf('.'))// 取到小数部分搜索
    var ret = intSum + dot
    return ret
  } else {
    return val
  }
}

export default {
  json2Form,
  formatNumberWithComma
}
