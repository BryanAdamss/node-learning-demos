const fs = require('fs')
const events = require('events')

class Watcher extends events.EventEmitter {
  constructor(watchDir, processedDir) {
    super()
    this.watchDir = watchDir
    this.processedDir = processedDir
  }

  watch() {
    fs.readdir(this.watchDir, (err, files) => {
      if (err) throw err
      for (var index in files) {
        console.log('派发process事件')
        this.emit('process', files[index])
      }
    })
  }

  start() {
    console.log(`开始观测${this.watchDir}文件夹变化`)
    fs.watchFile(this.watchDir, () => {
      console.log('目标文件夹发生变化')
      this.watch()
    })
  }
}

module.exports = Watcher
