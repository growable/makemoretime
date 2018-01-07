/**
 * [mysql Mysql db object, connect and close]
 */
var mysql  = require('mysql');
var config = require('../../app.config');

function MysqlQuery (db_name) {
    var mysql_config = config.mysql;
    mysql_config.database = db_name || 'ip';

    var pool = mysql.createPool(mysql_config);

    this.self = function() {
        return pool;
    };

    this.escape = function(param) {

        return pool.escape(param);
    }

    /**
     * [description]
     * @param  {[string]}   sql    [description]
     * @param  {Function} callback [description]
     * @return {[type]}            [description]
     */
    this.query = function(sql, callback) {
        pool.getConnection(function (err, connection) {
            if (err) throw(err);
            
            // Use the connection
            connection.query(sql, function (err, rows, fields) {
                connection.release();

                callback(err, rows, fields);
            });
        });
    };

}

module.exports = MysqlQuery;
