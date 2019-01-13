const http = require('http')

const fs = require('fs')

const getTitle = res => {
  fs.readFile('./title.json', (err, data) => {
    if (err) return handleError(err, res)
    getTemplate(JSON.parse(data.toString()), res)
  })
}

const getTemplate = (titles, res) => {
  fs.readFile('./template.html', (err, data) => {
    if (err) return handleError(err, res)
    formatHtml(titles, data.toString(), res)
  })
}

const formatHtml = (titles, tmpl, res) => {
  const html = tmpl.replace('%', titles.join('</li><li>'))
  res.writeHead(200, { 'Content-Type': 'text/html' })
  res.end(html)
}

const handleError = (err, res) => {
  console.err(err)
  res.end('Server Error')
}

const server = http.createServer((req, res) => {
  if (req.url == '/') {
    getTitle(res)
  }
})

console.log('server listen at 127.0.0.1:8000')
server.listen(8000, '127.0.0.1')
