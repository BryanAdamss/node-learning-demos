const net = require('net')
const redis = require('redis')

const server = net.createServer(socket => {
  let subscriber
  let publisher
  socket.on('connect', () => {
    subscriber = redis.createClient() // 为用户创建预定客户端
    subscriber.subscribe('main_chat_room') // 预定channel
    subscriber.on('message', (channel, message) => {
      // 信道收到信息后将它发送给用户
      socket.write(`Channel ${channel}:${message}`)
    })
    publisher = redis.createClient() // 为用户创建发布客户端
  })

  socket.on('data', data => {
    // socket接收到消息后，利用redis发布他们
    publisher.publish('main_chat_room', data) // 用户输入信息后发布它
  })

  socket.on('end', () => {
    subscriber.unsubscribe('main_chat_room')
    subscriber.end()
    publisher.end()
  })
})

server.listen(3000)

// ! 将redis部署到线上时，可以使用hiredis使redis性能最大化
