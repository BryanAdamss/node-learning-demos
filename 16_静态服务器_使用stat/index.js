const http = require('http')
const fs = require('fs')
const parse = require('url').parse
const join = require('path').join

const root = __dirname

const server = http.createServer((req, res) => {
  const url = parse(req.url)
  const path = join(root, url.pathname)

  fs.stat(path, (err, stat) => {
    if (err) {
      // * 文件不存在
      if (err.code === 'ENOENT') {
        res.statusCode = 404
        res.end('文件未找到')
      } else {
        // * 其他错误
        res.statusCode = 500
        res.end('服务器内部错误')
      }
    } else {
      // * 创建流并返回相关数据
      const stream = fs.createReadStream(path)
      res.setHeader('Content-Length', stat.size)
      stream.pipe(res)

      stream.on('error', err => {
        res.statusCode = 500
        res.end('服务器内部错误')
      })
    }
  })
})

server.listen(8000)
