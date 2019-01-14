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
};

/**
 * 获取IP列表数据
 * @param {*} status 
 * @param {*} lastUpdateTime 
 * @param {*} callback 
 */
exports.getIPList = function (status = [0], lastUpdateTime = '', callback) {
  if (lastUpdateTime === '') {
    lastUpdateTime = moment().add(-1, 'hour').format('YYYY-MM-DD HH:mm:ss');
  }
  const sql = 'SELECT * FROM ip_pool WHERE Status IN (?) AND UpdateTime > ?';
  db.query(sql, [status, lastUpdateTime], function (err, rows) {
    callback(err, rows);
  });
};

exports.updateIPStatus = function (id = 0, status = 0, callback) {
  if (status === 0) {
    status = -1;
  }
  const updateTime = moment().format('YYYY-MM-DD HH:mm:ss');
  const sql = 'UPDATE ip_pool SET Status = ?, UpdateTime = ? WHERE ID = ?';
  db.query(sql, [status, updateTime, id], function (err, rows) {
    callback(err, rows);
  });
};
