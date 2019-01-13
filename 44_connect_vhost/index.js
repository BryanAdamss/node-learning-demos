// 将请求转发到运行在不同端口的本地服务器上
const connect = require('connect')
const fs = require('fs')

const app = connect()
const sites = fs.readdirSync('sources/sites') // 读取本地映射表

sites.forEach(site => {
  app.use(connect.vhost(site, require(`./sites/${site}`)))
})
