const connect = require('connect')

const bodyParser = require('body-parser') // 使用bodyParser解析用户的输入，为后续中间件提供req.body、req.files；bodyParser即将被遗弃: use individual json/urlencoded middlewares

// eslint-disable-next-line
const app = connect()
  .use(bodyParser())
  .use((req, res, next) => {
    res.end(`new User:${req.body.username}`)
  })
  .listen(3000)
