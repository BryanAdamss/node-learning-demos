const connect = require('connect')

const logger = require('./logger')

const hello = (req, res, next) => {
  res.setHeader('Content-Type', 'text/plain')
  res.end('hello world') // 调用end就可以不调用next
}

const app = connect()
  .use(logger(':method :url'))
  .use(hello)
  .listen(3000)
