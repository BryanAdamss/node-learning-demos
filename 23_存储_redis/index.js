const redis = require('redis')

const client = redis.createClient(6379, '127.0.0.1') // 端口6379

// * 错误处理
client.on('error', err => console.log(`error:${err}`))

// * 设置及获取
client.set('color', 'red', redis.print) // print输出操作的结果或错误
client.get('color', (err, value) => {
  if (err) throw err
  console.log(`got:${value}`)
})

// * redis提供了哈希表结构
// * 设置:hmset
// * 获取:hget
// * 返回keys:hkeys 数组,可forEach
client.hmset(
  'hmaping',
  {
    test1: 'test1value',
    test2: 'test2value'
  },
  redis.print
)

client.hget('hmaping', 'test1', (err, value) => {
  if (err) throw err
  console.log(value)
})

client.hkeys('hmaping', (err, keys) => {
  if (err) throw err
  keys.forEach(key => console.log(key))
})

// * redis提供链表数据结构
client.lpush('tasks', 'red', redis.print) // 添加数据
client.lpush('tasks', 'blue', redis.print)
client.lrange('tasks', 0, -1, (err, items) => {
  // 获取指定范围的数据，[start,end) end为-1代表最后一个元素
  if (err) throw err

  items.forEach(item => console.log(item))
})

// * redis提供集合数据结构
// * 集合中重复值会被忽略
client.sadd('ip', '1.2.3.4', redis.print)
client.sadd('ip', '1.2.3.4', redis.print) // 被忽略
client.smembers('ip', (err, members) => {
  if (err) throw err
  console.log(members)
})
