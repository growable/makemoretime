//获取IP数据

var eventProxy = require('eventproxy');
var async      = require('async');
var ipConfig   = require('../config/spider');
var ipUtils    = require('../utils/ip');
var request    = require('../utils/request');
var output     = require('../utils/output');

exports.get = function() {
    var urls    = [];
    var pattern = ipConfig.ip.xici.pattern;

    urls = ipUtils.joinIPUrls(ipConfig.ip, 'xici');
    var res = '';

    async.eachSeries(urls, function(item, callback) {
        request.get(item.url, '', 'html', function (err, res) {

            ipUtils.filterIPsFromHtml(res, pattern, function(err, res) {
                output.exit(res);
            });
        });


    }, function(err) {
        console.log(err)
    });

};
