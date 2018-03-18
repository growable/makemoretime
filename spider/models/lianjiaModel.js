var mysqlLib = require('../utils/mysql');
var mysql = new mysqlLib('lianjia');
var moment = require('moment');

class LianjiaModel {
  /**
   * upinser second house base info
   */
  addHouseInfo (info = {}, callback) {
    if (info.houseId !== undefined) {
      this.checkHouseExist(info.houseId, function (err, result) {
        if (result === 0) {
          const current = moment().format('YYYY-MM-DD HH:mm:SS')
          let sql = 'INSERT INTO HouseDetail (HouseID, HouseURL, HouseName, UpdateTime) ' +
                    ' VALUES (?, ?, ?, ?)'
          mysql.query(sql, [info.houseId, info.url, info.houseName, current], 
            function(err, rows, fields) {
              callback(err, rows)
            })
        } else {
          callback(null, {})
        }
      })
    } else {
      callback(null, {})
    }
  }

  /**
   * add house dayly price
   */
  addHousePrice (house = {}, callback) {
    if (house.houseId !== undefined) {
      const date = moment().format('YYYY-MM-DD');
      const current = moment().format('YYYY-MM-DD HH:mm:SS')
      this.checkHousePriceExist(house.houseId, date, function (err, result) {
        if (result === 0) {
          let sql = 'INSERT INTO HousePrice (HouseID, TotalPrice, Date, UpdateTime) ' +
                    ' VALUES (?, ?, ?, ?)'
          mysql.query(sql, [house.houseId, house.totalPrice, date, current], 
            function(err, rows, fields) {
              callback(err, rows)
            })
        } else {
          callback(null, {})    
        }
      })
    } else {
      callback(null, {})
    }
  }

  /**
   * 
   */
  checkHouseExist (houseId = 0, callback) {
    let sql = 'SELECT ID FROM HouseDetail WHERE HouseID = ?'
    mysql.query(sql, [houseId], function(err, rows, fields) {
      callback(err, rows.length)
    })
  }

  checkHousePriceExist (houseId = '', date = '', callback) {
    let sql = 'SELECT ID FROM HousePrice WHERE HouseID = ? AND Date = ?'
    mysql.query(sql, [houseId, date], function(err, rows, fields) {
      callback(err, rows.length)
    })
  }
}

module.exports = exports = new LianjiaModel()