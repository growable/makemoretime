//代理IP model
var mysqlLib = require('../utils/mysql');
var mysql    = new mysqlLib('ip');

exports.getCanUserIP = function(callback) {
    var sql = 'SELECT IP,Port FROM `pool` WHERE CanUse = 1';
    mysql.query(sql, function(err, results, fields) {
        if (err) throw err;

        callback(err, results);
    });
};
