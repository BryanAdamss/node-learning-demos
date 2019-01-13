const http = require('http')
const server = http.createServer((req, res) => {
  const body = 'Hello world!1'
  // * 设置响应头
  res.setHeader('Content-Type', 'text/plain')
  res.setHeader('Content-Length', body.length)

  res.end('Hello wrold!')
})

server.listen(3000)
