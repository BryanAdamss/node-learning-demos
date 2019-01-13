const connect = require('connect')

const app = connect()
  .use('/app/files', connect.static('public')) // static路径是相对当前目录的；针对/app/files的请求提供./public文件夹中的静态文件
  .listen(3000)
