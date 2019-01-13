const connect = require('connect')

const app = connect()
  .use(connect.directory('public'))
  .use(connect.static('public'))
  .listen(3000)
