//代理IP model
var mysqlLib = require('../utils/mysql');
var mysql    = new mysqlLib('ip');
var moment   = require('moment');

/**
 * [description]
 * @param  {Function} callback [description]
 * @return {[type]}            [description]
 */
exports.getCanUserIP = function(callback) {
    var sql = 'SELECT IP,Port FROM `pool` WHERE CanUse = 1';
    mysql.query(sql, [], function(err, results, fields) {
        if (err) throw err;
        callback(err, results);
    });
};

/**
 * [description]
 * @param  {[type]} ip [description]
 * @return {[type]}    [description]
 */
exports.upInsertIP = function(ip, source) {
    var port = ip.port;
    var addr = ip.addr;
    var type = ip.type;
    var ip   = ip.ip;

    if (ip != 'ip') {
        var current = moment().format('YYYY-MM-DD HH:mm:SS');

        var sql = 'SELECT ID FROM pool WHERE IP = ? AND Port = ?';
        mysql.query(sql, [ip, port], function(err, results, fields) {
            if (results.length > 0) {
                sql = 'UPDATE pool SET CanUse = ?, UpdateTime = ?, PID = ?, HttpType = ? WHERE IP = ? AND Port = ?';
                mysql.query(sql, [1, current, '', type, ip, port], function(err, results,fields) {
                    console.log(source + ' update IP--' + ip + ':' + port);
                });
            } else {
                sql = 'INSERT INTO pool (IP, Port, HttpType, City, Source, CanUse, UpdateTime) '
                    + 'VALUES (?,?,?,?,?,?,?)';
                mysql.query(sql, [ip, port, type, addr, source, 1, current], function(err, results, fields) {
                    console.log(source + ' add IP--' + ip + ':' + port);
                });
            }
        });
    }
};


/**
 * get ip to check
 */
exports.getIPNeedCheck = function(callback) {
    var two_days_ago = moment().subtract(2, 'day').format('YYYY-MM-DD');
    var sql = 'SELECT IP, Port, HttpType FROM pool WHERE UpdateTime >= ?';

    mysql.query(sql, [two_days_ago], function(err, rows, fields) {
        callback(err, rows);
    });
};
