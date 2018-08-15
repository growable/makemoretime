var moment = require('moment')
var mongoUtils = require('../utils/mongo')

class LianjiaMongoModel {
  constructor() {
    this.indexName = 'Lianjia'
  }

  /**
   * 删除城市信息
   * @param {*} callback 
   */
  deleteCities(callback) {
    mongoUtils.delete(this.indexName, 'City', {}, function (err, result) {
      callback(err, result)
    })
  }

  /**
   * 检查城市信息是否存在
   * @param {*} cityName 
   * @param {*} callback 
   */
  checkCityExist(cityName = '', callback) {
    mongoUtils.find(this.indexName, 'City', {'cityName': cityName}, {}, function (err, result) {
      callback(err, result)
    })
  }

  /**
   * 新增城市信息
   * @param {*} cityName 
   * @param {*} cityUrl 
   * @param {*} callback 
   */
  addCityInfo(cityInfo = {}, callback) {
    const info = [{
      'cityName': cityInfo.cityName || '',
      'cityUrl': cityInfo.cityUrl || '',
      'createTime': moment().format('YYYY-MM-DD HH:mm:ss'),
      'updateTime': moment().format('YYYY-MM-DD HH:mm:ss')
    }]
    mongoUtils.insert(this.indexName, 'City', info, function(err, result) {
      callback(err, result)
    })
  }

  /**
   * 获取城市信息
   * @param {*} params
   * @param {*} callback
   */
  getCitiesInfo(params, callback) {
    mongoUtils.find(this.indexName, 'City', params, {}, function (err, result) {
      callback(err, result)
    })
  }

  /**
   * check house exist
   * @param {*} houseCode 
   * @param {*} callback 
   */
  checkHouseExist(houseCode = '', callback) {
    mongoUtils.find(this.indexName, 'House', {'houseCode': houseCode}, {}, function (err, result) {
      callback(err, result)
    })
  }

  /**
   * add house info
   * @param {*} houseInfo 
   * @param {*} callback 
   */
  addHouseInfo (houseInfo = {}, callback) {
    mongoUtils.insert(this.indexName, 'House', [houseInfo], function (err, result) {
      callback(err, result)
    })
  }

  /**
   * check house date price exist
   * @param {*} houseCode 
   * @param {*} date 
   * @param {*} callback 
   */
  checkHouseDayPriceExist(houseCode = '', date = '', callback) {
    mongoUtils.find(this.indexName, 'HousePrice', {'houseCode': houseCode, 'date': date}, {}, function (err, result) {
      callback(err, result)
    })
  }

  /**
   * add house date price info
   * @param {*} housePriceInfo 
   * @param {*} callback 
   */
  addHousePriceInfo (housePriceInfo = {}, callback) {
    mongoUtils.insert(this.indexName, 'HousePrice', [housePriceInfo], function (err, result) {
      callback(err, result)
    })
  }
}

module.exports = exports = new LianjiaMongoModel()