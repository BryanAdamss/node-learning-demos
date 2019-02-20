const mongodb = require('mongodb')

const server = new mongodb.Server('127.0.0.1', 27017, {})

// eslint-disable-next-line
const client = new mongodb.Db('photo_app', server, { w: 1 })
