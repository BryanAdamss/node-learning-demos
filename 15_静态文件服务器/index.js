const http = require('http')
const parse = require('url').parse
const join = require('path').join
const fs = require('fs')

// * __dirname是node独有的全局变量
// * 它只想当前文件所在目录

const root = __dirname

const server = http.createServer((req, res) => {
  const url = parse(req.url)
  const path = join(root, url.pathname)

  // * 以流形式读取文件并返回
  const stream = fs.createReadStream(path)

  // stream.on('data', chunk => {
  //   res.write(chunk)
  // })

  // stream.on('end', () => res.end())
  // * 可以用流及管道实现上面的读取并返回
  stream.pipe(res) // res.end()会在pipe内部调用

  // * 上面代码未实现错误捕获，导致报错拖垮服务器
  // * 流继承了EventEmitter，所以可以用on('error')监听一些错误
  stream.on('error', err => {
    res.statusCode = 500
    res.end('服务器内部错误')
  })
})

console.log('服务启动在: localhost:8000')

server.listen(8000)
