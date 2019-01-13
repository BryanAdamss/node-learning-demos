// 默认form 只支持GET、POST请求，不支持其他请求方法
// 需要在form中添加一个type为hidden的input 指明其value为需要使用的http请求方法，例如PUT
// 服务端检查对应值并假装它就是这个请求的请求方法
// methodOverride就是干这个的
const connect = require('connect')

const edit = (req, res, next) => {
  if (req.method !== 'GET') return next()

  res.setHeader('Content-Type', 'text/html')

  res.write('<form method="post"')

  res.write('<input type="hidden" name="_method" value="put" />') // methodOverride会找到name是_method的表单并用其value做为请求的请求方法

  res.write('<input type="text" name="user[name]" value="cgh" />')

  res.write('<input type="submit" value="Update" />')

  res.write('</form>')

  res.end()
}

const update = (req, res, next) => {
  if (req.method !== 'PUT') return next()

  res.end(`更新名字为：${req.body.user.name}`)
}

const app = connect()
  .use(connect.logger())
  .use(connect.bodyParser())
  .use(connect.methodOverride())
  .use(edit)
  .use(update)
  .listen(3000)
