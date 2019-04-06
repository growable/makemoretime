const ipRoute = require('./controllers/ip');
const lianjiaRoute = require('./controllers/lianjia');
const zhihuRoute = require('./controllers/zhihu');

module.exports = {
  ip: ipRoute,
  lianjia: lianjiaRoute,
  zhihu: zhihuRoute
};