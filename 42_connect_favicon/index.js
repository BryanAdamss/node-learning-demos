const connect = require('connect')
const path = require('path')

const hello = () => {
  console.log('hello')
}

// eslint-disable-next-line
const app = connect()
  .use(connect.favicon(path.join(__dirname, '/public/favicon.ico')))
  .use(connect.logger())
  .use(hello)
  .listen(3000)
