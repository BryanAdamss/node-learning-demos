// * 内置Node组件会自带一些事件发射器(事件监听吗？)

// * 创建一个echo服务器
// * 通过telnet 127.0.0.1:8888 连接
// * 输入相关信息，服务端接收到相关数据会原样返回
const net = require('net')

const server = net.createServer(socket => {
  socket.on('data', data => {
    socket.write(data)
  })
})

server.listen(8888)
