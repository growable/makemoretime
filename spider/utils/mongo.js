/**
 * mongo 操作utils
 */
var mongodb = require('mongodb').MongoClient
var assert = require('assert')
var config = require('../../app.config')

class MongoUtils {

  /**
   * 
   * @param {*} indexName 
   */
  setIndex (indexName = '') {
    this.mongoPool = config.mongo
    this.indexName = indexName
  }

  /**
   * 查找数据
   * @param {*} table 
   * @param {*} params 
   * @param {*} callback 
   */
  find (indexName = '', table = '', params = {}, fields = {}, callback) {
    mongodb.connect(config.mongo, function (err, client) {
      if (err) {
        callback(null, {})
        return
      }
      const db = client.db(indexName)
      db.collection(table).find(params, fields).toArray(function (err, result) {
        // assert.equal(null, err)
        callback(err, result)
      })
    })
  }

  /**
   *新增
   * @param {*} table 
   * @param {*} params 
   * @param {*} callback 
   */
  insert (indexName = '', table = '', params = [], callback) {
    mongodb.connect(config.mongo, function (err, client) {
      // assert.equal(null, err)
      if (err) {
        callback(null, {})
        return
      }
      const db = client.db(indexName)
      db.collection(table).insertMany(params, function (err, result) {
        callback(err, result)
      })
    })
  }

  update(indexName = '', table = '', where = {}, params = [], callback) {
    mongodb.connect(config.mongo, function (err, client) {
      // assert.equal(null, err)
      if (err) {
        callback(null, {})
        return
      }
      const db = client.db(indexName)
      db.collection(table).updateOne(where, {$set: params}, function (err, result) {
        callback(err, result)
      })
    })
  }

  /**
   * 删除
   * @param {*} table 
   * @param {*} params 
   * @param {*} callback 
   */
  delete (indexName = '', table = '', params = [], callback) {
    mongodb.connect(config.mongo, function (err, client) {
      // assert.equal(null, err)
      if (err) {
        callback(null, {})
        return
      }
      const db = client.db(indexName)
      db.collection(table).deleteOne(params, function (err, result) {
        callback(err, result)
      })
    })
  }
}

module.exports = exports = new MongoUtils()