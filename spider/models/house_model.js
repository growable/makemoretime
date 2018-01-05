//house Model
var mysqlLib = require('../utils/mysql');
var mysql    = new mysqlLib('lianjia');

exports.getAllCityZones = function() {
    var sql = '';

    mysql.query(sql, function(err, results, fields) {
        if (err) throw err;

        callback(err, results);
    });
};
