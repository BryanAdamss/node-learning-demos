module.exports = (req, res, next) => {
  const path = url.parse(req.url).pathname
  const match = path.match(/^\/blog\/posts\/(.+)/g)
  if (!match) next()

  findPostIdBySlug(match[1], (err, id) => {
    if (err) return next(err)
    if (!id) return next(new Error('未找到对应user'))
    req.url = `/blog/posts/${id}`
    next()
  })
}
