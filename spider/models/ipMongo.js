var moment = require('moment')
var mongoUtils = require('../utils/mongo')
mongoUtils.setIndex('IP')

class IPMongoModel {
  constructor() {
    this.indexName = 'IP'
  }
  
  /**
   * 新增、更新ip信息
   * @param {*} ipInfo 
   * @param {*} callback 
   */
  upInsertIP(ipInfo = {}, source = '', callback) {
    const port = ipInfo.port;
    const addr = ipInfo.addr;
    const type = ipInfo.type;
    const ip = ipInfo.ip;
    const currTime = moment().format('YYYY-MM-DD HH:mm:ss')
    const _this = this

    mongoUtils.find(this.indexName, 'Pool', {'IP': ip}, {}, function (err, result) {
      if (result.length > 0) {
        mongoUtils.update(_this.indexName, 'Pool', {'IP': ip}, {
          'Port': port,
          'Address': addr,
          'Type': type,
          'Source': source,
          'CanUse': 0,
          'UpdateTime': currTime
        }, function (err, result) {
          callback(err, result)
        })
      } else {
        mongoUtils.insert(_this.indexName, 'Pool', [{
          'IP': ip,
          'Port': port,
          'Address': addr,
          'Type': type,
          'CanUse': 0,
          'AddTime': currTime,
          'UpdateTime': currTime
        }], function (err, result) {
          callback(err, result)
        })
      }
    })
  }

  /**
   * 更改IP状态
   * @param {*} id 
   * @param {*} status 
   * @param {*} callback 
   */
  updateIPStatus (id = '', status = 0, callback) {
    mongoUtils.update(this.indexName, 'Pool', { '_id': id }, {
      'CanUse': status
    }, function (err, result) {
      callback(err, result)
    })
  }

  /**
   * 获取需要验证的IP
   * @param {*} callback 
   */
  getIPNeedCheck (callback) {
    const currTime = moment().subtract(2, 'day').format('YYYY-MM-DD')
    mongoUtils.find(this.indexName, 'Pool', {'UpdateTime': {$gt: currTime}}, {}, function (err, result) {
      callback(err, result)
    })
  }

  /**
   * get the ips can use
   * @param {*} callback 
   */
  getCanUseIps(callback) {
    mongoUtils.find(this.indexName, 'Pool', {'CanUse': 1}, {IP: 1, Port: 1}, function (err, result) {
      callback(err, result)
    })
  }
}

module.exports = exports = new IPMongoModel()