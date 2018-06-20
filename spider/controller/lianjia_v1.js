var config = require('../config/spider')
var async = require('async')
var request = require('../utils/request');
var lianjiaUtils = require('../utils/lianjia')
var lianjiaModel = require('../models/lianjiaModel')

class Lianjia {
  /**
   * init urls
   */
  _init () {
    let urls = []
    const domain = config.house.lianjia.domain
    const city = config.house.lianjia.city
    const houseType = config.house.lianjia.houseType
    const maxPage = config.house.lianjia.maxPage
    let url = ''

    city.forEach(function (cityCode, index) {
      if (config.house.lianjia['ershoufang'] !== undefined) {
        config.house.lianjia['ershoufang'].forEach(function (priceType, index3) {
          for (let page = 1; page < maxPage; page++) {            
            url = cityCode + '.' + domain + '/ershoufang/' +
                  (page === 1 ? '' : 'pg' + page) + priceType
            urls.push(url)
          }
        })
      }
    })
    
    return urls
  }

  /**
   * get page list
   * @param {*} url 
   */
  getHousePageList (url = '') {
    let urls = []

    //set url by Manually
    if (url.length > 0) {
      urls.push(url)
    } else {
      urls = this._init()
    }

    if (urls.length === 0) return    

    // request 10 url every time
    async.each(urls, function (url, cb) {
      async.waterfall([
        function (cb) {
          // request url
          request.get(url, '', 'html', function (err, result) {
            cb(err, result)
          })
        },
        function (html, cb) {
          // filter house urls
          lianjiaUtils.filterHouseListUrls(html.text, function (err, result) {
            cb(err, result)
          })
        },
        function (infos, cb) {
          // upinsert urls to db
          infos.forEach(function(house, index) {
            lianjiaModel.addHouseInfo(house, function (err, result) {
              console.log(house.houseId + '--' + house.houseName)
              if (err) console.log(err)
            })

            lianjiaModel.addHousePrice(house, function (err, result) {

            })
          })
          cb(null, {})
        }
      ], function (err, results) {
        console.log('-------------------')
      })     
    }, function (err) {
      console.log(err)
    })
  }

  /**
   * get second house detail info
   */
  getSecondHouseDetail () {
    for (var i = 0; i < 10000; i++) {
      async.waterfall([
        // get house need to get details
        function(cb) {
          lianjiaModel.getHouseNeedDetails(i, function (err, result) {
            cb(err, result)
          })
        },
        // get house details
        function(urls, cb) {
          if (urls.length === 0) return
          async.mapLimit(urls, 2, function(url, cb) {
            async.waterfall([
              // get house htmls
              function(cb) {
                request.get(url.HouseURL, '', 'html', function (err, result) {
                  cb(err, result)
                })
              },
              // get house details
              function(html, cb) {
                lianjiaUtils.getHouseDetailInfo(html, function (err, result) {
                  cb(err, result)
                })
              }
            ], function (err, results) {
              // save house details
              if (err) console.log(err)
              
            })
            
          })
        }
      ], function (err, results) {
        if (err) {
          console.log('get house urls error' )
          console.log(err)
        } else {
          console.log('---------------------')
        }
      })
    }
  }
}

module.exports = exports = new Lianjia()