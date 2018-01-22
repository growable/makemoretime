//获取IP数据

var eventProxy = require('eventproxy');
var async      = require('async');
var ipConfig   = require('../config/spider');
var ipUtils    = require('../utils/ip');
var request    = require('../utils/request');
var output     = require('../utils/output');
var ipModel    = require('../models/ip_model');

exports.get = function() {
    var urls    = [];
    var pattern = ipConfig.ip.xici.pattern;
    
    //xici
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
        console.log(err)
    });
    

    //kuaidaili
    urls = ipUtils.joinIPUrls(ipConfig.ip, 'kuaidaili');
    
    async.eachSeries(urls, function(item, callback) {
        request.get(item.url, '', 'html', function (err, res) {

            ipUtils.filterKuaidailiIPsFromHtml(res.text, pattern, function(err, res) {
                res.length > 0 && res.forEach(function(ip) {
                    ipModel.upInsertIP(ip, 'kuaidaili');
                });
            });
        });
    }, function(err) {
        console.log(err)
    });
    
    //66daili
    urls = ipUtils.joinIPUrls(ipConfig.ip, '66daili');

    async.eachSeries(urls, function(item, callback) {
        request.get(item.url, '', 'html', function (err, res) {

            ipUtils.filter66dailiIPsFromHtml(res.text, pattern, function(err, res) {
                res.length > 0 && res.forEach(function(ip) {
                    ipModel.upInsertIP(ip, '66daili');
                });
            });
        });
    }, function(err) {
        console.log(err)
    });
};


/**
 * check proxy ip wether can use or not.
 */
exports.check = function() {
    //get ip need to check

    var ep = new eventProxy();

    ep.all('ips', function(ips) {
        var http_type = '';
        async.each(ips, function(ip, callback) {
            http_type = ip.HttpType.toLowerCase() === 'https' ? 'https' : 'http';
            request.get('https://www.sina.com.cn/', http_type + '://' + ip.IP + ':' + ip.Port, 'html', function (err, res) { 
                ipModel.updateIPStatus(ip.ID, err, function(err, rows) {
                    console.log(ip.IP + ':' + ip.Port + ' updated');
                });
            });
        });
    });

    //ips
    ipModel.getIPNeedCheck(function(err, ips) {
        ep.emit('ips', ips);
    });
    
}
