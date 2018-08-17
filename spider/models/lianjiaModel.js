var mysqlLib = require('../utils/mysql');
var mysql = new mysqlLib('lianjia');
var moment = require('moment');

class LianjiaModel {
  /**
   * upinser second house base info
   */
  addHouseInfo (info = {}, callback) {
    if (info.houseCode !== undefined) {
      this.checkHouseExist(info.houseId, function (err, result) {
        if (result === 0) {
          const current = moment().format('YYYY-MM-DD HH:mm:ss')
          let sql = 'INSERT INTO House (houseCode, houseUrl, houseName, UpdateTime) ' +
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
      const current = moment().format('YYYY-MM-DD HH:mm:ss')
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

  /**
   * 
   * @param {*} houseId
   * @param {*} date
   * @param {*} callback
   */
  checkHousePriceExist (houseId = '', date = '', callback) {
    let sql = 'SELECT ID FROM HousePrice WHERE HouseID = ? AND Date = ?'
    mysql.query(sql, [houseId, date], function(err, rows, fields) {
      callback(err, rows.length)
    })
  }

  /**
   *  get house that need detail infos
   * @param {*} page 
   * @param {*} callback 
   */
  getHouseNeedDetails(page = 0, callback) {
    const from = page * 500;
    const sql = 'SELECT HouseID,HouseURL FROM HouseDetail ORDER BY ID DESC LIMIT ?,?'
    mysql.query(sql, [from, 500], function(err, rows, fields) {
      callback(err, rows)
    })
  }
}

module.exports = exports = new LianjiaModel()