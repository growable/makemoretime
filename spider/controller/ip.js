//获取IP数据

var eventProxy = require('eventproxy')
var async      = require('async')
var ipConfig   = require('../config/spider')
var ipUtils    = require('../utils/ip')
var request    = require('../utils/request')
var output     = require('../utils/output')
var ipMongo    = require('../models/ipMongo')
var redis = require('redis')
var RedisClient = redis.createClient(6379, 'localhost')

exports.get = function() {
    var ep = new eventProxy();
    ep.all('xici', 'kuaidaili', '66daili', function(xici, kuai, six) {
        console.log('done')
        process.exit(0);
    });
    
    //xici
    var urls    = [];
    var pattern = ipConfig.ip.xici.pattern;
    urls = ipUtils.joinIPUrls(ipConfig.ip, 'xici');

    async.eachSeries(urls, function(item, callback) {
			async.waterfall([
				function (cb) {
					request.get(item.url, '', 'html', function (err, res) {
						cb(err, res)
					})
				},
				function (res, cb) {
					res.length > 0 && res.forEach(function (ip) {
						ipMongo.upInsertIP(ip, 'xici', function (err, result) {
							console.log('add ' + ip.ip)
						});
					});
					cb(null, {})
				}
			], function (err, result) {
				callback(err, result)
			})
    }, function(err, result) {
			ep.emit('xici', null);
    });
    

    //kuaidaili
    urls = ipUtils.joinIPUrls(ipConfig.ip, 'kuaidaili');
    pattern = ipConfig.ip.xici.kuaidaili;
    
    async.eachSeries(urls, function(item, callback) {
			request.get(item.url, '', 'html', function (err, res) {
				ipUtils.filterKuaidailiIPsFromHtml(res.text, pattern, function(err, res) {
					res.length > 0 && res.forEach(function(ip) {
						ipMongo.upInsertIP(ip, 'kuaidaili', function (err, result) {
							console.log('add ' + ip.ip)
						});
					});
					callback(err, {})
				});
			});
    }, function(err) {
        console.log(err);
        ep.emit('kuaidaili',null);
    });
    
    //66daili
    urls = ipUtils.joinIPUrls(ipConfig.ip, 'sixdaili');
    pattern = ipConfig.ip.xici.sixdaili;

    async.eachSeries(urls, function(item, callback) {
			request.get(item.url, '', 'html', function (err, res) {
				ipUtils.filter66dailiIPsFromHtml(res.text, pattern, function(err, res) {
					res.length > 0 && res.forEach(function(ip) {
						ipMongo.upInsertIP(ip, 'sixdaili', function (err, result) {
								console.log('add ' + ip.ip)
						});
					});
					callback(err, {})
				});
			});
    }, function(err) {
			console.log(err);
			ep.emit('66daili',null);
    });
};


/**
 * check proxy ip wether can use or not.
 */
exports.check = function() {
	//get ip need to check

	let ep = new eventProxy();

	ep.all('ips', function(ips) {
		let http_type = '';
		let status    = 2;
		async.each(ips, function(ip, callback) {
			// http_type = ip.HttpType.toLowerCase() === 'https' ? 'https' : 'http';
			http_type = 'http';
			async.waterfall([
				function(cb) {
					request.get('https://www.baidu.com/', http_type + '://' + ip.IP + ':' + ip.Port, 'html',
						function (err, res) {
							status = 'undefined';
							if (res != undefined) status = res.status == 200 ? 1 : 2;

							cb(err, status)
						});
				},
				function (status, cb) {
					ipMongo.updateIPStatus(ip._id, parseInt(status) === 1 ? 1 : 2, function (err, rows) {
						console.log(ip.IP + ' status code is : ', status);
					});
				}
			], function (err, result) {
				callback(err, result)
			})
		}, function(err) {
			setTimeout(function() {
				console.log('done')
				process.exit(0);
			}, 2000);
		});
	});

	//ips
	ipMongo.getIPNeedCheck(function(err, ips) {
		ep.emit('ips', ips);
	});    
}


/**
 * update ip data to redis
 *
 */
exports.ipRedis = function () {

}
