//ip utils

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
    var regExp = '/' + pattern + '/g';

    ips = html.match(regExp);

    callback(null, ips);
};
