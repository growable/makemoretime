//house Model
var mysqlLib = require('../utils/mysql');
var mysql    = new mysqlLib('lianjia');

exports.getAllCityZones = function(callback) {
    var sql = 'SELECT PageName,PageUrl FROM Pages WHERE Category = "" AND PageName !="不限"';

    mysql.query(sql, [], function(err, results, fields) {
        if (err) throw err;

        callback(err, results);
    });
};

/**
 * [description]
 * @param  {[type]}   lists    [description]
 * @param  {Function} callback [description]
 * @return {[type]}            [description]
 */
exports.upInsertLianjiaList = function(lists, callback) {
    console.log(lists)
    process.exit()
};
