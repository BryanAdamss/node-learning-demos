const connect = require('connect')

const errHandler = require('./errorHandler.js')

const app = connect()
  .use((req, res) => {
    foo() // 未定义，会直接将错误抛给客户端，并以500结束响应
    res.setHeader('Content-Type', 'text/plain')
    res.end('Hello world')
  })
  .use(errHandler())
  .listen(3000)
