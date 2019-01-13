const connect = require('connect')

const url = require('url')

// * 重写请求的url
const rewrite = require('./rewrite.js')

const app = connect()
  .use(rewrite)
  .use(showPost)
  .listen(3000)
