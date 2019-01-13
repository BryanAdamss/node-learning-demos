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

// * 认证
const restrict = (req, res, next) => {
  const authorization = req.headers.authorization
  if (!authorization) return next(new Error('未授权')) // * next()调用带err时，后续执行的中间件只有错误处理中间件

  const parts = authorization.split(' ')
  const scheme = parts[0]
  const auth = new Buffer(parts[1], 'base64').toString().split(':')
  const user = auth[0]
  const pass = auth[1]

  // * 在数据库中比对user及pass
  authenticateWithDatabase(user, pass, err => {
    if (err) return next(err)

    next()
  })
}

// * 展示admin面板
const admin = (req, res, next) => {
  switch (req.url) {
    case '/':
      res.end('try /users')
      break
    case '/users':
      res.setHeader('Content-Type', 'application/json')
      res.end(JSON.stringify(['test1', 'test2', 'test3']))
      break
    default:
      break
  }
}

app
  .use(logger)
  .use('/admin', restrict) // restrict中间件只针对路径前缀是/admin的请求生效，针对试图访问/admin的用户进行认证鉴权
  .use('/admin', admin) // admin中间件只针对路径前缀是/admin的请求生效，认证通过后，展示admin面板
  .use(hello) // hello仍旧对所有请求都生效
  .listen(3000)
