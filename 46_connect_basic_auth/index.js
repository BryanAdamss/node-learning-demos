const connect = require('connect')

const users = {
  cgh: '123456'
}

const app = connect()
  .use(
    connect.basicAuth((user, pass) => {
      return users[user] === pass
    })
  )
  .listen(3000)
