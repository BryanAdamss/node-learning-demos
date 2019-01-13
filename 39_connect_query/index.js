const connect = require('connect')

const app = connect()
  .use(connect.query())
  .use((req, res, next) => {
    res.setHeader('Content-Type', 'application/json')
    res.end(JSON.stringify(req.query))
  })
  .listen(3000, () => {
    console.log('启动在3000')
  })
