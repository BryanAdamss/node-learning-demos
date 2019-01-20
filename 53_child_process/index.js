const http = require('http')

const cp = require('child_process')

console.log(__filename)

const server = http.createServer((req, res) => {
  const child = cp.fork('./fibonacci.js', [req.url.substring(1)])
  child.on('message', m => {
    res.end(`${m.result}\n`)
  })
})

server.listen(3000)
