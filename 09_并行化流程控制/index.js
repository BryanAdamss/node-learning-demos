const fs = require('fs')
const tasks = []
const wordCounts = {}
const fileDir = './text'
let completedTasks = 0

// * 检测是否完成
function checkIfComplete() {
  completedTasks++
  if (completedTasks === tasks.length) {
    for (let index in wordCounts) {
      console.log(`${index}:${wordCounts[index]}`)
    }
  }
}

// * 添加计数
function addWordCount(word) {
  wordCounts[word] = wordCounts[word] ? wordCounts[word] + 1 : 1
}

// * 计算单词数量
function countWordsInText(text) {
  const words = text
    .toString()
    .toLowerCase()
    .split(/\W+/)
    .sort()

  words.filter(word => word).forEach(word => addWordCount(word))
}

// * 目录
fs.readdir(fileDir, (err, files) => {
  if (err) throw err

  files.forEach(file => {
    const task = (file => {
      return () => {
        fs.readFile(file, (err, text) => {
          if (err) throw err

          countWordsInText(text)

          checkIfComplete()
        })
      }
    })(`${fileDir}/${file}`)

    tasks.push(task)
  })

  tasks.forEach(task => task())
})
