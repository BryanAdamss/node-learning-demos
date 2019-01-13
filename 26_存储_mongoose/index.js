const mongoose = require('mongoose')
const db = mongoose.connect('mongodb://localhost/tasks') // 连接，mongoose.disconnect()关闭

// * 注册schema(可以用来定义数据结构、默认值、处理输入、校验)
const Schema = mongoose.Schema
const Tasks = new Schema({
  project: String,
  description: String
})

mongoose.model('Task', Tasks)

// * 使用schema
const Task = mongoose.model('Task')
const task = new Task()
task.project = 'test'
task.description = 'desc'
task.save(err => {
  if (err) throw err
  console.log('Task saved!')
})

// * 搜索文档
Task.find({ project: 'test' }, (err, tasks) => {
  if (err) throw err
  tasks.forEach(t => console.log(t._id, t._description))
})

// * 更新文档
Task.update(
  { _id: '123123' }, // 使用内部id更新
  { description: 'new desc' },
  { mulit: false }, // 只更新一个文档
  (err, results) => {
    if (err) throw err
    console.log('Updated!')
  }
)

// * 删除文档
Task.findById('jaisdjfioas', (err, task) => {
  task.remove()
})
