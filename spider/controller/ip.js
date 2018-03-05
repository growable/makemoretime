//获取IP数据

var eventProxy = require('eventproxy');
var async      = require('async');
var ipConfig   = require('../config/spider');
var ipUtils    = require('../utils/ip');
var request    = require('../utils/request');
var output     = require('../utils/output');
var ipModel    = require('../models/ip_model');

exports.get = function() {

    var ep = new eventProxy();
    ep.all('xici', 'kuaidaili', '66daili', function(xici,kuai,six) {
        console.log('done')
        process.exit(0);
    });
    
    //xici
    var urls    = [];
    var pattern = ipConfig.ip.xici.pattern;
    urls = ipUtils.joinIPUrls(ipConfig.ip, 'xici');

    async.eachSeries(urls, function(item, callback) {
        request.get(item.url, '', 'html', function (err, res) {
            ipUtils.filterXiciIPsFromHtml(res.text, pattern, function(err, res) {
                res.length > 0 && res.forEach(function(ip) {
                    ipModel.upInsertIP(ip, 'xici');
                });
            });
        });
    }, function(err) {
        console.log(err);
        eq.emit('xici', null);
    });
    

    //kuaidaili
    urls = ipUtils.joinIPUrls(ipConfig.ip, 'kuaidaili');
    pattern = ipConfig.ip.xici.kuaidaili;
    
    async.eachSeries(urls, function(item, callback) {
        request.get(item.url, '', 'html', function (err, res) {

            ipUtils.filterKuaidailiIPsFromHtml(res.text, pattern, function(err, res) {
                res.length > 0 && res.forEach(function(ip) {
                    ipModel.upInsertIP(ip, 'kuaidaili');
                });
            });
        });
    }, function(err) {
        console.log(err);
        eq.emit('kuaidaili',null);
    });
    
    //66daili
    urls = ipUtils.joinIPUrls(ipConfig.ip, 'sixdaili');
    pattern = ipConfig.ip.xici.sixdaili;

    async.eachSeries(urls, function(item, callback) {
        request.get(item.url, '', 'html', function (err, res) {

            ipUtils.filter66dailiIPsFromHtml(res.text, pattern, function(err, res) {
                res.length > 0 && res.forEach(function(ip) {
                    ipModel.upInsertIP(ip, 'sixdaili');
                });
            });
        });
    }, function(err) {
        console.log(err);
        eq.emit('66daili',null);
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
            request.get('https://www.baidu.com/', http_type + '://' + ip.IP + ':' + ip.Port, 'html', 
                    function (err, res) {
                status = 'undefined';
                if (res != undefined) status = res.status == 200 ? 1 : 2;

                ipModel.updateIPStatus(ip.ID, status == 1 ? 1 : 2, function (err, rows) {
                    console.log(ip.IP + ' status code is : ', status);
                });
            });
        }, function(err) {
            setTimeout(function() {
                process.exit(0);
            }, 2000);
        });
    });

    //ips
    ipModel.getIPNeedCheck(function(err, ips) {
        ep.emit('ips', ips);
    });
    
}
