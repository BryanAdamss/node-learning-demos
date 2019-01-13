const http = require('http')
const fs = require('fs')
const path = require('path')
const mime = require('mime')
const chatServer = require('./lib/chat-server')

const test = require('./test/node')
console.log('---------------------', test)

var cache = {}

// * 404
function send404(response) {
  response.writeHead(404, {
    contentType: 'text/plain'
  })

  response.write('Error 404,resource not found.')

  response.end()
}

// * 发送文件
function sendFile(response, filePath, fileContents) {
  response.writeHead(200, {
    'content-type': mime.lookup(path.basename(filePath))
  })
  response.end(fileContents)
}

// * 提供静态文件
function serverStatic(response, cache, absPath) {
  // * 先从缓存取
  if (cache[absPath]) {
    sendFile(response, absPath, cache[absPath])
  } else {
    // * 检查是否存在
    fs.exists(absPath, function(exists) {
      if (exists) {
        fs.readFile(absPath, (err, data) => {
          if (err) send404(response)
          cache[absPath] = data
          sendFile(response, absPath, data)
        })
      } else {
        send404(response)
      }
    })
  }
}

// * 创建服务
const server = http.createServer((request, response) => {
  let filePath = false

  console.log(request.url)
  // * 路径转换
  if (request.url === '/') {
    filePath = 'public/index.html'
  } else {
    filePath = `public${request.url}`
  }

  const absPath = `./${filePath}`
  serverStatic(response, cache, absPath)
})

server.listen(3000, () => {
  console.log(`服务启动在:3000端口`)
})

chatServer.listen(server)
