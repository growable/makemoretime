//house library
var cheerio = require('cheerio');


/**
 * [description]
 * @param  {[type]} config [description]
 * @param  {[type]} zones  [description]
 * @return {[type]}        [description]
 */
exports.joinLianjiaUrl = function (config, zones) {
    var urls = [];
    var url  = '';

    //多重循环，待优化
    config.city.forEach(function(item) {
        config.houseType.forEach(function(type) {
            zones.forEach(function(zone) {
                for (var i = 1; i <= config.maxPage; i++) {
                    config[type].forEach(function(price) {
                        url = 'http://' + item + '.' + config.domain + '/' + type
                                + '/' + zone.PageUrl + '/d' + i + price;
                        urls.push({url:url,type:type});
                    });
                }
            });
        });
    });

    return urls;
};


/**
 * [description]
 * @param  {[type]}   html     [description]
 * @param  {Function} callback [description]
 * @return {[type]}            [description]
 */
exports.filterLianjiaList = function (html, callback) {
    var $ = cheerio.load(html);
    var prices = [];

    var price     = 0;
    var per_price = 0;
    var house_id  = '';

    $('.js_fang_list li').each(function(idx, element) {
        var list = $(element);

        price     = list.find('span.total-price').text().replace(/[\r\n\t]/g,"");
        per_price = list.find('span.minor').text().replace(/[\r\n\t]/g,"");
        house_id  = list.find('a.link-hover-green').attr('key').replace(/[\r\n\t]/g,"");

        prices.push({"house_id":house_id,"price":price,"per_price":per_price});
    });

    callback(null, prices);
};
