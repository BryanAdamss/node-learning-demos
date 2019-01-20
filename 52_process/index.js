// 运行 DEBUG=true node index.js
console.log('process.env.DEBUG', process.env.DEBUG)

process.on('exit', () => {
  // 退出事件
  console.log('exit')
})

// 进程被ctrl+c时会派发
process.on('SIGINT', () => {
  console.log('进程被ctrl+c杀掉')
})

process.on('uncaughtException', e => {
  console.error('--未捕获的错误--', e.message)
  process.exit(1)
})

throw new Error('我是一个错误')
