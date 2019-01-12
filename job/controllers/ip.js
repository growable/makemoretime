var async = require('async');
var crawler = require('crawler');
var ipConfig = require('../config/ipconfig');

/**
 * get ip list from remote web
 * @param {*} params
 * @param {*} callback
 */
exports.get = function (params = {}, callback) {
  if (ipConfig.length > 0) {
    async.mapLimit(ipConfig, 10, function (config, cb) {
      for (const type of config.type) {
        for (let pageNo = 1; pageNo <= config.pages; pageNo++) {
          const url = config.url.replace('{type}', type).replace('{pageNo}', pageNo);
          async.waterfall([
            // get page content
            function (cb) {
              getPageContent(url, cb);
            },
            // filter page content
            function (pageContent, cb) {
              filterPageContent(pageContent, config.regExp, cb);
            }
          ], function (err, result) {
            // cb(err, result);
            console.log(result);
          });
        }
      }
    }, function (err, result) {
      callback(err, result);
    });
  } else {
    callback(null, 'ip config is null');
  }
};

/**
 * validate ip
 * @param {*} params 
 * @param {*} callback 
 */
exports.check = function (params = {}, callback) {

};

/**
 * get page content
 * @param {*} url
 * @param {*} callback
 */
function getPageContent (url = '', callback) {
  var c = new crawler({
    callback: function (error, res, done) {
      callback(error, res);
      done();
    }
  });
  c.queue(url);
}

/**
 * filter page content with regExp
 * @param {*} pageContent
 * @param {*} regExp
 * @param {*} callback
 */
function filterPageContent (pageContent = '', regExp = '', callback) {
  callback(null, pageContent);
}
