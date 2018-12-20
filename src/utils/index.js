/** josn2Form */
const json2Form = (json) => {
  var str = []
  for (var p in json) {
    str.push(encodeURIComponent(p) + '=' + encodeURIComponent(json[p]))
  }
  return str.join('&')
}

export default {
  json2Form
}
