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

    urls = ipUtils.joinIPUrls(ipConfig.ip, 'xici');
    var res = '';

    async.eachSeries(urls, function(item, callback) {
        request.get(item.url, '', 'html', function (err, res) {

            ipUtils.filterIPsFromHtml(res.text, pattern, function(err, res) {
                res.length > 0 && res.forEach(function(ip) {
                    ipModel.upInsertIP(ip, 'xici');
                });
            });
        });


    }, function(err) {
        console.log(err)
    });

};
