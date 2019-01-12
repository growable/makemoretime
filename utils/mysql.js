/**
 * [mysql Mysql db object, connect and close]
 * @type {[type]}
 */
var mysql = require('mysql');
var async = require('async');

/**
 * [MysqlDB class]
 */
class MysqlDB {
  /**
   * constructor
   * @param {*} config
   */
  constructor(config) {
    this.config = config;

    this.createConnectionPool();
  }

  /**
   * create db connection pool
   */
  createConnectionPool() {
    this.pool = mysql.createPool(this.config);
  }

  /**
   * escape
   * @param {*} str
   * @param {*} callback
   */
  escape(str) {
    return this.pool.escape(str);
  }

  /**
   * @param {*} sql
   * @param {*} params
   * @param {*} callback
   */
  query(sql, params, callback) {
    this.pool.getConnection(function (err, connection) {
      if (err) throw new Error(err);

      // Use the connection
      connection.query(sql, params, function (err, rows, fields) {
        // if (err) throw new apiError(errors.MYSQL_QUERY_ERROR);

        connection.release();

        callback(err, rows, fields);
      });
    });
  }

  /**
   * insert sql
   * @param {*} table
   * @param {*} params
   * @param {*} callback
   */
  inserts(table, params, callback) {
    if (params.length === 0) {
      callback(new Error('params error'), 0);
    } else {
      this.pool.getConnection(function (err, connection) {
        if (err) throw new Error(err);

        let sql = 'INSERT INTO ' + table + ' SET ?';

        connection.query(sql, params, function (err, rows, fields) {
          connection.release();

          callback(err, rows, fields);
        });
      });
    }
  };

  /**
   * update sql
   * @param {*} table
   * @param {*} params
   * @param {*} callback
   */
  updates(table, params, callback) {
    if (params[0].length === 0) {
      callback(null, 0);
    } else {
      this.pool.getConnection(function (err, connection) {
        if (err) throw new Error(err);

        let sql = 'UPDATE ' + table + ' SET ? WHERE ?? = ?';

        connection.query(sql, params, function (err, rows, fields) {
          connection.release();

          callback(err, rows, fields);
        });
      });
    }
  }

  /**
   * delete sql
   * @param {*} sql
   * @param {*} params
   * @param {*} callback
   */
  deletes(table, field, value, callback) {
    if (value.length === 0) {
      callback(null, 0);
    } else {
      this.pool.getConnection(function (err, connection) {
        if (err) throw new Error(err);

        const sql = 'DELETE FROM ' + table + ' WHERE ?? = ?';

        connection.query(sql, [field, value], function (err, rows, fields) {
          connection.release();
          console.log(err);
          callback(err, rows, fields);
        });
      });
    }
  }

  /**
   * transaction sqls
   * @param {*} sqls
   * @param {*} callback
   */
  transaction(sqls, callback) {
    this.pool.getConnection(function (err, connection) {
      if (err) return callback(err, null);

      connection.beginTransaction(function (err) {
        if (err) return callback(err, null);

        let sqlArr = [];

        sqls.forEach(function (sqlParam) {
          let temp = function (cb) {
            var sql = sqlParam.sql;
            var param = sqlParam.param;

            connection.query(sql, param, function (tErr, rows, fields) {
              if (tErr) {
                connection.rollback(function () {
                  // throw tErr;
                })
              } else {
                return cb(null, 'success');
              }
            });
          }

          sqlArr.push(temp);
        })

        // async
        async.series(sqlArr, function (err, result) {
          if (err) {
            connection.rollback(function (err) {
              connection.release();
              return callback(err, null);
            })
          } else {
            connection.commit(function (err, info) {
              if (err) {
                connection.rollback(function (err) {
                  connection.release();
                  return callback(err, null)
                })
              } else {
                connection.release();
                return callback(null, info);
              }
            });
          }
        });
      });
    });
  }
}

module.exports = MysqlDB;
