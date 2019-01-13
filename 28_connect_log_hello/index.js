const connect = require('connect')

const app = connect()

const logger = (req, res, next) => {
  console.log('%s %s', req.method, req.url)
  next()
}

const hello = (req, res, next) => {
  res.setHeader('Content-Type', 'text/plain')
  res.end('hello world') // 调用end就可以不调用next
}

app
  .use(logger) // 使用logger中间件
  .use(hello) // 输出hello
  .listen(3000) // 监听3000
