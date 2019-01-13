const connect = require('connect')

const app = connect()
  .use(connect.compress()) // 根据请求中的 Accept-Encoding决定是否压缩，如何压缩；一般放在开头
  .use(connect.static('public'))
  .listen(3000)
