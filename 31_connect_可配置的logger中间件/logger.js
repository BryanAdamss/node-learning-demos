function setup({ format = ':method :url' } = {}) {
  const regexp = /:(\w+)/g // 提取关键字
  return function logger(req, res, next) {
    const str = format.replace(regexp, (match, property) => req[property]) // 替换
    console.log(str)
    next()
  }
}

module.exports = setup
