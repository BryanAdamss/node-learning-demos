const connect = require('connect')
const fs = require('fs')

const log = fs.createWriteStream('/var/log/myapp.log', { flag: 'a' }) // 使用追加模式

const hello = () => {
  console.log('hello')
}

const app = connect()
  .use(
    connect.logger({
      format: ':method :url', // 使用自定义格式
      stream: log, // 使用自定义log
      immediate: true // 收到请求就写日志
    })
  )
  .use(hello)
  .listen(3000)
