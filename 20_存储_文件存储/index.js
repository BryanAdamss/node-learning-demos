const fs = require('fs')

const path = require('path')

const args = process.argv.splice(2) // process.argv中保存了进程启动时的命令行参数，[0]是node的路径，[1]是当前执行的js文件的路径，其余参数为额外的命令行参数

const command = args.shift()

const taskDesc = args.join(' ')

const file = path.join(process.cwd(), '/.tasks') // 保存到.tasks文件中

switch (command) {
  case 'list':
    listTasks(file)
    break
  case 'add':
    addTask(file, taskDesc)
    break
  default:
    console.log(`Usage: ${process.agrv[0]} list|add [taskDesc]`)
    break
}

// 加载或初始化任务数组
function loadOrInitializeTaskArray(file, cb) {
  fs.exists(file, exists => {
    let tasks = []
    if (exists) {
      fs.readFile(file, 'utf-8', (err, data) => {
        if (err) throw err
        data = data.toString()
        tasks = JSON.parse(data || '[]')
        cb(tasks)
      })
    } else {
      cb([])
    }
  })
}

function listTasks(file) {
  loadOrInitializeTaskArray(file, tasks => {
    for (let i in tasks) {
      console.log(tasks[i])
    }
  })
}

function storeTasks(file, tasks) {
  fs.writeFile(file, JSON.stringify(tasks), 'utf-8', err => {
    if (err) throw err
    console.log('Saved.')
  })
}

function addTask(file, taskDesc) {
  loadOrInitializeTaskArray(file, tasks => {
    tasks.push(taskDesc)
    storeTasks(file, tasks)
  })
}
