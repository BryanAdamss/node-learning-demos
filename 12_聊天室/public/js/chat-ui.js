// * 转义用户输入
function divEscapedContentElement(message) {
  return $('<div></div>').text(message)
}

// * 系统消息
function divSystemContentElement(message) {
  return $('<div></div>').html(`<i>${message}</li>`)
}

// * 处理用户输入
function processUserInput(chatApp, socket) {
  var message = $('#send-message').val()
  var systemMessage

  if (message.charAt(0) === '/') {
    systemMessage = chatApp.processCommand(message)
    if (systemMessage) {
      $('#messages').append(divSystemContentElement(systemMessage))
    }
  } else {
    chatApp.sendMessage($('#room').text(), message)
    $('#messages').append(divEscapedContentElement(message))
    $('#messages').scrollTop($('#messages').prop('scrollHeight'))
  }
  $('#send-message').val('')
}

var socket = io.connect()

$(function() {
  var chatApp = new Chat(socket)

  socket.on('nameResult', result => {
    if (result.success) {
      message = `您已经更名为${result.name}`
    } else {
      message = result.message
    }
    $('#messages').append(divSystemContentElement(message))
  })

  socket.on('joinResult', result => {
    $('#room').text(result.room)
    $('#messages').append(divSystemContentElement('换房成功'))
  })

  socket.on('message', message => {
    var newEl = $('<div></div>').text(message.text)
    $('#messages').append(newEl)
  })

  // * 显示可用房间列表
  socket.on('rooms', rooms => {
    console.log('rooms')
    // debugger
    $('#room-list').empty()

    for (let room in rooms) {
      room = room.substring(1, room.length)
      if (room) {
        $('#room-list').append(divEscapedContentElement(room))
      }
    }
    $('#room-list div').click(function() {
      chatApp.processCommand('/join ' + $(this).text())
      $('#send-message').focus()
    })
  })

  setInterval(() => {
    socket.emit('rooms')
  }, 1000)

  $('#send-message').focus()

  $('#send-form').on('submit', function() {
    processUserInput(chatApp, socket)
    return false
  })
})
