const fs = require('fs')
const request = require('request')
const htmlparser = require('htmlparser')

const configFileName = './rss_feeds.txt'

// * 检查配置文件存在性
function checkForRSSFile() {
  fs.exists(configFileName, exists => {
    if (!exists) {
      return next(new Error(`没找到配置文件:${configFileName}`))
    }
    next(null, configFileName)
  })
}

// * 读取配置文件
function readRSSFile(configFileName) {
  fs.readFile(configFileName, (err, feedList) => {
    if (err) return next(err)
    feedList = feedList
      .toString()
      .replace(/^\s+|\s+$/g, '')
      .split('\n')

    const random = Math.floor(Math.random() * feedList.length)

    next(null, feedList[random])
  })
}

// * 下载
function downloadRSSFead(feedUrl) {
  request(
    {
      uri: feedUrl
    },
    (err, res, body) => {
      if (err) return next(err)
      if (res.statusCode !== 200) {
        return next(new Error('非正常状态码'))
      }
      next(null, body)
    }
  )
}

// * 解析
function parseRSSFeed(rss) {
  const handler = new htmlparser.RssHandler()
  const parser = new htmlparser.Parser(handler)

  parser.parseComplete(rss)

  if (!handler.dom.items.length) return next(new Error('没有RSS item'))

  const item = handler.dom.items.shift()

  console.log(item.title)
  console.log(item.link)
}

const tasks = [checkForRSSFile, readRSSFile, downloadRSSFead, parseRSSFeed]

function next(err, result) {
  if (err) throw err
  const curTask = tasks.shift()
  if (curTask) {
    curTask(result)
  }
}

next()
