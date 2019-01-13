const sqlite3 = require('sqlite3').verbose()
const dbName = 'later.sqlite'
const db = new sqlite3.Database(dbName) // * 创建一个数据库文件

db.serialize(() => {
  // * 创建articles表
  const sql = `
  CREATE TABLE IF NOT EXISTS articles
    (id integer primary key,title,content TEXT)
  `
  db.run(sql)
})

class Article {
  // * 获取所有数据
  static all(cb) {
    db.all('SELECT * FROM articles', cb)
  }

  // * 根据id查找
  static find(id, cb) {
    db.get('SELECT * FROM articles WHERE id = ?', id, cb)
  }

  // * 创建
  static create(data, cb) {
    const sql = 'INSERT INTO articles(title,content) VALUES(?,?)'
    db.run(sql, data.title, data.content, cb)
  }

  // * 删除
  static delete(id, cb) {
    if (!id) return cb(new Error('请提供一个id'))
    db.run('DELETE FROM articles WHERE id= ?', id, cb)
  }
}

module.exports = db
module.exports.Article = Article
