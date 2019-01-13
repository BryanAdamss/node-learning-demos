const connect = require('connect')
const cookieParser = require('cookie-parser')

const app = connect()
  .use(cookieParser('keyborard cat'))
  .use(connect.session())
  .use((req, res, next) => {
    const sess = req.session
    if (sess.views) {
      res.setHeader('Content-Type', 'text/html')
      res.write(`<p>Views:${sess.views}</p>`)
      res.end()

      sess.views++
    } else {
      sess.views = 1
      res.end(`请刷新页面`)
    }
  })
  .listen(3000)
