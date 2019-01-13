const qs = require('querystring')

// * 发送响应
module.exports.sendHtml = (res, html) => {
  res.setHeader('Content-Type', 'text/html;charset=utf8')
  res.setHeader('Content-Length', Buffer.byteLength(html))
  res.end(html)
}

// * 解析post数据
module.exports.parseReceivedData = (req, cb) => {
  let body = ''
  req.setEncoding('utf-8')
  req.on('data', chunk => {
    body += chunk
  })
  req.on('end', () => {
    const data = qs.parse(body)
    cb(data)
  })
}

// * 渲染表单
module.exports.actionForm = (id, path, label) => {
  return `<form method="POST" action=${path}>
  <input type="hidden" name="id" value="${id}"/>
  <input type="submit" value="${label}"/>
  </form>`
}

// * 添加
module.exports.add = (db, req, res) => {
  module.exports.parseReceivedData(req, work => {
    // * 添加工作记录
    db.query(
      `
      INSERT INTO work(hours,date,description) VALUES(?,?,?)
      `,
      [work.hours, work.date, work.description], // * ?的占位符
      err => {
        // 回调
        if (err) throw err
        // * 成功则展示
        module.exports.show(db, res)
      }
    )
  })
}

// * 删除
module.exports.delete = (db, req, res) => {
  module.exports.parseReceivedData(req, work => {
    db.query(
      `
      DELETE FROM work where id=?
    `,
      [work.id],
      err => {
        if (err) throw err
        module.exports.show(db, res)
      }
    )
  })
}

// * 归档
module.exports.archive = (db, req, res) => {
  module.exports.parseReceivedData(req, work => {
    db.query(
      `
      UPDATE work SET archived=1 WHERE id=?
    `,
      [work.id],
      err => {
        if (err) throw err
        module.exports.show(db, res)
      }
    )
  })
}

// * 获取
module.exports.show = (db, res, showArchived) => {
  const query = `
    SELECT * FROM work WHERE archived=? ORDER BY date DESC
  `
  const archiveValue = showArchived ? 1 : 0

  db.query(query, [archiveValue], (err, rows) => {
    if (err) throw err

    let html = showArchived
      ? ''
      : `
    <a href="/archived">归档</a>
    `

    html += module.exports.workHitlistHtml(rows) // * 将数据格式化成表格
    html += module.exports.workFormHtml()

    module.exports.sendHtml(res, html)
  })
}

// * 显示归档
module.exports.showArchived = (db, res) => {
  module.exports.show(db, res, true)
}

// * 渲染html表格
module.exports.workHitlistHtml = rows => {
  let html = '<table>'

  for (let i in rows) {
    html += '<tr>'
    html += `<td>${rows[i].date}</td>`
    html += `<td>${rows[i].hours}</td>`
    html += `<td>${rows[i].description}</td>`
    // * 显示归档按钮
    if (!rows[i].archived) {
      html += `<td>${module.exports.workArchiveForm(rows[i].id)}</td>`
    }
    html += `<td>${module.exports.workDeleteForm(rows[i].id)}</td>`
    html += '</tr>'
  }
  html += '</table>'

  return html
}

// * 渲染表单
module.exports.workFormHtml = () => {
  const html = `
    <form method="POST" action="/">
    <p>Date (YYYY-MM-DD):<br/> <input name="date" type="text"/></p>
    <p>Hours worked:<br/> <input name="hours" type="text"/></p>
    <p>Description:<br/> <textarea name="description"></textarea></p>
    <input type="submit" value="Add"/>
    </form>
  `
  return html
}

// * 渲染归档按钮表单
module.exports.workArchiveForm = id => {
  return module.exports.actionForm(id, '/archive', 'Archive')
}

// * 渲染删除按钮表单
module.exports.workDeleteForm = id => {
  return module.exports.actionForm(id, '/delete', 'Delete')
}
