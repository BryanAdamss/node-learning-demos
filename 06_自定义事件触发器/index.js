// * 利用node提供的事件发射器实现一个pub/sub模式(发布/订阅)
const net = require('net')
const events = require('events')

const chanel = new events.EventEmitter()

// * 有新客户端加入
chanel.on('join', function(id, client) {
  // * 保存相关信息
  this.clients[id] = client
  // * 添加订阅者
  this.subscriptions[id] = (senderId, message) => {
    if (id !== senderId) {
      this.clients[id].write(message)
    }
  }

  // * 接收到自定义的广播事件，执行对应的订阅
  this.on('broadcast', this.subscriptions[id])
})

// * chanel监听客户端leave事件，解除相关绑定
chanel.on('leave', function(id) {
  chanel.removeListener('broadcast', this.subscriptions[id])
  chanel.emit('broadcast', id, `${id}离开了聊天室\n`)
})

// * 停止服务
chanel.on('shutdown', () => {
  chanel.emit('broadcast', '', '服务器已经关机\n')
  chanel.removeAllListeners('broadcast')
})

// * 设置最大监听器数量
chanel.setMaxListeners(50)

const server = net.createServer(client => {
  const id = `${client.remoteAddress}:${client.remotePort}`

  // * 派发join事件
  chanel.emit('join', id, client)

  // * 客户端绑定data事件
  client.on('data', data => {
    data = data.toString()

    // * 输入关机命令，关闭服务
    if (data === '关机') {
      chanel.emit('shutdown')
    }

    // * 触发data时派发broadcast事件
    chanel.emit('broadcast', id, data)
  })

  // * 关闭时，派发leave事件
  client.on('close', () => {
    chanel.emit('leave', id)
  })
})

console.log(`服务启动在8888`)
server.listen(8888)
