const connect = require('connect')

const app = connect()
  .use((req, res, next) => {
    next(new Error('错误'))
  })
  .use(connect.errorHandler())
  .listen(3000)
