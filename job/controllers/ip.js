var async = require('async');
var crawler = require('crawler');
var cheerio = require('cheerio');
var request = require('superagent');
require('superagent-proxy')(request);
var ipConfig = require('../config/ipconfig');
var ipModel = require('../models/ip_model');

/**
 * get ip list from remote web
 * @param {*} params
 * @param {*} callback
 */
exports.get = function (params = {}, callback) {
  if (ipConfig.length > 0) {
    let urls = [];
    for (const config of ipConfig) {
      for (const type of config.type) {
        for (let pageNo = 1; pageNo <= config.pages; pageNo++) {
          urls.push({
            url: config.url.replace('{type}', type).replace('{pageNo}', pageNo),
            name: config.name
          });
        }
      }
    }

    if (urls.length === 0) {
      callback(null, 'url list is emtpy')
      return;
    }

    let ipList = [];
    async.mapLimit(urls, 1, function (url, cb) {
      async.waterfall([
        // get page content
        function (cb) {
          getPageContent(url.url, cb);
        },
        // filter page content
        function (pageContent, cb) {
          // js正则暂时没有找到分组的方式
          // filterPageContent(pageContent, config.regExp, cb);
          if (url.name === 'xici') {
            filterXiciPageContent(pageContent, cb);
          } else if (url.name === 'kuaidaili') {
            filterKuaiDailiPageContent(pageContent, cb);
          } else if (url.name === '66daili') {
            filter66DailiPageContent(pageContent, cb);
          } else {
            cb(null, []);
          }
        },
        // save ip to db
        function (ipList, cb) {
          if (ipList.length > 0) {
            saveToDB(ipList, cb);
          } else {
            cb(null, {});
          }
        }
      ], function (err, result) {
        // console.log(result);
        cb(err, result);
      });
    }, function (err, result) {
      // console.log(result)
      callback(err, result);
      // if ()
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
  async.waterfall([
    // 获取需要检查的IP
    function (cb) {
      ipModel.getIPList([0, 1, -1], '', function (err, result) {
        cb(err, result);
      });
    },
    // 检查IP
    function (ipList, cb) {
      if (ipList.length > 0) {
        async.mapLimit(ipList, 20, function (ip, cb) {
          const proxy = ip.Type.toLowerCase() + '://' + ip.IP + ':' + ip.Port;
          request.get('https://www.baidu.com')
            .proxy(proxy)
            .timeout(5000)
            .set('accept', 'html')
            .set('Referer', 'https://www.baidu.com')
            .set('Accept', 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8')
            .set('User-Agent', 'Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/63.0.3239.84 Safari/537.36')
            .end(function (err, res) {
              status = -1;
              if (res !== undefined) status = res.status === 200 ? 1 : -1;
              console.log(proxy + ', status: ' + status);
              ipModel.updateIPStatus(ip.ID, status, function (err, result) {
                cb(null, result);
              });
            });
        }, function (err, result) {
          cb(err, result);
        });
      } else {
        console.log('no IP need to check')
        cb(null, '');
      }
    }
  ], function (err, result) {
    callback(err, result);
  });
};

/**
 * get page content
 * @param {*} url
 * @param {*} callback
 */
function getPageContent (url = '', callback) {
  var c = new crawler({
    callback: function (error, res, done) {
      callback(error, res.body || '');
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
  // callback(null, pageContent.match(regExp));
}

/**
 * filter xici page ips
 * @param {*} pageContent 
 * @param {*} callback 
 */
function filterXiciPageContent (pageContent, callback) {
  var ips = [];
  var $ = cheerio.load(pageContent);

  $('#ip_list>tbody>tr').each(function (idx, element) {
    var tmp = {};
    tmp.ip = $(element).find("td").eq(1).text();
    tmp.port = $(element).find("td").eq(2).text();
    tmp.addr = $(element).find("td").eq(3).text().replace(/[\n| ]/g, '');
    tmp.type = $(element).find("td").eq(5).text();
    tmp.source = 'xici';

    tmp.ip.length > 0 && ips.push(tmp);
  });

  callback(null, ips);
}

/**
 * filter kuaidiali page ips
 * @param {*} pageContent 
 * @param {*} callback 
 */
function filterKuaiDailiPageContent (pageContent, callback) {
  var ips = [];
  var $ = cheerio.load(pageContent);

  $('#list>table>tbody>tr').each(function (idx, element) {
    var tmp = {};
    tmp.ip = $(element).find("td").eq(0).text();
    tmp.port = $(element).find("td").eq(1).text();
    tmp.addr = $(element).find("td").eq(4).text();
    tmp.type = $(element).find("td").eq(3).text();
    tmp.source = 'kuaidaili';

    tmp.ip.length > 0 && ips.push(tmp);
  });

  callback(null, ips);
}

/**
 * filter 66daili page ips
 * @param {*} pageContent
 * @param {*} callback
 */
function filter66DailiPageContent (pageContent, callback) {
  var ips = [];
  var $ = cheerio.load(pageContent);

  $('#footer>div>table>tbody>tr').each(function (idx, element) {
    var tmp = {};
    tmp.ip = $(element).find("td").eq(0).text();
    tmp.port = $(element).find("td").eq(1).text();
    tmp.addr = $(element).find("td").eq(2).text().charCodeAt('utf-8');
    tmp.type = 'http';
    tmp.source = '66daili';

    if (tmp.ip !== 'ip') {
      tmp.ip.length > 0 && ips.push(tmp);
    }
  });
  callback(null, ips);
}

/**
 * save ip data to mysql db
 * @param {*} ipList
 * @param {*} callback
 */
function saveToDB (ipList = [], callback) {
  async.mapLimit(ipList, 1, function (ip, cb) {
    async.waterfall([
      // check ip exist
      function (cb) {
        ipModel.getIPDetail(ip.ip, ip.port, function (err, result) {
          cb(err, result.IP);
        });
      },
      // update ip
      function (status, cb) {
        if (status) {
          console.log(ip.ip + ':' + ip.port + '  --  ' + ip.source + ' Update');
          ipModel.updateIPDetail(ip, function (err, result) {
            cb(err, !result);
          })
        } else {
          cb(null, true);
        }
      },
      // add ip
      function (status, cb) {
        if (status) {
          console.log(ip.ip + ':' + ip.port + '  --  ' + ip.source + '  Add');
          ipModel.addIPDetail(ip, function (err, result) {
            cb(err, result);
          });
        } else {
          callback(null, {});
        }
      }
    ], function (err, result) {
      cb(err, result);
    });
  }, function (err, result) {
    callback(err, result);
  });
}

