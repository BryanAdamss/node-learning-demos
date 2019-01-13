const express = require('express')
const app = express()
const articles = [
  {
    title: 'Example'
  }
]

const bodyParser = require('body-parser')

// * 加载数据库模块
const Article = require('./db.js').Article

// * 解析网页正文模块
const read = require('node-readability')

app.set('port', process.env.PORT || 3000)

// * 支持编码为JSON的请求消息体
app.use(bodyParser.json())

// * 支持表单编码消息体解析
app.use(
  bodyParser.urlencoded({
    extended: true
  })
)

// * 静态资源
app.use(
  '/css/bootstrap.css',
  express.static('node_modules/bootstrap/dist/css/bootstrap.css')
)

app.get('/articles', (req, res, next) => {
  Article.all((err, articles) => {
    if (err) return next(err)
    res.send(articles)
  })
})

app.get('/articles/:id', (req, res, next) => {
  const id = req.params.id
  Article.find(id, (err, article) => {
    if (err) return next(err)
    res.send(article)
  })
})

app.post('/articles', (req, res, next) => {
  const url = req.body.url
  // * 读取url并从url中获取正文，然后将其保存到数据库中
  read(url, (err, result) => {
    if (err || !result) res.status(500).send('无法下载文章')

    Article.create(
      {
        title: result.title,
        content: result.content
      },
      (err, article) => {
        if (err) return next(err)
        res.send('ok')
      }
    )
  })
})

app.delete('/artices/:id', (req, res, next) => {
  const id = req.params.id
  console.log(`删除${id}中`)

  Article.delete(id, err => {
    if (err) return next(err)
    res.send({
      message: '已经删除'
    })
  })
})

app.listen(app.get('port'), () => {
  console.log(`服务启动在${app.get('port')}上`)
})

module.exports = app
