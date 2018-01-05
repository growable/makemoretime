//request
var request = require('superagent');
require('superagent-proxy')(request);

//request url
exports.get = function(url, proxy, callback) {
    if (proxy.length > 0 ) {
        request.get(url).proxy(proxy).end(callback(err, res));
    } else {
        request.get(url).end(callback(err, res));
    }
}
