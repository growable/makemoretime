//house library


exports.joinLianjiaUrl = function (config, zones) {
    var urls = [];
    var url  = '';

    //多重循环，待优化
    config.city.forEach(function(item) {
        config.houseType.forEach(function(type) {
            zones.forEach(function(zone) {
                for (var i = 1; i <= config.MaxPage; i++) {
                    config[type].forEach(function(price) {
                        url = 'http://' + item + '.' + config.domain + '/' + type
                                + '/' + zone + '/d' + i + price;                        
                        urls.push({url:url,type:type});
                    });
                }
            });
        });
    });

    return urls;
};
