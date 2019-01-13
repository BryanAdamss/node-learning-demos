const http = require('http')
const formidable = require('formidable')
const url = require('url')

const show = (req, res) => {
  const html = `  
  <form action="/upload" method="post" enctype="multipart/form-data">
    <p><input type="text" name="name" /></p>
    <p><input type="file" name="file" /></p>
    <input type="submit" value="上传" />
  </form>
`

  res.setHeader('Content-Type', 'text/html')
  res.setHeader('Content-Length', Buffer.byteLength(html))

  res.end(html)
}

const upload = (req, res) => {
  if (!isFormData(req)) {
    res.statusCode = 400
    res.end('Bad Request')
    return
  }

  const form = new formidable.IncomingForm()

  // form.on('field', (field, value) => {
  //   console.log(field)
  //   console.log(value)
  // })

  // form.on('file', (name, filed) => {
  //   console.log(name)
  //   console.log(filed)
  // })

  // form.on('end', () => {
  //   res.end('上传完毕')
  // })

  // form.parse(req)

  // * 当向form中传入一个函数，会自动进行上述代码流程
  form.parse(req, (err, fields, files) => {
    console.log(fields)
    console.log(files)
    res.end('上传完毕')
  })

  form.on('progress', (bytesReceived, bytesExpected) => {
    const percent = Math.floor((bytesReceived / bytesExpected) * 100)
    console.log(percent)
  })
}

const isFormData = req => {
  const type = req.headers['content-type'] || ''
  return type.indexOf('multipart/form-data') === 0
}

const server = http.createServer((req, res) => {
  if (req.url === '/') {
    show(req, res)
  } else {
    switch (req.method) {
      case 'GET':
        show(req, res)
        break
      case 'POST':
        upload(req, res)
        break
      default:
        break
    }
  }
})

server.listen(8000)
