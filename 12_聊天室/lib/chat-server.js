const socketio = require('socket.io')

let io
let guestNumber = 1
let nickNames = {}
let namesUsed = []
let currentRoom = {}

// * 分配用户名
function assignGuestName(socket, guestNumber, nickNames, namesUsed) {
  var name = `Guest${guestNumber}`
  nickNames[socket.id] = name
  socket.emit('nameResult', {
    success: true,
    name
  })
  namesUsed.push(name)
  return guestNumber + 1
}

// * 加入聊天室
function joinRoom(socket, room) {
  // * 加入
  socket.join(room)
  currentRoom[socket.id] = room

  socket.emit('joinResult', {
    room
  })
  console.log('join room', room)
  // * 广播加入信息
  socket.broadcast.to(room).emit('message', {
    text: `${nickNames[socket.id]}加入${room}房间`
  })

  // * 更新聊天列表
  var usersInRoom = io.sockets.clients(room)

  if (usersInRoom.length > 1) {
    var usersInRoomSummary = `${room}房间里有 :`
    for (let index in usersInRoom) {
      const userSocketId = usersInRoom[index].id
      if (userSocketId !== socket.id) {
        if (index > 0) {
          usersInRoomSummary += ', '
        }
        usersInRoomSummary += nickNames[userSocketId]
      }
    }

    usersInRoomSummary += '.'

    socket.emit('message', {
      text: usersInRoomSummary
    })
  }
}

// * 更名
function handleNameChangeAttempts(socket, nickNames, namesUsed) {
  // * 接收客户端派发的nameAttempt事件
  socket.on('nameAttempt', name => {
    if (name.indexOf('Guest') === 0) {
      socket.emit('nameResult', {
        success: false,
        message: '名字不能以"Guest"开头'
      })
    } else {
      if (namesUsed.indexOf(name) === -1) {
        var previousName = nickNames[socket.id]
        var previousNameIndex = namesUsed.indexOf(previousName)

        namesUsed.push(name)
        nickNames[socket.id] = name

        delete namesUsed[previousNameIndex]

        socket.emit('nameResult', {
          success: true,
          name
        })

        socket.broadcast.to(currentRoom[socket.id]).emit('message', {
          text: `${previousName}用户，您已经更名为${name}`
        })
      } else {
        socket.emit('nameResult', {
          success: false,
          message: '名字已经被使用'
        })
      }
    }
  })
}

// * 接收客户端消息
function handleMessageBroadcasting(socket) {
  socket.on('message', message => {
    socket.broadcast.to(message.room).emit('message', {
      text: `${nickNames[socket.id]}:${message.text}`
    })
  })
}

// * 加入/创建房间
function handleRoomJoining(socket) {
  socket.on('join', room => {
    socket.leave(currentRoom[socket.id])
    joinRoom(socket, room.newRoom)
  })
}

// * 断开连接
function handleClientDisconnection(socket) {
  socket.on('disconnect', () => {
    var nameIndex = namesUsed.indexOf(nickNames[socket.id])
    delete namesUsed[nameIndex]
    delete nickNames[socket.id]
  })
}

module.exports.listen = function(server) {
  io = socketio.listen(server)

  io.set('log level', 1)

  io.sockets.on('connection', socket => {
    guestNumber = assignGuestName(socket, guestNumber, nickNames, namesUsed)
    joinRoom(socket, 'Lobby')
    handleMessageBroadcasting(socket, nickNames)
    handleNameChangeAttempts(socket, nickNames, namesUsed)
    handleRoomJoining(socket)

    socket.on('rooms', () => {
      console.log('---------rooms---------')
      socket.emit('rooms', io.sockets.manager.rooms)
    })

    handleClientDisconnection(socket, nickNames, namesUsed)
  })
}
