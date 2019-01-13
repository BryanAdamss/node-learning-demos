const mongodb = require('mongodb')

const server = new mongodb.Server('127.0.0.1', 27017, {})

const client = new mongodb.Db('mydatabase', server, { w: 1 })

client.prependOnceListener(err => {
  if (err) throw err
  client.collection('test_insert', (err, collection) => {
    if (err) throw err
    console.log('可以执行查询了')
    // * 插入
    collection.insert(
      {
        title: 'hi',
        body: 'goo'
      },
      { safe: true }, // safe:true表示，数据库操作应该在回调执行之前完成；如果回调不依赖数据库返回数据，可以传{}
      (err, documents) => {
        if (err) throw err
        console.log(`文档id为${documents[0]._id}`)
      }
    )
    // * 更新
    const _id = new client.bson_serializer.ObjectID('ji12o3jio123jiojdsiofj')

    collection.update(
      {
        _id
      },
      {
        $set: {
          title: 'test2'
        }
      },
      { safe: true },
      err => {
        if (err) throw err
      }
    )

    // * 搜索
    collection.find({ title: 'test' }).toArray((err, results) => {
      if (err) throw err
      console.log(results)
    })

    // * 删除文档
    const _newId = new client.bson_serializer.ObjectID('12j3i1j23ij123io')
    collection.remove(
      {
        _id: _newId
      },
      {
        safe: true
      },
      err => {
        if (err) throw err
      }
    )
  })
})
