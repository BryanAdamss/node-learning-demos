const connect = require('connect')

const app = connect()
  .use(connect.bodyParser())
  .use(connect.cookieParser('secret'))
  .use(connect.session())
  .use(connect.csrf()) // 需要在bodyParser、session之后调用
  .listen(3000)
