//request
var request   = require('superagent');
// const nocache = require('superagent-no-cache');
require('superagent-proxy')(request);

//request url
exports.get = function(url, proxy, accept_type, callback) {

    if (proxy.length > 1 ) {
        request.get(url)
                .proxy(proxy)
                // .set('accept', accept_type)
                .set('Referer','https://www.baidu.com')
                .set('Accept','text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8')
                .set('User-Agent','Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/63.0.3239.84 Safari/537.36')
                .end(callback);
    } else {
        request.get(url)
                // .set('accept', accept_type)
                .set('Referer','https://www.baidu.com')
                .set('Accept','text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8')
                .set('User-Agent','Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/63.0.3239.84 Safari/537.36')
                .end(callback);
    }
}
