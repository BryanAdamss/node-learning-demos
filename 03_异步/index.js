const http = require('http')

const fs = require('fs')

const server = http.createServer((req, res) => {
  if (req.url == '/') {
    fs.readFile('./title.json', (err, data) => {
      // * Node中的大多数内置模块在使用回调形式时错误总是做为第一个参数被返回，后续的用来放置结果
      if (err) {
        console.error(err)
        res.end('Server Error')
      } else {
        const titles = JSON.parse(data.toString())

        fs.readFile('./template.html', (err, data) => {
          if (err) {
            console.error(err)
            res.end('Server Error')
          } else {
            const tmpl = data.toString()

            const html = tmpl.replace('%', titles.join('</li><li>'))
            res.writeHead(200, { 'Content-Type': 'text/html' })

            res.end(html)
          }
        })
      }
    })
  }
})

console.log('server listen at 127.0.0.1:8000')
server.listen(8000, '127.0.0.1')
