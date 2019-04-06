const LianjiaModel = require('../models/lianjia_model');
const Crawler = require('../utils/crawler');
const Parse = require('../utils/lianjia_parse');
// const Redis = require('../utils/redis');
// const redis = require('redis');
// const RedisClient = redis.createClient(6379, 'localhost');
const ConfigLJ = require('../config/lianjia_config');
const tUtils = require('../utils/tools');
const async = require('async');
const moment = require('moment');
const _ = require('lodash');
const fs = require('fs');

/**
 * 获取城市列表信息
 */
exports.city = async function (params = {}, callback) {
  const cityList = await LianjiaModel.getCityList();
  console.log('start get city detail');
  await async.mapLimit(cityList, 1, function (city, cb) {
    async.waterfall([
      // 获取页面内容
      function (cb) {
        // console.log(city.cityUrl + 'ershoufang/')
        Crawler.get({ url: city.cityUrl + 'ershoufang/' }, cb);
        // fs.readFile('./文件.txt', 'utf8', cb);
      },
      // 解析页面内容
      function (pageContent, cb) {
        Parse.cityZone(pageContent, cb);
      },
      // 保存zone信息
      function (zoneList, cb) {
        saveCityZone(zoneList, city.cityName, cb);
      }
    ], function (err, result) {
      if (err) {
        console.log(err);
      }
      cb(null, {});
    });
  }, function (err, result) {
    console.log('end get city detail');
    callback(null, {});
  });
};

/**
 * 获取二手房数据
 * @param {*} params
 * @param {*} callback
 */
exports.house = async function (params = {}, callback) {
  const cityList = await assocCityErshouHouseList();
  // console.log(cityList)
  if (cityList.length > 0) {
    // 在IP池没有准备好前，每次只抓取一个页面
    let urlPre = '';
    await async.mapLimit(cityList, 20, function (city, cb) {
      // 前面同一条件下url没有获取到数据，跳过当前url
      if (urlPre === city.urlPre) {
        console.log('Skip current page ' + city.url);
        cb(null, {});
        return;
      }

      async.waterfall([
        // 获取页面HTML
        function (cb) {
          Crawler.get({ url: city.url}, cb);
          // fs.readFile('./文件.txt', 'utf8', cb);
        },
        // 解析页面
        function (pageContent, cb) {
          Parse.city(pageContent, cb);
        },
        // 保存数据
        function (houseList, cb) {
          saveHouseDetail(city, houseList, cb);
        }
      ], function (err, result) {
        if (err) {
          console.log(err);
        }
        if (result === 'nodata') {
          urlPre = city.urlPre;
        }
        cb(null, result);
      });
    }, function (err, result) {
      if (err) {
        console.log(err);
      }
      console.log('city page done');
      callback(err, {});
    });
  }
};

/**
 * 获取二手房数据
 * @param {*} params
 * @param {*} callback
 */
exports.house2 = async function (params = {}, callback) {
  const cityList = await getCityList();
  if (cityList.length > 0) {
    // 在IP池没有准备好前，每次只抓取一个页面
    // for (const city of cityList) {
      console.log(111);
      await Crawler.get2(cityList[0].cityUrl)
        .then(pageContent => {
          console.log(222);
          console.log(pageContent);
        })
        .catch(e => {
          console.log(e);
        });
      console.log(333);
    // }
  }

  callback(null, {});
};

/**
 * 获取城市列表
 */
async function getCityList() {
  return await CityModel.find({}, function (err, result) {
    return result;
  });
}

/**
 * 保存房子信息
 * @param {*} city
 * @param {*} houseList
 * @param {*} callback
 */
function saveHouseDetail (city = {}, houseList, callback) {
  if (houseList.length > 0) {
    const currentDate = moment().format('YYYY-MM-DD');
    const currentTime = moment().format('YYYY-MM-DD HH:mm:ss');
    async.mapLimit(houseList, 10, function (data, cb) {
      if (_.isNil(data.houseCode)) {
        cb(null, {});
        return;
      }
      async.waterfall([
        // 检查记录是否存在
        function (cb) {
          LianjiaModel.getHouseDetail(data.houseCode, function (err, result) {
            cb(null, result.length > 0);
          });
        },
        // 更新保存
        function (exist, cb) {
          async.parallel([
            function (cb) {
              if (exist) {
                LianjiaModel.updateHouse(data, function (err, result) {
                  cb(err, result);
                });
              } else {
                LianjiaModel.addHouse(data, function (err, result) {
                  cb(err, result);
                });
              }
            },
            // add daily price
            function (cb) {
              const price = {
                houseCode: data.houseCode,
                housePrice: data.totalPrice,
                date: currentDate,
                updateTime: currentTime
              };
              LianjiaModel.addHousePrice(price, function (err, result) {
                cb(err, result);
              });
            }
          ], function (err, result) {
            cb(err, result);
          });
        }
      ], function (err, result) {
        const output = [
          city.cityName,
          city.zoneName,
          city.pageNo,
          data.houseCode,
          _.padEnd(data.houseTitle, 50, ' '),
          data.totalPrice
        ];
        console.log(output.join('--'));
        cb(err, result);
      });
    }, function (err, result) {
      callback(null, result);
    });
  } else {
    const output = [
      city.cityName,
      city.zoneName,
      city.pageNo,
      'No Datas'
    ];
    console.log(output.join('--'));
    callback(null, 'nodata');
  }
}

/**
 * 保存zone信息
 * @param {*} zoneList
 * @param {*} cityName
 * @param {*} callback
 */
function saveCityZone (zoneList = [], cityName = '', callback) {
  if (zoneList.length > 0) {
    async.mapLimit(zoneList, 10, function (zone, cb) {
      const zoneName = zone.zone.zoneName || '';
      if (zoneName === '' || cityName === '') {
        cb(null, {});
        return;
      }
      async.waterfall([
        // 检查zone是否存在
        function (cb) {
          LianjiaModel.getZoneDetail(zoneName, cityName, function(err, result) {
            cb(err, result.length > 0);
          });
        },
        // 保存zone信息
        function (exist, cb) {
          if (exist) {
            delete zone.createTime;
            LianjiaModel.updateZoneDetail(zone, cityName, function (err,result) {
              cb(err, result);
            });
          } else {
            // zone.cityName = cityName;
            LianjiaModel.addZoneDetail(zone, cityName, function (err, result) {
              cb(err, result);
            });
          }
        }
      ], function (err, result) {
        console.log(cityName + '--' + zoneName);
        cb(null, result);
      });
    }, function (err, result) {
      callback(err, result);
    });
  } else {
    console.log(cityName + '-- NoDatas');
    callback(null, {});
  }
}

/**
 * 拼接需要抓取数据的城市二手房URL列表
 */
async function assocCityErshouHouseList() {
  console.log('start assoc city ershoufang url');
  let urlList = [];
  const cityList = await LianjiaModel.getCityList();
  // const cityList = await LianjiaModel.getCityZoneList();

  if (cityList.length > 0) {
    cityList.forEach((city) => {
      let cityUrlArr = [];
      let cityUrlSuffix = '';

      cityUrlArr = city.cityUrl.split('/');
      cityUrlSuffix = cityUrlArr[cityUrlArr.length - 1] === '' ? '' : '/';
      if (cityUrlSuffix !== '/') {
        if (_.isNil(city.zone)) {
          city.zone = [''];
        }

        city.zone.forEach((zone) => {
          let path = 'ershoufang';
          if (zone !== '') {
            path += '/' + zone.zonePinyin;
          }
          for (let page = 1; page <= ConfigLJ.maxPage; page++) {
            urlList.push({
              url: city.cityUrl + cityUrlSuffix + path + '/pg' + page + '/',
              urlPre: city.cityUrl + cityUrlSuffix + path,
              cityName: city.cityName,
              zoneName: zone.zoneName,
              pageNo: page
            });
          }
        });
      }
    });
  }
  console.log('end assoc city ershoufang url, total ' + urlList.length + ' urls');
  return urlList;
}

/**
 * 获取二手房详情数据
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
exports.houseDetail = async function (req, res, next) {
  let index = 0;
  for (let i = 0; ; i++) {
    houseList = await LianjiaModel.getHouseList(i);
    if (houseList.length === 0) {
      break;
    }

    for(const house of houseList) {
      try {
        if (!_.isEmpty(house.property) || !_.isEmpty(house.city)) {
          continue;
        }
        index++;
        const pageContent = await Crawler.getSync({ url: house.houseUrl });
        const detail = Parse.houseDetail(pageContent.body);
        if (!_.isEmpty(detail)) {
          console.log('[' + index + ']' + house.houseCode + JSON.stringify(detail));
          let data = { houseCode: house.houseCode };
          if (!_.isEmpty(detail.property)) {
            data.property = detail.property
          }
          if (!_.isEmpty(detail.city)) {
            data.city = detail.city
          }
          data.updateTime = moment().format('YYYY-MM-DD HH:mm:ss')
          await LianjiaModel.updateHouseSync(data);
        } else {
          console.log('----');
        }

        await tUtils.sleep(500);
      } catch (err) {
        console.log(err);
      }
    }
  }
};
