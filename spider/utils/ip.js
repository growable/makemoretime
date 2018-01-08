//ip utils
var cheerio = require('cheerio');


/**
 * [description]
 * @param  {[type]} config [description]
 * @param  {[type]} type   [description]
 * @return {[type]}        [description]
 */
exports.joinIPUrls = function(config, type) {
    var urls = [];
    var url  = '';
    config[type].type.forEach(function(item) {
        for (var i = 1; i <= config[type].maxPage; i++) {
            url = config[type].url.replace("[type]", item).replace("[page]", i);
            urls.push({url:url});
        }
    });

    return urls;
};


/**
 * [description]
 * @param  {[type]} html    [description]
 * @param  {[type]} pattern [description]
 * @return {[type]}         [description]
 */
exports.filterIPsFromHtml = function(html, pattern, callback) {
    var ips = [];
    var $ = cheerio.load(html);

    $('#ip_list>tbody>tr').each(function(idx, element) {
        var tmp = {};
        tmp.ip   = $(element).find("td").eq(1).text();
        tmp.port = $(element).find("td").eq(2).text();
        tmp.addr = $(element).find("td").eq(3).text();
        tmp.type = $(element).find("td").eq(5).text();

        tmp.ip.length > 0 && ips.push(tmp);
    });

    callback(null, ips);
};
