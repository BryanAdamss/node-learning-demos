// * connect已经不提供自带的中间件，需要手动安装
// * connect.cookieParser已经无法使用
const connect = require('connect')

const cookieParser = require('cookie-parser')

const COOKIE_KEY = 'I am a key' // 做为签名cookie的加密密钥

const app = connect()
  .use(cookieParser(COOKIE_KEY)) // cookieParser为后续中间件提供req.cookies和req.signedCookies
  .use((req, res, next) => {
    console.log(req.cookies) // 请求带回的cookies
    console.log(req.signedCookies) // 请求带回的签名cookies

    // * 设置出站cookie
    res.setHeader('Set-Cookie', 'foo=bar')
    res.setHeader(
      'Set-Cookie',
      'test=cgh;Expires=Tue, 08 Jun 2021 10:18:14 GMT'
    )

    res.end('hello\n')
  })
  .listen(3000)
