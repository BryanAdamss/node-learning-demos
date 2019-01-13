const connect = require('connect')

const hello = () => {
  console.log('hello')
}

const app = connect()
  .use(connect.logger(':method :url :response-time ms')) // 使用特殊格式
  .use(hello)
  .listen(3000)
