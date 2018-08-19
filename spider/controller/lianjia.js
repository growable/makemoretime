// import { resolve } from 'path'
// import { rejects } from 'assert'

var Config = require('../config/spider')
var LianjiaMongo = require('../models/lianjiaMongo.js')
var ipMongo = require('../models/ipMongo')
var Crawler = require("crawler")
var async = require('async')
var redis = require('redis')
var RedisClient = redis.createClient(6379, 'localhost')
var moment = require('moment')

class Lianjia {
  constructor() {
    this.urlList = []
  }

  /**
   * 删除城市信息
   */
  deleteCities() {
    for(let i = 0; i < 355; i++) {
      LianjiaMongo.deleteCities(function(err, result) {
        if (err) {
          console.log('city delete error.')
        } else {
          console.log('cities deleted')
        }
      })
    }
  }

  /**
   * 获取链家所有城市信息
   */
  cityList() {
    var c = new Crawler({
      callback: function (error, res, done) {
        if (error) {
          console.log(error)
        } else {
          let $ = res.$
          // 获取输入的自定义参数并打印。
          let cityLists = $('.all a')

          if (cityLists.length === 0) {
            return
          }
          let cityName = ''
          let cityUrl = ''
          // 保存城市信息
          if (cityLists.length === 0) return

          async.mapLimit(cityLists, 10, function(item, cb) {
            async.waterfall([
              function (cb) {
                cityName = ''
                cityUrl = ''
                // 城市url
                if (item.attribs !== undefined) {
                  cityUrl = item.attribs.href || ''
                }
                // 城市名称
                if (item.children !== undefined) {
                  cityName = item.children[0].data || ''
                }
                cb(null, {'cityName': cityName, 'cityUrl': cityUrl})
              },
              function (cityInfo, cb) {
                LianjiaMongo.checkCityExist(cityInfo.cityName, function (err, result) {
                  const exist = result.length > 0 ? true : false
                  cb(err, {'cityInfo': cityInfo, 'exist': exist})
                })
              },
              function (info, cb) {
                if (!info.exist) {
                  LianjiaMongo.addCityInfo(info.cityInfo, function (err, result) {
                    if (!err) {
                      cb(null, info.cityInfo.cityName)
                    }
                  })
                } else {
                  console.log(info.cityInfo.cityName + ' exist')
                  cb(null, false)
                }
              }
            ], function (err, result) {
              if (!err && result) {
                console.log('add new city' + result)
              }
              cb(null, {})
            })
          }, function (err, result) {
            console.log(111)
            process.exit(1)
          })      
        }
        done()
      }
    })

    c.queue( 'https://www.lianjia.com/' )
  }
  /**
   * 将页面数据放入到redis消息中
   */
  pageListToRedis() {
    // 获取城市信息
    let cityInfo = []
    const priceType = Config.house.lianjia.ershoufang
    async.waterfall([
      // 获取所有城市
      function(cb) {
        LianjiaMongo.getCitiesInfo({}, function(err, result) {
          cb(err, result)
        })
      },
      // 将城市信息拼接URL，放入redis中
      function (citiesInfo, cb) {
        // console.log(citiesInfo)
        let url = ''
        async.mapLimit(citiesInfo, 10, function (item, cb) {
          let suffixStr = ''
          priceType.forEach(function(type, index){
            for(let page = 1; page <= 100; page++) {
              url = item.cityUrl + suffixStr + 'ershoufang/pg' + page + type + '/'
              RedisClient.lpush('cityPageUrls', url)
              console.log('add ' + url + ' to redis message')
            }
          })
          cb(null, {})
        }, function (err, result) {
          console.log('url added to redis message')
          cb(err, result)
        })
      },
      // ip proxy
      function (nothing, cb) {
        ipMongo.getCanUseIps(function (err, result) {
          RedisClient.set('ips', JSON.stringify(result))
          cb(err, {})
        })
      }
    ], function (err, result) {
      if (err) console.log(err)
      console.log('done')
      process.exit(1)
    })
  }
  /**
   * 获取页面数据
   */
  pageList() {
    const _this = this
    async.waterfall([
      function (cb) {
        RedisClient.get('ips', function (err, result) {
          const ips = JSON.parse(result)
          cb(err, ips)
        })
      },
      function (ips, cb) {
        RedisClient.rpop('cityPageUrls', function (err, result) {
          if (result === null) {
            setTimeout(function () {
              console.log('no task')
              _this.pageList()
            }, 2000)
          } else {
            let ipIndex = 0
            ipIndex = parseInt(Math.random() * ips.length)
            // 将任务放入任务表中
            _this.urlList.push({uri: result, ip: ips[ipIndex].IP + ':' + ips[ipIndex].Port})
            // 每次执行5个任务
            if (_this.urlList.length === 5) {
              _this._processingPageData()
              _this.urlList = []
              // process.exit(1)
            }

            _this.pageList()
          }
        })
      }
    ], function (err, result) {
      process.exit(1)
    })
    
  }
  /**
   * 获取页面数据，更新保存页面信息
   */
  _processingPageData() {
    var c = new Crawler({
      callback: function (error, res, done) {
        if (error) {
          console.log(error)
        } else {
          let $ = res.$
          let list = []
          let html = ''
          let tmp = {}
          let lihtml = null
          const today = moment().format('YYYY-MM-DD')

          html = $('.sellListContent li')          
          // 获取html
          async.mapLimit(html, 10, function (item, cb) {
            const time = moment().format('YYYY-MM-DD HH:mm:ss')
            tmp = {}
            tmp._id = moment().valueOf() * 1000 + Math.floor(Math.random(0, 1) * 10000) + ''
            tmp.houseImg = $(item).find('.lj-lazy').attr('src')
            tmp.houseCode = $(item).find('a').attr('data-housecode')
            tmp.houseUrl = $(item).find('a').attr('href')
            tmp.houseTitle = $(item).find('.title').children('a').text()
            tmp.houseXiaoQuCode = $(item).find('.houseInfo').children('a').attr('href')
            tmp.houseInfo = $(item).find('.houseInfo').text()
            tmp.houseFloor = $(item).find('.positionInfo').text()
            tmp.followInfo = $(item).find('.followInfo').text()
            tmp.totalPrice = $(item).find('.totalPrice').children('span').text()
            tmp.unitPrice = $(item).find('.unitPrice').text()
            tmp.updateTime = time

            async.waterfall([
              // check house data wether exist
              function (cb) {
                LianjiaMongo.checkHouseExist(tmp.houseCode, function (err, result) {
                  cb(err, result.length > 0)
                })
              },
              // house info not exist
              function (exist, cb) {
                if (!exist) {
                  LianjiaMongo.addHouseInfo(tmp, function (err, result) {
                    console.log('add new house ')
                    cb(err, result)
                  })
                } else {
                 cb(null, {}) 
                }
              },
              // check daily price exist
              function (info, cb) {
                LianjiaMongo.checkHouseDayPriceExist(tmp.houseCode, today, function (err, result) {
                  cb(err, result.length > 0)
                })
              },
              // add house date prices
              function (exist, cb) {
                if (!exist) {
                  const housePriceInfo = {
                    _id: moment().valueOf() * 1000 + Math.floor(Math.random(0, 1) * 10000) + '',
                    houseCode: tmp.houseCode,
                    housePrice: tmp.totalPrice,
                    date: today,
                    updateTime: time
                  }
                  LianjiaMongo.addHousePriceInfo(housePriceInfo, function (err, result) {
                    console.log('add house day price ')
                    cb(err, result)
                  })
                } else {
                  cb(null, {})  
                }
              }
            ], function (err, result) {
              console.log(time + ': ' + tmp.houseTitle)
              if (err) console.log(err)
              cb (err, result)
            })
          }, function (err, results) {
            console.log('Page Done')
          })
        }
        done()
      }
    })
    c.queue(
      this.urlList
    )
  }
}

module.exports = exports = new Lianjia()