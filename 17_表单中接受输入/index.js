const http = require('http')
const qs = require('querystring')

let items = []

const show = res => {
  const html = `
  <!DOCTYPE html>
  <html>
    <head>
      <meta charset="utf-8" />
      <meta http-equiv="X-UA-Compatible" content="IE=edge" />
      <title>Page Title</title>
      <meta name="viewport" content="width=device-width, initial-scale=1" />
    </head>
    <body>
      <h1>Todo List</h1>
      <ul>
      ${items.map(item => `<li>${item}</li>`).join('')}
      </ul>
      <form action="/" method="post">
        <p><input type="text" name="item" /></p>
        <p><input type="submit" value="添加" /></p>
      </form>
    </body>
  </html>
    `

  res.statusCode = 200
  res.setHeader('Content-Type', 'text/html')
  res.setHeader('Content-Length', Buffer.byteLength(html))

  res.end(html)
}

const notFound = res => {
  res.statusCode = 404
  res.setHeader('Content-Type', 'text/plain')
  res.end('Not Found')
}

const add = (req, res) => {
  let body = ''
  req.setEncoding('utf-8')
  req.on('data', chunk => {
    body += chunk
  })

  req.on('end', () => {
    const obj = qs.parse(body)
    items.push(obj.item)
    show(res)
  })
}

const badRequest = res => {
  res.statusCode = 400
  res.setHeader('Content-Type', 'text/plain')
  res.end('Bad Request')
}

const server = http.createServer((req, res) => {
  if (req.url === '/') {
    switch (req.method) {
      case 'GET':
        show(res)
        break

      case 'POST':
        add(req, res)
        break

      default:
        badRequest(res)
        break
    }
  } else {
    notFound(res)
  }
})
server.listen(8000)
