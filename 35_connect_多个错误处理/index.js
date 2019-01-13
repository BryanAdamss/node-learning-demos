const connect = require('connect')

const hello = (req, res, next) => {
  if (req.url.match(/^\/hello/)) {
    res.end('hello world')
  } else {
    next()
  }
}

const db = {
  users: [{ name: 'test1' }, { name: 'test2' }, { name: 'test3' }]
}

const users = (req, res, next) => {
  const match = req.url.match(/^\/user\/(.+)/)
  if (match) {
    const user = db.users[match[1]]
    if (user) {
      res.setHeader('Content-Type', 'application/json')
      res.end(JSON.stringify(user))
    } else {
      const err = new Error('User Not Found')
      err.notFound = true
      next(err)
    }
  } else {
    next()
  }
}

const pets = (req, res, next) => {
  if (req.url.match(/^\/pets\/(.+)/)) {
    foo() // 故意抛出一个错误
  } else {
    next()
  }
}

const errorHandler = (err, req, res, next) => {
  console.error(err)
  res.setHeader('Content-Type', 'application/json')
  if (err.notFound) {
    res.statusCode = 404
    res.end(JSON.stringify({ error: err.message }))
  } else {
    res.statusCode = 500
    res.end(
      JSON.stringify({
        error: 'Internal Server Error'
      })
    )
  }
}

const errorPage = (err, req, res, next) => {
  const env = process.env.NODE_ENV || 'development'

  console.log(err)
  res.statusCode = 500
  switch (env) {
    // * 开发环境返回一个json
    case 'development':
      res.setHeader('Content-Type', 'application/json')
      res.end(JSON.stringify(err))
      break
    default:
      // * 生产环境直接提示服务器内部错误
      res.end('Server error')
      break
  }
}

const api = connect()
  .use(users)
  .use(pets)
  .use(errorHandler)

const app = connect()
  .use(hello)
  .use('/api', api) // 针对/api路径挂载api中间件
  .use(errorPage) // 由于api的errorHandler没有继续抛出错误，所以errorPage只能处理hello中抛出的错误
  .listen(3000)
