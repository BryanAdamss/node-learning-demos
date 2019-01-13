const parse = require('url').parse

module.exports = function route(obj) {
  return function(req, res, next) {
    // * 路由定义中不存在相关方法，直接返回
    if (!obj[req.method]) {
      next()
      return
    }

    const routes = obj[req.method]
    const url = parse(req.url)

    const paths = Object.keys(routes)

    // * 遍历路由，找到匹配的并调用相关处理函数
    for (let i = 0, len = paths.length; i < len; i++) {
      let path = paths[i]
      const fn = routes[path]

      path = path.replace(/\//g, '\\/').replace(/:(\w+)/g, '([^\\/]+)')

      const re = new RegExp(`^${path}$`)

      const captures = url.pathname.match(re)

      if (captures) {
        fn.call(null, req, res, ...captures.slice(1))
        return
      }
    }

    next()
  }
}
