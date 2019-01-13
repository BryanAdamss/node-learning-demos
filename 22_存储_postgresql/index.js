const pg = require('pg')

const connectStr = 'tcp://myuser:mypassword@localhost:5432/mydatabase'

const client = new pg.Client(connectStr)

client.connect()

// * 插入
client.query(
  `
  INSERT INTO users (name,age) VALUES ($1,$2)
`,
  ['mike', 39],
  err => {
    if (err) throw err
  }
)

// * 插入后，返回主键，使用RETURNING返回id
client.query(
  `
  INSERT INTO users (name,age) VALUES ($1,$2)
  RETURNING id
`,
  ['mike', 39],
  (err, result) => {
    if (err) throw err
    console.log(`刚刚插入的id为${result.rows[0].id}`)
  }
)

// * 查询
const q = client.query(
  `
  SELECT * FROM users WHERE age > $1
`,
  [40]
)

// * 查询对应事件
q.on('row', row => console.log(row.name))
q.on('data', () => client.end()) // 查询结束
