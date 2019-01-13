const connect = require('connect')

const hello = () => {
  console.log('hello')
}

// eslint-disable-next-line
const app = connect()
  .use(connect.limit('32kb'))
  .use(connect.bodyParser())
  .use(hello)
  .listen(3000, () => {
    console.log('启动在3000')
  })
