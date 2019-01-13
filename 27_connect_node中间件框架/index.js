// * 最小connect程序
const connect = require('connect')

const app = connect() // 创建一个connect裸程序，用来将请求派发给指定的中间件

app.listen(3000)
