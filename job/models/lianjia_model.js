const HouseModel = require('../schema/lianjia/house');
const CityModel = require('../schema/lianjia/city');
const HousePriceModel = require('../schema/lianjia/price');

/**
 * 获取城市列表
 * @param {*} callback 
 */
exports.getCityList = async function (callback) {
  return await CityModel.find({}, function (err, result) {
    return result;
  });
};

/**
 * 获取所有生成的zone信息
 * @param {*} callback
 */
exports.getCityZoneList = async function (callback) {
  callback(null, {});
};

/**
 * 获取zone信息
 * @param {*} zoneName
 * @param {*} cityName
 * @param {*} callback
 */
exports.getZoneDetail = function (zoneName = '', cityName = '', callback) {
  CityModel.find({ 'zone.zoneName': zoneName, cityName: cityName},
    function (err, result) {
      callback(err, result);
    });
};

/**
 * 查找房子信息
 * @param {*} code
 * @param {*} callback
 */
exports.getHouseDetail = function (code = '', callback) {
  // return await HouseModel.find({ houseCode: code }, function (err, result) {
  //   return result;
  // });
  HouseModel.find({ houseCode: code }, function (err, result) {
    callback(err, result);
  });
};

/**
 * 保存房子信息
 * @param {*} data
 * @param {*} callback
 */
exports.addHouse = function (data = {}, callback) {
  const newHouse = new HouseModel(data);
  newHouse.save(function (err, result) {
    data = null;
    callback(err, result);
  });
};

/**
 * 更新房子信息
 * @param {*} data
 * @param {*} callback
 */
exports.updateHouse = function (data = {}, callback) {
  HouseModel.updateOne({ houseCode: data.houseCode }, data, function (err, result) {
    data = {};
    callback(err, result);
  });
};

exports.updateHouseSync = async function (data = {}) {
  return await new Promise(function (resolve, reject) {
    HouseModel.updateOne({ houseCode: data.houseCode }, data, function (err, result) {
      data = null;
      resolve(resolve);
    });
  });
};

/**
 * 更新zone信息
 * @param {*} data
 * @param {*} callback
 */
exports.updateZoneDetail = function (data = {}, cityName = '', callback) {
  CityModel.updateOne({ 'zone.zoneName': data.zone.zoneName, cityName: cityName}, data, function (err, result) {
    callback(err, result);
  });
};

/**
 * 新增city zone
 * @param {*} data
 * @param {*} cityName
 * @param {*} callback
 */
exports.addZoneDetail = function (data = {}, cityName = '', callback) {
  CityModel.updateOne({ 'cityName': cityName }, {$push: data}, function (err, result) {
    callback(err, result);
  });
};

/**
 * 新增房子每日价格
 * @param {*} data
 * @param {*} callback
 */
exports.addHousePrice = function (data = {}, callback) {
  const newHousePrice = new HousePriceModel(data);
  newHousePrice.save(function (err, result) {
    callback(err, result);
  });
}

/**
 * 获取二手房数据
 * @param {*} page
 */
exports.getHouseList = async function (page = 0) {
  return await HouseModel.find({}).limit(100).skip(page * 100).exec();
}
