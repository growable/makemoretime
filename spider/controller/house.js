//spider controller
var eventProxy   = require('eventproxy');
var async        = require('async');
var ipModel      = require('../models/ip_model');
var houseModel   = require('../models/house_model');
var spiderConfig = require('../config/spider');
var output       = require('../utils/output');
var houseUtils   = require('../utils/house');
var request      = require('../utils/request');

/**
 * [链家房型list数据]
 * @return {[type]} [description]
 */
exports.lianjiaList = function () {

    var ep = new eventProxy();

    ep.all('proxys', 'zones', function(proxys, zones) {
        console.log(proxys);
        console.log(zones);

        if (zones.length === 0) output.exit('zones data is empty');

        var tasks = [];
        tasks = houseUtils.joinLianjiaUrl(spiderConfig.house.lianjia, zones);

        if (tasks.length === 0) output.exit('no tasks to run.');

        var getHoustList = function(res, callback) {
            houseUtils.filterLianjiaList(res, function(err, list) {
                console.log('filter');
                callback(list);
            });
        };

        var upInsertHouse = function (res, callback) {
            houseModel.upInsertLianjiaList(res, function (err, data) {
                console.log('upinsert');
                callback(data);
            });
        };

        var asyncCompose = async.compose(upInsertHouse, getHoustList);

        var proxy_len = proxys.length();

        //并行消息队列，同时执行5个任务
        async.eachLimit(tasks, 5, function(item, callback) {
            //随机分配一个代理IP
            proxy = proxy_len > 0 ? proxys[Math.ceil(Math.random() * (proxy_len + 1))] : '';

            request.get(item.url, proxy, function (err, res) {
                if (err) {
                    output.echo(item.url + ' response error.');
                } else {
                    asyncCompose(res, function(err, res) {
                        console.log('done done done.');
                    });
                }
            });
        }, function (err) {
            output.echo('something error.');
        });

    });

    //获取可用代理IP
    ipModel.getCanUserIP(ep.done(function(ips) {
        // ep.emit('proxys', ips);
        return ips;
    }));


    //获取城市地区信息
    houseModel.getAllCityZones(ep.done(function(zones) {
        // ep.emit('zones', zones);
        return zones;
    }));

};

/**
 * 获取链家二手房的详情数据
 * @return {[type]} [description]
 */
exports.lianjiaErshouDetail = function() {
    var ep = new eventProxy();

    //任务队列,队列长度为 5
    var queue = async.queue(function(task, callback) {
        console.log('run task');
    }, 5);

    //监听队列，
    queue.saturated = function() {
        console.log('all workers to be used');
    }

    //监听最后一个任务交给work时，调用
    queue.emty = function() {
        console.log('no more tasks');
    }

    //监听，所有任务执行完成后调用
    queue.drain = function() {
        console.log('all task complete');
    }

    //将任务加入队列
    for (var i = 0; ; i++) {
        houseModel.getLianjiaHouses(i, function (err, res) {
            console.log(res);
            queue.push([{url:'url',run:request.get(url, proxy, function(err, res) {console.log(res)})}
                    ],function (err) {
                        console.log('fff');
                    });
        });
    }

    ep.all('proxys', 'houses', function(proxys, zones) {

    });
};
