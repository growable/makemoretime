//spider controller
var eventProxy = require('eventproxy');
var ipModel    = require('../models/ip_model');
var houseModel = require('../models/house_model');

exports.index = function () {

    //get city zones from DB
    var ep = new eventProxy();

    ep.all('proxys', 'zones', function(proxys, zones) {
        console.log(proxys);
        console.log(zones);
    });

    ipModel.getCanUserIP(function(err, ips) {
        ep.emit('proxys', ips);
    });

};
