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
exports.upInsertIP = function(ip, source) {console.log(ip)
    var port = ip.port;
    var addr = ip.addr;
    var type = ip.type;
    var ip   = ip.ip;

    var current = moment().format('YYYY-MM-DD HH:mm:SS');

    var sql = "SELECT ID FROM pool WHERE IP = ? AND Port = ?";
    mysql.query(sql, [ip, port], function(err, results, fields) {
        if (results.length > 0) {
            sql = "UPDATE pool SET CanUse = ?, UpdateTime = ?, PID = ?, HttpType = ? WHERE IP = ? AND Port = ?";
            mysql.query(sql, [1, current, ip, port, '', type], function(err, results,fields) {
                console.log('update IP--' + ip + ':' + port);
            });
        } else {
            sql = "INSERT INTO pool (IP, Port, HttpType, City, Source, CanUse, UpdateTime) "
                + "VALUES (?,?,?,?,?,?)";
            mysql.query(sql, [ip, port, type, addr, source, 1, current], function(err, results, fields) {
                console.log('add IP--' + ip + ':' + port);
            });
        }
    });
};
