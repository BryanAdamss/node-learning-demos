module.exports = () => {
  const env = process.env.NODE_ENV || 'development'

  return (err, req, res, next) => {
    console.log(err)
    res.statusCode = 500
    switch (env) {
      // * 开发环境返回一个json
      case 'development':
        res.setHeader('Content-Type', 'application/json')
        res.end(JSON.stringify(err))
        break
      default:
        // * 生产环境直接提示服务器内部错误
        res.end('Server error')
        break
    }
  }
}
