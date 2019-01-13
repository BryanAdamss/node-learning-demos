const http = require('http')

let count = 0

const server = http.createServer((req, res) => {
  count++
  res.write(`已经被触发${count}次`)
  res.end()
})

server.listen(8000)
