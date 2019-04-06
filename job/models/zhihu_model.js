const UsersModel = require('../schema/zhihu/users');
const moment = require('moment');

/**
 * 通过userId获取用户信息
 * @param {*} userId
 */
exports.getUserById = async function (userId = '') {
  return await UsersModel.find({ 'id': userId }).exec();
};

/**
 * 更新用户详情信息
 * @param {*} data
 * @param {*} userId
 */
exports.updateUserDetail = async function (data = {}, userId = '') {
  return await UsersModel.updateOne({ id: userId }, data).exec();
}

/**
 * 新增用户详情信息
 * @param {*} data
 */
exports.addUserDetail = async function (data = {}) {
  data.createTime = moment().format('YYYY-MM-DD HH:mm:ss');
  return await new UsersModel(data).save();
}