const redis = require('redis');
let RedisClient = redis.createClient(6379, 'localhost');

/**
 * 获取redis的值
 * @param {*} key
 */
exports.get = async function (key = '') {

};

/**
 * 设置redis的值
 * @param {*} key
 * @param {*} value
 * @param {*} expires
 */
exports.set = async function (key = '', value = '', expires = 86400) {

};

/**
 * 删除redis的值
 * @param {*} key
 */
exports.delete = async function (key = '') {

};
