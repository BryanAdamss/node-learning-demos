const fs = require('fs')
const Watcher = require('./Watcher.js')

const watchDir = './watch'
const processedDir = './done'

const watch = new Watcher(watchDir, processedDir)

watch.on('process', file => {
  console.log('接收到process事件', file)

  const watchFile = `${watchDir}/${file}`
  const processedFile = `${processedDir}/${file.toLowerCase()}`

  console.log(`进行重命名并剪切到${processedDir}文件夹中`)
  fs.rename(watchFile, processedFile, err => {
    if (err) throw err
  })
})

watch.start()
