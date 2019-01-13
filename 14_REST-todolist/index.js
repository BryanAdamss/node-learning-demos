const http = require('http')

const url = require('url') // * 解析url，将url拆分成一个个部分

let items = []

const server = http.createServer((req, res) => {
  switch (req.method) {
    case 'POST':
      let item = ''

      req.setEncoding('utf-8')
      req.on('data', chunk => {
        console.log(chunk)
        item += chunk
      })

      req.on('end', () => {
        items.push(item)
        res.end('OK \n')
      })
      break

    case 'GET':
      // 请求返回中需要设置Content-Length 以提高性能

      const body = items.map((item, i) => `${i}: ${item}`).join('\n')

      // * Content-Length应该是字节长度而不是字符串长度
      // * 获取字节长度使用node自带的Buffer.byteLength方法
      res.setHeader('Content-Length', Buffer.byteLength(body))
      res.setHeader('Content-Type', 'text/plain;charset="utf-8"')

      res.end(body)

      break

    // * 根据索引删除数据项
    case 'DELETE':
      const path = url.parse(req.url).pathname

      // * 截取索引值并转换成Number
      const i = parseInt(path.slice(1), 10)

      if (isNaN(i)) {
        res.statusCode = 400
        res.end('违法item id')
      } else if (!items[i]) {
        res.statusCode = 404
        res.end('item 未找到')
      } else {
        items.splice(i, 1)
        res.end('OK \n')
      }

      break

    default:
      break
  }
})

server.listen(8000)
