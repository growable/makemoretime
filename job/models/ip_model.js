var moment = require('moment-timezone');
var MysqlDB = require('../../utils/mysql');
var config = require('../config/mysql_config');
const env = require('../../env');
var db = new MysqlDB(config[env]);

/**
 * get ip data
 * @param {*} ip
 * @param {*} port
 * @param {*} callback
 */
exports.getIPDetail = function (ip = '', port = 0, callback) {
  const sql = 'SELECT * FROM ip_pool WHERE IP = ? AND Port = ?';
  db.query(sql, [ip, port], function (err, rows) {
    callback(err, rows[0] || {});
  });
};

/**
 * update ip detail
 * @param {*} ipInfo
 * @param {*} callback
 */
exports.updateIPDetail = function (ipInfo = {}, callback) {
  let params = {};
  const ip = ipInfo.ip || '';
  const port = ipInfo.port || 0;
  if (ipInfo.addr) {
    params.CityName = ipInfo.addr;
  }
  if (ipInfo.type) {
    params.Type = ipInfo.type;
  }

  if (ipInfo.source) {
    params.Source = ipInfo.source;
  }

  params.Status = 0;
  params.UpdateTime = moment().format('YYYY-MM-DD HH:mm:ss');
  
  const sql = 'UPDATE ip_pool SET ? WHERE IP = ? AND Port = ?';
  db.query(sql, [params, ip, port], function (err, rows) {
    callback(err, rows);
  });
};

/**
 * add ip details
 * @param {*} ipInfo
 * @param {*} callback
 */
exports.addIPDetail = function (ipInfo = {}, callback) {
  let params = {};
  if (ipInfo.ip) {
    params.IP = ipInfo.ip;
  }
  if (ipInfo.port) {
    params.Port = ipInfo.port;
  }
  if (ipInfo.addr) {
    params.CityName = ipInfo.addr;
  }
  if (ipInfo.type) {
    params.Type = ipInfo.type;
  }

  if (ipInfo.source) {
    params.Source = ipInfo.source;
  }

  params.Status = 0;
  params.UpdateTime = moment().format('YYYY-MM-DD HH:mm:ss');
  params.CreateTime = params.UpdateTime;

  db.inserts('ip_pool', params, function (err, rows) {
    callback(err, rows);
  });
}
