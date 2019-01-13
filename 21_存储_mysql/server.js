const http = require('http')

const work = require('./helpers.js')

const mysql = require('mysql')

// * 连接mysql
const db = mysql.createConnection({
  host: '127.0.0.1',
  user: 'root',
  password: '******',
  database: 'timetrack'
})

// * 创建服务器
const server = http.createServer((req, res) => {
  switch (req.method) {
    case 'POST':
      switch (req.url) {
        case '/':
          work.add(db, req, res)
          break
        case '/archive':
          work.archive(db, req, res)
          break
        case '/delete':
          work.delete(db, req, res)
          break
        default:
          break
      }
      break
    case 'GET':
      switch (req.url) {
        case '/':
          work.show(db, res)
          break
        case '/archived':
          work.showArchived(db, res)
        default:
          break
      }
      break

    default:
      break
  }
})

// * 建表
db.query(
  `CREATE TABLE IF NOT EXISTS work (
  id INT(10) NOT NULL AUTO_INCREMENT,
  hours DECIMAL(5,2) DEFAULT 0,
  date DATE,
  archived INT(1) DEFAULT 0,
  description LONGTEXT,
  PRIMARY KEY(id)
  )`,
  err => {
    if (err) throw err
    console.log('服务启动中。。。')
    server.listen(3000, '127.0.0.1')
  }
)
