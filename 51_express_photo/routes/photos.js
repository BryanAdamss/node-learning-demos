var express = require('express')
var router = express.Router()
let photos = []

photos.push({
  name: 'logo'
})

photos.push({
  name: 'logo2'
})

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.render('photos', {
    title: 'photos',
    photos: photos
  })
})

module.exports = router
