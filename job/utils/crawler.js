const crawler = require('crawler');

/**
 * 爬取html页面
 * @param {*} url
 * @param {*} callback
 */
exports.get2 = async function (url = '') {
  const a = await spider({url: url}, function (err, result) {
    return 'aaa';
  });
  return a;
};

exports.get = function(params, callback) {
  let c = new crawler({
    callback: function (err, result, done) {
      callback(err, result.body || '');
      done();
    }
  });
  c.queue(params.url, 5000);
};

exports.getSync = function (params) {
  const data = new Promise(function(resolve, reject) {
    let c = new crawler({
      callback: function (err, result, done) {
        resolve(result);
        done();
      }
    });
    c.queue(params.url, 5000);
  });
  return data;
};

/**
 * 爬虫
 * @param {*} params
 * @param {*} callback
 */
function spider(params = {}, callback) {
  let c = new crawler({
    callback: function (err, result, done) {
      callback(err, result.body || '');
      done();
    }
  });
  c.queue(params.url, 5000);
}
